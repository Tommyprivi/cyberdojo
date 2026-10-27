import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E3 (Hacking etico e CTF: Che cos'è una CTF). Una chiave per lezione: "e03-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E03_ITEMS: Record<string, BankItem[]> = {};
