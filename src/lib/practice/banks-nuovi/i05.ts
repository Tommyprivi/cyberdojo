import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo I5 (Intelligenza artificiale: Python e dati per l'IA). Una chiave per lezione: "i05-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const I05_ITEMS: Record<string, BankItem[]> = {};
