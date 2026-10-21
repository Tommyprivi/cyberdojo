import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H14 (Hedge fund). Una chiave per lezione: "h14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H14_ITEMS: Record<string, BankItem[]> = {};