import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I1 (Intelligenza artificiale: Che cos'è l'IA). Una chiave per lezione: "i01-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I01_ITEMS: Record<string, BankItem[]> = {};
