import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D4 (Analista di dati). Una chiave per lezione: "d04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D04_ITEMS: Record<string, BankItem[]> = {};