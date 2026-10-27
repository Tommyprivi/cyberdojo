import { describe, expect, it } from "vitest";
import { remarkGlossary } from "./remark-glossary";

type N = { type: string; value?: string; name?: string; children?: N[]; attributes?: { name: string; value: string }[] };
const text = (value: string): N => ({ type: "text", value });
const para = (...c: N[]): N => ({ type: "paragraph", children: c });
const jsx = (name: string, ...c: N[]): N => ({ type: "mdxJsxFlowElement", name, attributes: [], children: c });
const run = (children: N[]) => {
  const tree: N = { type: "root", children };
  (remarkGlossary() as (t: N) => void)(tree);
  return tree;
};
const count = (n: N): number => (n.name === "GlossTerm" ? 1 : 0) + (n.children ?? []).reduce((s, c) => s + count(c), 0);

describe("remarkGlossary", () => {
  it("sostituisce la prima occorrenza con GlossTerm", () => {
    const t = run([para(text("La RAM e ancora la RAM."))]);
    expect(count(t)).toBe(1);
    const el = t.children![0].children!.find((c) => c.name === "GlossTerm")!;
    expect(el.attributes!.find((a) => a.name === "term")!.value).toBe("RAM");
    expect(el.attributes!.find((a) => a.name === "def")!.value.length).toBeGreaterThan(10);
  });
  it("non tocca titoli, codice, link e codice in linea", () => {
    const t = run([
      { type: "heading", children: [text("La RAM")] },
      { type: "code", value: "RAM" },
      para({ type: "inlineCode", value: "RAM" }, { type: "link", children: [text("CPU")] }),
    ]);
    expect(count(t)).toBe(0);
  });
  it("non entra nei componenti interattivi", () => {
    const t = run([jsx("Quiz", para(text("Che cos'è la RAM?"))), jsx("Practice", para(text("la CPU"))), jsx("Guided", para(text("il DNS")))]);
    expect(count(t)).toBe(0);
  });
  it("entra in Scene, Callout e Say", () => {
    const t = run([jsx("Scene", para(text("la CPU")), jsx("Callout", para(text("il DNS"))), jsx("Say", para(text("la RAM"))))]);
    expect(count(t)).toBe(3);
  });
  it("la prima occorrenza vale per tutta la schermata, anche tra paragrafi", () => {
    const t = run([para(text("la RAM")), para(text("ancora RAM"))]);
    expect(count(t)).toBe(1);
  });
  it("ogni esecuzione riparte da zero (una schermata alla volta)", () => {
    const p = remarkGlossary() as (t: N) => void;
    const a: N = { type: "root", children: [para(text("la RAM"))] };
    const b: N = { type: "root", children: [para(text("la RAM"))] };
    p(a);
    p(b);
    expect(count(a)).toBe(1);
    expect(count(b)).toBe(1);
  });
  it("non mette link verso le lezioni: la definizione è solo testo", () => {
    const t = run([para(text("la RAM"))]);
    expect(JSON.stringify(t)).not.toContain("/lezione");
  });
});
