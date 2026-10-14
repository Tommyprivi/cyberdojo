/**
 * Generatori di esercizi. Puri e deterministici: stesso seme, stesse domande.
 * I mattoni comuni (tipi, numeri casuali) stanno in core.ts; le domande a scelta in banks.ts.
 */
import { BANKS, hexByteToDecimal, ipPrivatePublic, ipValid } from "./banks";
import { parseChoiceAnswer, rng, type Question } from "./core";

export { rng, shuffle, parseChoiceAnswer } from "./core";
export type { Question, PublicQuestion } from "./core";

export type Difficulty = "facile" | "medio" | "severo";

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
    out.push({ prompt: "Quanto vale questo ottetto?", data, answer: value });
  }
  return out;
}

/**
 * Decimale → binario (ottetto). Si mostra il numero, si risponde con 8 bit.
 * Stesse esclusioni del caso inverso: niente 0, 255 e potenze di 2.
 */
export function decimalToBinary(seed: string, count = 5): Question[] {
  const next = rng(`decimal-to-binary:${seed}`);
  const seen = new Set<number>();
  const out: Question[] = [];
  while (out.length < count) {
    const value = 1 + Math.floor(next() * 254); // 1..254
    if (seen.has(value) || (value & (value - 1)) === 0) continue;
    seen.add(value);
    const data = String(value);
    out.push({ prompt: "Scrivilo in 8 bit.", data, answer: value });
  }
  return out;
}

/** Risposta accettata solo se è un intero scritto in modo pulito ("178", non "178.0" o "1e2"). */
export function parseIntegerAnswer(raw: string): number | null {
  const s = raw.trim();
  return /^\d{1,6}$/.test(s) ? Number(s) : null;
}

/**
 * Risposta in bit: esattamente 8 cifre 0/1. Gli spazi interni sono tollerati ("0100 0010"),
 * ma "1000010" (7 bit) no: in un ottetto si scrivono sempre tutti gli 8 bit.
 */
export function parseOctetAnswer(raw: string): number | null {
  const s = raw.replace(/\s+/g, "");
  return /^[01]{8}$/.test(s) ? parseInt(s, 2) : null;
}

/** Ogni generatore sa produrre le domande e leggere le risposte. */
export const GENERATORS = {
  "binary-to-decimal": { generate: binaryToDecimal, parse: parseIntegerAnswer },
  "decimal-to-binary": { generate: decimalToBinary, parse: parseOctetAnswer },
  "hex-byte-to-decimal": { generate: hexByteToDecimal, parse: parseIntegerAnswer },
  "ip-valid": { generate: ipValid, parse: parseChoiceAnswer },
  "ip-private-public": { generate: ipPrivatePublic, parse: parseChoiceAnswer },
  "packet-basics": { generate: BANKS["packet-basics"], parse: parseChoiceAnswer },
  "arp-concepts": { generate: BANKS["arp-concepts"], parse: parseChoiceAnswer },
  "osi-layers": { generate: BANKS["osi-layers"], parse: parseChoiceAnswer },
  "encapsulation": { generate: BANKS["encapsulation"], parse: parseChoiceAnswer },
} as const;

export type GeneratorId = keyof typeof GENERATORS;

export function isGeneratorId(id: string): id is GeneratorId {
  return id in GENERATORS;
}

/** Spiega perché una risposta in bit è sbagliata. */
export function diagnoseDecimalToBinary(value: number, raw: string): Diagnosis {
  const s = raw.replace(/\s+/g, "");
  if (s === "") return { ok: false, message: "" };
  if (!/^[01]+$/.test(s)) return { ok: false, message: "Usa solo 0 e 1." };
  if (s.length !== 8) {
    const short = s.length < 8 && parseInt(s, 2) === value;
    return {
      ok: false,
      message: short
        ? `Il valore è giusto, ma un ottetto ha sempre 8 bit: aggiungi ${8 - s.length} zeri a sinistra.`
        : `Servono esattamente 8 bit, ne hai scritti ${s.length}.`,
    };
  }
  const got = parseInt(s, 2);
  if (got === value) return { ok: true, message: "Corretto." };
  if (parseInt([...s].reverse().join(""), 2) === value) {
    return { ok: false, message: "Hai scritto i bit al contrario: la moneta da 128 sta a sinistra." };
  }
  return { ok: false, message: `Questi bit valgono ${got}, non ${value}. Riparti dalla moneta da 128.` };
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
