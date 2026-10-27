import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R4 (Reti e internet: I servizi che usi ogni giorno). Una chiave per lezione: "r04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R04_ITEMS: Record<string, BankItem[]> = {};
