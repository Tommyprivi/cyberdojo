import { describe, expect, it } from "vitest";
import { gradeChoices, isPassed, lessonsToMaster, MASTERY_XP, neededToPass, PASS_PCT } from "./scoring";

describe("punteggio della prova", () => {
  it("la soglia è l'80%", () => {
    expect(PASS_PCT).toBe(80);
    expect(neededToPass(8)).toBe(7);
    expect(neededToPass(10)).toBe(8);
    expect(neededToPass(5)).toBe(4);
  });
  it("supera solo con almeno l'80%", () => {
    expect(isPassed(7, 8)).toBe(true);
    expect(isPassed(6, 8)).toBe(false);
    expect(isPassed(8, 10)).toBe(true);
    expect(isPassed(79, 100)).toBe(false);
    expect(isPassed(0, 0)).toBe(false);
  });
  it("corregge le risposte; le mancanti o strane sono sbagliate", () => {
    const g = gradeChoices([1, 0, 2, 3], [1, "0", 2, 9, 5]);
    expect(g.results).toEqual([true, false, true, false]);
    expect(g.correct).toBe(2);
    expect(gradeChoices([0, 1], []).correct).toBe(0);
    expect(gradeChoices([0], [null]).results).toEqual([false]);
    expect(gradeChoices([0], [-0.5]).results).toEqual([false]);
  });
  it("padroneggiare non regala XP", () => {
    expect(MASTERY_XP).toBe(0);
  });
  it("segna padroneggiate solo le lezioni non già fatte né già padroneggiate", () => {
    const r = lessonsToMaster(["F.01.001", "F.01.002", "F.01.003"], new Set(["F.01.001"]), new Set(["F.01.002"]));
    expect(r).toEqual(["F.01.003"]);
  });
});
