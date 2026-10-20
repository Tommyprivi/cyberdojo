import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D16 (Analista di dati). Una chiave per lezione: "d16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D16_ITEMS: Record<string, BankItem[]> = {};