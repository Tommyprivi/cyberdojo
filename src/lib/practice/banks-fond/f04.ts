import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F4 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const F04_ITEMS: Record<string, BankItem[]> = {};