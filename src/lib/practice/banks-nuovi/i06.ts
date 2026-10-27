import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I6 (Intelligenza artificiale: Regressione e classificazione). Una chiave per lezione: "i06-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I06_ITEMS: Record<string, BankItem[]> = {};
