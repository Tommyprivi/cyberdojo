import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo L15 (Cloud e DevOps: Kubernetes). Una chiave per lezione: "l15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const L15_ITEMS: Record<string, BankItem[]> = {};
