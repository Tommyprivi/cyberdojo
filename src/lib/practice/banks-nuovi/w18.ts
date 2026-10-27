import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo W18 (Sviluppo web: API REST e database). Una chiave per lezione: "w18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const W18_ITEMS: Record<string, BankItem[]> = {};
