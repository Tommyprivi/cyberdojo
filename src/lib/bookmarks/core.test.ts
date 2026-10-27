import { describe, expect, it } from "vitest";
import { BOOKMARK_MAX, decideToggle, parseBookmarkInput } from "./core";

describe("parseBookmarkInput", () => {
  it("accetta una lezione valida e una schermata intera", () => {
    expect(parseBookmarkInput("A.01.001", 2, 5)).toEqual({ ok: true, lessonId: "A.01.001", screen: 2 });
  });
  it("rifiuta un id lezione malformato o non testo", () => {
    expect(parseBookmarkInput("../x", 0, 5).ok).toBe(false);
    expect(parseBookmarkInput(7, 0, 5).ok).toBe(false);
  });
  it("rifiuta schermate negative, decimali, fuori dal numero reale o non numeri", () => {
    expect(parseBookmarkInput("A.01.001", -1, 5).ok).toBe(false);
    expect(parseBookmarkInput("A.01.001", 1.5, 5).ok).toBe(false);
    expect(parseBookmarkInput("A.01.001", 5, 5).ok).toBe(false);
    expect(parseBookmarkInput("A.01.001", "2", 5).ok).toBe(false);
    expect(parseBookmarkInput("A.01.001", Number.NaN, 5).ok).toBe(false);
  });
});

describe("decideToggle", () => {
  it("se esiste già lo toglie, anche a limite raggiunto", () => {
    expect(decideToggle(true, BOOKMARK_MAX)).toBe("remove");
  });
  it("se non esiste lo aggiunge sotto il limite", () => {
    expect(decideToggle(false, BOOKMARK_MAX - 1)).toBe("add");
  });
  it("rifiuta di aggiungere oltre il limite di 200", () => {
    expect(BOOKMARK_MAX).toBe(200);
    expect(decideToggle(false, BOOKMARK_MAX)).toBe("limit");
  });
});
