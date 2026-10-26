/**
 * Una sola regola per decidere se una lezione si apre.
 * «Nessun salto»: servono i prerequisiti completati, oppure padroneggiati
 * (superando la prova del modulo: lo sblocco è registrato, non è un salto libero).
 */

type LessonLike = { id: string; prerequisites: string[] };

export type Progress = {
  completed: ReadonlySet<string>;
  /** Lezioni sbloccate con la prova di padronanza: aperte, ma senza XP. */
  mastered?: ReadonlySet<string>;
};

export type LessonState = "done" | "mastered" | "open" | "locked";

const satisfied = (id: string, p: Progress) => p.completed.has(id) || (p.mastered?.has(id) ?? false);

export function canOpenLesson(lesson: LessonLike, progress: Progress): boolean {
  return lesson.prerequisites.every((id) => satisfied(id, progress));
}

export function lessonState(lesson: LessonLike, progress: Progress): LessonState {
  if (progress.completed.has(lesson.id)) return "done";
  if (progress.mastered?.has(lesson.id)) return "mastered";
  return canOpenLesson(lesson, progress) ? "open" : "locked";
}
