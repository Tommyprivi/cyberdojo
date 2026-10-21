import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H13 (Hedge fund). Una chiave per lezione: "h13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H13_ITEMS: Record<string, BankItem[]> = {};