import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B10 (Database e dati a grande scala: Chiave-valore e cache). Una chiave per lezione: "b10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B10_ITEMS: Record<string, BankItem[]> = {};
