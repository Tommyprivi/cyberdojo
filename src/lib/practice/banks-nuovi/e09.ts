import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E9 (Hacking etico e CTF: Il web con gli occhi di un tester). Una chiave per lezione: "e09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E09_ITEMS: Record<string, BankItem[]> = {};
