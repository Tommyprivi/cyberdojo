import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R1 (Reti e internet: Che cos'è internet). Una chiave per lezione: "r01-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R01_ITEMS: Record<string, BankItem[]> = {};
