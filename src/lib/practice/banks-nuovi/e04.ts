import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E4 (Hacking etico e CTF: Strumenti e abitudini del mestiere). Una chiave per lezione: "e04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E04_ITEMS: Record<string, BankItem[]> = {};
