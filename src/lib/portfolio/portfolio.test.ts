import { describe, expect, it } from "vitest";
import { canEnablePortfolio, isValidPublicId, parsePublicRow, portfolioPath } from "./portfolio";

describe("canEnablePortfolio", () => {
  it("solo adulti con soprannome", () => {
    expect(canEnablePortfolio({ ageGroup: "adulti", hasNickname: true })).toEqual({ ok: true });
  });
  it("i minori non possono renderlo pubblico", () => {
    const r = canEnablePortfolio({ ageGroup: "minori", hasNickname: true });
    expect(r.ok).toBe(false);
  });
  it("senza fascia d'età o senza soprannome no", () => {
    expect(canEnablePortfolio({ ageGroup: null, hasNickname: true }).ok).toBe(false);
    expect(canEnablePortfolio({ ageGroup: "adulti", hasNickname: false }).ok).toBe(false);
  });
});

describe("isValidPublicId / portfolioPath", () => {
  it("accetta solo identificativi nel formato del Social", () => {
    expect(isValidPublicId("abcdefghjkmn")).toBe(true);
    expect(isValidPublicId("abc")).toBe(false);
    expect(isValidPublicId("ABCDEFGHJKMN")).toBe(false);
    expect(isValidPublicId("abcdefghjkm/")).toBe(false);
    expect(isValidPublicId("abcdefghjkm0")).toBe(false);
  });
  it("costruisce il percorso", () => {
    expect(portfolioPath("abcdefghjkmn")).toBe("/p/abcdefghjkmn");
  });
});

describe("parsePublicRow", () => {
  const row = {
    nickname: "Ninja",
    avatar: "fiamma",
    xp: 700,
    certificates: [{ course: "F", belt: "gialla", issued_at: "2026-10-01T10:00:00", code: "ABCD-1234" }],
  };
  it("legge cintura e livello dagli XP", () => {
    const p = parsePublicRow(row)!;
    expect(p.nickname).toBe("Ninja");
    expect(p.avatar).toBe("fiamma");
    expect(p.belt?.xp).toBe(700);
    expect(p.belt?.levelName).toBe("Analista");
    expect(p.certificates[0].code).toBe("ABCD-1234");
  });
  it("xp nullo: niente cintura", () => {
    expect(parsePublicRow({ ...row, xp: null })!.belt).toBeNull();
  });
  it("avatar sconosciuto diventa il Sensei, certificati malformati scartati", () => {
    const p = parsePublicRow({ ...row, avatar: "foto.png", certificates: [{ course: "F" }, null, row.certificates[0]] })!;
    expect(p.avatar).toBe("sensei");
    expect(p.certificates).toHaveLength(1);
  });
  it("riga vuota: null", () => {
    expect(parsePublicRow(undefined)).toBeNull();
    expect(parsePublicRow({ nickname: null, avatar: "x", xp: 1, certificates: [] })).toBeNull();
  });
});
