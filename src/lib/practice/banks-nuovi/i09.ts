import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I9 (Intelligenza artificiale: Dal neurone alla rete). Una chiave per lezione: "i09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I09_ITEMS: Record<string, BankItem[]> = {};
