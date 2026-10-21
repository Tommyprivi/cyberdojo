import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H16 (Hedge fund). Una chiave per lezione: "h16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const H16_ITEMS: Record<string, BankItem[]> = {};