import { describe, expect, it } from "vitest";
import {
  EMOJIS,
  PHRASES,
  createReactionLimiter,
  isAnnouncementRef,
  isEmoji,
  isPhraseKey,
  summarize,
} from "./reactions";

describe("elenchi chiusi", () => {
  it("emoji ammesse: solo le sei", () => {
    expect([...EMOJIS]).toEqual(["👍", "🔥", "🎉", "❤️", "🤯", "👏"]);
    expect(isEmoji("🔥")).toBe(true);
    expect(isEmoji("💩")).toBe(false);
    expect(isEmoji("<script>")).toBe(false);
    expect(isEmoji(5)).toBe(false);
  });
  it("frasi ammesse: solo le sette chiavi, con testo italiano", () => {
    expect(PHRASES.map((p) => p.key)).toEqual(["grazie", "bellissimo", "non-vedo-lora", "ottimo-lavoro", "ho-una-domanda", "funziona-bene", "ho-unidea"]);
    expect(PHRASES.every((p) => p.text.length > 3)).toBe(true);
    expect(isPhraseKey("grazie")).toBe(true);
    expect(isPhraseKey("ciao")).toBe(false);
    expect(isPhraseKey("Grazie")).toBe(false);
  });
  it("id annuncio: solo caratteri sicuri", () => {
    expect(isAnnouncementRef("2026-10-26-grande")).toBe(true);
    expect(isAnnouncementRef("db-2026-11-01-x-ab12")).toBe(true);
    expect(isAnnouncementRef("a b")).toBe(false);
    expect(isAnnouncementRef("'; drop")).toBe(false);
    expect(isAnnouncementRef("")).toBe(false);
  });
});

describe("summarize", () => {
  it("dà zero per le voci senza conteggio e segna le proprie", () => {
    const s = summarize("a1", [{ announcement_id: "a1", emoji: "🔥", n: 3 }, { announcement_id: "b", emoji: "👍", n: 9 }], [{ announcement_id: "a1", phrase_key: "grazie", n: 2 }], { emoji: "🔥", phrases: ["grazie"] });
    expect(s.reactions.find((r) => r.emoji === "🔥")).toEqual({ emoji: "🔥", n: 3, mine: true });
    expect(s.reactions.find((r) => r.emoji === "👍")).toEqual({ emoji: "👍", n: 0, mine: false });
    expect(s.phrases.find((p) => p.key === "grazie")).toMatchObject({ n: 2, mine: true });
    expect(s.phrases.find((p) => p.key === "bellissimo")).toMatchObject({ n: 0, mine: false });
  });
  it("ignora voci fuori elenco", () => {
    const s = summarize("a1", [{ announcement_id: "a1", emoji: "💩", n: 3 }], [], { emoji: null, phrases: [] });
    expect(s.reactions.every((r) => r.n === 0)).toBe(true);
  });
});

describe("limitatore", () => {
  it("blocca dopo 20 azioni in un minuto e poi riparte", () => {
    const tooMany = createReactionLimiter();
    for (let i = 0; i < 20; i++) expect(tooMany("u", 1000 + i)).toBe(false);
    expect(tooMany("u", 1100)).toBe(true);
    expect(tooMany("altro", 1100)).toBe(false);
    expect(tooMany("u", 1000 + 61_000)).toBe(false);
  });
});
