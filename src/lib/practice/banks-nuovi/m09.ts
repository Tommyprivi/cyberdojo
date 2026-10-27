import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M9 (Mondo digitale per tutti: Password e accessi). Una chiave per lezione: "m09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M09_ITEMS: Record<string, BankItem[]> = {};
