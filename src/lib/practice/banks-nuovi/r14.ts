import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R14 (Reti e internet: Affidabilità e monitoraggio). Una chiave per lezione: "r14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R14_ITEMS: Record<string, BankItem[]> = {};
