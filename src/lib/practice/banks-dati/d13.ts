import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D13 (Analista di dati). Una chiave per lezione: "d13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D13_ITEMS: Record<string, BankItem[]> = {};