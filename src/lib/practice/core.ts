/**
 * Mattoni comuni dei generatori: tipi delle domande e numeri casuali riproducibili.
 * Stesso seme, stesse domande: il seme viene salvato con il tentativo, quindi la correzione
 * si può rifare e le domande non sono uguali per tutti.
 */

export type Question = {
  /** Testo della domanda (senza il dato, che sta in `data`). */
  prompt: string;
  /** Dato grezzo mostrato in carattere monospazio (es. gli 8 bit, un indirizzo IP). Può essere vuoto. */
  data: string;
  /** Se presente, la domanda è a scelta: `answer` è l'indice della scelta giusta. */
  choices?: string[];
  /** Risposta attesa. Non va mai inviata al client nelle verifiche valutate. */
  answer: number;
};

export type PublicQuestion = Omit<Question, "answer">;

/** Hash di una stringa in un intero a 32 bit (cyrb128 semplificato). */
function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/** mulberry32: PRNG piccolo e riproducibile. */
export function rng(seed: string): () => number {
  let a = hashSeed(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mescola una copia dell'array (Fisher-Yates) con il generatore dato. */
export function shuffle<T>(items: readonly T[], next: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Risposta a scelta: un indice di una cifra ("0"…"9"). */
export function parseChoiceAnswer(raw: string): number | null {
  const s = raw.trim();
  return /^\d$/.test(s) ? Number(s) : null;
}
