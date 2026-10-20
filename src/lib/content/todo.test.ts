import { describe, expect, it } from "vitest";
import { parseTodo } from "./todo";

describe("parseTodo", () => {
  it("raggruppa per titolo e riconosce le etichette", () => {
    const r = parseTodo("# T\n\nLegenda: **[fatto]**.\n\n## A\n- [fatto] uno\n- [tuo] due **forte**\n- [x] tre\n- senza etichetta\n\n## Vuoto\n");
    expect(r.intro).toContain("Legenda");
    expect(r.groups).toHaveLength(1);
    expect(r.groups[0].items).toEqual([
      { label: "fatto", text: "uno" },
      { label: "tuo", text: "due forte" },
      { label: "fatto", text: "tre" },
      { label: null, text: "senza etichetta" },
    ]);
  });
});
