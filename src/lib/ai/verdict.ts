export type Verdict = "giusta" | "parziale" | "sbagliata";

const MARK = /\[\[\s*ESITO\s*:\s*(giusta|parziale|sbagliata)\s*\]\]/gi;

/** Separa il testo da un eventuale marcatore di esito, che non va mostrato. */
export function parseVerdict(text: string): { text: string; verdict: Verdict | null } {
  let verdict: Verdict | null = null;
  const clean = text.replace(MARK, (_m, v: string) => {
    verdict = v.toLowerCase() as Verdict;
    return "";
  });
  return { text: clean.trim(), verdict };
}

export function scoreOf(verdicts: Verdict[]): number {
  return verdicts.reduce((s, v) => s + (v === "giusta" ? 1 : v === "parziale" ? 0.5 : 0), 0);
}
