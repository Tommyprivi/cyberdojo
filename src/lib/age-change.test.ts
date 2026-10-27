import { describe, expect, it } from "vitest";
import { checkAgeChange, createAgeChangeLimiter } from "./age-change";

describe("checkAgeChange", () => {
  it("rifiuta una fascia che non esiste", () => {
    expect(checkAgeChange("14-17", "10-13", true)).toEqual({ ok: false, error: "Scegli una fascia d'età dall'elenco." });
    expect(checkAgeChange("14-17", "", true).ok).toBe(false);
  });

  it("senza la spunta di conferma non cambia niente", () => {
    const r = checkAgeChange("14-17", "18-25", false);
    expect(r.ok).toBe(false);
  });

  it("la stessa fascia non è un cambio", () => {
    expect(checkAgeChange("26-40", "26-40", true)).toEqual({ ok: true, changed: false, changesGroup: false });
  });

  it("dentro lo stesso gruppo (adulti) il social non si azzera", () => {
    expect(checkAgeChange("18-25", "26-40", true)).toEqual({ ok: true, changed: true, changesGroup: false });
  });

  it("da ragazzo ad adulto e viceversa cambia gruppo: il social si azzera", () => {
    expect(checkAgeChange("14-17", "18-25", true)).toEqual({ ok: true, changed: true, changesGroup: true });
    expect(checkAgeChange("41+", "14-17", true)).toEqual({ ok: true, changed: true, changesGroup: true });
  });

  it("senza fascia attuale (profilo incompleto) è un cambio che azzera il social", () => {
    expect(checkAgeChange(null, "18-25", true)).toEqual({ ok: true, changed: true, changesGroup: true });
  });
});

describe("limite ai cambi di fascia", () => {
  it("al massimo 3 cambi in un'ora per persona", () => {
    const lim = createAgeChangeLimiter(3, 60 * 60_000);
    const t = 1_000_000;
    expect(lim.allow("a", t)).toBe(true);
    expect(lim.allow("a", t + 1)).toBe(true);
    expect(lim.allow("a", t + 2)).toBe(true);
    expect(lim.allow("a", t + 3)).toBe(false);
    expect(lim.allow("b", t + 3)).toBe(true);
    expect(lim.allow("a", t + 60 * 60_000 + 10)).toBe(true);
  });
});
