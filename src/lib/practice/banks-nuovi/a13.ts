import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A13 (App per telefono: Struttura di un'app che cresce). Una chiave per lezione: "a13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A13_ITEMS: Record<string, BankItem[]> = {};
