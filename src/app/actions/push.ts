"use server";

import { and, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { pushConfig } from "@/lib/push/config";
import { parsePrefs, validateSubscription } from "@/lib/push/rules";
import { getSessionUser } from "@/lib/session";

export type PushResult = { ok: true } | { ok: false; error: string };

const OFF: PushResult = { ok: false, error: "Le notifiche non sono attive su questo sito." };
const LOGIN: PushResult = { ok: false, error: "Sessione scaduta: accedi di nuovo." };

/** Salva il dispositivo che ha dato il permesso. Valida tutto sul server e rispetta il limite per utente. */
export async function subscribePush(subscription: unknown, prefs?: unknown): Promise<PushResult> {
  if (!pushConfig()) return OFF;
  const user = await getSessionUser();
  if (!user) return LOGIN;

  const p = prefs === undefined ? null : parsePrefs(prefs);
  if (p && !p.ok) return p;

  try {
    return await withUser(user.id, async (tx): Promise<PushResult> => {
      const mine = await tx
        .select({ endpoint: schema.pushSubscriptions.endpoint })
        .from(schema.pushSubscriptions)
        .where(eq(schema.pushSubscriptions.userId, user.id));
      const raw = (subscription ?? {}) as { endpoint?: unknown };
      const already = mine.some((m) => m.endpoint === raw.endpoint);
      const v = validateSubscription(subscription, already ? 0 : mine.length);
      if (!v.ok) return v;
      const set = {
        userId: user.id,
        p256dh: v.value.p256dh,
        auth: v.value.auth,
        ...(p?.ok ? { kinds: p.value.kinds, hour: p.value.hour } : {}),
      };
      await tx
        .insert(schema.pushSubscriptions)
        .values({ id: crypto.randomUUID(), endpoint: v.value.endpoint, ...set })
        .onConflictDoUpdate({ target: schema.pushSubscriptions.endpoint, set });
      return { ok: true };
    });
  } catch (e) {
    console.error("Iscrizione notifiche non salvata:", e instanceof Error ? e.message : "errore");
    return { ok: false, error: "Non sono riuscito a salvare. Riprova tra poco." };
  }
}

/** Toglie questo dispositivo (o, senza endpoint, tutti i dispositivi dell'utente). */
export async function unsubscribePush(endpoint?: unknown): Promise<PushResult> {
  const user = await getSessionUser();
  if (!user) return LOGIN;
  if (endpoint !== undefined && (typeof endpoint !== "string" || endpoint.length > 1000)) return { ok: false, error: "Dato non valido." };
  try {
    const mineOnly = eq(schema.pushSubscriptions.userId, user.id);
    await withUser(user.id, (tx) =>
      tx.delete(schema.pushSubscriptions).where(typeof endpoint === "string" ? and(mineOnly, eq(schema.pushSubscriptions.endpoint, endpoint)) : mineOnly),
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Non sono riuscito a disattivare. Riprova." };
  }
}

/** Ora e tipi di notifica: valgono per tutti i dispositivi dell'utente. */
export async function savePushPrefs(input: unknown): Promise<PushResult> {
  const user = await getSessionUser();
  if (!user) return LOGIN;
  const p = parsePrefs(input);
  if (!p.ok) return p;
  try {
    await withUser(user.id, (tx) =>
      tx.update(schema.pushSubscriptions).set({ kinds: p.value.kinds, hour: p.value.hour }).where(eq(schema.pushSubscriptions.userId, user.id)),
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Non sono riuscito a salvare. Riprova." };
  }
}

/** Chiave pubblica VAPID (pubblica per natura), oppure null se le notifiche sono spente. Serve a <AskPush />. */
export async function getPushPublicKey(): Promise<string | null> {
  return pushConfig()?.publicKey ?? null;
}
