import { describe, expect, it } from "vitest";
import { applyStreak, daysBetween, effectiveStreak, localDay, MAX_FREEZES, type StreakResult, type StreakState } from "./streak";
import { xpForPass } from "./xp";

const fresh: StreakState = { current: 0, best: 0, lastDay: null, freezes: 0 };

describe("localDay / daysBetween", () => {
  it("usa il fuso dell'utente, non quello del server", () => {
    const t = new Date("2026-10-14T23:30:00Z");
    expect(localDay(t, "Europe/Rome")).toBe("2026-10-15"); // già mezzanotte passata a Roma (UTC+2)
    expect(localDay(t, "UTC")).toBe("2026-10-14");
    expect(localDay(t, "America/Los_Angeles")).toBe("2026-10-14");
  });

  it("conta i giorni di calendario anche col cambio dell'ora legale", () => {
    expect(daysBetween("2026-10-24", "2026-10-26")).toBe(2); // il cambio ora è il 25 ottobre
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetween("2026-10-14", "2026-10-14")).toBe(0);
  });
});

describe("applyStreak", () => {
  it("il primo giorno vale 1", () => {
    const r = applyStreak(fresh, "2026-10-14");
    expect(r).toMatchObject({ current: 1, best: 1, lastDay: "2026-10-14", counted: true });
  });

  it("lo stesso giorno non conta due volte", () => {
    const a = applyStreak(fresh, "2026-10-14");
    const b = applyStreak(a, "2026-10-14");
    expect(b.counted).toBe(false);
    expect(b.current).toBe(1);
  });

  it("giorni consecutivi aumentano la serie e il record", () => {
    let s: StreakState = fresh;
    for (const d of ["2026-10-14", "2026-10-15", "2026-10-16"]) s = applyStreak(s, d);
    expect(s).toMatchObject({ current: 3, best: 3 });
  });

  it("un giorno saltato senza congelamenti rompe la serie, ma il record resta", () => {
    let s = applyStreak(applyStreak(fresh, "2026-10-14"), "2026-10-15");
    const r = applyStreak(s, "2026-10-17");
    expect(r).toMatchObject({ current: 1, best: 2, broken: true });
    s = r;
    expect(s.lastDay).toBe("2026-10-17");
  });

  it("un congelamento copre un giorno saltato", () => {
    const s: StreakState = { current: 5, best: 5, lastDay: "2026-10-14", freezes: 1 };
    const r = applyStreak(s, "2026-10-16"); // saltato il 15
    expect(r).toMatchObject({ current: 6, freezes: 0, freezesUsed: 1, broken: false });
  });

  it("con due giorni saltati servono due congelamenti", () => {
    const s: StreakState = { current: 5, best: 5, lastDay: "2026-10-14", freezes: 1 };
    expect(applyStreak(s, "2026-10-17")).toMatchObject({ current: 1, broken: true });
    expect(applyStreak({ ...s, freezes: 2 }, "2026-10-17")).toMatchObject({ current: 6, freezes: 0, freezesUsed: 2 });
  });

  it("ogni 7 giorni si guadagna un congelamento, massimo 2", () => {
    let s: StreakState | StreakResult = fresh;
    const days = Array.from({ length: 21 }, (_, i) => `2026-11-${String(i + 1).padStart(2, "0")}`);
    const earned: number[] = [];
    for (const d of days) {
      s = applyStreak(s, d);
      if ("freezeEarned" in s && s.freezeEarned) earned.push(s.current);
    }
    expect(earned).toEqual([7, 14]); // al giorno 21 il massimo (2) è già raggiunto
    expect(s.freezes).toBe(MAX_FREEZES);
    expect(s.current).toBe(21);
  });

  it("l'orologio che torna indietro non rompe nulla", () => {
    const s: StreakState = { current: 4, best: 4, lastDay: "2026-10-14", freezes: 0 };
    expect(applyStreak(s, "2026-10-12")).toMatchObject({ current: 4, counted: false });
  });
});

describe("effectiveStreak", () => {
  const s: StreakState = { current: 5, best: 8, lastDay: "2026-10-14", freezes: 1 };
  it("è viva oggi, domani e coperta da un congelamento", () => {
    expect(effectiveStreak(s, "2026-10-14")).toBe(5);
    expect(effectiveStreak(s, "2026-10-15")).toBe(5);
    expect(effectiveStreak(s, "2026-10-16")).toBe(5); // un giorno saltato, un congelamento
  });
  it("è finita se i giorni saltati superano i congelamenti", () => {
    expect(effectiveStreak(s, "2026-10-17")).toBe(0);
    expect(effectiveStreak({ ...s, freezes: 0 }, "2026-10-16")).toBe(0);
  });
  it("senza storia vale 0", () => {
    expect(effectiveStreak({ current: 0, best: 0, lastDay: null, freezes: 0 }, "2026-10-14")).toBe(0);
  });
});

describe("xpForPass", () => {
  it("lezione 10 + verifica 10, più 5 al primo tentativo perfetto", () => {
    expect(xpForPass({ firstTryPerfect: false }).reduce((a, e) => a + e.amount, 0)).toBe(20);
    expect(xpForPass({ firstTryPerfect: true }).reduce((a, e) => a + e.amount, 0)).toBe(25);
  });
});
