/**
 * Generatori di esercizi a numeri casuali. Puri e deterministici: stesso seme, stesse domande.
 * Il seme viene salvato con il tentativo, quindi la correzione si può rifare e le domande
 * non sono uguali per tutti.
 */

export type Difficulty = "facile" | "medio" | "severo";

export type Question = {
  /** Testo mostrato all'utente. */
  prompt: string;
  /** Dato grezzo dell'esercizio (es. gli 8 bit). */
  data: string;
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

const BITS: Record<Difficulty, number> = { facile: 4, medio: 8, severo: 8 };

/**
 * Binario → decimale. Evita i casi banali (0 e il massimo) e gli ottetti con un solo bit a 1
 * nei livelli medio e severo, così non si indovina a occhio.
 */
export function binaryToDecimal(seed: string, count = 5, difficulty: Difficulty = "medio"): Question[] {
  const next = rng(`binary-to-decimal:${difficulty}:${seed}`);
  const bits = BITS[difficulty];
  const max = 2 ** bits - 1;
  const seen = new Set<number>();
  const out: Question[] = [];
  while (out.length < count) {
    const value = 1 + Math.floor(next() * (max - 1)); // 1..max-1
    if (seen.has(value)) continue;
    if (difficulty !== "facile" && (value & (value - 1)) === 0) continue; // potenza di 2
    seen.add(value);
    const data = value.toString(2).padStart(bits, "0");
    out.push({ prompt: `Converti ${data} in decimale`, data, answer: value });
  }
  return out;
}

export const GENERATORS = {
  "binary-to-decimal": binaryToDecimal,
} as const;

export type GeneratorId = keyof typeof GENERATORS;

export function isGeneratorId(id: string): id is GeneratorId {
  return id in GENERATORS;
}

/** Risposta accettata solo se è un intero scritto in modo pulito ("178", non "178.0" o "1e2"). */
export function parseIntegerAnswer(raw: string): number | null {
  const s = raw.trim();
  return /^\d{1,6}$/.test(s) ? Number(s) : null;
}

export type Diagnosis = { ok: boolean; message: string };

const WEIGHTS = (n: number) => Array.from({ length: n }, (_, i) => 2 ** (n - 1 - i));

/** Spiega PERCHÉ una risposta è sbagliata, non solo che lo è. */
export function diagnoseBinaryToDecimal(bits: string, raw: string): Diagnosis {
  const expected = parseInt(bits, 2);
  const answer = parseIntegerAnswer(raw);
  if (raw.trim() === "") return { ok: false, message: "" };
  if (answer === null) {
    return { ok: false, message: "Scrivi solo un numero intero, senza spazi o simboli." };
  }
  if (answer === expected) return { ok: true, message: "Corretto." };

  const w = WEIGHTS(bits.length);
  const parts = [...bits].map((b, i) => (b === "1" ? w[i] : null)).filter((x): x is number => x !== null);
  const reversed = parseInt([...bits].reverse().join(""), 2);

  if (answer === reversed) {
    return {
      ok: false,
      message: `Hai letto i bit al contrario. Il bit più a sinistra pesa ${w[0]}, quello più a destra pesa 1.`,
    };
  }
  if (answer === parts.length) {
    return { ok: false, message: "Hai contato gli uno. Ogni uno vale il peso della sua posizione, non 1." };
  }
  if (answer === Number(bits)) {
    return { ok: false, message: "Hai copiato le cifre come se fossero decimali. Sono bit: sommane i pesi." };
  }
  if (answer > 2 ** bits.length - 1) {
    return {
      ok: false,
      message: `Con ${bits.length} bit il massimo è ${2 ** bits.length - 1}. Il tuo risultato è troppo grande.`,
    };
  }
  return {
    ok: false,
    message: `Non torna. Somma i pesi dei bit a 1 (${w.join(", ")}) e controlla di non aver saltato una posizione.`,
  };
}

/** Passo successivo dello svolgimento, per il pulsante "mostrami il passo successivo". */
export function binaryToDecimalSteps(bits: string): string[] {
  const w = WEIGHTS(bits.length);
  const ones = [...bits].map((b, i) => (b === "1" ? w[i] : null)).filter((x): x is number => x !== null);
  return [
    `Scrivi i pesi sotto i bit: ${w.join("  ")}.`,
    `Tieni solo i pesi dove il bit è 1: ${ones.join(", ")}.`,
    `Sommali: ${ones.join(" + ")} = ${ones.reduce((a, b) => a + b, 0)}.`,
  ];
}
