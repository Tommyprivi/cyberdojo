import { describe, expect, it } from "vitest";
import {
  binaryToDecimal,
  binaryToDecimalSteps,
  diagnoseBinaryToDecimal,
  parseIntegerAnswer,
} from "./generators";

describe("binaryToDecimal", () => {
  it("è deterministico per lo stesso seme", () => {
    expect(binaryToDecimal("abc")).toEqual(binaryToDecimal("abc"));
  });

  it("cambia con semi diversi", () => {
    expect(binaryToDecimal("abc")).not.toEqual(binaryToDecimal("abd"));
  });

  it("la risposta corrisponde ai bit e non ci sono duplicati", () => {
    for (const d of ["facile", "medio", "severo"] as const) {
      const qs = binaryToDecimal("seme-1", 5, d);
      expect(qs).toHaveLength(5);
      expect(new Set(qs.map((q) => q.answer)).size).toBe(5);
      for (const q of qs) expect(parseInt(q.data, 2)).toBe(q.answer);
    }
  });

  it("usa 4 bit al livello facile e 8 agli altri", () => {
    expect(binaryToDecimal("x", 3, "facile")[0].data).toHaveLength(4);
    expect(binaryToDecimal("x", 3, "medio")[0].data).toHaveLength(8);
  });

  it("evita potenze di 2 ai livelli medio e severo", () => {
    for (let i = 0; i < 50; i++) {
      for (const q of binaryToDecimal(`s${i}`, 5, "severo")) {
        expect(q.answer & (q.answer - 1)).not.toBe(0);
      }
    }
  });
});

describe("parseIntegerAnswer", () => {
  it("accetta solo interi puliti", () => {
    expect(parseIntegerAnswer(" 178 ")).toBe(178);
    for (const bad of ["", "17.8", "1e2", "-5", "abc", "0x10"]) {
      expect(parseIntegerAnswer(bad)).toBeNull();
    }
  });
});

describe("diagnoseBinaryToDecimal", () => {
  it("riconosce la risposta corretta", () => {
    expect(diagnoseBinaryToDecimal("10110010", "178").ok).toBe(true);
  });

  it("riconosce la lettura al contrario", () => {
    const d = diagnoseBinaryToDecimal("10110010", String(parseInt("01001101", 2)));
    expect(d.ok).toBe(false);
    expect(d.message).toContain("al contrario");
  });

  it("riconosce il conteggio degli uno", () => {
    expect(diagnoseBinaryToDecimal("10110010", "4").message).toContain("contato gli uno");
  });

  it("non dà errore su input vuoto o non numerico", () => {
    expect(diagnoseBinaryToDecimal("1010", "").message).toBe("");
    expect(diagnoseBinaryToDecimal("1010", "dieci").message).toContain("numero intero");
  });
});

describe("binaryToDecimalSteps", () => {
  it("l'ultimo passo contiene il risultato giusto", () => {
    const steps = binaryToDecimalSteps("11000000");
    expect(steps[2]).toContain("= 192");
  });
});
