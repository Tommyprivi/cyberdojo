import { isGeneratorId } from "../practice/generators";
import { getCourseByFolder } from "./courses";
import type { RawLesson } from "./load";
import { splitScreens } from "./load";
import { LESSON_ID, lessonFrontmatter, type LessonFrontmatter } from "./schema";

export type Issue = { file: string; message: string };

const MIN_SCREENS = 6;
const MAX_SCREENS = 8;

/** Controlla frontmatter, ID, prerequisiti, struttura delle schermate e regole di pubblicazione. */
export function lintLessons(lessons: RawLesson[]): Issue[] {
  const issues: Issue[] = [];
  const add = (file: string, message: string) => issues.push({ file, message });
  const valid = new Map<string, { file: string; fm: LessonFrontmatter }>();

  for (const l of lessons) {
    const parsed = lessonFrontmatter.safeParse(l.data);
    if (!parsed.success) {
      for (const i of parsed.error.issues) add(l.file, `frontmatter: ${i.path.join(".") || "(radice)"}: ${i.message}`);
      continue;
    }
    const fm = parsed.data;
    const [folder, dir, name] = l.file.split("/");
    const course = getCourseByFolder(folder);
    const m = LESSON_ID.exec(fm.id)!;

    if (valid.has(fm.id)) add(l.file, `ID duplicato ${fm.id} (già in ${valid.get(fm.id)!.file})`);
    else valid.set(fm.id, { file: l.file, fm });

    if (name !== `${fm.id}.mdx`) add(l.file, `il nome file deve essere ${fm.id}.mdx`);
    if (!course) add(l.file, `cartella corso sconosciuta: ${folder}`);
    else {
      if (course.id !== m[1]) add(l.file, `l'ID ${fm.id} non appartiene al corso ${course.id}`);
      if (fm.course !== course.folder) add(l.file, `course deve essere "${course.folder}"`);
      if (!course.modules.some((x) => x.n === fm.module)) add(l.file, `modulo ${fm.module} inesistente nel corso ${course.id}`);
    }
    if (Number(m[2]) !== fm.module) add(l.file, `il modulo nell'ID (${m[2]}) non coincide con module: ${fm.module}`);
    if (dir !== `${m[1].toLowerCase()}${fm.module}`) add(l.file, `la cartella deve chiamarsi ${m[1].toLowerCase()}${fm.module}`);

    if (fm.video && fm.video.end <= fm.video.start) add(l.file, "video: end deve essere maggiore di start");
    if (fm.verification.type === "generated-numeric") {
      if (!fm.verification.generator || !isGeneratorId(fm.verification.generator)) {
        add(l.file, `verification.generator sconosciuto: ${fm.verification.generator ?? "(mancante)"}`);
      }
    }

    // Regole di pubblicazione.
    if (fm.status === "published") {
      if (!fm.approved) add(l.file, "status published richiede approved: true (approvazione del titolare)");
      if (m[1] === "C" && fm.module === 8 && !fm.human_reviewed) {
        add(l.file, "i moduli di attacco etico (C8) richiedono human_reviewed: true");
      }
    }

    // Struttura del corpo.
    const screens = splitScreens(l.body);
    if (screens.length < MIN_SCREENS || screens.length > MAX_SCREENS) {
      add(l.file, `servono ${MIN_SCREENS}-${MAX_SCREENS} schermate, trovate ${screens.length}`);
    }
    if (!screens.some((s) => s.includes("<Practice"))) add(l.file, "manca la verifica pratica (<Practice>)");
    if (screens.length > 0 && !screens[screens.length - 1].includes("<Recap")) add(l.file, "l'ultima schermata deve contenere <Recap>");
    screens.forEach((s, i) => {
      if (!s.includes("<Say")) add(l.file, `schermata ${i + 1}: manca <Say> (serve per audio e trascrizione)`);
    });
    for (const w of l.body.matchAll(/<Say\s+who="([^"]*)"/g)) {
      if (w[1] !== "sensei" && w[1] !== "assistente") add(l.file, `<Say who="${w[1]}"> non valido (sensei | assistente)`);
    }
  }

  // Prerequisiti: esistenza e cicli.
  for (const [id, { file, fm }] of valid) {
    for (const p of fm.prerequisites) {
      if (p === id) add(file, "una lezione non può essere prerequisito di sé stessa");
      else if (!valid.has(p)) add(file, `prerequisito inesistente: ${p}`);
    }
  }
  const state = new Map<string, 1 | 2>();
  const walk = (id: string, trail: string[]) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      add(valid.get(id)!.file, `ciclo nei prerequisiti: ${[...trail, id].join(" → ")}`);
      return;
    }
    state.set(id, 1);
    for (const p of valid.get(id)!.fm.prerequisites) if (valid.has(p) && p !== id) walk(p, [...trail, id]);
    state.set(id, 2);
  };
  for (const id of valid.keys()) walk(id, []);

  return issues;
}
