import { describe, expect, it } from "vitest";
import { isAppMode, themeColorFor, THEME_COLORS } from "./app-mode";

const mq = (matching: string[]) => (q: string) => ({ matches: matching.includes(q) });

describe("modalità app", () => {
  it("riconosce l'app installata (standalone, schermo intero, barra minima)", () => {
    expect(isAppMode(mq(["(display-mode: standalone)"]))).toBe(true);
    expect(isAppMode(mq(["(display-mode: fullscreen)"]))).toBe(true);
    expect(isAppMode(mq(["(display-mode: minimal-ui)"]))).toBe(true);
  });
  it("nel browser normale non è modalità app", () => {
    expect(isAppMode(mq(["(display-mode: browser)"]))).toBe(false);
  });
  it("riconosce l'iPhone con «Aggiungi a Home» (navigator.standalone)", () => {
    expect(isAppMode(mq([]), true)).toBe(true);
    expect(isAppMode(mq([]), false)).toBe(false);
  });
});

describe("colore della barra di stato", () => {
  it("chiaro e scuro hanno il loro colore", () => {
    expect(themeColorFor("light", true)).toBe(THEME_COLORS.light);
    expect(themeColorFor("dark", false)).toBe(THEME_COLORS.dark);
  });
  it("«sistema» segue il dispositivo", () => {
    expect(themeColorFor("system", true)).toBe(THEME_COLORS.dark);
    expect(themeColorFor("system", false)).toBe(THEME_COLORS.light);
  });
});
