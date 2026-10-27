import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A17 (App per telefono: Dalla prova al negozio). Una chiave per lezione: "a17-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A17_ITEMS: Record<string, BankItem[]> = {};
