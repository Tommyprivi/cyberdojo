import { describe, expect, it } from "vitest";
import { BELT_IDS } from "@/lib/content/schema";
import { filterByLevel, levelOfBelt, parseLevelFilter } from "./levels";

describe("livelli", () => {
  it("ogni cintura ha un livello", () => {
    for (const b of BELT_IDS) expect(["base", "medio", "avanzato"]).toContain(levelOfBelt(b));
  });
  it("mappa le cinture come documentato", () => {
    expect(levelOfBelt("bianca")).toBe("base");
    expect(levelOfBelt("gialla")).toBe("base");
    expect(levelOfBelt("arancione")).toBe("medio");
    expect(levelOfBelt("verde")).toBe("medio");
    expect(levelOfBelt("blu")).toBe("avanzato");
    expect(levelOfBelt("marrone")).toBe("avanzato");
    expect(levelOfBelt("nera")).toBe("avanzato");
  });
  it("una cintura sconosciuta ricade su base", () => {
    expect(levelOfBelt("rosa")).toBe("base");
  });
  it("legge il filtro dall'indirizzo e scarta i valori strani", () => {
    expect(parseLevelFilter("medio")).toBe("medio");
    expect(parseLevelFilter(["avanzato", "base"])).toBe("avanzato");
    expect(parseLevelFilter("tutti")).toBeNull();
    expect(parseLevelFilter(undefined)).toBeNull();
    expect(parseLevelFilter("<script>")).toBeNull();
  });
  it("filtra per livello, senza filtro lascia tutto", () => {
    const l = [{ belt: "bianca" }, { belt: "verde" }, { belt: "blu" }];
    expect(filterByLevel(l, null)).toHaveLength(3);
    expect(filterByLevel(l, "medio")).toEqual([{ belt: "verde" }]);
  });
});
