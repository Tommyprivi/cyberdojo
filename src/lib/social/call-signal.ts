import { sql } from "drizzle-orm";
import { withUser } from "../db/scoped";
import { buildIceServers, CALL_NOT_AVAILABLE, createRateLimiter, validateSignal, type IceServer, type SignalKind } from "./call-protocol";
import { getCall, type Result } from "./service";

/**
 * Segnalazione della chiamata (WebRTC) via database. Il controllo vero (amicizia accettata, io tra i due, entrambi adulti,
 * nessun blocco) lo fanno le funzioni SQL call_signal_send / call_signal_poll a OGNI chiamata (drizzle/0012_chiamate.sql).
 * Qui: limite di frequenza per istanza, forma dei messaggi e messaggi di errore gentili.
 * Si restituiscono solo i messaggi dell'altro (dati tecnici di connessione): mai id, email o altro.
 */

const fail = (error: string) => ({ ok: false as const, error });
const NOT_AVAILABLE = CALL_NOT_AVAILABLE;

const sendLimiter = createRateLimiter(100, 60_000);
const pollLimiter = createRateLimiter(100, 60_000);
export function _resetCallLimitsForTests() {
  sendLimiter.reset();
  pollLimiter.reset();
}

export type SignalMessage = { seq: number; kind: SignalKind; payload: Record<string, unknown> };

function errText(e: unknown): string {
  const x = e as { message?: string; cause?: { message?: string } } | undefined;
  return `${x?.cause?.message ?? ""} ${x?.message ?? ""}`;
}

export async function sendSignal(userId: string, friendshipId: string, kind: unknown, payload: unknown): Promise<Result> {
  const check = validateSignal(kind, payload);
  if (!check.ok) return fail("Messaggio non valido.");
  if (!sendLimiter.take(`${userId}:${friendshipId}`)) return fail("Troppi messaggi: aspetta qualche secondo.");
  try {
    const seq = await withUser(userId, async (tx) => {
      const r = await tx.execute(sql`select call_signal_send(${friendshipId}, ${kind as string}, ${JSON.stringify(check.payload)}::jsonb) as seq`);
      return (r.rows[0] as { seq: string | number | null } | undefined)?.seq ?? null;
    });
    return seq === null ? fail(NOT_AVAILABLE) : { ok: true };
  } catch (e) {
    const m = errText(e);
    if (m.includes("call_signal_rate")) return fail("Troppi messaggi: aspetta qualche secondo.");
    if (m.includes("call_signal_invalid")) return fail("Messaggio non valido.");
    console.error("Errore segnalazione chiamata:", m.slice(0, 300));
    return fail("Qualcosa non ha funzionato: riprova tra poco.");
  }
}

export async function pollSignals(userId: string, friendshipId: string, after: number): Promise<Result<{ signals: SignalMessage[] }>> {
  if (!pollLimiter.take(`${userId}:${friendshipId}`)) return fail("Troppe richieste: aspetta qualche secondo.");
  try {
    const rows = await withUser(userId, async (tx) => {
      const r = await tx.execute(sql`select seq, kind, payload from call_signal_poll(${friendshipId}, ${after}::bigint)`);
      return r.rows as { seq: string | number; kind: string; payload: unknown }[];
    });
    const signals: SignalMessage[] = [];
    for (const row of rows) {
      // Seconda barriera: anche in uscita passa solo ciò che ha la forma giusta.
      const check = validateSignal(row.kind, row.payload);
      if (check.ok) signals.push({ seq: Number(row.seq), kind: row.kind as SignalKind, payload: check.payload });
    }
    return { ok: true, signals };
  } catch (e) {
    console.error("Errore lettura segnalazione:", errText(e).slice(0, 300));
    return fail("Qualcosa non ha funzionato: riprova tra poco.");
  }
}

/** Configurazione ICE, solo per chi può davvero chiamare (le credenziali TURN non vanno a chiunque). */
export async function getIceConfig(userId: string, friendshipId: string): Promise<Result<{ iceServers: IceServer[] }>> {
  const call = await getCall(userId, friendshipId);
  if (!call) return fail(NOT_AVAILABLE);
  return { ok: true, iceServers: buildIceServers({ urls: process.env.TURN_URLS, username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL }) };
}
