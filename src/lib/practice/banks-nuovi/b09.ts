import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B9 (Database e dati a grande scala: Database a documenti). Una chiave per lezione: "b09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B09_ITEMS: Record<string, BankItem[]> = {};
