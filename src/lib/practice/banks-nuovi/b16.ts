import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B16 (Database e dati a grande scala: Messaggi, code e flussi). Una chiave per lezione: "b16-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B16_ITEMS: Record<string, BankItem[]> = {};
