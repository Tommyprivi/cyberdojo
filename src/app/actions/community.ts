"use server";

import { z } from "zod";
import { createReactionLimiter, isAnnouncementRef, isEmoji, isPhraseKey } from "@/lib/community/reactions";
import { isNewsVersion } from "@/lib/community/news";
import * as community from "@/lib/community/service";
import { isCourseId } from "@/lib/community/teams";
import { ANNOUNCEMENT_ID, announcementInput } from "@/lib/community/validation";
import { getSessionUser } from "@/lib/session";
import * as social from "@/lib/social/service";
import type { LeaderRow } from "@/lib/social/service";

/**
 * Azioni della community: annunci dello staff, reazioni, frasi, classifica per corso, novità viste.
 * L'utente arriva SEMPRE dalla sessione. Le azioni dello staff controllano il ruolo ogni volta, lato server.
 */

type R<T = object> = community.Result<T>;
const NO_SESSION = { ok: false as const, error: "Sessione scaduta: accedi di nuovo." };
const BAD = { ok: false as const, error: "Dati non validi." };
const FORBIDDEN = { ok: false as const, error: "Non hai i permessi per farlo (403)." };

const tooMany = createReactionLimiter();
const staffTooMany = createReactionLimiter();
const TOO_MANY = { ok: false as const, error: "Troppe azioni di fila: aspetta un minuto." };

async function staffUser() {
  const user = await getSessionUser();
  if (!user) return { user: null, error: NO_SESSION };
  if (!(await community.checkStaff(user))) return { user: null, error: FORBIDDEN };
  if (staffTooMany(`staff:${user.id}`)) return { user: null, error: TOO_MANY };
  return { user, error: null };
}

const idInput = z.string().regex(ANNOUNCEMENT_ID);

export async function createStaffAnnouncement(input: unknown): Promise<R<{ id: string }>> {
  const { user, error } = await staffUser();
  if (!user) return error;
  const p = announcementInput.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Dati non validi." };
  return community.createAnnouncement(user.id, p.data);
}

export async function updateStaffAnnouncement(id: unknown, input: unknown): Promise<R> {
  const { user, error } = await staffUser();
  if (!user) return error;
  const i = idInput.safeParse(id);
  const p = announcementInput.safeParse(input);
  if (!i.success) return BAD;
  if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Dati non validi." };
  return community.updateAnnouncement(user.id, i.data, p.data);
}

export async function pinStaffAnnouncement(id: unknown, pinned: unknown): Promise<R> {
  const { user, error } = await staffUser();
  if (!user) return error;
  const i = idInput.safeParse(id);
  return i.success && typeof pinned === "boolean" ? community.setPinned(user.id, i.data, pinned) : BAD;
}

export async function deleteStaffAnnouncement(id: unknown): Promise<R> {
  const { user, error } = await staffUser();
  if (!user) return error;
  const i = idInput.safeParse(id);
  return i.success ? community.deleteAnnouncement(user.id, i.data) : BAD;
}

/** Controlla che l'annuncio esista davvero (file o database): niente righe su id inventati. */
async function announcementExists(userId: string, id: string): Promise<boolean> {
  return (await community.getAllAnnouncements(userId)).some((a) => a.id === id);
}

export async function reactToAnnouncement(id: unknown, emoji: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  if (!isAnnouncementRef(id) || !(emoji === null || isEmoji(emoji))) return BAD;
  if (tooMany(user.id)) return TOO_MANY;
  if (!(await announcementExists(user.id, id))) return BAD;
  return community.setReaction(user.id, id, emoji);
}

export async function sayPhraseOnAnnouncement(id: unknown, key: unknown, on: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  if (!isAnnouncementRef(id) || !isPhraseKey(key) || typeof on !== "boolean") return BAD;
  if (tooMany(user.id)) return TOO_MANY;
  if (!(await announcementExists(user.id, id))) return BAD;
  return community.setPhrase(user.id, id, key, on);
}

export async function loadCourseLeaderboard(course: unknown): Promise<R<{ rows: LeaderRow[] }>> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  if (!isCourseId(course)) return BAD;
  if (tooMany(`board:${user.id}`)) return TOO_MANY;
  try {
    const { rows } = await social.getCourseLeaderboard(user.id, course);
    return { ok: true, rows };
  } catch {
    return { ok: false, error: "Classifica del corso non disponibile per ora." };
  }
}

/** Ricorda per ACCOUNT l'ultima novità vista (profiles.seen_news_version). */
export async function markNewsSeen(version: unknown): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  if (!isNewsVersion(version)) return BAD;
  return community.saveSeenNews(user.id, version);
}

/** Legge l'ultima novità vista da questo account; `null` se nessuna o se non c'è sessione (si usa il localStorage). */
export async function readNewsSeen(): Promise<{ signedIn: boolean; version: string | null }> {
  const user = await getSessionUser();
  if (!user) return { signedIn: false, version: null };
  return { signedIn: true, version: await community.getSeenNews(user.id) };
}

/** Per l'interfaccia: l'utente può aprire /annunci/scrivi? */
export async function amIStaff(): Promise<boolean> {
  const user = await getSessionUser();
  return user ? community.checkStaff(user) : false;
}
