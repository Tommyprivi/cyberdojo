import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A9 (App per telefono: Stato e dati). Una chiave per lezione: "a09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A09_ITEMS: Record<string, BankItem[]> = {};
