import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M11 (Mondo digitale per tutti: Privacy e dati personali). Una chiave per lezione: "m11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M11_ITEMS: Record<string, BankItem[]> = {};
