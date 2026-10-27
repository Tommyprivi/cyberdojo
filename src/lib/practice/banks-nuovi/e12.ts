import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E12 (Hacking etico e CTF: Sfide web e write-up). Una chiave per lezione: "e12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E12_ITEMS: Record<string, BankItem[]> = {};
