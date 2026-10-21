import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H22 (Hedge fund). Una chiave per lezione: "h22-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H22_ITEMS: Record<string, BankItem[]> = {};