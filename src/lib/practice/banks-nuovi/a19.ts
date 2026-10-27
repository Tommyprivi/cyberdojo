import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A19 (App per telefono: Dopo la pubblicazione). Una chiave per lezione: "a19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A19_ITEMS: Record<string, BankItem[]> = {};
