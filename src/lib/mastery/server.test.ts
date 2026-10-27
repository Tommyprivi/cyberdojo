import { describe, expect, it } from "vitest";
import { COURSES } from "@/lib/content/courses";
import { pickQuestions } from "./pool";
import { attemptSeed, courseByLetter, masteryAvailable, MASTERY_QUESTIONS, modulesWithLessons, placementSet, poolForModule } from "./server";

describe("domande vere dei corsi", () => {
  it("Cybersecurity modulo 1 ha una prova da circa 8 domande", () => {
    const c = courseByLetter("C")!;
    expect(masteryAvailable(c, 1)).toBe(true);
    const q = pickQuestions(poolForModule("C", 1), "prova", MASTERY_QUESTIONS);
    expect(q).toHaveLength(MASTERY_QUESTIONS);
    for (const x of q) {
      expect(x.choices.length).toBeGreaterThanOrEqual(2);
      expect(x.answer).toBeGreaterThanOrEqual(0);
    }
  });
  it("gli id delle domande di un modulo sono tutti diversi", () => {
    const ids = poolForModule("C", 1).map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("ogni corso con lezioni ha un test d'ingresso o una ragione chiara per non averlo", () => {
    const withPlacement = COURSES.filter((c) => placementSet(c, "x").length > 0).map((c) => c.id);
    expect(withPlacement).toContain("C");
    for (const c of COURSES) {
      const set = placementSet(c, "x");
      // sempre PER_MODULE domande per ogni modulo campionato
      expect(set.length % 2).toBe(0);
      for (const m of new Set(set.map((s) => s.module))) expect(modulesWithLessons(c)).toContain(m);
    }
  });
  it("il test d'ingresso è deterministico per seme", () => {
    const c = courseByLetter("C")!;
    expect(placementSet(c, "a").map((s) => s.question.id)).toEqual(placementSet(c, "a").map((s) => s.question.id));
  });
  it("il seme del tentativo dipende da utente, ambito e identificativo", () => {
    const a = attemptSeed("u1", "t1", "modulo:C.01");
    expect(a).toBe(attemptSeed("u1", "t1", "modulo:C.01"));
    expect(a).not.toBe(attemptSeed("u2", "t1", "modulo:C.01"));
    expect(a).not.toBe(attemptSeed("u1", "t2", "modulo:C.01"));
    expect(a).not.toBe(attemptSeed("u1", "t1", "modulo:C.02"));
  });
});
