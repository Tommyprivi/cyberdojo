import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P10 (Programmazione generale: Hash, dizionari e insiemi). Una chiave per lezione: "p10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P10_ITEMS: Record<string, BankItem[]> = {};
