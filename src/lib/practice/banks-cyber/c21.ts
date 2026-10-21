import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C21 (Cybersecurity). Una chiave per lezione: "c21-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C21_ITEMS: Record<string, BankItem[]> = {};