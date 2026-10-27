import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo B18 (Database e dati a grande scala: Elaborazione distribuita). Una chiave per lezione: "b18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const B18_ITEMS: Record<string, BankItem[]> = {};
