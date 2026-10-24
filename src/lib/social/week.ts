import { localDay } from "../progress/streak";

/** La classifica e le sfide usano sempre il fuso italiano, uguale per tutti. */
export const SOCIAL_TZ = "Europe/Rome";

/** Differenza (ms) tra l'ora locale del fuso e UTC in quell'istante. */
function offsetMs(date: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** L'istante UTC della mezzanotte locale di una data (corretto anche nei giorni del cambio ora). */
function zonedMidnightUtc(y: number, m: number, d: number, tz: string): Date {
  const naive = Date.UTC(y, m - 1, d);
  let t = naive - offsetMs(new Date(naive), tz);
  t = naive - offsetMs(new Date(t), tz);
  return new Date(t);
}

export type WeekBounds = {
  /** Lunedì 00:00 italiane, incluso. */
  start: Date;
  /** Lunedì successivo 00:00 italiane, escluso. */
  end: Date;
  /** Il lunedì come YYYY-MM-DD: identifica la settimana. */
  key: string;
};

function boundsFromMonday(y: number, m: number, d: number): WeekBounds {
  const next = new Date(Date.UTC(y, m - 1, d + 7));
  return {
    start: zonedMidnightUtc(y, m, d, SOCIAL_TZ),
    end: zonedMidnightUtc(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), SOCIAL_TZ),
    key: new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10),
  };
}

/** La settimana (lunedì-domenica, ora italiana) che contiene `now`. Si azzera ogni lunedì a mezzanotte. */
export function weekBounds(now: Date = new Date()): WeekBounds {
  const [y, m, d] = localDay(now, SOCIAL_TZ).split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = domenica
  const sinceMonday = (dow + 6) % 7;
  const monday = new Date(Date.UTC(y, m - 1, d - sinceMonday));
  return boundsFromMonday(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate());
}

/** I confini di una settimana dato il suo lunedì (YYYY-MM-DD), oppure null se la chiave non è valida. */
export function weekBoundsFromKey(key: string): WeekBounds | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d || dt.getUTCDay() !== 1) return null;
  return boundsFromMonday(y, m, d);
}

/** Tempo mancante al prossimo azzeramento, a parole. */
export function resetLabel(now: Date, end: Date): string {
  const hours = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 3_600_000));
  if (hours >= 48) return `${Math.floor(hours / 24)} giorni`;
  if (hours > 1) return `${hours} ore`;
  return "meno di un'ora";
}
