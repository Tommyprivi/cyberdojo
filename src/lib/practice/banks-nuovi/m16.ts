import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M16 (Mondo digitale per tutti: Servizi pubblici digitali). Una chiave per lezione: "m16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M16_ITEMS: Record<string, BankItem[]> = {};
