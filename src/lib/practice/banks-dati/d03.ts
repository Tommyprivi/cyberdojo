import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D3 (Analista di dati). Una chiave per lezione: "d03-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D03_ITEMS: Record<string, BankItem[]> = {};