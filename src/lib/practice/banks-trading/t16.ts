import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T16 (Trading algoritmico con Python). Una chiave per lezione: "t16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const T16_ITEMS: Record<string, BankItem[]> = {};