/**
 * Leghe settimanali. Nessuna tabella: la divisione di una settimana si ricava dagli XP della settimana
 * precedente (soglie fisse). Promozione o retrocessione = confronto con la divisione della settimana prima.
 */

export type Division = { id: string; name: string; /** XP minimi della settimana per entrarci. */ minXp: number; color: string };

export const DIVISIONS: readonly Division[] = [
  { id: "bronzo", name: "Bronzo", minXp: 0, color: "#a8693a" },
  { id: "argento", name: "Argento", minXp: 50, color: "#8a94a0" },
  { id: "oro", name: "Oro", minXp: 120, color: "#c9971c" },
  { id: "zaffiro", name: "Zaffiro", minXp: 200, color: "#2d5fb8" },
  { id: "rubino", name: "Rubino", minXp: 300, color: "#b8321c" },
  { id: "diamante", name: "Diamante", minXp: 450, color: "#3bb6c9" },
];

/** Indice della divisione raggiunta con quegli XP settimanali. */
export function divisionIndex(weeklyXp: number): number {
  let idx = 0;
  for (let i = 0; i < DIVISIONS.length; i++) if (weeklyXp >= DIVISIONS[i].minXp) idx = i;
  return idx;
}

export const divisionFor = (weeklyXp: number): Division => DIVISIONS[divisionIndex(weeklyXp)];

export type Movement = "promosso" | "retrocesso" | "confermato";

export function movement(prevIdx: number, nowIdx: number): Movement {
  return nowIdx > prevIdx ? "promosso" : nowIdx < prevIdx ? "retrocesso" : "confermato";
}

/** Messaggio gentile per l'inizio settimana. */
export function movementMessage(prevIdx: number, nowIdx: number): string {
  const from = DIVISIONS[prevIdx].name;
  const to = DIVISIONS[nowIdx].name;
  switch (movement(prevIdx, nowIdx)) {
    case "promosso":
      return `Complimenti! Sei salito da ${from} a ${to}.`;
    case "retrocesso":
      return `Questa settimana riparti da ${to}. Con qualche lezione risali presto.`;
    default:
      return `Resti in ${to}. Bel ritmo!`;
  }
}

/** XP che mancano alla divisione successiva (null se già al massimo). */
export function xpToNext(weeklyXp: number): { next: Division; missing: number } | null {
  const idx = divisionIndex(weeklyXp);
  const next = DIVISIONS[idx + 1];
  return next ? { next, missing: next.minXp - Math.max(0, weeklyXp) } : null;
}
