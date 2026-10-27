import { describe, expect, it } from "vitest";
import { BOX_DAYS, dueNow, nextReview } from "./leitner";

const now = new Date("2026-10-27T10:00:00Z");
const days = (n: number) => new Date(now.getTime() + n * 86_400_000);

describe("ripasso a scatole", () => {
  it("le scatole sono 1, 3, 7, 21 giorni", () => {
    expect(BOX_DAYS).toEqual([1, 3, 7, 21]);
  });
  it("se sbagli torni alla scatola 1, domani", () => {
    expect(nextReview(3, false, now)).toEqual({ box: 1, dueAt: days(1) });
  });
  it("se indovini sali di scatola", () => {
    expect(nextReview(1, true, now)).toEqual({ box: 2, dueAt: days(3) });
    expect(nextReview(3, true, now)).toEqual({ box: 4, dueAt: days(21) });
  });
  it("l'ultima scatola resta tale", () => {
    expect(nextReview(4, true, now)).toEqual({ box: 4, dueAt: days(21) });
  });
  it("una scatola fuori scala viene riportata nei limiti", () => {
    expect(nextReview(99, true, now).box).toBe(4);
    expect(nextReview(0, true, now).box).toBe(2);
  });
  it("sono da ripassare quelle scadute, le più vecchie prima, con un tetto", () => {
    const items = [
      { itemId: "a", dueAt: days(2) },
      { itemId: "b", dueAt: days(-2) },
      { itemId: "c", dueAt: days(-5) },
      { itemId: "d", dueAt: now },
    ];
    expect(dueNow(items, now, 2).map((i) => i.itemId)).toEqual(["c", "b"]);
    expect(dueNow(items, now, 10).map((i) => i.itemId)).toEqual(["c", "b", "d"]);
  });
});
