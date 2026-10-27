import { describe, expect, it } from "vitest";
import {
  CHAT_MAX_CHARS,
  createChatLimiter,
  deriveStatus,
  describeMediaError,
  generateSid,
  isPolite,
  nextPollDelay,
  parseChatMessage,
  parseDataMessage,
  reduceInitialBatch,
  routeSignal,
  sanitizeChatText,
  videoConstraints,
  type IncomingSignal,
} from "./call-client";

describe("generateSid", () => {
  it("produce id validi per il protocollo e diversi tra loro", () => {
    const a = generateSid();
    const b = generateSid();
    expect(a).toMatch(/^[A-Za-z0-9-]{8,40}$/);
    expect(a).not.toBe(b);
  });
});

describe("isPolite (ruolo educato/maleducato)", () => {
  it("è deterministico", () => {
    expect(isPolite("aaaaaaaa1", "bbbbbbbb2")).toBe(isPolite("aaaaaaaa1", "bbbbbbbb2"));
  });
  it("è opposto per i due lati: uno educato e uno no", () => {
    const a = "aaaaaaaa1";
    const b = "bbbbbbbb2";
    expect(isPolite(a, b)).not.toBe(isPolite(b, a));
  });
});

describe("nextPollDelay", () => {
  const base = { now: 100_000, lastActivityAt: 99_000, errors: 0, hidden: false, closed: false };
  it("ogni secondo quando c'è attività recente", () => {
    expect(nextPollDelay(base)).toBe(1000);
  });
  it("torna a 3 secondi dopo 30 secondi senza novità", () => {
    expect(nextPollDelay({ ...base, lastActivityAt: 100_000 - 29_000 })).toBe(1000);
    expect(nextPollDelay({ ...base, lastActivityAt: 100_000 - 31_000 })).toBe(3000);
  });
  it("si ferma (null) con scheda nascosta o chiamata chiusa", () => {
    expect(nextPollDelay({ ...base, hidden: true })).toBeNull();
    expect(nextPollDelay({ ...base, closed: true })).toBeNull();
  });
  it("con errori rallenta in modo esponenziale fino a un massimo", () => {
    expect(nextPollDelay({ ...base, errors: 1 })).toBe(2000);
    expect(nextPollDelay({ ...base, errors: 2 })).toBe(4000);
    expect(nextPollDelay({ ...base, errors: 3 })).toBe(8000);
    expect(nextPollDelay({ ...base, errors: 20 })).toBe(30_000);
  });
});

const sidA = "aaaaaaaa-1";
const sidB = "bbbbbbbb-2";
const msg = (seq: number, kind: IncomingSignal["kind"], sid: string, extra: Record<string, unknown> = {}): IncomingSignal => ({ seq, kind, payload: { sid, ...extra } });

describe("reduceInitialBatch", () => {
  it("tiene solo i messaggi dell'ultima sessione dell'altro", () => {
    const out = reduceInitialBatch([msg(1, "hello", sidA), msg(2, "offer", sidA), msg(3, "hello", sidB), msg(4, "ice", sidB)]);
    expect(out.map((m) => m.seq)).toEqual([3, 4]);
  });
  it("se l'ultima sessione ha chiuso (bye) non resta nulla", () => {
    expect(reduceInitialBatch([msg(1, "hello", sidA), msg(2, "bye", sidA)])).toEqual([]);
  });
  it("vuoto resta vuoto", () => {
    expect(reduceInitialBatch([])).toEqual([]);
  });
});

describe("routeSignal", () => {
  const empty = { remoteSid: null as string | null };
  it("un hello nuovo registra l'altro e chiede di rispondere", () => {
    const r = routeSignal(empty, msg(1, "hello", sidA));
    expect(r.state.remoteSid).toBe(sidA);
    expect(r.action).toEqual({ type: "peer", sid: sidA });
  });
  it("un hello ripetuto dello stesso non fa nulla", () => {
    const r = routeSignal({ remoteSid: sidA }, msg(2, "hello", sidA));
    expect(r.action.type).toBe("ignore");
  });
  it("un hello con un altro sid è un nuovo ingresso (l'altro ha ricaricato)", () => {
    const r = routeSignal({ remoteSid: sidA }, msg(3, "hello", sidB));
    expect(r.state.remoteSid).toBe(sidB);
    expect(r.action.type).toBe("peer");
  });
  it("offer, answer e ice passano solo dalla sessione conosciuta", () => {
    const st = { remoteSid: sidA };
    expect(routeSignal(st, msg(1, "offer", sidA, { description: { type: "offer", sdp: "x" } })).action.type).toBe("offer");
    expect(routeSignal(st, msg(1, "answer", sidA, { description: { type: "answer", sdp: "x" } })).action.type).toBe("answer");
    expect(routeSignal(st, msg(1, "ice", sidA, { candidate: null })).action.type).toBe("ice");
    expect(routeSignal(st, msg(1, "offer", sidB, { description: { type: "offer", sdp: "x" } })).action.type).toBe("ignore");
    expect(routeSignal(empty, msg(1, "ice", sidA, { candidate: null })).action.type).toBe("ignore");
  });
  it("bye della sessione conosciuta chiude; di un'altra viene ignorato", () => {
    expect(routeSignal({ remoteSid: sidA }, msg(1, "bye", sidA)).action.type).toBe("bye");
    expect(routeSignal({ remoteSid: sidA }, msg(1, "bye", sidB)).action.type).toBe("ignore");
    expect(routeSignal({ remoteSid: sidA }, msg(1, "bye", sidA)).state.remoteSid).toBeNull();
  });
  it("ignora payload senza sid o non oggetto", () => {
    expect(routeSignal(empty, { seq: 1, kind: "hello", payload: {} as never }).action.type).toBe("ignore");
    expect(routeSignal(empty, { seq: 1, kind: "hello", payload: null as never }).action.type).toBe("ignore");
  });
});

