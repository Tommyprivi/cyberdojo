import { describe, expect, it } from "vitest";
import { canSeeClass, formatLastDay, isAnnouncementStaffRole, parseRoleArg, toProgressRow } from "./rules";

describe("parseRoleArg (script aggiungi-staff)", () => {
  it("senza opzione il ruolo è staff", () => {
    expect(parseRoleArg(["node", "s", "a@b.it"])).toEqual({ ok: true, role: "staff" });
  });
  it("accetta --ruolo docente e --ruolo staff", () => {
    expect(parseRoleArg(["a@b.it", "--ruolo", "docente"])).toEqual({ ok: true, role: "docente" });
    expect(parseRoleArg(["--ruolo", "staff", "a@b.it"])).toEqual({ ok: true, role: "staff" });
    expect(parseRoleArg(["--ruolo=docente"])).toEqual({ ok: true, role: "docente" });
  });
  it("rifiuta ruoli sconosciuti, anche admin, e valori mancanti", () => {
    expect(parseRoleArg(["--ruolo", "admin"]).ok).toBe(false);
    expect(parseRoleArg(["--ruolo", "boh"]).ok).toBe(false);
    expect(parseRoleArg(["a@b.it", "--ruolo"]).ok).toBe(false);
  });
});

describe("canSeeClass", () => {
  it("serve il ruolo docente (o admin) E essere il creatore del gruppo", () => {
    expect(canSeeClass({ role: "docente", isOwner: true })).toBe(true);
    expect(canSeeClass({ role: "admin", isOwner: true })).toBe(true);
    expect(canSeeClass({ role: "docente", isOwner: false })).toBe(false);
  });
  it("staff semplice, nessun ruolo o ruolo strano non bastano", () => {
    expect(canSeeClass({ role: "staff", isOwner: true })).toBe(false);
    expect(canSeeClass({ role: null, isOwner: true })).toBe(false);
    expect(canSeeClass({ role: "x", isOwner: true })).toBe(false);
  });
});

describe("isAnnouncementStaffRole", () => {
  it("il docente NON scrive gli annunci", () => {
    expect(isAnnouncementStaffRole("staff")).toBe(true);
    expect(isAnnouncementStaffRole("admin")).toBe(true);
    expect(isAnnouncementStaffRole("docente")).toBe(false);
  });
});

describe("formatLastDay", () => {
  const now = new Date("2026-03-15T10:00:00Z");
  it("gestisce vuoto, oggi, ieri, qualche giorno, data", () => {
    expect(formatLastDay(null, now)).toBe("mai");
    expect(formatLastDay("2026-03-15", now)).toBe("oggi");
    expect(formatLastDay("2026-03-14", now)).toBe("ieri");
    expect(formatLastDay("2026-03-12", now)).toBe("3 giorni fa");
    expect(formatLastDay("2026-02-01", now)).toBe("1/2/2026");
  });
  it("un valore non valido o nel futuro non rompe nulla", () => {
    expect(formatLastDay("boh", now)).toBe("mai");
    expect(formatLastDay("2026-03-20", now)).toBe("oggi");
  });
});

describe("toProgressRow", () => {
  it("tiene solo soprannome, lezioni, XP e ultimo giorno; scarta ogni altro campo", () => {
    const row = toProgressRow({ member_no: 2, nickname: "Tigre", lessons: 5, xp: 120, last_day: "2026-03-14", email: "x@y.it", answer: "segreto" });
    expect(row).toEqual({ no: 2, nickname: "Tigre", lessons: 5, xp: 120, lastDay: "2026-03-14" });
    expect(Object.keys(row)).not.toContain("email");
  });
  it("normalizza numeri mancanti o negativi", () => {
    expect(toProgressRow({ member_no: 1, nickname: "A", lessons: -3, xp: null, last_day: null })).toEqual({ no: 1, nickname: "A", lessons: 0, xp: 0, lastDay: null });
  });
});
