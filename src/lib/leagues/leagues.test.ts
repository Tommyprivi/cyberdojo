import { describe, expect, it } from "vitest";
import { DIVISIONS, divisionFor, divisionIndex, movement, movementMessage, xpToNext } from "./divisions";

describe("divisioni", () => {
  it("sono sei, nell'ordine giusto e con soglie crescenti", () => {
    expect(DIVISIONS.map((d) => d.name)).toEqual(["Bronzo", "Argento", "Oro", "Zaffiro", "Rubino", "Diamante"]);
    const m = DIVISIONS.map((d) => d.minXp);
    expect(m).toEqual([...m].sort((a, b) => a - b));
  });
  it("si calcolano dagli XP della settimana", () => {
    expect(divisionFor(0).id).toBe("bronzo");
    expect(divisionFor(49).id).toBe("bronzo");
    expect(divisionFor(50).id).toBe("argento");
    expect(divisionFor(450).id).toBe("diamante");
    expect(divisionFor(99999).id).toBe("diamante");
    expect(divisionIndex(-5)).toBe(0);
  });
  it("promozione, retrocessione e conferma", () => {
    expect(movement(1, 2)).toBe("promosso");
    expect(movement(3, 1)).toBe("retrocesso");
    expect(movement(2, 2)).toBe("confermato");
    expect(movementMessage(1, 2)).toContain("Argento a Oro");
  });
  it("XP mancanti alla successiva", () => {
    expect(xpToNext(40)).toMatchObject({ missing: 10 });
    expect(xpToNext(500)).toBeNull();
  });
});
