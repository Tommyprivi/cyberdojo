import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E14 (Hacking etico e CTF: Privilegi su Linux). Una chiave per lezione: "e14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E14_ITEMS: Record<string, BankItem[]> = {};
