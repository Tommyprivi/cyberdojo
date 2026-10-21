import { makeBank, type BankItem } from "../banks";
import { T01_ITEMS } from "./t01";
import { T02_ITEMS } from "./t02";
import { T03_ITEMS } from "./t03";
import { T04_ITEMS } from "./t04";
import { T05_ITEMS } from "./t05";
import { T06_ITEMS } from "./t06";
import { T07_ITEMS } from "./t07";
import { T08_ITEMS } from "./t08";
import { T09_ITEMS } from "./t09";
import { T10_ITEMS } from "./t10";
import { T11_ITEMS } from "./t11";
import { T12_ITEMS } from "./t12";
import { T13_ITEMS } from "./t13";
import { T14_ITEMS } from "./t14";
import { T15_ITEMS } from "./t15";
import { T16_ITEMS } from "./t16";
import { T17_ITEMS } from "./t17";
import { T18_ITEMS } from "./t18";

/** Tutte le banche del corso Trading algoritmico con Python. */
export const TRADING_BANK_ITEMS: Record<string, BankItem[]> = {
  ...T01_ITEMS,
  ...T02_ITEMS,
  ...T03_ITEMS,
  ...T04_ITEMS,
  ...T05_ITEMS,
  ...T06_ITEMS,
  ...T07_ITEMS,
  ...T08_ITEMS,
  ...T09_ITEMS,
  ...T10_ITEMS,
  ...T11_ITEMS,
  ...T12_ITEMS,
  ...T13_ITEMS,
  ...T14_ITEMS,
  ...T15_ITEMS,
  ...T16_ITEMS,
  ...T17_ITEMS,
  ...T18_ITEMS,
};

export const TRADING_BANKS = Object.fromEntries(
  Object.entries(TRADING_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
