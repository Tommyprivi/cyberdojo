import { makeBank, type BankItem } from "../banks";
import { F01_ITEMS } from "./f01";
import { F02_ITEMS } from "./f02";
import { F03_ITEMS } from "./f03";
import { F04_ITEMS } from "./f04";
import { F05_ITEMS } from "./f05";
import { F06_ITEMS } from "./f06";
import { F07_ITEMS } from "./f07";
import { F08_ITEMS } from "./f08";
import { F09_ITEMS } from "./f09";
import { F10_ITEMS } from "./f10";

/** Tutte le banche del corso Fondamenta scritte dopo il modulo F5, per identificatore (f01-..., f02-...). */
export const FOND_BANK_ITEMS: Record<string, BankItem[]> = {
  ...F01_ITEMS,
  ...F02_ITEMS,
  ...F03_ITEMS,
  ...F04_ITEMS,
  ...F05_ITEMS,
  ...F06_ITEMS,
  ...F07_ITEMS,
  ...F08_ITEMS,
  ...F09_ITEMS,
  ...F10_ITEMS,
};

export const FOND_BANKS = Object.fromEntries(
  Object.entries(FOND_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);