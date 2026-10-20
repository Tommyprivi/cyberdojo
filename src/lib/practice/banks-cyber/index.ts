import { makeBank, type BankItem } from "../banks";
import { C01_ITEMS } from "./c01";
import { C02_ITEMS } from "./c02";
import { C03_ITEMS } from "./c03";
import { C04_ITEMS } from "./c04";
import { C05_ITEMS } from "./c05";
import { C06_ITEMS } from "./c06";
import { C07_ITEMS } from "./c07";
import { C08_ITEMS } from "./c08";
import { C09_ITEMS } from "./c09";
import { C10_ITEMS } from "./c10";
import { C11_ITEMS } from "./c11";

/** Tutte le banche del corso Cybersecurity, per identificatore (c01-..., c02-...). */
export const CYBER_BANK_ITEMS: Record<string, BankItem[]> = {
  ...C01_ITEMS,
  ...C02_ITEMS,
  ...C03_ITEMS,
  ...C04_ITEMS,
  ...C05_ITEMS,
  ...C06_ITEMS,
  ...C07_ITEMS,
  ...C08_ITEMS,
  ...C09_ITEMS,
  ...C10_ITEMS,
  ...C11_ITEMS,
};

export const CYBER_BANKS = Object.fromEntries(
  Object.entries(CYBER_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
