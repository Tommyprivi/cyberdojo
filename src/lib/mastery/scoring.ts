/** Punteggio delle prove di padronanza. Funzioni pure. */

/** Percentuale minima di risposte giuste per superare la prova (decisa dal titolare: 80%). */
export const PASS_PCT = 80;

/** Superare una prova di padronanza non dà XP: sblocca soltanto (vedi DECISIONS.md). */
export const MASTERY_XP = 0;

export function neededToPass(total: number): number {
  return Math.ceil((total * PASS_PCT) / 100);
}

export function isPassed(correct: number, total: number): boolean {
  return total > 0 && correct * 100 >= PASS_PCT * total;
}

/** Confronta le risposte date (indici) con quelle attese. Tutto ciò che non è un indice intero giusto è sbagliato. */
export function gradeChoices(expected: readonly number[], given: readonly unknown[]): { results: boolean[]; correct: number } {
  const results = expected.map((e, i) => typeof given[i] === "number" && Number.isInteger(given[i]) && given[i] === e);
  return { results, correct: results.filter(Boolean).length };
}

/** Le lezioni del modulo da segnare «padroneggiata»: quelle non già completate né già padroneggiate. */
export function lessonsToMaster(moduleLessonIds: readonly string[], completed: ReadonlySet<string>, mastered: ReadonlySet<string>): string[] {
  return moduleLessonIds.filter((id) => !completed.has(id) && !mastered.has(id));
}
