import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R20 (Reti e internet: Progetto finale e mestiere). Una chiave per lezione: "r20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R20_ITEMS: Record<string, BankItem[]> = {};
