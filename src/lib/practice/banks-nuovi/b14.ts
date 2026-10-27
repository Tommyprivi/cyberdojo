import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B14 (Database e dati a grande scala: Partizionamento e sharding). Una chiave per lezione: "b14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B14_ITEMS: Record<string, BankItem[]> = {};
