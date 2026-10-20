import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D12 (Analista di dati). Una chiave per lezione: "d12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D12_ITEMS: Record<string, BankItem[]> = {};