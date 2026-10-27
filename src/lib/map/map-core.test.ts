import { describe, expect, it } from "vitest";
import type { CourseDef } from "@/lib/content/courses";
import { buildKnowledgeMap, type MapLessonInfo } from "./map-core";

const course: CourseDef = {
  id: "F",
  folder: "fondamenta",
  title: "Fondamenta",
  modules: [
    { n: 1, title: "Uno", summary: "" },
    { n: 2, title: "Due", summary: "" },
    { n: 3, title: "Tre", summary: "" },
    { n: 4, title: "Quattro", summary: "" },
  ],
};
const L = (id: string, module: number): MapLessonInfo => ({ id, course: "fondamenta", module });
const lessons = [L("F.01.001", 1), L("F.01.002", 1), L("F.02.001", 2), L("F.02.002", 2), L("F.03.001", 3)];

describe("buildKnowledgeMap", () => {
  const map = buildKnowledgeMap([course], lessons, new Set(["F.01.001", "F.01.002", "F.02.001"]))[0];
  it("segna completato il modulo con tutte le lezioni fatte", () => {
    expect(map.modules[0]).toMatchObject({ n: 1, done: 2, total: 2, state: "done" });
  });
  it("segna in corso il modulo iniziato ma non finito", () => {
    expect(map.modules[1]).toMatchObject({ n: 2, done: 1, total: 2, state: "progress" });
  });
  it("segna da fare il modulo non iniziato", () => {
    expect(map.modules[2]).toMatchObject({ n: 3, done: 0, total: 1, state: "todo" });
  });
  it("segna in preparazione il modulo senza lezioni", () => {
    expect(map.modules[3]).toMatchObject({ n: 4, total: 0, state: "soon" });
  });
  it("somma le lezioni del corso", () => {
    expect(map).toMatchObject({ id: "F", done: 3, total: 5 });
  });
});
