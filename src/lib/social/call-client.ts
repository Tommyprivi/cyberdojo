import { createRateLimiter, type SignalKind } from "./call-protocol";

/**
 * Logica PURA del lato browser della chiamata (nessun WebRTC qui dentro, così si prova con i test):
 * ruolo educato/maleducato, ritmo del polling, instradamento dei messaggi di segnalazione, chat, stato mostrato.
 * Il collegamento vero sta in src/components/social/use-call.ts.
 */

// ---------- identità della sessione e ruolo ----------

/** Identificativo casuale di QUESTA apertura della pagina (non è un id utente: serve a distinguere ricariche e a scegliere il ruolo). */
export function generateSid(): string {
  const bytes = new Uint8Array(12);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * «Perfect negotiation»: in caso di offerte contemporanee uno cede (educato), l'altro no.
 * Si decide confrontando i due sid: deterministico e sempre opposto per i due lati (senza esporre id utente).
 */
export function isPolite(ownSid: string, remoteSid: string): boolean {
  return ownSid < remoteSid;
}

// ---------- ritmo del polling ----------

export const POLL_FAST_MS = 1000;
export const POLL_SLOW_MS = 3000;
export const POLL_IDLE_AFTER_MS = 30_000;
export const POLL_MAX_BACKOFF_MS = 30_000;

export type PollState = { now: number; lastActivityAt: number; errors: number; hidden: boolean; closed: boolean };

/** Attesa prima della prossima lettura; null = fermo (scheda nascosta o chiamata chiusa). */
export function nextPollDelay(s: PollState): number | null {
  if (s.closed || s.hidden) return null;
  if (s.errors > 0) return Math.min(POLL_MAX_BACKOFF_MS, POLL_FAST_MS * 2 ** s.errors);
  return s.now - s.lastActivityAt > POLL_IDLE_AFTER_MS ? POLL_SLOW_MS : POLL_FAST_MS;
}

// ---------- messaggi di segnalazione ricevuti ----------

export type IncomingSignal = { seq: number; kind: SignalKind; payload: Record<string, unknown> };

function sidOf(m: IncomingSignal): string | null {
  const p = m.payload;
  return p && typeof p === "object" && typeof (p as { sid?: unknown }).sid === "string" ? (p as { sid: string }).sid : null;
}

/** Alla prima lettura (storico di 15 minuti): si tiene solo l'ultima sessione dell'altro, e niente se ha già chiuso. */
export function reduceInitialBatch(batch: IncomingSignal[]): IncomingSignal[] {
  if (batch.length === 0) return [];
  const last = sidOf(batch[batch.length - 1]);
  if (!last) return [];
  const mine = batch.filter((m) => sidOf(m) === last);
  return mine[mine.length - 1].kind === "bye" ? [] : mine;
}

export type RouteState = { remoteSid: string | null };
export type RouteAction =
  | { type: "ignore" }
  | { type: "peer"; sid: string }
  | { type: "offer" | "answer" | "ice"; sid: string; payload: Record<string, unknown> }
  | { type: "bye"; sid: string };

/** Decide cosa fare con un messaggio dell'altro, ricordando solo quale sessione dell'altro stiamo seguendo. */
export function routeSignal(state: RouteState, m: IncomingSignal): { state: RouteState; action: RouteAction } {
  const sid = sidOf(m);
  if (!sid) return { state, action: { type: "ignore" } };
  if (m.kind === "hello") {
    if (sid === state.remoteSid) return { state, action: { type: "ignore" } };
    return { state: { remoteSid: sid }, action: { type: "peer", sid } };
  }
  if (sid !== state.remoteSid) return { state, action: { type: "ignore" } };
  if (m.kind === "bye") return { state: { remoteSid: null }, action: { type: "bye", sid } };
  if (m.kind === "offer" || m.kind === "answer" || m.kind === "ice") return { state, action: { type: m.kind, sid, payload: m.payload } };
  return { state, action: { type: "ignore" } };
}

// ---------- chat (solo testo semplice, passa direttamente tra i due browser) ----------

export const CHAT_MAX_CHARS = 500;
const CHAT_RAW_MAX = 4000;
/** Caratteri di controllo e invisibili (anche quelli che invertono la direzione del testo). */
const INVISIBLE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f​-‏‪-‮⁠-⁩﻿]/g;

/** Testo pulito per la chat, o null se vuoto. Non tocca l'HTML perché non viene mai interpretato (React lo mostra come testo). */
export function sanitizeChatText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.replace(INVISIBLE, "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  return Array.from(text).slice(0, CHAT_MAX_CHARS).join("");
}

