import { describe, expect, it } from "vitest";
import { cleanNote, NOTE_MAX } from "./note-core";

describe("cleanNote", () => {
  it("toglie spazi ai bordi e normalizza gli a capo", () => {
    expect(cleanNote("  ciao\r\nmondo  ")).toBe("ciao\nmondo");
  });
  it("toglie i caratteri di controllo ma tiene gli a capo", () => {
    expect(cleanNote("a\u0000b\u0007c\nd")).toBe("abc\nd");
  });
  it("taglia alla lunghezza massima", () => {
    expect(cleanNote("x".repeat(NOTE_MAX + 500)).length).toBe(NOTE_MAX);
  });
  it("non accetta cose che non sono testo", () => {
    expect(cleanNote(undefined as unknown as string)).toBe("");
    expect(cleanNote(42 as unknown as string)).toBe("");
  });
  it("lascia il testo com'è: niente HTML interpretato (lo mostra React come testo)", () => {
    expect(cleanNote("<b>x</b>")).toBe("<b>x</b>");
  });
});
