import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A12 (App per telefono: Sensori e funzioni del dispositivo). Una chiave per lezione: "a12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A12_ITEMS: Record<string, BankItem[]> = {};
