import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I11 (Intelligenza artificiale: Immagini e reti convoluzionali). Una chiave per lezione: "i11-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I11_ITEMS: Record<string, BankItem[]> = {};
