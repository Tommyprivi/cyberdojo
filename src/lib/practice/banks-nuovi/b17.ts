import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B17 (Database e dati a grande scala: Data warehouse e OLAP). Una chiave per lezione: "b17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B17_ITEMS: Record<string, BankItem[]> = {};
