import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M15 (Mondo digitale per tutti: Benessere digitale). Una chiave per lezione: "m15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M15_ITEMS: Record<string, BankItem[]> = {};
