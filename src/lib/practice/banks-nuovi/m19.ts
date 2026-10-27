import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M19 (Mondo digitale per tutti: Lavoro e competenze digitali). Una chiave per lezione: "m19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M19_ITEMS: Record<string, BankItem[]> = {};
