import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I15 (Intelligenza artificiale: Immagini, audio e video generativi). Una chiave per lezione: "i15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I15_ITEMS: Record<string, BankItem[]> = {};
