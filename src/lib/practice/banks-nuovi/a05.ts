import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A5 (App per telefono: I componenti base). Una chiave per lezione: "a05-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A05_ITEMS: Record<string, BankItem[]> = {};
