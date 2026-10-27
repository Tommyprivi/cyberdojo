import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B12 (Database e dati a grande scala: Grafi, ricerca e vettori). Una chiave per lezione: "b12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B12_ITEMS: Record<string, BankItem[]> = {};
