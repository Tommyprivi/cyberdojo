import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R3 (Reti e internet: Il Wi-Fi). Una chiave per lezione: "r03-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R03_ITEMS: Record<string, BankItem[]> = {};
