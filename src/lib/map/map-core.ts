import type { CourseDef } from "@/lib/content/courses";

/** Dati per la mappa del sapere: puro, senza file né database. */

export type MapLessonInfo = { id: string; course: string; module: number };
export type ModuleState = "done" | "progress" | "todo" | "soon";
export type MapModuleNode = { n: number; title: string; done: number; total: number; state: ModuleState };
export type MapCourseNode = { id: string; title: string; folder: string; done: number; total: number; modules: MapModuleNode[] };

export function buildKnowledgeMap(courses: readonly CourseDef[], lessons: readonly MapLessonInfo[], completed: ReadonlySet<string>): MapCourseNode[] {
  return courses.map((c) => {
    const mine = lessons.filter((l) => l.course === c.folder);
    const modules = c.modules.map((m): MapModuleNode => {
      const inMod = mine.filter((l) => l.module === m.n);
      const done = inMod.filter((l) => completed.has(l.id)).length;
      const state: ModuleState = inMod.length === 0 ? "soon" : done === inMod.length ? "done" : done > 0 ? "progress" : "todo";
      return { n: m.n, title: m.title, done, total: inMod.length, state };
    });
    return { id: c.id, title: c.title, folder: c.folder, done: mine.filter((l) => completed.has(l.id)).length, total: mine.length, modules };
  });
}
