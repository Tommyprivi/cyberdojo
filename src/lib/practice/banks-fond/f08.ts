import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F8 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f08-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const F08_ITEMS: Record<string, BankItem[]> = {};