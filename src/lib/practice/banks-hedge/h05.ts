import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H5 (Hedge fund). Una chiave per lezione: "h05-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H05_ITEMS: Record<string, BankItem[]> = {};