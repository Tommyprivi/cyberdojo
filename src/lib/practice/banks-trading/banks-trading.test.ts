import { describe, expect, it } from "vitest";
import { TRADING_BANK_ITEMS, TRADING_BANKS } from "./index";


import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";
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

const MODULES = { T01_ITEMS, T02_ITEMS, T03_ITEMS, T04_ITEMS, T05_ITEMS, T06_ITEMS, T07_ITEMS, T08_ITEMS, T09_ITEMS, T10_ITEMS, T11_ITEMS, T12_ITEMS, T13_ITEMS, T14_ITEMS };

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche del corso Trading algoritmico con Python", () => {
  for (const [id, items] of Object.entries(TRADING_BANK_ITEMS)) {
    describe(id, () => {
      it("l'identificatore segue il formato tNN-argomento", () => {
        expect(id).toMatch(/^t(0[1-9]|1[0-8])-[a-z0-9-]+$/);
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
          const qs = TRADING_BANKS[id](`seme-${s}`, 5);
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

