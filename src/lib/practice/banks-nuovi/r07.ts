import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R7 (Reti e internet: Strumenti di diagnosi). Una chiave per lezione: "r07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R07_ITEMS: Record<string, BankItem[]> = {};
