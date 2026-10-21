import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C19 (Cybersecurity). Una chiave per lezione: "c19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const C19_ITEMS: Record<string, BankItem[]> = {};