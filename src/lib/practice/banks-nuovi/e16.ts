import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E16 (Hacking etico e CTF: Traffico di rete e attacchi locali). Una chiave per lezione: "e16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E16_ITEMS: Record<string, BankItem[]> = {};
