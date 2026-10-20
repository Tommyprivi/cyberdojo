import { describe, expect, it } from "vitest";
import { DATI_BANK_ITEMS, DATI_BANKS } from "./index";
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

const MODULES = { D01_ITEMS, D02_ITEMS, D03_ITEMS, D04_ITEMS, D05_ITEMS, D06_ITEMS, D07_ITEMS, D08_ITEMS, D09_ITEMS, D10_ITEMS, D11_ITEMS, D12_ITEMS, D13_ITEMS, D14_ITEMS, D15_ITEMS, D16_ITEMS, D17_ITEMS };
import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche del corso Analista di dati", () => {
  for (const [id, items] of Object.entries(DATI_BANK_ITEMS)) {
    describe(id, () => {
      it("l'identificatore segue il formato dNN-argomento", () => {
        expect(id).toMatch(/^d(0[1-9]|1[0-7])-[a-z0-9-]+$/);
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
          const qs = DATI_BANKS[id](`seme-${s}`, 5);
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

