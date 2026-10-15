import { localDay, type StreakState } from "../progress/streak";

/** Un utente che ha attivato i promemoria, con quanto serve per decidere se mandargliene uno ora. */
export type ReminderCandidate = {
  userId: string;
  email: string;
  name: string | null;
  timezone: string;
  /** Ora del giorno (0-23, nel suo fuso) scelta dall'utente. */
  reminderHour: number;
  lastReminderDay: string | null;
  streak: StreakState;
};

/** Per quante ore dopo l'orario scelto si può ancora mandare (se un giro è saltato). Poi basta: niente promemoria a notte fonda. */
export const SEND_WINDOW_HOURS = 3;

/** Ora locale (0-23) di un istante in un fuso. */
export function localHour(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" }).formatToParts(date);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0);
}

/**
 * Quando va mandato il promemoria? Una sola volta al giorno, nella finestra dopo l'orario scelto,
 * e solo se oggi l'utente non ha già superato una verifica (la sua serie di oggi è già al sicuro).
 */
export function isReminderDue(c: ReminderCandidate, now: Date): boolean {
  const today = localDay(now, c.timezone);
  if (c.lastReminderDay === today) return false;
  if (c.streak.lastDay === today) return false;
  const hour = localHour(now, c.timezone);
  return hour >= c.reminderHour && hour < c.reminderHour + SEND_WINDOW_HOURS;
}
