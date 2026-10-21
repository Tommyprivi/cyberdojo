import { readRawLessons } from "@/lib/content/load";
import { COURSES, getCourseById } from "@/lib/content/courses";
import { isVisible, lessonFrontmatter } from "@/lib/content/schema";
import { LIMITS } from "./limits";
import type { Scope } from "./schema";

export type LessonInfo = { id: string; title: string; module: number; course: string; objectives: string[]; body: string };

export type ScopeContext = {
  /** Etichetta per il prompt, es. «Lezione F.01.001: Titolo». */
  label: string;
  /** Testo di riferimento, già limitato in dimensione. */
  text: string;
  /** Obiettivi del contesto, per le domande della demo. */
  topics: string[];
  courseId: string;
  lessonId?: string;
};

export class ScopeError extends Error {}

/** Toglie dal testo MDX ciò che non serve al modello: import, tag, separatori. */
export function stripMdx(body: string): string {
  return body
    .replace(/^\s*import .*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<[A-Za-z][^>]*\/>/g, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}\n[…testo accorciato]`;
}

function visibleLessons(): LessonInfo[] {
  const out: LessonInfo[] = [];
  for (const raw of readRawLessons()) {
    const parsed = lessonFrontmatter.safeParse(raw.data);
    if (!parsed.success || !isVisible(parsed.data.status)) continue;
    const fm = parsed.data;
    out.push({ id: fm.id, title: fm.title, module: fm.module, course: fm.id[0], objectives: fm.objectives, body: raw.body });
  }
  return out;
}

/** Costruisce il contesto per il modello. Solo lezioni visibili. */
export function loadScopeContext(scope: Scope, lessons: LessonInfo[] = visibleLessons()): ScopeContext {
  const course = getCourseById(scope.courseId);
  if (!course) throw new ScopeError("Corso inesistente");

  if (scope.lessonId) {
    const l = lessons.find((x) => x.id === scope.lessonId);
    if (!l) throw new ScopeError("Lezione inesistente");
    const head = `Lezione ${l.id}: ${l.title}\nObiettivi:\n${l.objectives.map((o) => `- ${o}`).join("\n")}\n\nTesto della lezione:\n`;
    return {
      label: `Lezione ${l.id}: ${l.title}`,
      text: head + truncate(stripMdx(l.body), Math.max(1000, LIMITS.maxContextChars - head.length)),
      topics: l.objectives,
      courseId: l.course,
      lessonId: l.id,
    };
  }

  const inCourse = lessons.filter((l) => l.course === course.id && (!scope.module || l.module === scope.module));
  if (scope.module) {
    const mod = course.modules.find((m) => m.n === scope.module);
    if (!mod) throw new ScopeError("Modulo inesistente");
    const lines = inCourse.map((l) => `Lezione ${l.id}: ${l.title}\n${l.objectives.map((o) => `  - ${o}`).join("\n")}`);
    return {
      label: `Corso «${course.title}», modulo ${mod.n}: ${mod.title}`,
      text: truncate(`Modulo ${mod.n}: ${mod.title}. ${mod.summary}\n\n${lines.join("\n")}`, LIMITS.maxContextChars),
      topics: inCourse.flatMap((l) => l.objectives),
      courseId: course.id,
    };
  }

  const modules = course.modules.map((m) => {
    const ls = inCourse.filter((l) => l.module === m.n);
    return `Modulo ${m.n}: ${m.title}. ${m.summary}\n${ls.map((l) => `  Lezione ${l.id}: ${l.title}`).join("\n")}`;
  });
  return {
    label: `Corso «${course.title}»`,
    text: truncate(modules.join("\n\n"), LIMITS.maxContextChars),
    topics: course.modules.map((m) => `${m.title}: ${m.summary}`),
    courseId: course.id,
  };
}

/** Corsi, moduli e lezioni visibili: per i selettori della pagina. */
export function catalogForPicker() {
  const lessons = visibleLessons();
  return COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    modules: c.modules.map((m) => ({
      n: m.n,
      title: m.title,
      lessons: lessons.filter((l) => l.course === c.id && l.module === m.n).map((l) => ({ id: l.id, title: l.title })),
    })),
  }));
}
