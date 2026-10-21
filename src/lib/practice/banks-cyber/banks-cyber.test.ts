import { describe, expect, it } from "vitest";
import { CYBER_BANK_ITEMS, CYBER_BANKS } from "./index";
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

const MODULES = { C01_ITEMS, C02_ITEMS, C03_ITEMS, C04_ITEMS, C05_ITEMS, C06_ITEMS, C07_ITEMS, C08_ITEMS, C09_ITEMS, C10_ITEMS, C11_ITEMS };
import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche del corso Cybersecurity", () => {
  for (const [id, items] of Object.entries(CYBER_BANK_ITEMS)) {
    describe(id, () => {
      it("l'identificatore segue il formato cNN-argomento", () => {
        expect(id).toMatch(/^c(0[1-9]|[12][0-9]|30)-[a-z0-9-]+$/);
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
          const qs = CYBER_BANKS[id](`seme-${s}`, 5);
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

