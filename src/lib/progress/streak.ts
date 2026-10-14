/**
 * Serie (streak): regole della sezione 7 della spec.
 * - Un giorno conta solo se si supera almeno una verifica pratica (la chiamata avviene solo allora).
 * - Il giorno si calcola nel fuso orario dell'utente.
 * - Ogni 7 giorni di serie si guadagna 1 "congelamento", massimo 2 accumulati.
 * - Un congelamento copre un giorno saltato: la serie non si rompe.
 */

export type StreakState = { current: number; best: number; lastDay: string | null; freezes: number };

export const MAX_FREEZES = 2;
export const FREEZE_EVERY = 7;

/** Giorno di calendario "YYYY-MM-DD" di un istante, nel fuso indicato. */
export function localDay(date: Date, timeZone: string): string {
  // en-CA formatta già come YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Giorni di calendario tra due date "YYYY-MM-DD" (b meno a). Indipendente da ora legale e fusi. */
export function daysBetween(a: string, b: string): number {
  const [ya, ma, da] = a.split("-").map(Number);
  const [yb, mb, db] = b.split("-").map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000);
}

export type StreakResult = StreakState & {
  /** false se oggi era già stato contato. */
  counted: boolean;
  /** Congelamenti consumati per coprire giorni saltati. */
  freezesUsed: number;
  /** true se questo giorno ha fatto guadagnare un congelamento. */
  freezeEarned: boolean;
  /** true se la serie si era rotta ed è ripartita da 1. */
  broken: boolean;
};

export function applyStreak(state: StreakState, today: string): StreakResult {
  const same = (extra: Partial<StreakResult> = {}): StreakResult => ({
    ...state, counted: false, freezesUsed: 0, freezeEarned: false, broken: false, ...extra,
  });

  if (state.lastDay === today) return same();

  let current: number;
  let freezes = state.freezes;
  let freezesUsed = 0;
  let broken = false;

  if (state.lastDay === null) {
    current = 1;
  } else {
    const gap = daysBetween(state.lastDay, today);
    if (gap < 1) return same(); // orologio indietro: non si tocca nulla
    if (gap === 1) {
      current = state.current + 1;
    } else {
      const missed = gap - 1;
      if (freezes >= missed) {
        freezes -= missed;
        freezesUsed = missed;
        current = state.current + 1;
      } else {
        current = 1;
        broken = state.current > 0;
      }
    }
  }

  let freezeEarned = false;
  if (current % FREEZE_EVERY === 0 && current > state.current && freezes < MAX_FREEZES) {
    freezes += 1;
    freezeEarned = true;
  }

  return { current, best: Math.max(state.best, current), lastDay: today, freezes, counted: true, freezesUsed, freezeEarned, broken };
}

/**
 * Serie da mostrare oggi, senza modificare nulla: se hai saltato giorni che i congelamenti non
 * coprono, la serie è già finita anche se il database non è ancora stato aggiornato.
 */
export function effectiveStreak(state: StreakState, today: string): number {
  if (!state.lastDay) return 0;
  const gap = daysBetween(state.lastDay, today);
  if (gap <= 1) return state.current;
  return state.freezes >= gap - 1 ? state.current : 0;
}
