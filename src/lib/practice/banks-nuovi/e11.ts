import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E11 (Hacking etico e CTF: Vulnerabilità web: accessi e logica). Una chiave per lezione: "e11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E11_ITEMS: Record<string, BankItem[]> = {};
