"use server";

import { z } from "zod";
import * as duels from "@/lib/duels/service";
import { getSessionUser } from "@/lib/session";

/** Azioni dei duelli: qui si capisce chi è l'utente (dalla sessione) e si controlla la forma dei dati. Le regole stanno in src/lib/duels. */

const NO_SESSION = { ok: false as const, error: "Sessione scaduta: accedi di nuovo." };
const BAD = { ok: false as const, error: "Dati non validi." };
const idInput = z.string().min(1).max(64);
const courseInput = z.string().regex(/^[A-Z]$/).nullable();

async function safely<T extends { ok: boolean }>(fn: () => Promise<T>): Promise<T | { ok: false; error: string }> {
  try {
    return await fn();
  } catch {
    return { ok: false, error: "Qualcosa è andato storto: riprova tra poco." };
  }
}

export async function challengeFriend(friendshipId: unknown, course: unknown = null): Promise<duels.Result<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const f = idInput.safeParse(friendshipId);
  const c = courseInput.safeParse(course ?? null);
  if (!f.success || !c.success) return BAD;
  return safely(() => duels.createDuel(user.id, f.data, c.data));
}

export async function answerDuelInvite(id: unknown, accept: unknown): Promise<duels.Result> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  if (!p.success || typeof accept !== "boolean") return BAD;
  return safely(() => duels.respondToDuel(user.id, p.data, accept));
}

export async function startDuelTurn(id: unknown): Promise<duels.Result<duels.DuelStart>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  if (!p.success) return BAD;
  return safely(() => duels.startDuel(user.id, p.data));
}

export async function submitDuelTurn(id: unknown, answers: unknown): Promise<duels.Result<{ correct: number; total: number }>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  if (!p.success || !Array.isArray(answers)) return BAD;
  return safely(() => duels.submitDuel(user.id, p.data, answers));
}
