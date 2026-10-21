import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C28 (Cybersecurity). Una chiave per lezione: "c28-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C28_ITEMS: Record<string, BankItem[]> = {};