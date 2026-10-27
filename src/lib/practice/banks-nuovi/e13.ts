import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E13 (Hacking etico e CTF: Ricognizione e scansione). Una chiave per lezione: "e13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E13_ITEMS: Record<string, BankItem[]> = {};
