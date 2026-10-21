import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C26 (Cybersecurity). Una chiave per lezione: "c26-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C26_ITEMS: Record<string, BankItem[]> = {};