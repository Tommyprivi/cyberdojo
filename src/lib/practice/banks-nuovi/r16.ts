import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R16 (Reti e internet: Automazione delle reti). Una chiave per lezione: "r16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R16_ITEMS: Record<string, BankItem[]> = {};
