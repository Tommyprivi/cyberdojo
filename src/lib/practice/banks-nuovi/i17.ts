import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I17 (Intelligenza artificiale: Progetti di IA ben fatti). Una chiave per lezione: "i17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I17_ITEMS: Record<string, BankItem[]> = {};
