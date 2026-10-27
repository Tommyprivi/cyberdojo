import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I10 (Intelligenza artificiale: Come impara una rete). Una chiave per lezione: "i10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I10_ITEMS: Record<string, BankItem[]> = {};