describe("sanitizeChatText", () => {
  it("toglie spazi ai bordi e comprime gli spazi", () => {
    expect(sanitizeChatText("  ciao    a   tutti  ")).toBe("ciao a tutti");
  });
  it("vuoto o solo spazi: null", () => {
    expect(sanitizeChatText("   \n\t ")).toBeNull();
    expect(sanitizeChatText("")).toBeNull();
    expect(sanitizeChatText(42 as never)).toBeNull();
  });
  it("toglie caratteri di controllo e di inversione del testo", () => {
    expect(sanitizeChatText("a\u0000b\u0007c")).toBe("abc");
    expect(sanitizeChatText("ciao‮evil")).toBe("ciaoevil");
    expect(sanitizeChatText("a​b")).toBe("ab");
  });
  it("accorcia al massimo", () => {
    expect(sanitizeChatText("x".repeat(CHAT_MAX_CHARS + 50))?.length).toBe(CHAT_MAX_CHARS);
  });
  it("lascia il testo com'è: l'HTML non viene interpretato (lo mostra React come testo)", () => {
    expect(sanitizeChatText("<img src=x onerror=alert(1)>")).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("parseChatMessage", () => {
  it("legge un messaggio valido", () => {
    expect(parseChatMessage(JSON.stringify({ t: "chat", text: " ciao " }))).toBe("ciao");
  });
  it("scarta tutto il resto", () => {
    expect(parseChatMessage("non json")).toBeNull();
    expect(parseChatMessage(JSON.stringify({ t: "altro", text: "x" }))).toBeNull();
    expect(parseChatMessage(JSON.stringify({ t: "chat", text: 5 }))).toBeNull();
    expect(parseChatMessage(JSON.stringify({ t: "chat", text: "  " }))).toBeNull();
    expect(parseChatMessage(new ArrayBuffer(8))).toBeNull();
    expect(parseChatMessage("x".repeat(5000))).toBeNull();
  });
});

describe("parseDataMessage", () => {
  it("chat pulita e stato di microfono e fotocamera", () => {
    expect(parseDataMessage(JSON.stringify({ t: "chat", text: " ciao " }))).toEqual({ type: "chat", text: "ciao" });
    expect(parseDataMessage(JSON.stringify({ t: "state", mic: true, cam: false }))).toEqual({ type: "state", mic: true, cam: false });
  });
  it("scarta forme sbagliate", () => {
    expect(parseDataMessage(JSON.stringify({ t: "state", mic: "si", cam: false }))).toBeNull();
    expect(parseDataMessage(JSON.stringify({ t: "x" }))).toBeNull();
    expect(parseDataMessage("{")).toBeNull();
    expect(parseDataMessage(null)).toBeNull();
  });
});

describe("createChatLimiter", () => {
  it("limita i messaggi in una finestra breve", () => {
    let now = 0;
    const l = createChatLimiter(() => now);
    const results = Array.from({ length: 10 }, () => l.take("me"));
    expect(results.filter(Boolean).length).toBeLessThan(10);
    expect(results[0]).toBe(true);
    now = 60_000;
    expect(l.take("me")).toBe(true);
  });
});

describe("deriveStatus", () => {
  const base = { remotePresent: true, remoteLeft: false, connectionState: "new", iceConnectionState: "new", connectingForMs: 0 };
  it("attesa se l'amico non c'è", () => {
    expect(deriveStatus({ ...base, remotePresent: false })).toBe("waiting");
  });
  it("collegamento in corso", () => {
    expect(deriveStatus({ ...base, connectionState: "connecting", connectingForMs: 5000 })).toBe("connecting");
  });
  it("collegato", () => {
    expect(deriveStatus({ ...base, connectionState: "connected", iceConnectionState: "connected" })).toBe("connected");
    expect(deriveStatus({ ...base, connectionState: "connected", iceConnectionState: "completed" })).toBe("connected");
  });
  it("connessione debole se ICE si disconnette", () => {
    expect(deriveStatus({ ...base, connectionState: "connected", iceConnectionState: "disconnected" })).toBe("weak");
    expect(deriveStatus({ ...base, connectionState: "disconnected", iceConnectionState: "disconnected" })).toBe("weak");
  });
  it("fallito se lo dice il browser o se dopo 20 secondi non è partita", () => {
    expect(deriveStatus({ ...base, connectionState: "failed" })).toBe("failed");
    expect(deriveStatus({ ...base, connectionState: "connecting", connectingForMs: 20_001 })).toBe("failed");
    expect(deriveStatus({ ...base, connectionState: "connecting", connectingForMs: 19_000 })).toBe("connecting");
  });
  it("amico uscito", () => {
    expect(deriveStatus({ ...base, remoteLeft: true })).toBe("left");
  });
});

describe("describeMediaError", () => {
  it("permesso negato: spiega come attivarlo", () => {
    expect(describeMediaError({ name: "NotAllowedError" })).toMatch(/permess/i);
  });
  it("nessun dispositivo / occupato / non supportato", () => {
    expect(describeMediaError({ name: "NotFoundError" })).toMatch(/microfono|fotocamera/i);
    expect(describeMediaError({ name: "NotReadableError" })).toMatch(/altra app|usando/i);
    expect(describeMediaError(null)).toMatch(/non supporta|aggiorna/i);
  });
});

describe("videoConstraints", () => {
  it("fino a 720p e 30 fps, fotocamera scelta", () => {
    const v = videoConstraints("user");
    expect(v).toMatchObject({ facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } });
    expect(videoConstraints("environment")).toMatchObject({ facingMode: "environment" });
  });
});
