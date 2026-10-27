import type { BankItem } from "@/lib/practice/banks";

/**
 * Estrae i <Quiz question="..." options={[...]} answer={n} /> da una lezione MDX, per usarli
 * come domande delle prove. Legge solo la forma standard (stringhe tra virgolette doppie):
 * ciò che non si capisce con certezza viene saltato, mai indovinato.
 */

const QUIZ = /<Quiz\b([\s\S]*?)\/>/g;
const STRING = '"((?:[^"\\\\]|\\\\.)*)"';
const QUESTION = new RegExp(`question=${STRING}`);
const OPTIONS = /options=\{(\[[\s\S]*?\])\}/;
const ANSWER = /answer=\{(\d+)\}/;

export type ParsedQuiz = Pick<BankItem, "q" | "ok"> & { no: string[] };

export function parseQuizzes(mdx: string): ParsedQuiz[] {
  const out: ParsedQuiz[] = [];
  for (const m of mdx.matchAll(QUIZ)) {
    const block = m[1];
    const qm = QUESTION.exec(block);
    const om = OPTIONS.exec(block);
    const am = ANSWER.exec(block);
    if (!qm || !om || !am) continue;
    try {
      const q: unknown = JSON.parse(`"${qm[1]}"`);
      const options: unknown = JSON.parse(om[1]);
      const answer = Number(am[1]);
      if (typeof q !== "string" || !Array.isArray(options) || !options.every((o) => typeof o === "string")) continue;
      if (options.length < 2 || answer >= options.length) continue;
      if (new Set(options).size !== options.length) continue;
      out.push({ q, ok: options[answer], no: options.filter((_, i) => i !== answer) });
    } catch {
      continue;
    }
  }
  return out;
}
