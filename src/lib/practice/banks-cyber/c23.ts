import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C23 (Cybersecurity). Una chiave per lezione: "c23-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C23_ITEMS: Record<string, BankItem[]> = {};