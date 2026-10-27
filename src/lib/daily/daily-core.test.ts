import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/practice/banks";
import { ALL_BANK_ITEMS } from "@/lib/practice/banks-all";
import { checkDaily, DAILY_XP, dailyStreak, dailyXpEvent, pickDaily, publicDaily } from "./daily-core";

const BANKS: Record<string, BankItem[]> = {
  a: [
    { q: "Uno?", ok: "giusta1", no: ["x1", "y1"] },
    { q: "Due?", ok: "giusta2", no: ["x2", "y2", "z2"] },
  ],
  b: [{ q: "Tre?", ok: "giusta3", no: ["x3", "y3"] }],
};

describe("pickDaily", () => {
  it("è deterministica: stessa data, stessa domanda", () => {
    expect(pickDaily("2026-11-01", BANKS)).toEqual(pickDaily("2026-11-01", BANKS));
  });
  it("non dipende dall'ordine in cui sono scritte le banche", () => {
    const rev = { b: BANKS.b, a: BANKS.a };
    expect(pickDaily("2026-11-02", rev)).toEqual(pickDaily("2026-11-02", BANKS));
  });
  it("con le banche vere cambia nel tempo e la risposta giusta è tra le scelte", () => {
    const seen = new Set<string>();
    for (let d = 1; d <= 28; d++) {
      const p = pickDaily(`2026-11-${String(d).padStart(2, "0")}`, ALL_BANK_ITEMS);
      seen.add(p.question);
      expect(p.choices).toContain(p.correct);
      expect(new Set(p.choices).size).toBe(p.choices.length);
    }
    expect(seen.size).toBeGreaterThan(20);
  });
  it("rifiuta banche vuote", () => {
    expect(() => pickDaily("2026-11-01", {})).toThrow();
  });
});

describe("publicDaily", () => {
  it("non contiene la risposta giusta come campo", () => {
    const pub = publicDaily(pickDaily("2026-11-01", BANKS));
    expect(Object.keys(pub).sort()).toEqual(["choices", "question"]);
  });
});

describe("checkDaily", () => {
  it("riconosce la risposta giusta e quella sbagliata", () => {
    const p = pickDaily("2026-11-01", BANKS);
    expect(checkDaily(p, p.correct)).toBe(true);
    expect(checkDaily(p, p.choices.find((c) => c !== p.correct)!)).toBe(false);
    expect(checkDaily(p, "qualcosa di inventato")).toBe(false);
  });
});

describe("XP della sfida", () => {
  it("un evento solo per giorno: il riferimento è la data", () => {
    expect(dailyXpEvent("2026-11-01", true)).toEqual({ kind: "daily", amount: DAILY_XP, refId: "2026-11-01" });
    expect(dailyXpEvent("2026-11-01", false)).toEqual({ kind: "daily_miss", amount: 0, refId: "2026-11-01" });
  });
  it("lo stesso giorno produce sempre la stessa chiave (il vincolo xp_once blocca il doppione)", () => {
    const a = dailyXpEvent("2026-11-01", true);
    const b = dailyXpEvent("2026-11-01", true);
    expect(`${a.kind}|${a.refId}`).toBe(`${b.kind}|${b.refId}`);
  });
});

describe("dailyStreak", () => {
  it("conta i giorni di fila fino a oggi", () => {
    expect(dailyStreak(["2026-11-03", "2026-11-02", "2026-11-01"], "2026-11-03")).toBe(3);
  });
  it("se oggi manca ma ieri c'è, la serie è ancora viva", () => {
    expect(dailyStreak(["2026-11-02", "2026-11-01"], "2026-11-03")).toBe(2);
  });
  it("si rompe con un giorno saltato", () => {
    expect(dailyStreak(["2026-11-03", "2026-11-01"], "2026-11-03")).toBe(1);
    expect(dailyStreak(["2026-11-01"], "2026-11-03")).toBe(0);
  });
  it("ignora doppioni e ordine", () => {
    expect(dailyStreak(["2026-11-01", "2026-11-02", "2026-11-02"], "2026-11-02")).toBe(2);
    expect(dailyStreak([], "2026-11-02")).toBe(0);
  });
  it("passa bene da un mese all'altro", () => {
    expect(dailyStreak(["2026-12-01", "2026-11-30", "2026-11-29"], "2026-12-01")).toBe(3);
  });
});
