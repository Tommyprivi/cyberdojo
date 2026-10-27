import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I2 (Intelligenza artificiale: Usare bene gli assistenti di IA). Una chiave per lezione: "i02-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I02_ITEMS: Record<string, BankItem[]> = {};
