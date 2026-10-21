import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H18 (Hedge fund). Una chiave per lezione: "h18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H18_ITEMS: Record<string, BankItem[]> = {};