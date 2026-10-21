import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H19 (Hedge fund). Una chiave per lezione: "h19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H19_ITEMS: Record<string, BankItem[]> = {};