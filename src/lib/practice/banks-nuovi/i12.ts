import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I12 (Intelligenza artificiale: Sequenze e attenzione). Una chiave per lezione: "i12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I12_ITEMS: Record<string, BankItem[]> = {};
