import { describe, expect, it } from "vitest";
import { calculate, formatResult } from "./calculator";

const ok = (expr: string) => {
  const r = calculate(expr);
  if (!r.ok) throw new Error(`atteso un risultato per «${expr}», errore: ${r.error}`);
  return r.value;
};

describe("calculate", () => {
  it("fa le quattro operazioni", () => {
    expect(ok("2+3")).toBe(5);
    expect(ok("10-4")).toBe(6);
    expect(ok("6*7")).toBe(42);
    expect(ok("20/8")).toBe(2.5);
  });

  it("rispetta la precedenza e le parentesi", () => {
    expect(ok("2+3*4")).toBe(14);
    expect(ok("(2+3)*4")).toBe(20);
    expect(ok("2*(3+(4-1))")).toBe(12);
  });

  it("accetta i simboli × ÷ − e la virgola decimale", () => {
    expect(ok("6×7")).toBe(42);
    expect(ok("9÷3")).toBe(3);
    expect(ok("5−2")).toBe(3);
    expect(ok("1,5+1,5")).toBe(3);
  });

  it("gestisce il meno unario e le potenze", () => {
    expect(ok("-3+5")).toBe(2);
    expect(ok("2*-3")).toBe(-6);
    expect(ok("2^10")).toBe(1024);
    expect(ok("2^3^2")).toBe(512); // la potenza va da destra a sinistra
    expect(ok("-2^2")).toBe(-4);
  });

  it("calcola le percentuali", () => {
    expect(ok("50%")).toBe(0.5);
    expect(ok("200*10%")).toBe(20);
  });

  it("ignora gli spazi", () => {
    expect(ok("  2 +  3 ")).toBe(5);
  });

  it("evita gli errori dei decimali", () => {
    expect(ok("0.1+0.2")).toBe(0.3);
  });

  it("segnala la divisione per zero", () => {
    const r = calculate("5/0");
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toContain("zero");
  });

  it("segnala le espressioni sbagliate", () => {
    for (const bad of ["", "2+", "*3", "(2+3", "2+3)", "2..3", "abc", "2 3"]) {
      expect(calculate(bad).ok, bad).toBe(false);
    }
  });

  it("non esegue mai codice: lettere e simboli strani sono errori", () => {
    for (const bad of ["alert(1)", "process.exit()", "2;3", "constructor", "1e5", "0x10", "`1`"]) {
      expect(calculate(bad).ok, bad).toBe(false);
    }
  });

  it("rifiuta risultati enormi o infiniti", () => {
    expect(calculate("9^9^9").ok).toBe(false);
  });

  it("rifiuta espressioni troppo lunghe", () => {
    expect(calculate("1+".repeat(300) + "1").ok).toBe(false);
  });
});

describe("formatResult", () => {
  it("usa la virgola e toglie gli zeri inutili", () => {
    expect(formatResult(2.5)).toBe("2,5");
    expect(formatResult(5)).toBe("5");
    expect(formatResult(0.3)).toBe("0,3");
  });

  it("separa le migliaia", () => {
    expect(formatResult(1234567)).toBe("1.234.567");
  });
});
