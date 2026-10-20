import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D11 (Analista di dati). Una chiave per lezione: "d11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D11_ITEMS: Record<string, BankItem[]> = {};