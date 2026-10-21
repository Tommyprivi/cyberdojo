import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C15 (Cybersecurity). Una chiave per lezione: "c15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C15_ITEMS: Record<string, BankItem[]> = {};