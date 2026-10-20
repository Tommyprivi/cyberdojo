import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D10 (Analista di dati). Una chiave per lezione: "d10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D10_ITEMS: Record<string, BankItem[]> = {};