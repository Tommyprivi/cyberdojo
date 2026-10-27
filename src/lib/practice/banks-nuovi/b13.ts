import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B13 (Database e dati a grande scala: Replicazione e alta disponibilità). Una chiave per lezione: "b13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B13_ITEMS: Record<string, BankItem[]> = {};
