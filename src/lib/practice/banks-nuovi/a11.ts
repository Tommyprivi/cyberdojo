import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A11 (App per telefono: Dati dal web e dal server). Una chiave per lezione: "a11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A11_ITEMS: Record<string, BankItem[]> = {};
