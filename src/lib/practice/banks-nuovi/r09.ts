import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R9 (Reti e internet: Routing). Una chiave per lezione: "r09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R09_ITEMS: Record<string, BankItem[]> = {};
