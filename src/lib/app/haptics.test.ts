import { describe, expect, it } from "vitest";
import { HAPTIC_PATTERNS, parseHapticsSetting, pickVibration } from "./haptics";

const ok = { enabled: true, supported: true, reducedMotion: false };

describe("vibrazione", () => {
  it("ogni evento ha uno schema breve (sotto mezzo secondo in tutto)", () => {
    for (const [name, p] of Object.entries(HAPTIC_PATTERNS)) {
      const total = Array.isArray(p) ? p.reduce((a, b) => a + b, 0) : p;
      expect(total, name).toBeGreaterThan(0);
      expect(total, name).toBeLessThan(500);
    }
  });
  it("risposta sbagliata e lezione completata si distinguono", () => {
    expect(pickVibration("wrong", ok)).not.toEqual(pickVibration("right", ok));
    expect(pickVibration("complete", ok)).not.toEqual(pickVibration("right", ok));
  });
  it("niente vibrazione se spenta, non supportata o con «riduci movimento»", () => {
    expect(pickVibration("right", { ...ok, enabled: false })).toBeNull();
    expect(pickVibration("right", { ...ok, supported: false })).toBeNull();
    expect(pickVibration("right", { ...ok, reducedMotion: true })).toBeNull();
  });
  it("l'impostazione salvata: accesa se manca o è illeggibile, spenta solo con «1»", () => {
    expect(parseHapticsSetting(null)).toBe(true);
    expect(parseHapticsSetting("0")).toBe(true);
    expect(parseHapticsSetting("1")).toBe(false);
    expect(parseHapticsSetting("boh")).toBe(true);
  });
});
