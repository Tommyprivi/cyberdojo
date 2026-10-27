import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A16 (App per telefono: Sicurezza e privacy nelle app). Una chiave per lezione: "a16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A16_ITEMS: Record<string, BankItem[]> = {};
