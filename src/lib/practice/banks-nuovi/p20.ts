import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo P20 (Programmazione generale: Progetto finale e mestiere). Una chiave per lezione: "p20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const P20_ITEMS: Record<string, BankItem[]> = {};
