import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B11 (Database e dati a grande scala: Serie temporali e colonne larghe). Una chiave per lezione: "b11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B11_ITEMS: Record<string, BankItem[]> = {};
