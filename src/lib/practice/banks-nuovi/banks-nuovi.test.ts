import { describe, expect, it } from "vitest";
import { GENERATORS, isGeneratorId } from "../generators";
import type { Question } from "../core";
import { NUOVI_BANK_ITEMS, NUOVI_BANKS } from "./index";

const registry = GENERATORS as unknown as Record<string, { generate: (seed: string, count?: number) => Question[] }>;

describe("banche dei 10 nuovi corsi", () => {
  it("l'identificatore segue il formato <lettera><modulo 01-20>-argomento", () => {
    for (const id of Object.keys(NUOVI_BANK_ITEMS)) expect(id).toMatch(/^[wpaiblrexm](0[1-9]|1[0-9]|20)-[a-z0-9-]+$/);
  });

  for (const [id, items] of Object.entries(NUOVI_BANK_ITEMS)) {
    describe(id, () => {
      it("ha almeno 12 domande, tutte diverse", () => {
        expect(items.length).toBeGreaterThanOrEqual(12);
        expect(new Set(items.map((i) => i.q)).size).toBe(items.length);
      });
      it("ogni domanda ha una sola risposta giusta e opzioni distinte, non vuote e senza «tutte le precedenti»", () => {
        for (const it of items) {
          const options = [it.ok, ...it.no];
          expect(new Set(options).size, it.q).toBe(options.length);
          expect(it.no.length, it.q).toBeGreaterThanOrEqual(2);
          expect(it.no.length, it.q).toBeLessThanOrEqual(3);
          for (const o of options) {
            expect(o.trim().length, it.q).toBeGreaterThan(0);
            expect(o.toLowerCase(), it.q).not.toMatch(/(tutte|nessuna) (le|delle) precedenti/);
          }
          expect(it.q.length, it.q).toBeGreaterThan(15);
        }
      });
      it("genera 5 domande con la risposta giusta al posto indicato e viene riconosciuta dal sito", () => {
        expect(isGeneratorId(id)).toBe(true);
        for (let s = 0; s < 30; s++) {
          const qs = NUOVI_BANKS[id](`seme-${s}`, 5);
          expect(qs).toHaveLength(5);
          expect(registry[id].generate(`seme-${s}`, 5)).toEqual(qs);
          for (const q of qs) expect(q.choices![q.answer]).toBe(items.find((i) => i.q === q.prompt)!.ok);
        }
      });
    });
  }
});
