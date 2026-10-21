import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H12 (Hedge fund). Una chiave per lezione: "h12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H12_ITEMS: Record<string, BankItem[]> = {};