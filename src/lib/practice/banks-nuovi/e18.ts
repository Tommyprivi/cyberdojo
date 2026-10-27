import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E18 (Hacking etico e CTF: Memoria e vulnerabilità dei programmi). Una chiave per lezione: "e18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E18_ITEMS: Record<string, BankItem[]> = {};
