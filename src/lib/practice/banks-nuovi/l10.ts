import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo L10 (Cloud e DevOps: Calcolo, archiviazione e serverless). Una chiave per lezione: "l10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const L10_ITEMS: Record<string, BankItem[]> = {};
