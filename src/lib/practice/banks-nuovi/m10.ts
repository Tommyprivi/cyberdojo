import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M10 (Mondo digitale per tutti: Truffe e inganni online). Una chiave per lezione: "m10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M10_ITEMS: Record<string, BankItem[]> = {};
