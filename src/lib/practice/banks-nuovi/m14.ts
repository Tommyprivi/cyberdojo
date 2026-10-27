import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M14 (Mondo digitale per tutti: Regole, diritti e rispetto). Una chiave per lezione: "m14-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M14_ITEMS: Record<string, BankItem[]> = {};
