import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R13 (Reti e internet: Prestazioni e TCP a fondo). Una chiave per lezione: "r13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R13_ITEMS: Record<string, BankItem[]> = {};
