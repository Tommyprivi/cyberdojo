import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C18 (Cybersecurity). Una chiave per lezione: "c18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C18_ITEMS: Record<string, BankItem[]> = {};