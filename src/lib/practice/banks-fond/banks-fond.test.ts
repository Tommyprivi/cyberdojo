import { describe, expect, it } from "vitest";
import { FOND_BANK_ITEMS, FOND_BANKS } from "./index";
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


const MODULES = { F01_ITEMS, F02_ITEMS, F03_ITEMS, F04_ITEMS, F05_ITEMS, F06_ITEMS, F07_ITEMS, F08_ITEMS, F09_ITEMS, F10_ITEMS };
import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche del corso Fondamenta", () => {
  for (const [id, items] of Object.entries(FOND_BANK_ITEMS)) {
    describe(id, () => {
      it("l'identificatore segue il formato fNN-argomento", () => {
        expect(id).toMatch(/^f(0[1-9]|10)-[a-z0-9-]+$/);
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
          const qs = FOND_BANKS[id](`seme-${s}`, 5);
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

