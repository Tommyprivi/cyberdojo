import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A7 (App per telefono: Navigazione). Una chiave per lezione: "a07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A07_ITEMS: Record<string, BankItem[]> = {};
