import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R12 (Reti e internet: Collegamenti geografici). Una chiave per lezione: "r12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R12_ITEMS: Record<string, BankItem[]> = {};
