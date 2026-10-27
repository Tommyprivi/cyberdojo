import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A8 (App per telefono: Input e moduli). Una chiave per lezione: "a08-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A08_ITEMS: Record<string, BankItem[]> = {};
