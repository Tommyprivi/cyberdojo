import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P16 (Programmazione generale: Ambiente di lavoro). Una chiave per lezione: "p16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P16_ITEMS: Record<string, BankItem[]> = {};
