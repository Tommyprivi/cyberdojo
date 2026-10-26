import { describe, expect, it } from "vitest";
import { SOUNDS, soundStore } from "./sounds";

describe("suoni", () => {
  it("ogni suono ha note valide, corte e a basso volume", () => {
    for (const [name, notes] of Object.entries(SOUNDS)) {
      expect(notes.length, name).toBeGreaterThan(0);
      for (const n of notes) {
        expect(n.f).toBeGreaterThan(100);
        expect(n.f).toBeLessThan(4000);
        expect(n.at).toBeGreaterThanOrEqual(0);
        expect(n.dur).toBeGreaterThan(0);
        expect(n.at + n.dur).toBeLessThan(1.5);
        expect(n.gain ?? 0.07).toBeLessThanOrEqual(0.1);
      }
    }
  });

  it("il tocco è più breve e più piano della festa", () => {
    const length = (notes: { at: number; dur: number }[]) => Math.max(...notes.map((n) => n.at + n.dur));
    expect(length(SOUNDS.tap)).toBeLessThan(length(SOUNDS.celebrate));
  });

  it("senza browser lo stato di partenza è «suoni accesi»", () => {
    expect(soundStore.getServerSnapshot()).toBe(true);
    expect(soundStore.getSnapshot()).toBe(true);
  });
});
