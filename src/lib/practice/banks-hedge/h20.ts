import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H20 (Hedge fund). Una chiave per lezione: "h20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H20_ITEMS: Record<string, BankItem[]> = {};