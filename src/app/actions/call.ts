"use server";

import { z } from "zod";
import { getIceConfig, pollSignals, sendSignal } from "@/lib/social/call-signal";
import { getSessionUser } from "@/lib/session";

/**
 * Azioni della chiamata «Studia insieme». Qui: utente dalla sessione (mai dal browser) e forma dei dati.
 * Le regole (amicizia, età, blocchi) si controllano sul server a ogni invio e a ogni lettura.
 */

const NO_SESSION = { ok: false as const, error: "Sessione scaduta: accedi di nuovo." };
const BAD = { ok: false as const, error: "Dati non validi." };

const friendshipId = z.string().regex(/^[A-Za-z0-9-]{8,64}$/);
const sendInput = z.object({ friendshipId, kind: z.string().max(10), payload: z.unknown() });
const pollInput = z.object({ friendshipId, after: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER) });

export async function sendCallSignal(input: unknown) {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = sendInput.safeParse(input);
  return p.success ? sendSignal(user.id, p.data.friendshipId, p.data.kind, p.data.payload) : BAD;
}

export async function pollCallSignals(input: unknown) {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = pollInput.safeParse(input);
  return p.success ? pollSignals(user.id, p.data.friendshipId, p.data.after) : BAD;
}

export async function getCallIceServers(id: unknown) {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = friendshipId.safeParse(id);
  return p.success ? getIceConfig(user.id, p.data) : BAD;
}
