import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E17 (Hacking etico e CTF: Reverse engineering: le basi). Una chiave per lezione: "e17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E17_ITEMS: Record<string, BankItem[]> = {};
