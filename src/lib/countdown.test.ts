import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readCountdown } from "./countdown";
import { countdownState, formatRemaining } from "./countdown-format";

const tmp = (content: string) => {
  const file = path.join(mkdtempSync(path.join(tmpdir(), "cd-")), "countdown.json");
  writeFileSync(file, content);
  return file;
};

describe("formatRemaining", () => {
  it("mostra minuti e secondi sotto l'ora", () => {
    expect(formatRemaining(59 * 60_000 + 9_000)).toBe("59:09");
    expect(formatRemaining(5_000)).toBe("0:05");
  });
  it("mostra anche le ore da un'ora in su", () => {
    expect(formatRemaining(3_600_000)).toBe("1:00:00");
    expect(formatRemaining(3_725_000)).toBe("1:02:05");
  });
  it("non va mai sotto zero", () => {
    expect(formatRemaining(-500)).toBe("0:00");
  });
});

describe("readCountdown", () => {
  it("legge data e testo", () => {
    const c = readCountdown(tmp(JSON.stringify({ endsAt: "2026-10-26T20:00:00Z", label: "novità sui social" })));
    expect(c).toEqual({ endsAt: Date.parse("2026-10-26T20:00:00Z"), label: "novità sui social" });
  });
  it("senza file, con data non valida o vuota non mostra niente", () => {
    expect(readCountdown(path.join(tmpdir(), "non-esiste.json"))).toBeNull();
    expect(readCountdown(tmp("non è json"))).toBeNull();
    expect(readCountdown(tmp(JSON.stringify({ endsAt: "boh" })))).toBeNull();
    expect(readCountdown(tmp(JSON.stringify({ endsAt: null })))).toBeNull();
  });
});

describe("countdownState", () => {
  const end = 1_000_000;
  it("conta alla rovescia, poi avvisa, poi sparisce", () => {
    expect(countdownState(end, end - 1)).toBe("running");
    expect(countdownState(end, end)).toBe("done");
    expect(countdownState(end, end + 60 * 60_000)).toBe("done");
    expect(countdownState(end, end + 2 * 60 * 60_000 + 1)).toBe("hidden");
  });
});
