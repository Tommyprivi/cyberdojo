import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo E19 (Hacking etico e CTF: Un test di sicurezza completo). Una chiave per lezione: "e19-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const E19_ITEMS: Record<string, BankItem[]> = {};
