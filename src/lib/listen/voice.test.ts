import { describe, expect, it } from "vitest";
import { appendDictation, speakable } from "./voice";

describe("speakable", () => {
  it("toglie markdown, collegamenti a lezioni, righe di verdetto e codice", () => {
    const t = "**Bravo!** Vedi /lezione/F.01.002 e `ls`.\n\n```\nrm -rf\n```\n- punto uno\n- punto due";
    expect(speakable(t)).toBe("Bravo! Vedi la lezione F.01.002 e ls. punto uno punto due");
  });
  it("vuoto", () => expect(speakable("  ")).toBe(""));
  it("limita la lunghezza", () => expect(speakable("a ".repeat(3000)).length).toBeLessThanOrEqual(1500));
});

describe("appendDictation", () => {
  it("aggiunge con uno spazio", () => expect(appendDictation("Ciao", "come va")).toBe("Ciao come va"));
  it("campo vuoto", () => expect(appendDictation("", " ciao ")).toBe("ciao"));
  it("rispetta il massimo", () => expect(appendDictation("a", "b".repeat(50), 10)).toHaveLength(10));
});
