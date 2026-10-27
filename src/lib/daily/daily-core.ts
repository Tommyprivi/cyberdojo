import { rng, shuffle } from "@/lib/practice/core";
import type { BankItem } from "@/lib/practice/banks";

/**
 * Sfida del giorno: una domanda uguale per tutti, scelta solo dalla data e dalle banche di domande.
 * Funzioni pure: la risposta giusta resta sul server (vedi src/app/actions/daily.ts).
 */

export const DAILY_XP = 5;

export type DailyPick = { bankId: string; question: string; choices: string[]; correct: string };
export type PublicDaily = { question: string; choices: string[] };

/** Sceglie la domanda di un giorno ("YYYY-MM-DD"). Le banche si ordinano per nome: l'ordine di scrittura non conta. */
export function pickDaily(day: string, banks: Record<string, readonly BankItem[]>): DailyPick {
  const ids = Object.keys(banks)
    .filter((id) => banks[id].length > 0)
    .sort();
  const total = ids.reduce((n, id) => n + banks[id].length, 0);
  if (total === 0) throw new Error("Nessuna domanda disponibile per la sfida del giorno.");
  const next = rng(`daily:${day}`);
  let k = Math.floor(next() * total);
  for (const id of ids) {
    if (k < banks[id].length) {
      const item = banks[id][k];
      return { bankId: id, question: item.q, choices: shuffle([item.ok, ...item.no], next), correct: item.ok };
    }
    k -= banks[id].length;
  }
  throw new Error("Indice fuori dalle banche."); // non raggiungibile
}

/** Ciò che si può mandare al browser: mai la risposta giusta. */
export function publicDaily(p: DailyPick): PublicDaily {
  return { question: p.question, choices: p.choices };
}

export function checkDaily(p: DailyPick, chosen: string): boolean {
  return typeof chosen === "string" && chosen === p.correct;
}

/**
 * Evento XP del giorno. `refId` è la data: l'indice unico xp_once (utente, tipo, riferimento) del database
 * impedisce un secondo evento nello stesso giorno. Una risposta sbagliata registra un evento da 0 punti
 * («daily_miss»): serve a dare un solo tentativo al giorno.
 */
export function dailyXpEvent(day: string, correct: boolean) {
  return { kind: correct ? ("daily" as const) : ("daily_miss" as const), amount: correct ? DAILY_XP : 0, refId: day };
}

/** Giorni di fila con sfida riuscita, contando da oggi (o da ieri, se oggi non è ancora stata fatta). */
export function dailyStreak(wonDays: readonly string[], today: string): number {
  const set = new Set(wonDays);
  let cursor = today;
  if (!set.has(cursor)) cursor = shiftDay(today, -1);
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = shiftDay(cursor, -1);
  }
  return n;
}

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

