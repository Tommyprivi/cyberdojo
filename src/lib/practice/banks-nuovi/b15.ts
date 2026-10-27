import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B15 (Database e dati a grande scala: Sistemi distribuiti). Una chiave per lezione: "b15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B15_ITEMS: Record<string, BankItem[]> = {};
