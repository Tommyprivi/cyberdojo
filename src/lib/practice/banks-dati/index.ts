import { makeBank, type BankItem } from "../banks";
import { D01_ITEMS } from "./d01";
import { D02_ITEMS } from "./d02";
import { D03_ITEMS } from "./d03";
import { D04_ITEMS } from "./d04";
import { D05_ITEMS } from "./d05";
import { D06_ITEMS } from "./d06";
import { D07_ITEMS } from "./d07";
import { D08_ITEMS } from "./d08";
import { D09_ITEMS } from "./d09";
import { D10_ITEMS } from "./d10";
import { D11_ITEMS } from "./d11";
import { D12_ITEMS } from "./d12";
import { D13_ITEMS } from "./d13";
import { D14_ITEMS } from "./d14";
import { D15_ITEMS } from "./d15";
import { D16_ITEMS } from "./d16";
import { D17_ITEMS } from "./d17";

/** Tutte le banche del corso Analista di dati, per identificatore (d01-..., d02-...). */
export const DATI_BANK_ITEMS: Record<string, BankItem[]> = {
  ...D01_ITEMS,
  ...D02_ITEMS,
  ...D03_ITEMS,
  ...D04_ITEMS,
  ...D05_ITEMS,
  ...D06_ITEMS,
  ...D07_ITEMS,
  ...D08_ITEMS,
  ...D09_ITEMS,
  ...D10_ITEMS,
  ...D11_ITEMS,
  ...D12_ITEMS,
  ...D13_ITEMS,
  ...D14_ITEMS,
  ...D15_ITEMS,
  ...D16_ITEMS,
  ...D17_ITEMS,
};

export const DATI_BANKS = Object.fromEntries(
  Object.entries(DATI_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
