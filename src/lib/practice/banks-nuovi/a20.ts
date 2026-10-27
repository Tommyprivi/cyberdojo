import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A20 (App per telefono: Progetto finale). Una chiave per lezione: "a20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A20_ITEMS: Record<string, BankItem[]> = {};
