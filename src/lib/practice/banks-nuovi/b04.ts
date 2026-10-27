import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B4 (Database e dati a grande scala: Usare il database da un programma). Una chiave per lezione: "b04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B04_ITEMS: Record<string, BankItem[]> = {};
