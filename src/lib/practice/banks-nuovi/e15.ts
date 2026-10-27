import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E15 (Hacking etico e CTF: Password, hash e accessi). Una chiave per lezione: "e15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E15_ITEMS: Record<string, BankItem[]> = {};
