import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C24 (Cybersecurity). Una chiave per lezione: "c24-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C24_ITEMS: Record<string, BankItem[]> = {};