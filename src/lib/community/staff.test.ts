import { describe, expect, it } from "vitest";
import { isStaffUser, parseStaffEmails } from "./staff";

describe("parseStaffEmails", () => {
  it("separa per virgola, toglie spazi e maiuscole, scarta i vuoti", () => {
    expect(parseStaffEmails(" A@x.it, b@Y.it ,, ")).toEqual(["a@x.it", "b@y.it"]);
  });
  it("senza variabile dà elenco vuoto", () => {
    expect(parseStaffEmails(undefined)).toEqual([]);
    expect(parseStaffEmails("")).toEqual([]);
  });
});

describe("isStaffUser", () => {
  const base = { hasRole: false, email: "a@x.it", emailVerified: true, staffEmails: "a@x.it" };
  it("è staff con la riga nel database", () => {
    expect(isStaffUser({ ...base, hasRole: true, staffEmails: "" })).toBe(true);
  });
  it("è staff con email verificata in elenco (senza badare alle maiuscole)", () => {
    expect(isStaffUser({ ...base, email: "A@X.it" })).toBe(true);
  });
  it("NON è staff se l'email non è verificata", () => {
    expect(isStaffUser({ ...base, emailVerified: false })).toBe(false);
  });
  it("NON è staff se l'email non è in elenco o manca", () => {
    expect(isStaffUser({ ...base, email: "z@x.it" })).toBe(false);
    expect(isStaffUser({ ...base, email: null })).toBe(false);
  });
});
