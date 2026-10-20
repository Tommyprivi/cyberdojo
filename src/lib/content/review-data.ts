import type { TableRow } from "@/components/review/lesson-table";
import { CYBER_BANK_ITEMS } from "@/lib/practice/banks-cyber";
import { COURSES } from "./courses";
import { readRawLessons, splitScreens } from "./load";
import { lessonFrontmatter } from "./schema";
import type { Reviews } from "./reviews";

/** Righe della tabella delle lezioni, con i valori delle revisioni già fusi (readRawLessons li fonde). */
export function loadLessonRows(reviews: Reviews): TableRow[] {
  return readRawLessons().flatMap((l) => {
    const fm = lessonFrontmatter.safeParse(l.data);
    if (!fm.success) return [];
    const d = fm.data;
    const gen = d.verification.generator;
    const code = `${d.id[0]}${d.module}`;
    return [
      {
        id: d.id,
        title: d.title,
        module: d.module,
        course: l.file.split("/")[0],
        moduleCode: code,
        approved: d.approved,
        hasVideo: !!d.video,
        videoReviewed: !!d.video?.reviewed,
        isAttack: d.id[0] === "C" && d.module === 8,
        humanReviewed: d.human_reviewed,
        screens: splitScreens(l.body).length,
        questions: gen ? (CYBER_BANK_ITEMS[gen]?.length ?? 0) : 0,
        status: d.status,
        hasNote: !!reviews[d.id]?.note,
        note: reviews[d.id]?.note,
      },
    ];
  });
}

export const moduleList = () =>
  COURSES.flatMap((c) => c.modules.map((m) => ({ code: `${c.id}${m.n}`, title: m.title, course: c.title })));
