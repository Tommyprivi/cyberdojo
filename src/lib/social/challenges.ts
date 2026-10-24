import { weekBoundsFromKey } from "./week";

/**
 * Sfide settimanali: obiettivi a punti a cui ci si iscrive volontariamente.
 * Lo stato (a che punto sei, se l'hai vinta) NON è salvato: si calcola sempre dai dati veri
 * (lezioni completate, XP), contando solo da quando ti sei iscritto. A fine settimana la sfida
 * vinta diventa una medaglia nel Profilo.
 */

export type ChallengeMetric = "lessons" | "xp";
export type Challenge = { id: string; title: string; hint: string; metric: ChallengeMetric; target: number };

export const CHALLENGES: readonly Challenge[] = [
  { id: "tre-lezioni", title: "Tre casi", hint: "Completa 3 lezioni questa settimana", metric: "lessons", target: 3 },
  { id: "cinque-lezioni", title: "Cinque casi", hint: "Completa 5 lezioni questa settimana", metric: "lessons", target: 5 },
  { id: "xp-120", title: "120 punti", hint: "Guadagna 120 XP questa settimana", metric: "xp", target: 120 },
];

export const CHALLENGE_IDS = CHALLENGES.map((c) => c.id) as [string, ...string[]];

export function challengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export type ProgressData = {
  /** Quando sono state completate le lezioni. */
  lessonDates: Date[];
  xpEvents: { at: Date; amount: number }[];
};

/** Quanto hai fatto tra `from` (incluso) e `to` (escluso). */
export function progressOf(c: Challenge, data: ProgressData, from: Date, to: Date): number {
  const inside = (d: Date) => d.getTime() >= from.getTime() && d.getTime() < to.getTime();
  if (c.metric === "lessons") return data.lessonDates.filter(inside).length;
  return data.xpEvents.filter((e) => inside(e.at)).reduce((s, e) => s + e.amount, 0);
}

export type ChallengeEntry = { challengeId: string; weekStart: string; joinedAt: Date };

/** Progresso di una sfida a cui sei iscritto: conta solo da quando ti sei iscritto, dentro la sua settimana. */
export function entryProgress(entry: ChallengeEntry, data: ProgressData, now: Date = new Date()) {
  const c = challengeById(entry.challengeId);
  const week = weekBoundsFromKey(entry.weekStart);
  if (!c || !week) return null;
  const from = new Date(Math.max(week.start.getTime(), entry.joinedAt.getTime()));
  const to = new Date(Math.min(week.end.getTime(), now.getTime() + 1));
  const value = progressOf(c, data, from, to);
  return { challenge: c, value: Math.min(value, c.target), done: value >= c.target, ended: now.getTime() >= week.end.getTime() };
}

/** Quante sfide hai vinto in settimane già concluse: sono le medaglie. */
export function countWins(entries: ChallengeEntry[], data: ProgressData, now: Date = new Date()): number {
  return entries.reduce((n, e) => {
    const p = entryProgress(e, data, now);
    return p && p.ended && p.done ? n + 1 : n;
  }, 0);
}
