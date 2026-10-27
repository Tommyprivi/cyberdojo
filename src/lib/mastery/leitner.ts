/** Ripasso intelligente a scatole (Leitner): 1, 3, 7, 21 giorni. Funzioni pure. */

export const BOX_DAYS = [1, 3, 7, 21] as const;
const DAY_MS = 86_400_000;

const clampBox = (box: number) => Math.min(BOX_DAYS.length, Math.max(1, Math.trunc(box) || 1));

/** Sbagli: scatola 1, si rivede domani. Indovini: si sale di una scatola (l'ultima resta tale). */
export function nextReview(box: number, correct: boolean, now: Date): { box: number; dueAt: Date } {
  const next = correct ? Math.min(BOX_DAYS.length, clampBox(box) + 1) : 1;
  return { box: next, dueAt: new Date(now.getTime() + BOX_DAYS[next - 1] * DAY_MS) };
}

/** Le voci scadute, le più vecchie per prime, al massimo `limit`. */
export function dueNow<T extends { dueAt: Date }>(items: readonly T[], now: Date, limit: number): T[] {
  return items
    .filter((i) => i.dueAt.getTime() <= now.getTime())
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .slice(0, limit);
}
