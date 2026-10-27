import { rng, shuffle } from "@/lib/practice/core";
import { parseQuizzes } from "./quiz-parse";

/**
 * Domande delle prove: si prendono dalle banche (src/lib/practice/banks-*) e dai <Quiz> delle lezioni.
 * Tutto puro e deterministico: stesso seme, stesse domande, stesso ordine delle opzioni.
 * Questo file va importato SOLO da codice server: contiene le risposte giuste.
 */

export type PoolItem = { id: string; q: string; ok: string; no: string[] };
export type FullQuestion = { id: string; prompt: string; choices: string[]; answer: number };
export type PublicQuestion = Omit<FullQuestion, "answer">;

export type PoolLesson = { id: string; course: string; module: number; generator?: string; body: string };
type Bank = readonly { q: string; ok: string; no: readonly string[] }[];

/** Chiave del modulo, es. «C1», «F5». */
export const moduleKey = (course: string, module: number) => `${course.toUpperCase()}${module}`;

const BANK_PREFIX = /^([cfdth])(\d{2})-/;

/** Raggruppa tutte le domande per modulo. Le banche senza un modulo riconoscibile si ignorano. */
export function buildPools(banks: Record<string, Bank>, lessons: readonly PoolLesson[]): Map<string, PoolItem[]> {
  const pools = new Map<string, PoolItem[]>();
  const add = (key: string, item: PoolItem) => pools.set(key, [...(pools.get(key) ?? []), item]);

  const moduleOfBank = new Map<string, string>();
  for (const l of lessons) if (l.generator) moduleOfBank.set(l.generator, moduleKey(l.course, l.module));

  for (const [bank, items] of Object.entries(banks)) {
    const m = BANK_PREFIX.exec(bank);
    const key = m ? moduleKey(m[1], Number(m[2])) : moduleOfBank.get(bank);
    if (!key) continue;
    items.forEach((it, i) => add(key, { id: `${bank}#${i + 1}`, q: it.q, ok: it.ok, no: [...it.no] }));
  }
  for (const l of lessons) {
    parseQuizzes(l.body).forEach((it, i) => add(moduleKey(l.course, l.module), { id: `quiz:${l.id}#${i + 1}`, ...it }));
  }
  return pools;
}

/** Sceglie `count` domande diverse (anche nel testo) e mescola le opzioni. */
export function pickQuestions(pool: readonly PoolItem[], seed: string, count: number): FullQuestion[] {
  const next = rng(`mastery:${seed}`);
  const seen = new Set<string>();
  const out: FullQuestion[] = [];
  for (const it of shuffle(pool, next)) {
    if (out.length >= count) break;
    if (seen.has(it.q)) continue;
    seen.add(it.q);
    const choices = shuffle([it.ok, ...it.no], next);
    out.push({ id: it.id, prompt: it.q, choices, answer: choices.indexOf(it.ok) });
  }
  return out;
}

/** Ciò che può arrivare al browser: mai la risposta giusta. */
export function toPublic({ id, prompt, choices }: FullQuestion): PublicQuestion {
  return { id, prompt, choices };
}
