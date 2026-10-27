import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M20 (Mondo digitale per tutti: Progetto: la mia vita digitale in ordine). Una chiave per lezione: "m20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M20_ITEMS: Record<string, BankItem[]> = {};
