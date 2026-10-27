import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R18 (Reti e internet: Reti mobili e internet delle cose). Una chiave per lezione: "r18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R18_ITEMS: Record<string, BankItem[]> = {};
