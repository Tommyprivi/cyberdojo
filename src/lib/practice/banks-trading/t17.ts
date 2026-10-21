import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T17 (Trading algoritmico con Python). Una chiave per lezione: "t17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const T17_ITEMS: Record<string, BankItem[]> = {};