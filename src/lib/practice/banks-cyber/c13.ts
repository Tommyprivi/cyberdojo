import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C13 (Cybersecurity). Una chiave per lezione: "c13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C13_ITEMS: Record<string, BankItem[]> = {};