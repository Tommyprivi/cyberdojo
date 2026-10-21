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
import { C12_ITEMS } from "./c12";
import { C13_ITEMS } from "./c13";
import { C14_ITEMS } from "./c14";
import { C15_ITEMS } from "./c15";
import { C16_ITEMS } from "./c16";
import { C17_ITEMS } from "./c17";
import { C18_ITEMS } from "./c18";
import { C19_ITEMS } from "./c19";
import { C20_ITEMS } from "./c20";
import { C21_ITEMS } from "./c21";
import { C22_ITEMS } from "./c22";
import { C23_ITEMS } from "./c23";
import { C24_ITEMS } from "./c24";
import { C25_ITEMS } from "./c25";
import { C26_ITEMS } from "./c26";
import { C27_ITEMS } from "./c27";
import { C28_ITEMS } from "./c28";
import { C29_ITEMS } from "./c29";
import { C30_ITEMS } from "./c30";

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
  ...C12_ITEMS,
  ...C13_ITEMS,
  ...C14_ITEMS,
  ...C15_ITEMS,
  ...C16_ITEMS,
  ...C17_ITEMS,
  ...C18_ITEMS,
  ...C19_ITEMS,
  ...C20_ITEMS,
  ...C21_ITEMS,
  ...C22_ITEMS,
  ...C23_ITEMS,
  ...C24_ITEMS,
  ...C25_ITEMS,
  ...C26_ITEMS,
  ...C27_ITEMS,
  ...C28_ITEMS,
  ...C29_ITEMS,
  ...C30_ITEMS,
};

export const CYBER_BANKS = Object.fromEntries(
  Object.entries(CYBER_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
