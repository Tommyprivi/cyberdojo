import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C12 (Cybersecurity). Una chiave per lezione: "c12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C12_ITEMS: Record<string, BankItem[]> = {};