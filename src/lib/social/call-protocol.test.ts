import { describe, expect, it } from "vitest";
import { buildIceServers, createRateLimiter, isValidIceUrl, SIGNAL_MAX_BYTES, validateSignal } from "./call-protocol";

describe("isValidIceUrl", () => {
  it("accetta solo stun:, turn: e turns:", () => {
    expect(isValidIceUrl("stun:stun.example.org:3478")).toBe(true);
    expect(isValidIceUrl("turn:turn.example.org:3478?transport=udp")).toBe(true);
    expect(isValidIceUrl("turns:turn.example.org:443?transport=tcp")).toBe(true);
  });
  it("scarta tutto il resto", () => {
    for (const u of ["http://x.org", "https://x.org", "javascript:alert(1)", "data:text/plain,a", "file:///etc/passwd", "ws://x.org", "", "stun:", "turn: x", "stun:a b"]) {
      expect(isValidIceUrl(u)).toBe(false);
    }
  });
  it("scarta indirizzi troppo lunghi o con caratteri di controllo", () => {
    expect(isValidIceUrl("stun:" + "a".repeat(300))).toBe(false);
    expect(isValidIceUrl("turn:x.org\n")).toBe(false);
  });
});

describe("buildIceServers", () => {
  it("senza variabili: solo i due STUN pubblici", () => {
    expect(buildIceServers({})).toEqual([{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }]);
  });
  it("con le tre variabili aggiunge il TURN", () => {
    const l = buildIceServers({ urls: "turn:t.example.org:3478, turns:t.example.org:443", username: "u", credential: "c" });
    expect(l).toHaveLength(2);
    expect(l[1]).toEqual({ urls: ["turn:t.example.org:3478", "turns:t.example.org:443"], username: "u", credential: "c" });
  });
  it("ignora il TURN se manca username o credenziale o indirizzi", () => {
    expect(buildIceServers({ urls: "turn:t.org:3478", username: "u" })).toHaveLength(1);
    expect(buildIceServers({ urls: "turn:t.org:3478", credential: "c" })).toHaveLength(1);
    expect(buildIceServers({ username: "u", credential: "c" })).toHaveLength(1);
  });
  it("scarta URL non validi e, se non resta nulla, niente TURN", () => {
    const l = buildIceServers({ urls: "http://evil.org, javascript:x, turn:ok.org:3478", username: "u", credential: "c" });
    expect(l[1]).toMatchObject({ urls: ["turn:ok.org:3478"] });
    expect(buildIceServers({ urls: "http://evil.org", username: "u", credential: "c" })).toHaveLength(1);
  });
});

describe("validateSignal", () => {
  const sid = "abcd1234efgh5678";
  it("accetta messaggi ben formati", () => {
    expect(validateSignal("hello", { sid }).ok).toBe(true);
    expect(validateSignal("bye", { sid }).ok).toBe(true);
    expect(validateSignal("offer", { sid, description: { type: "offer", sdp: "v=0\r\n" } }).ok).toBe(true);
    expect(validateSignal("answer", { sid, description: { type: "answer", sdp: "v=0\r\n" } }).ok).toBe(true);
    expect(validateSignal("ice", { sid, candidate: { candidate: "candidate:1 1 udp 1 1.2.3.4 5 typ host", sdpMid: "0", sdpMLineIndex: 0 } }).ok).toBe(true);
    expect(validateSignal("ice", { sid, candidate: null }).ok).toBe(true);
  });
  it("rifiuta tipi sconosciuti", () => {
    expect(validateSignal("chat", { sid }).ok).toBe(false);
    expect(validateSignal("", { sid }).ok).toBe(false);
    expect(validateSignal(undefined, { sid }).ok).toBe(false);
  });
  it("rifiuta payload non oggetto o senza sid valido", () => {
    expect(validateSignal("hello", null).ok).toBe(false);
    expect(validateSignal("hello", "x").ok).toBe(false);
    expect(validateSignal("hello", []).ok).toBe(false);
    expect(validateSignal("hello", { sid: "<script>" }).ok).toBe(false);
    expect(validateSignal("hello", {}).ok).toBe(false);
  });
  it("rifiuta offer/answer con descrizione del tipo sbagliato o mancante", () => {
    expect(validateSignal("offer", { sid, description: { type: "answer", sdp: "x" } }).ok).toBe(false);
    expect(validateSignal("answer", { sid, description: { type: "offer", sdp: "x" } }).ok).toBe(false);
    expect(validateSignal("offer", { sid }).ok).toBe(false);
  });
  it("rifiuta campi extra (nessun dato nascosto nei messaggi)", () => {
    expect(validateSignal("hello", { sid, nome: "Mario" }).ok).toBe(false);
  });
  it("rifiuta payload troppo grandi", () => {
    expect(validateSignal("offer", { sid, description: { type: "offer", sdp: "a".repeat(SIGNAL_MAX_BYTES) } }).ok).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("lascia passare fino al massimo e poi blocca", () => {
    const now = 0;
    const l = createRateLimiter(3, 1000, () => now);
    expect(l.take("a")).toBe(true);
    expect(l.take("a")).toBe(true);
    expect(l.take("a")).toBe(true);
    expect(l.take("a")).toBe(false);
  });
  it("è separato per chiave e si libera con il tempo", () => {
    let now = 0;
    const l = createRateLimiter(1, 1000, () => now);
    expect(l.take("a")).toBe(true);
    expect(l.take("b")).toBe(true);
    expect(l.take("a")).toBe(false);
    now = 1001;
    expect(l.take("a")).toBe(true);
  });
  it("un rifiuto non allunga l'attesa", () => {
    let now = 0;
    const l = createRateLimiter(1, 1000, () => now);
    l.take("a");
    now = 900;
    l.take("a");
    now = 1001;
    expect(l.take("a")).toBe(true);
  });
});
