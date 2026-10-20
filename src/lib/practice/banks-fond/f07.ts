import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F7 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const F07_ITEMS: Record<string, BankItem[]> = {};