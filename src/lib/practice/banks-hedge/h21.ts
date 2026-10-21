import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H21 (Hedge fund). Una chiave per lezione: "h21-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H21_ITEMS: Record<string, BankItem[]> = {};