import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E2 (Hacking etico e CTF: Il laboratorio sicuro). Una chiave per lezione: "e02-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E02_ITEMS: Record<string, BankItem[]> = {};
