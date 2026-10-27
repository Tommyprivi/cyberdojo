import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A3 (App per telefono: App installabili dal web). Una chiave per lezione: "a03-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A03_ITEMS: Record<string, BankItem[]> = {};
