import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M1 (Mondo digitale per tutti: Computer e telefono). Una chiave per lezione: "m01-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M01_ITEMS: Record<string, BankItem[]> = {};
