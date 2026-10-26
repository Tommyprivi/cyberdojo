import { canOpenLesson } from "@/lib/progress/unlock";
import { readRawLessons } from "./load";
import { isVisible, lessonFrontmatter } from "./schema";

/** Le lezioni che uno studente può vedere, con quanto serve a Percorso e promemoria. */
export type LessonInfo = {
  id: string;
  title: string;
  course: string;
  module: number;
  minutes: number;
  prerequisites: string[];
};

export function loadCatalog(): LessonInfo[] {
  return readRawLessons()
    .flatMap((l) => {
      const fm = lessonFrontmatter.safeParse(l.data);
      return fm.success && isVisible(fm.data.status)
        ? [{ id: fm.data.id, title: fm.data.title, course: l.file.split("/")[0], module: fm.data.module, minutes: fm.data.duration_min, prerequisites: fm.data.prerequisites }]
        : [];
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** La prima lezione non completata i cui prerequisiti sono tutti completati: il «prossimo caso». */
export function nextLesson(lessons: LessonInfo[], completed: ReadonlySet<string>): LessonInfo | undefined {
  return lessons.find((l) => !completed.has(l.id) && canOpenLesson(l, { completed }));
}
