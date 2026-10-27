import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M13 (Mondo digitale per tutti: Informazione e notizie false). Una chiave per lezione: "m13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M13_ITEMS: Record<string, BankItem[]> = {};
