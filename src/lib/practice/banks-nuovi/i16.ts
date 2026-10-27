import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I16 (Intelligenza artificiale: Costruire con i modelli di linguaggio). Una chiave per lezione: "i16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I16_ITEMS: Record<string, BankItem[]> = {};
