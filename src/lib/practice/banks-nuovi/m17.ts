import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M17 (Mondo digitale per tutti: Intelligenza artificiale per tutti). Una chiave per lezione: "m17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M17_ITEMS: Record<string, BankItem[]> = {};
