import { z } from "zod";

/**
 * Parti PURE della chiamata (nessun database, nessun browser): configurazione ICE, validazione dei messaggi di
 * segnalazione e limite di frequenza. Usate sia dal server (azioni) sia dal browser.
 */

/** Dimensione massima di un messaggio di segnalazione (ripetuta nel database: drizzle/0012_chiamate.sql). */
export const SIGNAL_MAX_BYTES = 16384;
export const SIGNAL_KINDS = ["hello", "offer", "answer", "ice", "bye"] as const;
export type SignalKind = (typeof SIGNAL_KINDS)[number];

/** Messaggio unico per «chiamata non consentita» (il motivo non si rivela): il browser lo riconosce e chiude la chiamata. */
export const CALL_NOT_AVAILABLE = "La chiamata non è disponibile.";

export const PUBLIC_STUN = ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"];

export type IceServer = { urls: string[]; username?: string; credential?: string };

/** Solo stun:, turn: e turns: con un indirizzo senza spazi né caratteri di controllo. */
export function isValidIceUrl(url: string): boolean {
  if (typeof url !== "string" || url.length > 200) return false;
  return /^(stun|turn|turns):[^\s\u0000-\u001f\u007f]+$/i.test(url);
}

/** Elenco dei server ICE: STUN pubblici e, solo se tutte e tre le variabili sono presenti e valide, un TURN. */
export function buildIceServers(env: { urls?: string | null; username?: string | null; credential?: string | null }): IceServer[] {
  const list: IceServer[] = [{ urls: [...PUBLIC_STUN] }];
  const username = (env.username ?? "").trim();
  const credential = (env.credential ?? "").trim();
  const urls = (env.urls ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(isValidIceUrl);
  if (urls.length > 0 && username && credential) list.push({ urls, username, credential });
  return list;
}

const sid = z.string().regex(/^[A-Za-z0-9-]{8,40}$/);
const description = (type: "offer" | "answer") => z.object({ type: z.literal(type), sdp: z.string().max(15000) }).strict();
const candidate = z
  .object({
    candidate: z.string().max(1000),
    sdpMid: z.string().max(64).nullable().optional(),
    sdpMLineIndex: z.number().int().min(0).max(64).nullable().optional(),
    usernameFragment: z.string().max(64).nullable().optional(),
  })
  .strict();

const SHAPES = {
  hello: z.object({ sid }).strict(),
  bye: z.object({ sid }).strict(),
  offer: z.object({ sid, description: description("offer") }).strict(),
  answer: z.object({ sid, description: description("answer") }).strict(),
  ice: z.object({ sid, candidate: candidate.nullable() }).strict(),
} as const;

export type SignalPayload = Record<string, unknown>;
export type SignalCheck = { ok: true; payload: SignalPayload } | { ok: false };

/** Tipo noto, forma esatta, nessun campo in più, dimensione limitata. */
export function validateSignal(kind: unknown, payload: unknown): SignalCheck {
  if (typeof kind !== "string" || !(SIGNAL_KINDS as readonly string[]).includes(kind)) return { ok: false };
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return { ok: false };
  let size: number;
  try {
    size = JSON.stringify(payload).length;
  } catch {
    return { ok: false };
  }
  if (size > SIGNAL_MAX_BYTES) return { ok: false };
  const parsed = SHAPES[kind as SignalKind].safeParse(payload);
  return parsed.success ? { ok: true, payload: parsed.data as SignalPayload } : { ok: false };
}

/** Finestra scorrevole: al massimo `max` azioni ogni `windowMs`, per chiave. I rifiuti non contano. */
export function createRateLimiter(max: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, number[]>();
  return {
    take(key: string): boolean {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}
