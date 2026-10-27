import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B7 (Database e dati a grande scala: PostgreSQL in pratica). Una chiave per lezione: "b07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B07_ITEMS: Record<string, BankItem[]> = {};
