import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I18 (Intelligenza artificiale: Portare un modello in produzione). Una chiave per lezione: "i18-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I18_ITEMS: Record<string, BankItem[]> = {};
