"use server";

import { z } from "zod";
import { AVATAR_IDS } from "@/lib/social/avatars";
import { CHALLENGE_IDS } from "@/lib/social/challenges";
import { GROUP_KINDS, GROUP_THEMES } from "@/lib/social/group-names";
import { sendReportEmail } from "@/lib/social/report-mail";
import { REPORT_REASON_IDS } from "@/lib/social/rules";
import * as social from "@/lib/social/service";
import { getSessionUser } from "@/lib/session";

/**
 * Azioni del lato social. Qui si fanno solo due cose: capire chi è l'utente (dalla sessione, mai dal
 * browser) e controllare la forma dei dati. Le regole vere (età, limiti, parole vietate) stanno in
 * src/lib/social e, come seconda barriera, nei trigger del database.
 */

type R<T = object> = social.Result<T>;
const NO_SESSION = { ok: false as const, error: "Sessione scaduta: accedi di nuovo." };
const BAD = { ok: false as const, error: "Dati non validi." };

const nicknameInput = z.object({ nickname: z.string().max(40), avatar: z.enum(AVATAR_IDS) });
const togglesInput = z.object({ joinLeaderboard: z.boolean(), showToFriends: z.boolean(), acceptRequests: z.boolean() });
const idInput = z.string().min(1).max(64);
const codeInput = z.string().min(1).max(32);

export async function saveSocialNickname(input: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = nicknameInput.safeParse(input);
  if (!p.success) return { ok: false, error: "Scegli un avatar dell'elenco." };
  return social.saveNickname(user.id, p.data, { name: user.name, email: user.email });
}

export async function saveSocialToggles(input: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = togglesInput.safeParse(input);
  return p.success ? social.saveToggles(user.id, p.data) : BAD;
}

export async function manageFriendCode(mode: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  if (mode !== "renew" && mode !== "disable") return BAD;
  return social.setFriendCode(user.id, mode);
}

export async function unblockEveryone(): Promise<R> {
  const user = await getSessionUser();
  return user ? social.unblockAll(user.id) : NO_SESSION;
}

export async function addFriendByCode(code: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = codeInput.safeParse(code);
  return p.success ? social.sendFriendRequest(user.id, p.data) : BAD;
}

export async function answerFriendRequest(id: unknown, accept: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  return p.success && typeof accept === "boolean" ? social.respondToRequest(user.id, p.data, accept) : BAD;
}

export async function removeFriend(id: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  return p.success ? social.removeFriendship(user.id, p.data) : BAD;
}

const groupInput = z.object({
  kind: z.enum(GROUP_KINDS),
  theme: z.enum(GROUP_THEMES),
  num: z.number().int().min(1).max(99),
  audience: z.enum(["minori", "adulti"]),
});

export async function createStudyGroup(input: unknown): Promise<R<{ code: string }>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = groupInput.safeParse(input);
  return p.success ? social.createGroup(user.id, p.data) : BAD;
}

export async function joinStudyGroup(code: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = codeInput.safeParse(code);
  return p.success ? social.joinGroup(user.id, p.data) : BAD;
}

export async function leaveStudyGroup(id: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  return p.success ? social.leaveGroup(user.id, p.data) : BAD;
}

export async function deleteStudyGroup(id: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  return p.success ? social.deleteGroup(user.id, p.data) : BAD;
}

export async function renewStudyGroupCode(id: unknown): Promise<R<{ code: string }>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = idInput.safeParse(id);
  return p.success ? social.renewGroupCode(user.id, p.data) : BAD;
}

export async function setWeeklyChallenge(id: unknown, join: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = z.enum(CHALLENGE_IDS).safeParse(id);
  return p.success && typeof join === "boolean" ? social.setChallenge(user.id, p.data, join) : BAD;
}

const reportInput = z.object({ kind: z.enum(["user", "group"]), targetId: z.string().regex(/^[a-z0-9-]{8,40}$/), reason: z.enum(REPORT_REASON_IDS) });

/** Segnala e blocca: salva solo id, motivo e data, manda l'email al titolare e toglie subito l'elemento a chi segnala. */
export async function reportSocial(input: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const p = reportInput.safeParse(input);
  if (!p.success) return BAD;
  const r = await social.reportTarget(user.id, p.data);
  if (!r.ok) return r;
  await sendReportEmail({ ...p.data, reportId: r.reportId, at: new Date() });
  return { ok: true };
}
