import { describe, expect, it } from "vitest";
import { buildFor, CHALLENGE_ID, CHALLENGES, findChallenge, listing, toPublic } from "./catalog";
import { FLAG_RE, LEVELS, XP_BY_LEVEL, challengeSalt, verifyFlag } from "./core";
import { CATEGORIES } from "./types";

const SECRET = "segreto-di-prova";
const USERS = ["u1", "u2", "u3", "utente-lungo-4", "u5"];

describe("validazione del catalogo", () => {
  it("ha almeno 20 sfide con id unici e ben formati", () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(20);
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(CHALLENGE_ID);
  });
  it("ogni sfida ha 3 indizi, spiegazione, difesa, livello e categoria validi", () => {
    for (const c of CHALLENGES) {
      expect(c.hints, c.id).toHaveLength(3);
      for (const h of c.hints) expect(h.trim().length, c.id).toBeGreaterThan(10);
      expect(c.explanation.length, c.id).toBeGreaterThan(30);
      expect(c.defense.length, c.id).toBeGreaterThan(30);
      expect(c.goal, c.id).toMatch(/CYBERDOJO\{/);
      expect(LEVELS).toContain(c.level);
      expect(CATEGORIES).toContain(c.category);
      expect(XP_BY_LEVEL[c.level]).toBeGreaterThan(0);
    }
  });
  it("copre tutte le categorie e tutti i livelli", () => {
    for (const cat of CATEGORIES) expect(CHALLENGES.some((c) => c.category === cat), cat).toBe(true);
    for (const l of LEVELS) expect(CHALLENGES.some((c) => c.level === l), l).toBe(true);
  });
  it("findChallenge rifiuta id strani", () => {
    expect(findChallenge("../etc")).toBeUndefined();
    expect(findChallenge(5)).toBeUndefined();
    expect(findChallenge(CHALLENGES[0].id)).toBe(CHALLENGES[0]);
    expect(listing()).toHaveLength(CHALLENGES.length);
  });
});

describe("generazione dei dati", () => {
  it("la bandiera ha il formato giusto ed è stabile per lo stesso utente", () => {
    for (const c of CHALLENGES) {
      for (const u of USERS) {
        const a = buildFor(SECRET, u, c);
        expect(a.flag, c.id).toMatch(FLAG_RE);
        expect(buildFor(SECRET, u, c).flag).toBe(a.flag);
      }
    }
  });
  it("il materiale pubblico non contiene la bandiera in chiaro", () => {
    for (const c of CHALLENGES) {
      for (const u of USERS) {
        const b = buildFor(SECRET, u, c);
        const shown = JSON.stringify(toPublic(c, b)).toLowerCase();
        expect(shown, c.id).not.toContain(b.flag);
      }
    }
  });
  it("un segreto diverso cambia le bandiere (per la maggior parte delle sfide)", () => {
    let changed = 0;
    for (const c of CHALLENGES) if (buildFor("a", "u", c).flag !== buildFor("b", "u", c).flag) changed++;
    expect(changed).toBeGreaterThan(CHALLENGES.length * 0.8);
  });
  it("la verifica usa il sale e accetta solo la bandiera giusta", () => {
    for (const c of CHALLENGES) {
      const b = buildFor(SECRET, "u1", c);
      const salt = challengeSalt(SECRET, c.id);
      expect(verifyFlag(b.flag.toUpperCase(), b.flag, salt)).toBe(true);
      expect(verifyFlag("cyberdojo{sbagliata}", b.flag, salt)).toBe(false);
    }
  });
  it("le sfide SQL hanno la bandiera nel database finto, non nel materiale pubblico", () => {
    for (const c of CHALLENGES.filter((x) => buildFor(SECRET, "u1", x).artifact.kind === "sqlform")) {
      const b = buildFor(SECRET, "u1", c);
      expect(JSON.stringify(b.sql?.rows).toLowerCase()).toContain(b.flag.slice(9));
    }
  });
});
