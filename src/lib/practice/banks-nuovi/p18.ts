import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P18 (Programmazione generale: Paradigmi e linguaggi). Una chiave per lezione: "p18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P18_ITEMS: Record<string, BankItem[]> = {};
