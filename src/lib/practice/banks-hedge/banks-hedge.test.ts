import { describe, expect, it } from "vitest";
import { HEDGE_BANK_ITEMS, HEDGE_BANKS } from "./index";


import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";
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

const MODULES = { H01_ITEMS, H02_ITEMS, H03_ITEMS, H04_ITEMS, H05_ITEMS, H06_ITEMS, H07_ITEMS, H08_ITEMS, H09_ITEMS, H10_ITEMS, H11_ITEMS, H12_ITEMS };

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche del corso Hedge fund", () => {
  for (const [id, items] of Object.entries(HEDGE_BANK_ITEMS)) {
    describe(id, () => {
      it("l'identificatore segue il formato hNN-argomento", () => {
        expect(id).toMatch(/^h(0[1-9]|1[0-9]|2[0-4])-[a-z0-9-]+$/);
      });
      it("ha almeno 10 domande, tutte diverse", () => {
        expect(items.length).toBeGreaterThanOrEqual(10);
        expect(new Set(items.map((i) => i.q)).size).toBe(items.length);
      });
      it("ogni domanda ha una sola risposta giusta e opzioni distinte e non vuote", () => {
        for (const it of items) {
          const options = [it.ok, ...it.no];
          expect(new Set(options).size, it.q).toBe(options.length);
          for (const o of options) expect(o.trim().length, it.q).toBeGreaterThan(0);
          expect(it.q.length, it.q).toBeGreaterThan(15);
        }
      });
      it("genera 5 domande con la risposta giusta al posto indicato e viene riconosciuta", () => {
        expect(isGeneratorId(id)).toBe(true);
        for (let s = 0; s < 30; s++) {
          const qs = HEDGE_BANKS[id](`seme-${s}`, 5);
          expect(qs).toHaveLength(5);
          expect(registry[id].generate(`seme-${s}`, 5)).toEqual(qs);
          for (const q of qs) expect(q.choices![q.answer]).toBe(items.find((i) => i.q === q.prompt)!.ok);
        }
      });
    });
  }
  it("nessun identificatore è dichiarato in due moduli", () => {
    const all = Object.values(MODULES).flatMap((m) => Object.keys(m));
    expect(new Set(all).size).toBe(all.length);
  });
});

