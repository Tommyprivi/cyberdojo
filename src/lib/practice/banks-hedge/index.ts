import { makeBank, type BankItem } from "../banks";
import { H01_ITEMS } from "./h01";
import { H02_ITEMS } from "./h02";
import { H03_ITEMS } from "./h03";
import { H04_ITEMS } from "./h04";
import { H05_ITEMS } from "./h05";
import { H06_ITEMS } from "./h06";
import { H07_ITEMS } from "./h07";
import { H08_ITEMS } from "./h08";
import { H09_ITEMS } from "./h09";
import { H10_ITEMS } from "./h10";
import { H11_ITEMS } from "./h11";
import { H12_ITEMS } from "./h12";
import { H13_ITEMS } from "./h13";
import { H14_ITEMS } from "./h14";
import { H15_ITEMS } from "./h15";
import { H16_ITEMS } from "./h16";
import { H17_ITEMS } from "./h17";
import { H18_ITEMS } from "./h18";
import { H19_ITEMS } from "./h19";
import { H20_ITEMS } from "./h20";
import { H21_ITEMS } from "./h21";
import { H22_ITEMS } from "./h22";
import { H23_ITEMS } from "./h23";
import { H24_ITEMS } from "./h24";

/** Tutte le banche del corso Hedge fund. */
export const HEDGE_BANK_ITEMS: Record<string, BankItem[]> = {
  ...H01_ITEMS,
  ...H02_ITEMS,
  ...H03_ITEMS,
  ...H04_ITEMS,
  ...H05_ITEMS,
  ...H06_ITEMS,
  ...H07_ITEMS,
  ...H08_ITEMS,
  ...H09_ITEMS,
  ...H10_ITEMS,
  ...H11_ITEMS,
  ...H12_ITEMS,
  ...H13_ITEMS,
  ...H14_ITEMS,
  ...H15_ITEMS,
  ...H16_ITEMS,
  ...H17_ITEMS,
  ...H18_ITEMS,
  ...H19_ITEMS,
  ...H20_ITEMS,
  ...H21_ITEMS,
  ...H22_ITEMS,
  ...H23_ITEMS,
  ...H24_ITEMS,
};

export const HEDGE_BANKS = Object.fromEntries(
  Object.entries(HEDGE_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
