import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B20 (Database e dati a grande scala: Governance, costi e progetto finale). Una chiave per lezione: "b20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B20_ITEMS: Record<string, BankItem[]> = {};
