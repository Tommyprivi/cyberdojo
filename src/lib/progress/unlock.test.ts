import { describe, expect, it } from "vitest";
import { canOpenLesson, lessonState } from "./unlock";

const lesson = (id: string, prerequisites: string[] = []) => ({ id, prerequisites });

describe("canOpenLesson", () => {
  it("apre una lezione senza prerequisiti", () => {
    expect(canOpenLesson(lesson("F.01.001"), { completed: new Set() })).toBe(true);
  });

  it("apre la lezione quando i prerequisiti sono completati", () => {
    const l = lesson("F.01.002", ["F.01.001"]);
    expect(canOpenLesson(l, { completed: new Set(["F.01.001"]) })).toBe(true);
  });

  it("blocca la lezione se manca un prerequisito", () => {
    const l = lesson("F.01.003", ["F.01.001", "F.01.002"]);
    expect(canOpenLesson(l, { completed: new Set(["F.01.001"]) })).toBe(false);
  });

  it("una lezione padroneggiata vale come prerequisito soddisfatto", () => {
    const l = lesson("F.01.002", ["F.01.001"]);
    expect(canOpenLesson(l, { completed: new Set(), mastered: new Set(["F.01.001"]) })).toBe(true);
  });

  it("la padronanza non apre una lezione con altri prerequisiti mancanti", () => {
    const l = lesson("F.01.003", ["F.01.001", "F.01.002"]);
    expect(canOpenLesson(l, { completed: new Set(), mastered: new Set(["F.01.001"]) })).toBe(false);
  });
});

describe("lessonState", () => {
  const l = lesson("F.01.002", ["F.01.001"]);

  it("è «done» se completata", () => {
    expect(lessonState(l, { completed: new Set(["F.01.002"]) })).toBe("done");
  });

  it("è «mastered» se padroneggiata ma non completata", () => {
    expect(lessonState(l, { completed: new Set(), mastered: new Set(["F.01.002"]) })).toBe("mastered");
  });

  it("è «open» se i prerequisiti ci sono", () => {
    expect(lessonState(l, { completed: new Set(["F.01.001"]) })).toBe("open");
  });

  it("è «locked» altrimenti", () => {
    expect(lessonState(l, { completed: new Set() })).toBe("locked");
  });
});
