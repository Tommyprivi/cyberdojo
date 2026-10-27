import { describe, expect, it } from "vitest";
import { compareGroups, isCourseId } from "./teams";

const g = (id: string, totalXpWeek: number, members: number, audience: "minori" | "adulti" = "adulti") => ({ id, name: id, totalXpWeek, members, audience });

describe("compareGroups", () => {
  it("ordina per XP della settimana e calcola distacco e media", () => {
    const r = compareGroups([g("a", 100, 4), g("b", 300, 3), g("c", 50, 1)]);
    expect(r.map((x) => [x.id, x.rank])).toEqual([["b", 1], ["a", 2], ["c", 3]]);
    expect(r[1]).toMatchObject({ gap: 200, avg: 25 });
    expect(r[0]).toMatchObject({ gap: 0, avg: 100 });
  });
  it("a pari XP stesso posto", () => {
    const r = compareGroups([g("a", 100, 2), g("b", 100, 5), g("c", 10, 1)]);
    expect(r.map((x) => x.rank)).toEqual([1, 1, 3]);
  });
  it("non mescola minori e adulti: restituisce una classifica per fascia", () => {
    const r = compareGroups([g("a", 100, 2, "minori"), g("b", 500, 2, "adulti")]);
    expect(r.find((x) => x.id === "a")?.rank).toBe(1);
    expect(r.find((x) => x.id === "b")?.rank).toBe(1);
  });
  it("gestisce gruppi vuoti senza dividere per zero", () => {
    expect(compareGroups([g("a", 0, 0)])[0].avg).toBe(0);
    expect(compareGroups([])).toEqual([]);
  });
});

describe("isCourseId", () => {
  it("ammette solo le cinque lettere dei corsi", () => {
    for (const c of ["F", "C", "D", "T", "H"]) expect(isCourseId(c)).toBe(true);
    for (const c of ["X", "f", "FF", "", null, 1]) expect(isCourseId(c)).toBe(false);
  });
});
