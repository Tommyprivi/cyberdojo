import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D14 (Analista di dati). Una chiave per lezione: "d14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D14_ITEMS: Record<string, BankItem[]> = {};