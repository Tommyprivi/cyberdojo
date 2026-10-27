import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P15 (Programmazione generale: Test e qualità del codice). Una chiave per lezione: "p15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P15_ITEMS: Record<string, BankItem[]> = {};
