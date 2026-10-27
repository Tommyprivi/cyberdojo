import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I14 (Intelligenza artificiale: Transformer e modelli di linguaggio). Una chiave per lezione: "i14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I14_ITEMS: Record<string, BankItem[]> = {};
