import { describe, expect, it } from "vitest";
import { explainIp, ipQuestions, isPrivate } from "./ip";

describe("isPrivate (RFC 1918)", () => {
  it("riconosce le tre reti private", () => {
    expect(isPrivate([10, 0, 0, 1])).toBe(true);
    expect(isPrivate([172, 16, 0, 1])).toBe(true);
    expect(isPrivate([172, 31, 255, 254])).toBe(true);
    expect(isPrivate([192, 168, 1, 10])).toBe(true);
  });

  it("non confonde i vicini", () => {
    expect(isPrivate([172, 15, 0, 1])).toBe(false);
    expect(isPrivate([172, 32, 0, 1])).toBe(false);
    expect(isPrivate([192, 169, 0, 1])).toBe(false);
    expect(isPrivate([11, 0, 0, 1])).toBe(false);
  });
});

describe("ipQuestions", () => {
  it("è deterministico e coerente", () => {
    expect(ipQuestions("a")).toEqual(ipQuestions("a"));
    for (let s = 0; s < 200; s++) {
      for (const q of ipQuestions(`s${s}`)) {
        expect(q.octets).toHaveLength(4);
        q.octets.forEach((o, i) => {
          expect(o).toBeGreaterThanOrEqual(0);
          expect(o).toBeLessThanOrEqual(255);
          expect(parseInt(q.bits[i], 2)).toBe(o);
          expect(q.bits[i]).toHaveLength(8);
        });
        expect(q.private).toBe(isPrivate(q.octets));
        // mai indirizzi riservati o speciali come pubblici
        if (!q.private) expect([0, 10, 100, 127, 169, 172, 192, 198, 203]).not.toContain(q.octets[0]);
        expect(q.octets[0]).toBeLessThan(224);
      }
    }
  });

  it("produce sia interni sia esterni", () => {
    const all = Array.from({ length: 50 }, (_, s) => ipQuestions(`m${s}`)).flat();
    expect(all.some((q) => q.private)).toBe(true);
    expect(all.some((q) => !q.private)).toBe(true);
  });
});

describe("explainIp", () => {
  it("segnala la trappola 172 fuori intervallo", () => {
    expect(explainIp([172, 40, 1, 1])).toContain("Trappola");
    expect(explainIp([172, 20, 1, 1])).toContain("privata");
  });
});
