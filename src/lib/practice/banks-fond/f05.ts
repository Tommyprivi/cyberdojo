import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F5 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f05-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const F05_ITEMS: Record<string, BankItem[]> = {};