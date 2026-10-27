import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A14 (App per telefono: Account e dati nel cloud). Una chiave per lezione: "a14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A14_ITEMS: Record<string, BankItem[]> = {};
