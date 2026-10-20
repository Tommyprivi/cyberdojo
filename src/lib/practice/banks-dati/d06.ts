import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D6 (Analista di dati). Una chiave per lezione: "d06-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D06_ITEMS: Record<string, BankItem[]> = {};