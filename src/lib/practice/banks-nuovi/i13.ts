import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I13 (Intelligenza artificiale: Il linguaggio per le macchine). Una chiave per lezione: "i13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I13_ITEMS: Record<string, BankItem[]> = {};
