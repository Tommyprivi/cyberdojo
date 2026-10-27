import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo M12 (Mondo digitale per tutti: Dispositivi al sicuro). Una chiave per lezione: "m12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const M12_ITEMS: Record<string, BankItem[]> = {};
