import { SEND_WINDOW_HOURS, localHour } from "../mail/reminders";
import { localDay } from "../progress/streak";

/** Logica pura delle notifiche push: nessun database, nessuna rete. Tutto testabile. */

export const PUSH_KINDS = ["studio", "novita", "sfide"] as const;
export type PushKind = (typeof PUSH_KINDS)[number];

/** Quante apparecchi (telefono, PC...) può avere un utente. */
export const MAX_SUBSCRIPTIONS_PER_USER = 5;
const MAX_ENDPOINT_LENGTH = 1000;
const MAX_KEY_LENGTH = 200;
const BASE64URL = /^[A-Za-z0-9_-]+={0,2}$/;

export type PushCandidate = {
  kinds: string[];
  hour: number;
  timezone: string;
  lastStudyDay: string | null;
  lastNewsId: string | null;
  /** Ultimo giorno in cui ha studiato (dalla serie), nel suo fuso. */
  streakLastDay: string | null;
};

/** Promemoria di studio: una volta al giorno, nella finestra dopo l'ora scelta, solo se oggi non ha ancora studiato. */
export function isStudyPushDue(c: PushCandidate, now: Date): boolean {
  if (!c.kinds.includes("studio")) return false;
  try {
    const today = localDay(now, c.timezone);
    if (c.lastStudyDay === today) return false;
    if (c.streakLastDay === today) return false;
    const hour = localHour(now, c.timezone);
    return hour >= c.hour && hour < c.hour + SEND_WINDOW_HOURS;
  } catch {
    return false; // fuso non valido
  }
}

/** Novità: solo se c'è un annuncio e non è già stato mandato a questo dispositivo. */
export function isNewsPushDue(c: Pick<PushCandidate, "kinds" | "lastNewsId">, latestNewsId: string | null): boolean {
  return c.kinds.includes("novita") && !!latestNewsId && c.lastNewsId !== latestNewsId;
}

export type PushMessage = { title: string; body: string; url: string; tag: string };

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/** Testi gentili, senza pressione né paura di «perdere» qualcosa (gli utenti hanno dai 14 anni). */
export function buildMessage(
  kind: PushKind,
  ctx: { streak?: number; nextLessonTitle?: string | null; title?: string },
): PushMessage {
  if (kind === "studio") {
    const next = ctx.nextLessonTitle ? `Quando vuoi, ti aspetta «${clip(ctx.nextLessonTitle, 60)}».` : "Quando vuoi, il tuo prossimo caso è pronto.";
    const streak = ctx.streak && ctx.streak > 0 ? ` Finora hai studiato ${ctx.streak} ${ctx.streak === 1 ? "giorno" : "giorni"} di fila: bel lavoro.` : "";
    return { title: "Un momento per te al dojo", body: `${next}${streak}`, url: "/percorso", tag: "studio" };
  }
  if (kind === "novita") {
    const t = ctx.title ? `«${clip(ctx.title, 80)}»` : "C'è una novità";
    return { title: "Novità al dojo", body: `${t}. Dai un'occhiata quando hai tempo.`, url: "/annunci", tag: "novita" };
  }
  return { title: "Una sfida al dojo", body: "C'è una sfida con la community: partecipa solo se ti va.", url: "/social", tag: "sfide" };
}

/** Solo percorsi interni (stessa regola di safeNext, ma senza importare codice server). */
export function safeInternalUrl(u: unknown, fallback = "/percorso"): string {
  if (typeof u !== "string" || !u.startsWith("/") || u.startsWith("//") || u.includes("\\")) return fallback;
  return u;
}

export type SubscriptionInput = { endpoint: string; p256dh: string; auth: string };
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes(":")) return true; // IPv6 letterale
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(h); // IPv4 letterale: i servizi push veri usano nomi
}

/** Controlla l'iscrizione arrivata dal browser (non è fidata) e il limite per utente. */
export function validateSubscription(input: unknown, existingCount: number): Result<SubscriptionInput> {
  if (!input || typeof input !== "object") return { ok: false, error: "Iscrizione non valida." };
  const { endpoint, keys } = input as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  if (typeof endpoint !== "string" || endpoint.length === 0 || endpoint.length > MAX_ENDPOINT_LENGTH) {
    return { ok: false, error: "Indirizzo di notifica non valido." };
  }
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return { ok: false, error: "Indirizzo di notifica non valido." };
  }
  if (url.protocol !== "https:" || url.username || url.password || isBlockedHost(url.hostname)) {
    return { ok: false, error: "Indirizzo di notifica non valido." };
  }
  const p256dh = keys?.p256dh;
  const auth = keys?.auth;
  for (const k of [p256dh, auth]) {
    if (typeof k !== "string" || k.length === 0 || k.length > MAX_KEY_LENGTH || !BASE64URL.test(k)) {
      return { ok: false, error: "Chiavi di notifica non valide." };
    }
  }
  if (existingCount >= MAX_SUBSCRIPTIONS_PER_USER) {
    return { ok: false, error: `Hai già ${MAX_SUBSCRIPTIONS_PER_USER} dispositivi con le notifiche: togline uno prima.` };
  }
  return { ok: true, value: { endpoint, p256dh: p256dh as string, auth: auth as string } };
}

/** Ora (0-23) e tipi scelti dall'utente. */
export function parsePrefs(input: unknown): Result<{ hour: number; kinds: PushKind[] }> {
  if (!input || typeof input !== "object") return { ok: false, error: "Scelte non valide." };
  const { hour, kinds } = input as { hour?: unknown; kinds?: unknown };
  if (typeof hour !== "number" || !Number.isInteger(hour) || hour < 0 || hour > 23) return { ok: false, error: "Ora non valida." };
  if (!Array.isArray(kinds) || kinds.length > PUSH_KINDS.length * 2) return { ok: false, error: "Tipi non validi." };
  const out: PushKind[] = [];
  for (const k of kinds) {
    if (!(PUSH_KINDS as readonly string[]).includes(k as string)) return { ok: false, error: "Tipo di notifica sconosciuto." };
    if (!out.includes(k as PushKind)) out.push(k as PushKind);
  }
  return { ok: true, value: { hour, kinds: out } };
}

/** Il servizio push dice che l'iscrizione non esiste più (404/410): va cancellata. */
export function isSubscriptionGone(err: unknown): boolean {
  const code = (err as { statusCode?: unknown } | null)?.statusCode;
  return code === 404 || code === 410;
}
