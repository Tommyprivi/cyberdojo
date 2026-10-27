import type { BankItem } from "./banks";
import { CYBER_BANK_ITEMS } from "./banks-cyber";
import { DATI_BANK_ITEMS } from "./banks-dati";
import { FOND_BANK_ITEMS } from "./banks-fond";
import { HEDGE_BANK_ITEMS } from "./banks-hedge";
import { NUOVI_BANK_ITEMS } from "./banks-nuovi";
import { TRADING_BANK_ITEMS } from "./banks-trading";

/** Tutte le banche di domande dei corsi (Cybersecurity e Fondamenta oltre F5), per identificatore. */
export const ALL_BANK_ITEMS: Record<string, BankItem[]> = { ...FOND_BANK_ITEMS, ...CYBER_BANK_ITEMS, ...DATI_BANK_ITEMS, ...TRADING_BANK_ITEMS, ...HEDGE_BANK_ITEMS, ...NUOVI_BANK_ITEMS };