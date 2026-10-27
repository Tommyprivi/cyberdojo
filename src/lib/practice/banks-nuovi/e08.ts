import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E8 (Hacking etico e CTF: Programmare per le sfide). Una chiave per lezione: "e08-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E08_ITEMS: Record<string, BankItem[]> = {};
