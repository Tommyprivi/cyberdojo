import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo W10 (Sviluppo web: Form e dati nel browser). Una chiave per lezione: "w10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const W10_ITEMS: Record<string, BankItem[]> = {};
