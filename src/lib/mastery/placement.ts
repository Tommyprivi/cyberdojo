/** Test d'ingresso: logica pura. Il risultato consiglia un modulo, non sblocca nulla. */

/** Domande per ogni modulo campionato. */
export const PER_MODULE = 2;
export const MAX_SAMPLED_MODULES = 5;

/** Fino a `max` moduli sparsi lungo il corso, sempre con il primo e l'ultimo. */
export function sampleModules(modules: readonly number[], max = MAX_SAMPLED_MODULES): number[] {
  const sorted = [...modules].sort((a, b) => a - b);
  if (sorted.length <= max) return sorted;
  const picked = new Set<number>();
  for (let i = 0; i < max; i++) picked.add(sorted[Math.round((i * (sorted.length - 1)) / (max - 1))]);
  return [...picked].sort((a, b) => a - b);
}

export type ModuleScore = { module: number; correct: number };

/**
 * Il primo modulo campionato che non si conosce del tutto. Se si conosce tutto, l'ultimo testato.
 * Senza risposte: il modulo 1.
 */
export function recommendModule(scores: readonly ModuleScore[]): { module: number; allKnown: boolean } {
  const sorted = [...scores].sort((a, b) => a.module - b.module);
  if (sorted.length === 0) return { module: 1, allKnown: false };
  const gap = sorted.find((s) => s.correct < PER_MODULE);
  return gap ? { module: gap.module, allKnown: false } : { module: sorted[sorted.length - 1].module, allKnown: true };
}

/** I moduli precedenti a quello consigliato: per saltarli serve la prova di padronanza di ciascuno. */
export function modulesToProve(modules: readonly number[], recommended: number): number[] {
  return [...modules].filter((m) => m < recommended).sort((a, b) => a - b);
}
