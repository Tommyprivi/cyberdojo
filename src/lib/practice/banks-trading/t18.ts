import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T18 (Trading algoritmico con Python). Una chiave per lezione: "t18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const T18_ITEMS: Record<string, BankItem[]> = {};