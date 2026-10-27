import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I7 (Intelligenza artificiale: Valutare i modelli). Una chiave per lezione: "i07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I07_ITEMS: Record<string, BankItem[]> = {};