/** Messaggio arrivato dal canale dati: solo testo JSON {t:"chat", text}; tutto il resto si scarta. */
export function parseChatMessage(data: unknown): string | null {
  if (typeof data !== "string" || data.length > CHAT_RAW_MAX) return null;
  try {
    const v = JSON.parse(data) as { t?: unknown; text?: unknown };
    if (!v || typeof v !== "object" || v.t !== "chat") return null;
    return sanitizeChatText(v.text);
  } catch {
    return null;
  }
}

export type DataMessage = { type: "chat"; text: string } | { type: "state"; mic: boolean; cam: boolean };

/** Messaggio del canale dati: chat (testo pulito) oppure stato di microfono e fotocamera dell'altro. Tutto il resto si scarta. */
export function parseDataMessage(data: unknown): DataMessage | null {
  if (typeof data !== "string" || data.length > CHAT_RAW_MAX) return null;
  try {
    const v = JSON.parse(data) as { t?: unknown; text?: unknown; mic?: unknown; cam?: unknown };
    if (!v || typeof v !== "object") return null;
    if (v.t === "chat") {
      const text = sanitizeChatText(v.text);
      return text ? { type: "chat", text } : null;
    }
    if (v.t === "state" && typeof v.mic === "boolean" && typeof v.cam === "boolean") return { type: "state", mic: v.mic, cam: v.cam };
    return null;
  } catch {
    return null;
  }
}

/** Al massimo 6 messaggi ogni 10 secondi (per chi scrive e per chi riceve). */
export function createChatLimiter(now?: () => number) {
  return createRateLimiter(6, 10_000, now);
}

// ---------- stato mostrato all'utente ----------

export type CallStatus = "waiting" | "connecting" | "connected" | "weak" | "failed" | "left";
/** Testo mostrato quando il server dice che la chiamata non è più consentita (amicizia finita, blocco...). Nessun ripiego in questo caso. */
export const CALL_GONE_TEXT = "Questa chiamata non è più disponibile.";
export const CONNECT_TIMEOUT_MS = 20_000;

export const STATUS_TEXT: Record<CallStatus, string> = {
  waiting: "In attesa che il tuo amico entri…",
  connecting: "Collegamento in corso…",
  connected: "Collegato",
  weak: "Connessione debole",
  failed: "Non riesco a collegarmi: prova a ricaricare la pagina.",
  left: "Il tuo amico è uscito dalla chiamata.",
};

export type StatusInput = {
  remotePresent: boolean;
  remoteLeft: boolean;
  connectionState: string;
  iceConnectionState: string;
  connectingForMs: number;
};

export function deriveStatus(s: StatusInput): CallStatus {
  if (s.remoteLeft) return "left";
  if (!s.remotePresent) return "waiting";
  if (s.connectionState === "failed") return "failed";
  if (s.iceConnectionState === "disconnected" || s.connectionState === "disconnected") return "weak";
  if (s.connectionState === "connected" && (s.iceConnectionState === "connected" || s.iceConnectionState === "completed")) return "connected";
  return s.connectingForMs > CONNECT_TIMEOUT_MS ? "failed" : "connecting";
}

// ---------- fotocamera e microfono ----------

export const AUDIO_CONSTRAINTS = { echoCancellation: true, noiseSuppression: true, autoGainControl: true } as const;

export function videoConstraints(facing: "user" | "environment") {
  return { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } };
}

/** Messaggio gentile per un errore di getUserMedia (o per un browser senza getUserMedia: errore nullo). */
export function describeMediaError(err: { name?: string } | null | undefined): string {
  if (!err) return "Questo browser non supporta le chiamate. Aggiorna il browser, oppure usa Chrome.";
  switch (err.name) {
    case "NotAllowedError":
    case "SecurityError":
    case "PermissionDeniedError":
      return "Non hai dato il permesso per microfono e fotocamera. Tocca il lucchetto accanto all'indirizzo (o le impostazioni dell'app, sotto Permessi), consenti microfono e fotocamera, poi ricarica la pagina.";
    case "NotFoundError":
    case "OverconstrainedError":
    case "DevicesNotFoundError":
      return "Non trovo un microfono o una fotocamera. Controlla che siano collegati e riprova.";
    case "NotReadableError":
    case "TrackStartError":
      return "Microfono o fotocamera sono in uso da un'altra app. Chiudila e ricarica la pagina.";
    default:
      return "Non riesco ad accendere microfono e fotocamera. Ricarica la pagina e riprova.";
  }
}
