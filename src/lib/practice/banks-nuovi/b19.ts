import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B19 (Database e dati a grande scala: Data lake, formati e streaming). Una chiave per lezione: "b19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B19_ITEMS: Record<string, BankItem[]> = {};
