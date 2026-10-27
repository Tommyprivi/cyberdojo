import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A18 (App per telefono: Altre strade: nativo e Flutter). Una chiave per lezione: "a18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A18_ITEMS: Record<string, BankItem[]> = {};
