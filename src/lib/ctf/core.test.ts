import { describe, expect, it } from "vitest";
import { challengeSalt, challengeSeed, hashFlag, normalizeFlag, rateLimit, verifyFlag, xpForSolve, xpToAward } from "./core";

describe("verifica della bandiera", () => {
  const salt = challengeSalt("segreto", "x");
  it("accetta la bandiera giusta anche con spazi e maiuscole", () => {
    expect(verifyFlag("  CYBERDOJO{Ciao}  ", "cyberdojo{ciao}", salt)).toBe(true);
  });
  it("rifiuta bandiere sbagliate, vuote, troppo lunghe o non testo", () => {
    expect(verifyFlag("cyberdojo{altro}", "cyberdojo{ciao}", salt)).toBe(false);
    expect(verifyFlag("", "cyberdojo{ciao}", salt)).toBe(false);
    expect(verifyFlag("a".repeat(500), "cyberdojo{ciao}", salt)).toBe(false);
    expect(verifyFlag(42, "cyberdojo{ciao}", salt)).toBe(false);
  });
  it("l'hash dipende dal sale", () => {
    expect(hashFlag("a", "1")).not.toBe(hashFlag("a", "2"));
    expect(hashFlag("a", "1")).toMatch(/^[0-9a-f]{64}$/);
  });
  it("normalizza", () => expect(normalizeFlag(" AB ")).toBe("ab"));
});

describe("seme e sale", () => {
  it("sono stabili e dipendono da segreto, utente e sfida", () => {
    expect(challengeSeed("s", "u", "c")).toBe(challengeSeed("s", "u", "c"));
    expect(challengeSeed("s", "u", "c")).not.toBe(challengeSeed("s", "v", "c"));
    expect(challengeSeed("s", "u", "c")).not.toBe(challengeSeed("t", "u", "c"));
    expect(challengeSalt("s", "a")).not.toBe(challengeSalt("s", "b"));
  });
});

describe("limite di tentativi", () => {
  const now = new Date("2026-01-01T12:00:00Z");
  const ago = (m: number) => new Date(now.getTime() - m * 60_000);
  it("non blocca sotto il limite", () => {
    expect(rateLimit(Array.from({ length: 9 }, () => ago(1)), now)).toEqual({ blocked: false });
  });
  it("blocca a 10 errori in 10 minuti e dice quanto attendere", () => {
    const r = rateLimit([ago(9), ...Array.from({ length: 9 }, () => ago(1))], now);
    expect(r).toEqual({ blocked: true, minutes: 1 });
  });
  it("ignora gli errori fuori dalla finestra", () => {
    expect(rateLimit(Array.from({ length: 12 }, () => ago(11)), now)).toEqual({ blocked: false });
  });
});

describe("XP una volta sola", () => {
  it("evento ctf con refId = id sfida", () => {
    expect(xpForSolve("medio", "cesare")).toEqual({ kind: "ctf", amount: 25, refId: "cesare" });
  });
  it("niente punti se già dati", () => {
    expect(xpToAward("difficile", "a", new Set())).toBe(40);
    expect(xpToAward("difficile", "a", new Set(["a"]))).toBe(0);
  });
});
