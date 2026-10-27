import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I20 (Intelligenza artificiale: Progetto finale e carriera). Una chiave per lezione: "i20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I20_ITEMS: Record<string, BankItem[]> = {};
