"use server";

import { z } from "zod";
import { getShareState, setShareProgress } from "@/lib/docente/service";
import { getSessionUser } from "@/lib/session";

/** Consenso dello studente a far vedere i progressi al docente della classe. Sessione dal server, mai dal browser. */
const groupId = z.string().min(1).max(64);

export async function readShareProgress(id: unknown): Promise<{ ok: true; share: boolean } | { ok: false }> {
  const user = await getSessionUser();
  const p = groupId.safeParse(id);
  if (!user || !p.success) return { ok: false };
  const s = await getShareState(user.id, p.data);
  return s === null ? { ok: false } : { ok: true, share: s };
}

export async function changeShareProgress(id: unknown, share: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };
  const p = groupId.safeParse(id);
  if (!p.success || typeof share !== "boolean") return { ok: false, error: "Dati non validi." };
  return setShareProgress(user.id, p.data, share);
}
