import { describe, expect, it } from "vitest";
import raw from "../../../content/events.json";
import { eventStatus, parseEvents } from "./events";

const e = { startsAt: "2026-11-20T18:00:00+01:00", endsAt: "2026-11-20T19:30:00+01:00" };

describe("stato evento", () => {
  it("presto, in corso, finito", () => {
    expect(eventStatus(e, Date.parse("2026-11-20T16:00:00Z"))).toBe("presto");
    expect(eventStatus(e, Date.parse("2026-11-20T17:00:00Z"))).toBe("in-corso"); // 18:00 locali = 17:00Z: inizio incluso
    expect(eventStatus(e, Date.parse("2026-11-20T18:30:00Z"))).toBe("finito"); // fine esclusa
  });
});

describe("file eventi", () => {
  it("quello del progetto è valido e marcato come esempio", () => {
    const list = parseEvents(raw, Date.now());
    expect(list.length).toBe(2);
    expect(list.every((x) => x.example === true && x.title.startsWith("ESEMPIO"))).toBe(true);
  });
  it("rifiuta formati sbagliati e scarta fini prima degli inizi", () => {
    expect(() => parseEvents({ events: [{ id: "A", title: "x" }] }, 0)).toThrow();
    const bad = { events: [{ id: "x", title: "t", description: "", startsAt: e.endsAt, endsAt: e.startsAt }] };
    expect(parseEvents(bad, 0)).toEqual([]);
  });
});
