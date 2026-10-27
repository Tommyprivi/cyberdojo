import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo L12 (Cloud e DevOps: Costi e scelta del fornitore). Una chiave per lezione: "l12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const L12_ITEMS: Record<string, BankItem[]> = {};
