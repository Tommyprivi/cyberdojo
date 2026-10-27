import { describe, expect, it } from "vitest";
import { buildPools, pickQuestions, toPublic, type PoolItem } from "./pool";

const items = (n: number, tag = "x"): PoolItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${tag}#${i + 1}`, q: `Domanda ${tag} ${i}`, ok: `giusta ${i}`, no: [`a${i}`, `b${i}`, `c${i}`] }));

describe("selezione domande", () => {
  it("è deterministica: stesso seme, stesse domande e stesse opzioni", () => {
    expect(pickQuestions(items(20), "seme-1", 8)).toEqual(pickQuestions(items(20), "seme-1", 8));
  });
  it("semi diversi danno domande diverse", () => {
    const a = pickQuestions(items(30), "s1", 8).map((q) => q.id);
    const b = pickQuestions(items(30), "s2", 8).map((q) => q.id);
    expect(a).not.toEqual(b);
  });
  it("nessuna domanda ripetuta e al massimo quante richieste", () => {
    const q = pickQuestions(items(20), "s", 8);
    expect(q).toHaveLength(8);
    expect(new Set(q.map((x) => x.id)).size).toBe(8);
    expect(pickQuestions(items(3), "s", 8)).toHaveLength(3);
  });
  it("l'indice della risposta punta alla scelta giusta", () => {
    for (const q of pickQuestions(items(20), "s", 8)) {
      expect(q.choices[q.answer]).toMatch(/^giusta/);
      expect(q.choices).toHaveLength(4);
    }
  });
  it("la versione pubblica non contiene la risposta", () => {
    const p = toPublic(pickQuestions(items(5), "s", 3)[0]);
    expect(Object.keys(p).sort()).toEqual(["choices", "id", "prompt"]);
  });
  it("scarta le domande con lo stesso testo", () => {
    const dup = [...items(5), { ...items(1)[0], id: "y#1" }];
    expect(pickQuestions(dup, "s", 10)).toHaveLength(5);
  });
});

describe("raggruppamento per modulo", () => {
  const item = (q: string) => [{ q, ok: "a", no: ["b", "c"] as [string, string] }];
  const banks = { "c01-asset": item("q1"), "packet-basics": item("q2"), "d02-sql": item("q3"), orfana: item("q4") };
  const lessons = [
    { id: "F.05.001", course: "F", module: 5, generator: "packet-basics", body: "" },
    { id: "C.01.001", course: "C", module: 1, body: '<Quiz\n  question="Chi?"\n  options={["x", "y", "z"]}\n  answer={1}\n  explain="e"\n/>' },
  ];
  const pools = buildPools(banks, lessons);
  it("usa il prefisso della banca o la lezione che la usa", () => {
    expect(pools.get("C1")?.map((i) => i.q).sort()).toEqual(["Chi?", "q1"]);
    expect(pools.get("F5")?.map((i) => i.q)).toEqual(["q2"]);
    expect(pools.get("D2")?.map((i) => i.q)).toEqual(["q3"]);
  });
  it("ignora le banche senza modulo", () => {
    for (const p of pools.values()) expect(p.some((i) => i.q === "q4")).toBe(false);
  });
  it("gli id sono stabili", () => {
    expect(pools.get("C1")?.map((i) => i.id)).toContain("c01-asset#1");
    expect(pools.get("C1")?.map((i) => i.id)).toContain("quiz:C.01.001#1");
  });
});
