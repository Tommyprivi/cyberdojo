import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M18 (Mondo digitale per tutti: Un assaggio di programmazione). Una chiave per lezione: "m18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M18_ITEMS: Record<string, BankItem[]> = {};
