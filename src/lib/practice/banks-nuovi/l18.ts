import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo L18 (Cloud e DevOps: Affidabilità e incidenti). Una chiave per lezione: "l18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const L18_ITEMS: Record<string, BankItem[]> = {};
