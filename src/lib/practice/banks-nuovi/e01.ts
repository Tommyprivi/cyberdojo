import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E1 (Hacking etico e CTF: Etica e legge). Una chiave per lezione: "e01-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E01_ITEMS: Record<string, BankItem[]> = {};
