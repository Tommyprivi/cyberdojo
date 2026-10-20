import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D9 (Analista di dati). Una chiave per lezione: "d09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D09_ITEMS: Record<string, BankItem[]> = {};