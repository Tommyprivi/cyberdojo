import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo R15 (Reti e internet: Sicurezza della rete per chi la progetta). Una chiave per lezione: "r15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const R15_ITEMS: Record<string, BankItem[]> = {};
