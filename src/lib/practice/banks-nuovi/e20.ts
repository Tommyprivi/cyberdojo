import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E20 (Hacking etico e CTF: CTF in squadra, bug bounty e carriera). Una chiave per lezione: "e20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E20_ITEMS: Record<string, BankItem[]> = {};
