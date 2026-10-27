import { describe, expect, it } from "vitest";
import {
  canAccept,
  canAnswer,
  canCreateDuel,
  DUEL_HOURS,
  DUEL_QUESTIONS,
  duelExpiry,
  duelOutcome,
  effectiveStatus,
  MAX_OPEN_DUELS,
  opponentScoreToShow,
  pickDuelQuestions,
  timeLeftLabel,
  winnerXp,
} from "./rules";

const pool = Array.from({ length: 30 }, (_, i) => ({ id: `b#${i}`, q: `Domanda ${i}?`, ok: "giusta", no: ["a", "b", "c"] }));
const t0 = new Date("2026-03-01T10:00:00Z");

describe("esito", () => {
  it("vince il punteggio più alto, parità = pareggio", () => {
    expect(duelOutcome(7, 5)).toBe("win");
    expect(duelOutcome(4, 9)).toBe("loss");
    expect(duelOutcome(6, 6)).toBe("draw");
  });
});

describe("scadenza", () => {
  it("scade dopo 24 ore", () => {
    expect(duelExpiry(t0).getTime() - t0.getTime()).toBe(DUEL_HOURS * 3_600_000);
  });
  it("in corso o in attesa diventa expired dopo la scadenza; chiuso resta chiuso", () => {
    const exp = duelExpiry(t0);
    const before = new Date(exp.getTime() - 1);
    expect(effectiveStatus("active", exp, before)).toBe("active");
    expect(effectiveStatus("active", exp, exp)).toBe("expired");
    expect(effectiveStatus("pending", exp, new Date(exp.getTime() + 5))).toBe("expired");
    expect(effectiveStatus("done", exp, new Date(exp.getTime() + 5))).toBe("done");
    expect(effectiveStatus("declined", exp, new Date(exp.getTime() + 5))).toBe("declined");
  });
});

describe("limiti", () => {
  it("al massimo 5 duelli aperti", () => {
    expect(canCreateDuel(MAX_OPEN_DUELS - 1, false).ok).toBe(true);
    expect(canCreateDuel(MAX_OPEN_DUELS, false).ok).toBe(false);
  });
  it("non due duelli aperti con lo stesso amico", () => {
    expect(canCreateDuel(0, true).ok).toBe(false);
  });
});

describe("chi può fare cosa", () => {
  it("lo sfidante gioca subito, lo sfidato solo dopo aver accettato", () => {
    expect(canAnswer("pending", true, false)).toBe(true);
    expect(canAnswer("pending", false, false)).toBe(false);
    expect(canAnswer("active", false, false)).toBe(true);
  });
  it("non si risponde due volte né a duello chiuso", () => {
    expect(canAnswer("active", true, true)).toBe(false);
    expect(canAnswer("expired", true, false)).toBe(false);
    expect(canAnswer("done", false, false)).toBe(false);
    expect(canAnswer("declined", false, false)).toBe(false);
  });
  it("accetta solo lo sfidato, solo se in attesa", () => {
    expect(canAccept("pending", false)).toBe(true);
    expect(canAccept("pending", true)).toBe(false);
    expect(canAccept("active", false)).toBe(false);
    expect(canAccept("expired", false)).toBe(false);
  });
});

describe("privacy del punteggio", () => {
  it("non si vede il punteggio dell'avversario prima di aver finito", () => {
    expect(opponentScoreToShow({ iFinished: false, status: "active", theirScore: 9 })).toBeNull();
    expect(opponentScoreToShow({ iFinished: false, status: "pending", theirScore: 9 })).toBeNull();
  });
  it("si vede dopo il proprio turno o a duello chiuso", () => {
    expect(opponentScoreToShow({ iFinished: true, status: "active", theirScore: 9 })).toBe(9);
    expect(opponentScoreToShow({ iFinished: false, status: "done", theirScore: 9 })).toBe(9);
    expect(opponentScoreToShow({ iFinished: false, status: "expired", theirScore: 9 })).toBe(9);
  });
  it("un punteggio assente resta assente", () => {
    expect(opponentScoreToShow({ iFinished: true, status: "active", theirScore: null })).toBeNull();
  });
});

describe("XP", () => {
  it("5 XP solo al vincitore a duello concluso", () => {
    expect(winnerXp("win", "done")).toBe(5);
    expect(winnerXp("draw", "done")).toBe(0);
    expect(winnerXp("loss", "done")).toBe(0);
    expect(winnerXp("win", "active")).toBe(0);
    expect(winnerXp(null, "done")).toBe(0);
  });
});

describe("domande dal seme", () => {
  it("10 domande, uguali per lo stesso seme, diverse con un altro", () => {
    const a = pickDuelQuestions(pool, "seme-1");
    expect(a).toHaveLength(DUEL_QUESTIONS);
    expect(pickDuelQuestions(pool, "seme-1")).toEqual(a);
    expect(pickDuelQuestions(pool, "seme-2").map((q) => q.id)).not.toEqual(a.map((q) => q.id));
  });
  it("niente domande doppie", () => {
    const ids = pickDuelQuestions(pool, "x").map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("con poche domande disponibili dà errore", () => {
    expect(() => pickDuelQuestions(pool.slice(0, 5), "x")).toThrow();
  });
});

describe("tempo che resta", () => {
  it("scrive ore e minuti in italiano", () => {
    expect(timeLeftLabel(new Date(t0.getTime() + 5 * 3_600_000), t0)).toBe("Scade tra 5 ore");
    expect(timeLeftLabel(new Date(t0.getTime() + 60_000), t0)).toBe("Scade tra 1 minuto");
    expect(timeLeftLabel(new Date(t0.getTime() + 40 * 60_000), t0)).toBe("Scade tra 40 minuti");
    expect(timeLeftLabel(t0, t0)).toBe("Scaduto");
  });
});
