import { describe, expect, it } from "vitest";
import { lastDays, levelOf, medalsFor } from "./profile-stats";

describe("levelOf", () => {
  it("parte dal livello 1 e sale a 100 e 300 XP", () => {
    expect(levelOf(0)).toMatchObject({ level: 1, name: "Novizio", pct: 0 });
    expect(levelOf(99).level).toBe(1);
    expect(levelOf(100)).toMatchObject({ level: 2, into: 0, span: 200 });
    expect(levelOf(300).level).toBe(3);
  });
  it("non supera l'ultimo nome", () => {
    expect(levelOf(100000).name).toBe("Maestro");
  });
});

describe("medalsFor", () => {
  it("sblocca in base ai dati", () => {
    const m = Object.fromEntries(medalsFor({ xp: 120, lessons: 1, bestStreak: 3, beltDone: false }).map((x) => [x.id, x.unlocked]));
    expect(m).toMatchObject({ first: true, xp100: true, xp500: false, s3: true, s7: false, belt: false });
  });
});

describe("lastDays", () => {
  it("copre n giorni, oggi per ultimo, anche a cavallo di mese", () => {
    const d = lastDays("2026-03-02", 4, new Set(["2026-03-01"]));
    expect(d.map((x) => x.day)).toEqual(["2026-02-27", "2026-02-28", "2026-03-01", "2026-03-02"]);
    expect(d[2].done).toBe(true);
    expect(d[3].isToday).toBe(true);
  });
});
