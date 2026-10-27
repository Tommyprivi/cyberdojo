import { createHmac } from "node:crypto";
import type { AgeGroup } from "./rules";
import { NICKNAME_MAX, NICKNAME_MIN } from "./nickname";

/**
 * «Studia insieme»: la chiamata passa dal servizio Jitsi, senza server nostri e senza salvare nulla.
 * Funzioni pure (il segreto arriva come parametro e non va mai al browser).
 */

const DEFAULT_JITSI = "https://meet.jit.si";
const ROOM_PREFIX = "cyberdojo-";
const ROOM_HEX_LENGTH = 24;

/**
 * Nome della stanza: HMAC-SHA256 dell'id dell'amicizia, troncato. Dipende solo dall'amicizia, quindi è lo stesso
 * per i due amici, stabile nel tempo e non indovinabile da altri (serve il segreto del server).
 */
export function callRoomName(secret: string, friendshipId: string): string {
  if (!secret) throw new Error("Segreto della stanza mancante.");
  if (!friendshipId) throw new Error("Id dell'amicizia mancante.");
  const digest = createHmac("sha256", secret).update(`call:${friendshipId}`).digest("hex");
  return ROOM_PREFIX + digest.slice(0, ROOM_HEX_LENGTH);
}

export type CallCheck = {
  status: string;
  myGroup: AgeGroup | null;
  theirGroup: AgeGroup | null;
  blocked: boolean;
};

/** Chiamate solo tra adulti, con amicizia accettata e senza blocchi. Mai per i minori, mai tra fasce diverse. */
export function isCallAllowed(c: CallCheck): boolean {
  return c.status === "accepted" && !c.blocked && c.myGroup === "adulti" && c.theirGroup === "adulti";
}

/** Base di Jitsi dalla variabile JITSI_BASE_URL: solo https, senza barra finale; altrimenti il servizio pubblico. */
export function jitsiBaseUrl(env: string | undefined | null): string {
  const raw = (env ?? "").trim();
  if (!raw) return DEFAULT_JITSI;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return DEFAULT_JITSI;
    return u.origin + u.pathname.replace(/\/+$/, "");
  } catch {
    return DEFAULT_JITSI;
  }
}

const SAFE_NAME = new RegExp(`^[A-Za-z][A-Za-z0-9_-]{${NICKNAME_MIN - 1},${NICKNAME_MAX - 1}}$`);

/** Indirizzo della stanza: pre-ingresso attivo, video spento all'inizio, niente richiesta di app. Il nome mostrato è solo il soprannome. */
export function jitsiCallUrl(base: string, room: string, nickname: string | null | undefined): string {
  const params = ["config.prejoinPageEnabled=true", "config.startWithVideoMuted=true", "config.disableDeepLinking=true"];
  if (nickname && SAFE_NAME.test(nickname)) params.push(`userInfo.displayName=${encodeURIComponent(JSON.stringify(nickname))}`);
  return `${base}/${encodeURIComponent(room)}#${params.join("&")}`;
}
