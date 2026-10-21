import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H23 (Hedge fund). Una chiave per lezione: "h23-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H23_ITEMS: Record<string, BankItem[]> = {};