/**
 * Livelli Base / Medio / Avanzato, ricavati dalla cintura scritta nella lezione (campo `belt`).
 * Mappa scelta (documentata in DECISIONS.md):
 *   bianca, gialla      -> Base      (si parte da zero)
 *   arancione, verde    -> Medio     (si lavora con gli strumenti)
 *   blu, marrone, nera  -> Avanzato  (si ragiona da professionisti)
 * Funzioni pure: usabili sia nel server che nel browser.
 */

export const LEVELS = ["base", "medio", "avanzato"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABEL: Record<Level, string> = { base: "Base", medio: "Medio", avanzato: "Avanzato" };

const BELT_LEVEL: Record<string, Level> = {
  bianca: "base",
  gialla: "base",
  arancione: "medio",
  verde: "medio",
  blu: "avanzato",
  marrone: "avanzato",
  nera: "avanzato",
};

/** Una cintura che non conosciamo ricade su Base: meglio non nascondere la lezione. */
export function levelOfBelt(belt: string): Level {
  return BELT_LEVEL[belt] ?? "base";
}

/** Legge `?livello=` dall'indirizzo. Qualsiasi valore non previsto vuol dire «tutti». */
export function parseLevelFilter(value: unknown): Level | null {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" && (LEVELS as readonly string[]).includes(v) ? (v as Level) : null;
}

export function filterByLevel<T extends { belt: string }>(items: readonly T[], level: Level | null): T[] {
  return level ? items.filter((i) => levelOfBelt(i.belt) === level) : [...items];
}
