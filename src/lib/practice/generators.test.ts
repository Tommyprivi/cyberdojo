import { describe, expect, it } from "vitest";
import {
  binaryToDecimal,
  binaryToDecimalSteps,
  decimalToBinary,
  diagnoseBinaryToDecimal,
  diagnoseDecimalToBinary,
  GENERATORS,
  isGeneratorId,
  parseIntegerAnswer,
  parseOctetAnswer,
} from "./generators";

describe("decimalToBinary", () => {
  it("è deterministico, senza duplicati né casi banali", () => {
    expect(decimalToBinary("abc")).toEqual(decimalToBinary("abc"));
    expect(decimalToBinary("abc")).not.toEqual(decimalToBinary("abd"));
    for (let s = 0; s < 100; s++) {
      const qs = decimalToBinary(`s${s}`);
      expect(new Set(qs.map((q) => q.answer)).size).toBe(5);
      for (const q of qs) {
        expect(q.answer).toBeGreaterThanOrEqual(1);
        expect(q.answer).toBeLessThanOrEqual(254);
        expect(q.answer & (q.answer - 1)).not.toBe(0);
        expect(q.data).toBe(String(q.answer));
      }
    }
  });
});

describe("parseOctetAnswer", () => {
  it("accetta solo 8 bit, tollerando gli spazi", () => {
    expect(parseOctetAnswer("01000010")).toBe(66);
    expect(parseOctetAnswer(" 0100 0010 ")).toBe(66);
    expect(parseOctetAnswer("11111111")).toBe(255);
  });

  it("rifiuta 7 o 9 bit, cifre non binarie e testo", () => {
    for (const bad of ["1000010", "001000010", "01000012", "sessantasei", "", "66", "0b01000010"]) {
      expect(parseOctetAnswer(bad)).toBeNull();
    }
  });
});

describe("diagnoseDecimalToBinary", () => {
  it("riconosce la risposta giusta", () => {
    expect(diagnoseDecimalToBinary(66, "01000010").ok).toBe(true);
  });

  it("spiega i bit mancanti, il contrario e l'errore generico", () => {
    expect(diagnoseDecimalToBinary(66, "1000010").message).toContain("aggiungi 1 zeri");
    // 178 = 10110010 non è un palindromo: letto al contrario (01001101) vale 77.
    expect(diagnoseDecimalToBinary(178, "01001101").message).toContain("al contrario");
    expect(diagnoseDecimalToBinary(178, "10110010").ok).toBe(true);
    expect(diagnoseDecimalToBinary(66, "11000010").message).toContain("valgono 194");
    expect(diagnoseDecimalToBinary(66, "1020").message).toContain("solo 0 e 1");
    expect(diagnoseDecimalToBinary(66, "").message).toBe("");
  });
});

describe("GENERATORS", () => {
  it("espone generate e parse per ogni generatore", () => {
    expect(isGeneratorId("decimal-to-binary")).toBe(true);
    expect(isGeneratorId("niente")).toBe(false);
    for (const g of Object.values(GENERATORS)) {
      const q = g.generate("x", 2)[0];
      expect(typeof q.answer).toBe("number");
    }
  });
});

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
