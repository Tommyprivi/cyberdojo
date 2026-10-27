import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo L20 (Cloud e DevOps: Progetto finale e carriera). Una chiave per lezione: "l20-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const L20_ITEMS: Record<string, BankItem[]> = {};
