import { describe, expect, it } from "vitest";
import { parseSafeMarkdown } from "./markdown";

describe("parseSafeMarkdown", () => {
  it("separa i paragrafi", () => {
    const b = parseSafeMarkdown("Uno\n\nDue");
    expect(b).toHaveLength(2);
    expect(b[0]).toEqual({ type: "p", inline: [{ t: "text", v: "Uno" }] });
  });
  it("titoletti e elenchi", () => {
    const b = parseSafeMarkdown("## Titolo\n\n- a\n- b");
    expect(b[0]).toMatchObject({ type: "h", level: 2 });
    expect(b[1]).toMatchObject({ type: "ul" });
    expect((b[1] as { items: unknown[] }).items).toHaveLength(2);
  });
  it("grassetto, corsivo e codice", () => {
    const [p] = parseSafeMarkdown("a **b** _c_ `d`");
    expect((p as { inline: { t: string }[] }).inline.map((i) => i.t)).toEqual(["text", "bold", "text", "italic", "text", "code"]);
  });
  it("accetta solo link http/https", () => {
    const ok = parseSafeMarkdown("[sito](https://example.com)")[0] as { inline: { t: string; href?: string }[] };
    expect(ok.inline[0]).toMatchObject({ t: "link", href: "https://example.com" });
    const bad = parseSafeMarkdown("[x](javascript:alert(1))")[0] as { inline: { t: string }[] };
    expect(bad.inline.some((i) => i.t === "link")).toBe(false);
  });
  it("tratta l'HTML come testo semplice (mai tag)", () => {
    const [p] = parseSafeMarkdown("<img src=x onerror=alert(1)>");
    expect(p).toEqual({ type: "p", inline: [{ t: "text", v: "<img src=x onerror=alert(1)>" }] });
  });
  it("testo vuoto dà nessun blocco", () => {
    expect(parseSafeMarkdown("  \n ")).toEqual([]);
  });
});
