import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C27 (Cybersecurity). Una chiave per lezione: "c27-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C27_ITEMS: Record<string, BankItem[]> = {};