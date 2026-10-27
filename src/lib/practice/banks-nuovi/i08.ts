import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I8 (Intelligenza artificiale: Altri modelli di apprendimento). Una chiave per lezione: "i08-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I08_ITEMS: Record<string, BankItem[]> = {};
