import { beforeAll, describe, expect, it } from "vitest";
import { isWeeklyDue, weeklyEmail } from "./weekly";

beforeAll(() => {
  process.env.BETTER_AUTH_URL = "https://cyberdojo.example";
});

describe("isWeeklyDue", () => {
  it("domenica alle 19 locali sì", () => {
    expect(isWeeklyDue({ timezone: "Europe/Rome" }, new Date("2026-11-01T18:30:00Z"))).toBe(true); // 19:30 a Roma (ora solare)
  });
  it("non negli altri giorni né in altre ore", () => {
    expect(isWeeklyDue({ timezone: "Europe/Rome" }, new Date("2026-10-31T18:30:00Z"))).toBe(false); // sabato
    expect(isWeeklyDue({ timezone: "Europe/Rome" }, new Date("2026-11-01T20:30:00Z"))).toBe(false); // 21:30
    expect(isWeeklyDue({ timezone: "Europe/Rome" }, new Date("2026-11-01T17:59:00Z"))).toBe(false); // 18:59
  });
  it("rispetta il fuso del profilo", () => {
    expect(isWeeklyDue({ timezone: "America/New_York" }, new Date("2026-11-01T23:30:00Z"))).toBe(false); // 18:30 a NY
    expect(isWeeklyDue({ timezone: "America/New_York" }, new Date("2026-11-02T00:30:00Z"))).toBe(true); // 19:30 NY (EST) domenica
  });
});

describe("weeklyEmail", () => {
  it("riporta lezioni, XP e serie", () => {
    const m = weeklyEmail({ name: "Ada", email: "a@x.it", summary: { lessons: 3, xp: 80, streak: 5 }, unsubscribeUrl: "https://x/u" });
    expect(m.text).toContain("3 lezioni completate");
    expect(m.text).toContain("80 XP");
    expect(m.text).toContain("5 giorni");
  });
  it("settimana vuota: tono gentile", () => {
    const m = weeklyEmail({ name: null, email: "a@x.it", summary: { lessons: 0, xp: 0, streak: 0 }, unsubscribeUrl: "https://x/u" });
    expect(m.text).toContain("tranquilla");
  });
});
