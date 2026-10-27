import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P12 (Programmazione generale: Grafi). Una chiave per lezione: "p12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P12_ITEMS: Record<string, BankItem[]> = {};
