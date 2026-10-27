import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E10 (Hacking etico e CTF: Vulnerabilità web: iniezione e script). Una chiave per lezione: "e10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E10_ITEMS: Record<string, BankItem[]> = {};
