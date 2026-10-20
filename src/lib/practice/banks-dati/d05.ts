import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D5 (Analista di dati). Una chiave per lezione: "d05-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D05_ITEMS: Record<string, BankItem[]> = {};