import { describe, expect, it } from "vitest";
import { modulesToProve, PER_MODULE, recommendModule, sampleModules } from "./placement";

describe("test d'ingresso", () => {
  it("campiona al massimo 5 moduli, sparsi, in ordine, con primo e ultimo", () => {
    expect(sampleModules([1, 2, 3], 5)).toEqual([1, 2, 3]);
    const s = sampleModules([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
    expect(s).toHaveLength(5);
    expect(s[0]).toBe(1);
    expect(s[4]).toBe(10);
    expect([...s].sort((a, b) => a - b)).toEqual(s);
  });
  it("consiglia il primo modulo campionato non del tutto noto", () => {
    const r = recommendModule([
      { module: 1, correct: PER_MODULE },
      { module: 4, correct: 1 },
      { module: 8, correct: 0 },
    ]);
    expect(r).toEqual({ module: 4, allKnown: false });
  });
  it("parte dal primo modulo se non sa niente", () => {
    expect(recommendModule([{ module: 1, correct: 0 }, { module: 5, correct: 2 }]).module).toBe(1);
  });
  it("se sa tutto, propone l'ultimo modulo testato", () => {
    expect(recommendModule([{ module: 1, correct: 2 }, { module: 9, correct: 2 }])).toEqual({ module: 9, allKnown: true });
  });
  it("senza risposte propone il modulo 1", () => {
    expect(recommendModule([])).toEqual({ module: 1, allKnown: false });
  });
  it("rimanda alla prova dei moduli precedenti, non regala sblocchi", () => {
    expect(modulesToProve([1, 2, 3, 4, 5], 4)).toEqual([1, 2, 3]);
    expect(modulesToProve([1, 2, 3], 1)).toEqual([]);
  });
});
