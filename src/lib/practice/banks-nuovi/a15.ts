import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A15 (App per telefono: Qualità: prestazioni, test, accessibilità). Una chiave per lezione: "a15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A15_ITEMS: Record<string, BankItem[]> = {};
