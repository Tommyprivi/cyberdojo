import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo A10 (App per telefono: Salvare i dati sul telefono). Una chiave per lezione: "a10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const A10_ITEMS: Record<string, BankItem[]> = {};
