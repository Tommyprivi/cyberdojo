import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D15 (Analista di dati). Una chiave per lezione: "d15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D15_ITEMS: Record<string, BankItem[]> = {};