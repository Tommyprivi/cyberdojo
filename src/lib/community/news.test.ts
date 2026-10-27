import { describe, expect, it } from "vitest";
import { isNewsVersion } from "./news";

describe("isNewsVersion", () => {
  it("accetta id di annunci", () => {
    expect(isNewsVersion("2026-10-26-grande")).toBe(true);
    expect(isNewsVersion("db-2026-11-01-x-ab12")).toBe(true);
  });
  it("rifiuta vuoti, troppo lunghi e caratteri strani", () => {
    for (const v of ["", "a b", "<x>", "x".repeat(81), null, 3]) expect(isNewsVersion(v)).toBe(false);
  });
});
