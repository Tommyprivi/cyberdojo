import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C30 (Cybersecurity). Una chiave per lezione: "c30-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C30_ITEMS: Record<string, BankItem[]> = {};