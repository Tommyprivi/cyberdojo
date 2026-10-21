import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T15 (Trading algoritmico con Python). Una chiave per lezione: "t15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const T15_ITEMS: Record<string, BankItem[]> = {};