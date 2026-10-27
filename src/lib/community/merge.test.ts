import { describe, expect, it } from "vitest";
import { mergeAnnouncements, type MergedAnnouncement } from "./merge";

const a = (id: string, date: string, extra: Partial<MergedAnnouncement> = {}): MergedAnnouncement => ({
  id,
  date,
  title: id,
  summary: "",
  body: "",
  tags: [],
  source: "file",
  pinned: false,
  ...extra,
});

describe("mergeAnnouncements", () => {
  it("ordina per data decrescente unendo le due fonti", () => {
    const r = mergeAnnouncements([a("f1", "2026-10-21"), a("f2", "2026-10-26")], [a("db-1", "2026-10-30", { source: "db" })]);
    expect(r.map((x) => x.id)).toEqual(["db-1", "f2", "f1"]);
  });
  it("a parità di data ordina per id decrescente", () => {
    expect(mergeAnnouncements([a("a", "2026-10-21"), a("b", "2026-10-21")], []).map((x) => x.id)).toEqual(["b", "a"]);
  });
  it("gli annunci fissati vanno in cima", () => {
    const r = mergeAnnouncements([a("f1", "2026-10-26")], [a("db-old", "2026-01-01", { source: "db", pinned: true })]);
    expect(r[0].id).toBe("db-old");
  });
  it("se un id collide vince quello del database", () => {
    const r = mergeAnnouncements([a("x", "2026-10-21")], [a("x", "2026-10-22", { source: "db" })]);
    expect(r).toHaveLength(1);
    expect(r[0].source).toBe("db");
  });
});
