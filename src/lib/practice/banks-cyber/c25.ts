import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C25 (Cybersecurity). Una chiave per lezione: "c25-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C25_ITEMS: Record<string, BankItem[]> = {};