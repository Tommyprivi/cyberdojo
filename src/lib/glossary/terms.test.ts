import { describe, expect, it } from "vitest";
import { GLOSSARY, glossarySlug } from "./terms";

describe("glossario", () => {
  it("ha almeno 100 termini", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(100);
  });
  it("ogni termine ha una definizione breve e un corso valido", () => {
    for (const t of GLOSSARY) {
      expect(t.term.trim().length, t.term).toBeGreaterThan(1);
      expect(t.def.length, t.term).toBeGreaterThan(20);
      expect(t.def.length, t.term).toBeLessThanOrEqual(200);
      expect("FCDTH").toContain(t.course);
    }
  });
  it("nessun termine né identificatore è ripetuto", () => {
    const slugs = GLOSSARY.map((t) => glossarySlug(t.term));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("copre tutti i corsi", () => {
    expect(new Set(GLOSSARY.map((t) => t.course)).size).toBe(5);
  });
});

describe("glossarySlug", () => {
  it("toglie accenti e simboli", () => {
    expect(glossarySlug("Triade CIA")).toBe("triade-cia");
    expect(glossarySlug("p-value")).toBe("p-value");
    expect(glossarySlug("Man-in-the-middle")).toBe("man-in-the-middle");
  });
});
