import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I19 (Intelligenza artificiale: Sicurezza, equità e IA responsabile). Una chiave per lezione: "i19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I19_ITEMS: Record<string, BankItem[]> = {};
