import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D8 (Analista di dati). Una chiave per lezione: "d08-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D08_ITEMS: Record<string, BankItem[]> = {};