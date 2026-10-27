import { and, eq, gte, sql } from "drizzle-orm";
import { loadCatalog } from "../content/catalog";
import { schema } from "../db";
import { withUser, type Tx } from "../db/scoped";
import { effectiveStreak, localDay } from "../progress/streak";
import { isAvatarId, type AvatarId } from "./avatars";
import {
  CHALLENGES,
  challengeById,
  countWins,
  entryProgress,
  type ChallengeEntry,
  type ProgressData,
} from "./challenges";
import { generateCode, generatePublicId, normalizeCode } from "./codes";
import { composeGroupName } from "./group-names";
import { canChangeNickname, nextChangeAt, validateNickname, type NicknameContext } from "./nickname";
import {
  ageGroupOf,
  canCreateGroup,
  canJoinGroup,
  LEADERBOARD_LIMIT,
  MAX_FRIENDS,
  MAX_GROUP_SIZE,
  MAX_JOINED_GROUPS,
  MAX_OWNED_GROUPS,
  NICKNAME_COOLDOWN_DAYS,
  REPORTS_PER_HOUR,
  type AgeGroup,
  type GroupAudience,
  type ReportReason,
} from "./rules";
import { weekBounds, type WeekBounds } from "./week";

/**
 * Logica del lato social, senza sessione né Next.js: ogni funzione riceve l'id dell'utente già
 * autenticato (lo decide solo `src/app/actions/social.ts`) e lavora dentro `withUser`, quindi con la RLS.
 * I dati degli altri utenti arrivano SOLO dalle funzioni SQL in sola lettura (drizzle/0005_social.sql).
 */

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });

// ---------- tipi che arrivano al browser (nessun id interno) ----------

export type SocialSettings = {
  /** Gruppo di età dichiarato nel profilo; null se il profilo è incompleto. */
  ageGroup: AgeGroup | null;
  hasProfile: boolean;
  ref: string | null;
  nickname: string | null;
  avatar: AvatarId;
  joinLeaderboard: boolean;
  showToFriends: boolean;
  acceptRequests: boolean;
  friendCode: string | null;
  /** Quando si potrà cambiare di nuovo il soprannome (ISO), se è in attesa. */
  nicknameLockedUntil: string | null;
  blocked: number;
};

export type LeaderRow = { rank: number; ref: string; nickname: string; avatar: string; xp: number; isMe: boolean };
export type FriendRow = {
  id: string;
  ref: string;
  status: "pending" | "accepted";
  incoming: boolean;
  visible: boolean;
  nickname: string | null;
  avatar: string | null;
  xp: number | null;
  streak: number | null;
  belt: "white" | "yellow" | null;
};
export type GroupMemberRow = { ref: string; nickname: string; avatar: string; xp: number; isOwner: boolean; isMe: boolean };
export type GroupView = {
  id: string;
  name: string;
  audience: GroupAudience;
  isOwner: boolean;
  members: number;
  code: string | null;
  list: GroupMemberRow[];
  totalLessons: number;
  totalXpWeek: number;
};
export type ChallengeView = {
  id: string;
  title: string;
  hint: string;
  target: number;
  joined: boolean;
  value: number;
  done: boolean;
};

// ---------- utilità ----------

function dbMessage(e: unknown): string {
  const anyE = e as { message?: string; cause?: { message?: string } } | undefined;
  return `${anyE?.cause?.message ?? ""} ${anyE?.message ?? ""}`;
}
function dbCode(e: unknown): string | undefined {
  const anyE = e as { code?: string; cause?: { code?: string } } | undefined;
  return anyE?.cause?.code ?? anyE?.code;
}

/** Traduce gli errori delle regole nel database (trigger, vincoli) in frasi comprensibili. */
function friendlyDbError(e: unknown): string {
  const m = dbMessage(e);
  const map: [string, string][] = [
    ["social_nickname_cooldown", `Puoi cambiare il soprannome una volta ogni ${NICKNAME_COOLDOWN_DAYS} giorni.`],
    ["social_age_mismatch", "Questa persona o questo gruppo non è nella tua fascia d'età."],
    ["social_friend_limit_other", "Questa persona ha già raggiunto il numero massimo di amici."],
    ["social_friend_limit", `Hai già ${MAX_FRIENDS} amici o richieste: rimuovine qualcuna prima.`],
    ["social_not_accepting", "Questo codice non è disponibile."],
    ["social_group_full", `Il gruppo è pieno (massimo ${MAX_GROUP_SIZE} persone).`],
    ["social_group_limit", `Puoi stare al massimo in ${MAX_JOINED_GROUPS} gruppi.`],
    ["social_group_owner_limit", `Puoi creare al massimo ${MAX_OWNED_GROUPS} gruppi.`],
    ["social_group_owner_must_be_adult", "Solo chi ha dichiarato almeno 18 anni può creare un gruppo."],
    ["social_blocked", "Hai bloccato questo gruppo."],
    ["social_nickname_required", "Scegli prima un soprannome."],
    ["social_profile_missing", "Scegli prima un soprannome."],
  ];
  for (const [k, text] of map) if (m.includes(k)) return text;
  const code = dbCode(e);
  if (code === "23505") {
    if (m.includes("nickname_key")) return "Questo soprannome è già usato: scegline un altro.";
    if (m.includes("friendships_pair")) return "Siete già amici, oppure c'è già una richiesta in sospeso.";
    return "Operazione già fatta o codice già esistente: riprova.";
  }
  console.error("Errore social inatteso:", m.slice(0, 300));
  return "Qualcosa non ha funzionato: riprova tra poco.";
}

/** Limite di tentativi sui codici (anti indovinello): qualche prova ogni 10 minuti, per utente. */
const attempts = new Map<string, number[]>();
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const ATTEMPT_MAX = 10;
function tooManyAttempts(userId: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(userId) ?? []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  if (recent.length >= ATTEMPT_MAX) {
    attempts.set(userId, recent);
    return true;
  }
  recent.push(now);
  attempts.set(userId, recent);
  return false;
}
export function _resetAttemptsForTests() {
  attempts.clear();
}

type SocialRow = typeof schema.socialProfiles.$inferSelect;

/**
 * Il social segue la fascia d'età del profilo. Se è cambiata da quando l'utente è entrato (un minore che
 * si dichiara adulto o il contrario), si azzera tutto: soprannome, amici, gruppi. Niente passaggi di gruppo.
 */
async function loadContext(tx: Tx, userId: string): Promise<{ ageGroup: AgeGroup | null; row: SocialRow | null }> {
  const [profile] = await tx.select({ ageBand: schema.profiles.ageBand }).from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1);
  const ageGroup = ageGroupOf(profile?.ageBand);
  const [row] = await tx.select().from(schema.socialProfiles).where(eq(schema.socialProfiles.userId, userId)).limit(1);
  if (row && row.ageGroup !== ageGroup) {
    await wipeSocial(tx, userId);
    return { ageGroup, row: null };
  }
  return { ageGroup, row: row ?? null };
}

async function wipeSocial(tx: Tx, userId: string) {
  await tx.delete(schema.friendships).where(sql`${schema.friendships.requesterId} = ${userId} or ${schema.friendships.addresseeId} = ${userId}`);
  await tx.delete(schema.groupMembers).where(eq(schema.groupMembers.userId, userId));
  await tx.delete(schema.studyGroups).where(eq(schema.studyGroups.ownerId, userId));
  await tx.delete(schema.socialProfiles).where(eq(schema.socialProfiles.userId, userId));
}

const iso = (d: Date) => d.toISOString();

// ---------- impostazioni e soprannome ----------

export async function getSettings(userId: string): Promise<SocialSettings> {
  return withUser(userId, async (tx) => {
    const { ageGroup, row } = await loadContext(tx, userId);
    const [{ n }] = await tx
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.socialBlocks)
      .where(eq(schema.socialBlocks.userId, userId));
    const locked =
      row?.nicknameChangedAt && !canChangeNickname(row.nicknameChangedAt, new Date(), NICKNAME_COOLDOWN_DAYS)
        ? iso(nextChangeAt(row.nicknameChangedAt, NICKNAME_COOLDOWN_DAYS))
        : null;
    return {
      ageGroup,
      hasProfile: !!row && !!row.nickname,
      ref: row?.publicId ?? null,
      nickname: row?.nickname ?? null,
      avatar: (isAvatarId(row?.avatar) ? row?.avatar : "sensei") as AvatarId,
      joinLeaderboard: row?.joinLeaderboard ?? false,
      showToFriends: row?.showToFriends ?? false,
      acceptRequests: row?.acceptRequests ?? false,
      friendCode: row?.friendCode ?? null,
      nicknameLockedUntil: locked,
      blocked: n,
    };
  });
}

export async function saveNickname(userId: string, input: { nickname: string; avatar: string }, ctx: NicknameContext): Promise<Result> {
  if (!isAvatarId(input.avatar)) return fail("Scegli un avatar dell'elenco.");
  const v = validateNickname(input.nickname, ctx);
  if (!v.ok) return fail(v.error);
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      const { ageGroup, row } = await loadContext(tx, userId);
      if (!ageGroup) return fail("Completa prima il profilo (fascia d'età): serve a tenere i ragazzi separati dagli adulti.");
      if (!row) {
        await tx.insert(schema.socialProfiles).values({
          userId,
          publicId: generatePublicId(),
          nickname: v.nickname,
          nicknameKey: v.key,
          avatar: input.avatar,
          ageGroup,
        });
        return { ok: true };
      }
      if (row.nickname === v.nickname) {
        await tx.update(schema.socialProfiles).set({ avatar: input.avatar }).where(eq(schema.socialProfiles.userId, userId));
        return { ok: true };
      }
      if (row.nickname && !canChangeNickname(row.nicknameChangedAt, new Date(), NICKNAME_COOLDOWN_DAYS)) {
        return fail(`Puoi cambiare il soprannome una volta ogni ${NICKNAME_COOLDOWN_DAYS} giorni.`);
      }
      await tx
        .update(schema.socialProfiles)
        .set({ nickname: v.nickname, nicknameKey: v.key, avatar: input.avatar })
        .where(eq(schema.socialProfiles.userId, userId));
      return { ok: true };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

export type Toggles = { joinLeaderboard: boolean; showToFriends: boolean; acceptRequests: boolean };

export async function saveToggles(userId: string, t: Toggles): Promise<Result> {
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      const { row } = await loadContext(tx, userId);
      if (!row?.nickname) return fail("Prima scegli un soprannome e un avatar.");
      // Chi accetta richieste ha bisogno di un codice; chi le rifiuta lo tiene spento.
      const friendCode = t.acceptRequests ? (row.friendCode ?? generateCode()) : null;
      await tx
        .update(schema.socialProfiles)
        .set({ joinLeaderboard: t.joinLeaderboard, showToFriends: t.showToFriends, acceptRequests: t.acceptRequests, friendCode })
        .where(eq(schema.socialProfiles.userId, userId));
      return { ok: true };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

/** Nuovo codice amico (il vecchio smette di funzionare subito) oppure codice spento. */
export async function setFriendCode(userId: string, mode: "renew" | "disable"): Promise<Result> {
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      const { row } = await loadContext(tx, userId);
      if (!row?.nickname) return fail("Prima scegli un soprannome e un avatar.");
      if (mode === "renew") {
        await tx.update(schema.socialProfiles).set({ friendCode: generateCode(), acceptRequests: true }).where(eq(schema.socialProfiles.userId, userId));
      } else {
        await tx.update(schema.socialProfiles).set({ friendCode: null, acceptRequests: false }).where(eq(schema.socialProfiles.userId, userId));
      }
      return { ok: true };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

/** Toglie tutti i blocchi (anche quelli nati da una segnalazione): chi li ha messi decide di rivedere quelle persone. */
export async function unblockAll(userId: string): Promise<Result> {
  await withUser(userId, (tx) => tx.delete(schema.socialBlocks).where(eq(schema.socialBlocks.userId, userId)));
  return { ok: true };
}

// ---------- classifica ----------

export async function getLeaderboard(userId: string, now = new Date()): Promise<{ week: WeekBounds; rows: LeaderRow[] }> {
  const week = weekBounds(now);
  const rows = await withUser(userId, async (tx) => {
    await loadContext(tx, userId);
    const r = await tx.execute(
      sql`select * from social_leaderboard(${iso(week.start)}::timestamptz, ${iso(week.end)}::timestamptz, ${LEADERBOARD_LIMIT})`,
    );
    return r.rows as { rank: number; public_id: string; nickname: string; avatar: string; xp: number; is_me: boolean }[];
  });
  return { week, rows: rows.map((r) => ({ rank: r.rank, ref: r.public_id, nickname: r.nickname, avatar: r.avatar, xp: r.xp, isMe: r.is_me })) };
}

/** Classifica di un solo corso (lettera F, C, D, T, H): conta gli XP delle lezioni di quel corso nella settimana. Stessa fascia d'età, solo chi partecipa. */
export async function getCourseLeaderboard(userId: string, course: string, now = new Date()): Promise<{ week: WeekBounds; rows: LeaderRow[] }> {
  const week = weekBounds(now);
  if (!/^[A-Z]$/.test(course)) return { week, rows: [] };
  const rows = await withUser(userId, async (tx) => {
    await loadContext(tx, userId);
    const r = await tx.execute(
      sql`select * from course_leaderboard(${course}, ${iso(week.start)}::timestamptz, ${iso(week.end)}::timestamptz, ${LEADERBOARD_LIMIT})`,
    );
    return r.rows as { rank: number; public_id: string; nickname: string; avatar: string; xp: number; is_me: boolean }[];
  });
  return { week, rows: rows.map((r) => ({ rank: r.rank, ref: r.public_id, nickname: r.nickname, avatar: r.avatar, xp: r.xp, isMe: r.is_me })) };
}

// ---------- amici ----------

/** Cintura mostrata agli amici: gialla se il primo modulo di Fondamenta è completo (come nel Profilo). */
function beltOf(completed: Set<string>): "white" | "yellow" {
  const lessons = loadCatalog().filter((l) => l.course === "fondamenta");
  const first = lessons.filter((l) => l.module === 1);
  const pool = first.length ? first : lessons;
  return pool.length > 0 && pool.every((l) => completed.has(l.id)) ? "yellow" : "white";
}

type FriendSql = {
  friendship_id: string;
  status: "pending" | "accepted";
  incoming: boolean;
  public_id: string;
  visible: boolean;
  nickname: string | null;
  avatar: string | null;
  xp: number | null;
  streak_current: number | null;
  streak_last_day: string | null;
  timezone: string | null;
  completed_lessons: string[] | null;
};

async function friendRows(tx: Tx, week: WeekBounds): Promise<FriendSql[]> {
  const r = await tx.execute(sql`select * from social_friends(${iso(week.start)}::timestamptz, ${iso(week.end)}::timestamptz)`);
  return r.rows as FriendSql[];
}

export async function getFriends(userId: string, now = new Date()): Promise<FriendRow[]> {
  const week = weekBounds(now);
  const rows = await withUser(userId, async (tx) => {
    const { row } = await loadContext(tx, userId);
    if (!row) return [];
    return friendRows(tx, week);
  });
  return rows.map((r) => {
    const accepted = r.status === "accepted" && r.visible;
    const tz = r.timezone ?? "Europe/Rome";
    return {
      id: r.friendship_id,
      ref: r.public_id,
      status: r.status,
      incoming: r.incoming,
      visible: r.visible,
      nickname: r.nickname,
      avatar: r.avatar,
      xp: accepted ? r.xp : null,
      // Dei congelamenti dell'amico non sappiamo nulla: la serie mostrata è quella certa (senza).
      streak: accepted
        ? effectiveStreak({ current: r.streak_current ?? 0, best: r.streak_current ?? 0, lastDay: r.streak_last_day, freezes: 0 }, localDay(now, tz))
        : null,
      belt: accepted ? beltOf(new Set(r.completed_lessons ?? [])) : null,
    };
  });
}

export async function sendFriendRequest(userId: string, codeInput: string): Promise<Result> {
  const code = normalizeCode(codeInput);
  if (!code) return fail("Il codice ha 8 caratteri, nel formato XXXX-XXXX.");
  if (tooManyAttempts(userId)) return fail("Troppi tentativi: aspetta qualche minuto e riprova.");
  // Non dice quale dei motivi vale (per la privacy dell'altro), ma elenca tutti quelli possibili.
  const generic =
    "Non trovo questo codice. Controlla che sia giusto e che il tuo amico abbia attivato «Accetto richieste». Ricorda: si può diventare amici solo nella stessa fascia d'età (14-17 anni, oppure adulti).";
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      const { row } = await loadContext(tx, userId);
      if (!row?.nickname) return fail("Prima scegli un soprannome e un avatar.");
      if (!row.showToFriends) return fail("Per mandare richieste devi attivare «Mostro il soprannome agli amici» nelle impostazioni Social.");
      const found = (await tx.execute(sql`select * from social_resolve_friend_code(${code})`)).rows as { target_id: string }[];
      if (!found.length) return fail(generic);
      await tx.insert(schema.friendships).values({ id: crypto.randomUUID(), requesterId: userId, addresseeId: found[0].target_id, status: "pending" });
      return { ok: true };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

export async function respondToRequest(userId: string, friendshipId: string, accept: boolean): Promise<Result> {
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      if (accept) {
        const done = await tx
          .update(schema.friendships)
          .set({ status: "accepted", acceptedAt: new Date() })
          .where(and(eq(schema.friendships.id, friendshipId), eq(schema.friendships.addresseeId, userId), eq(schema.friendships.status, "pending")))
          .returning({ id: schema.friendships.id });
        return done.length ? { ok: true } : fail("Richiesta non trovata.");
      }
      const gone = await tx
        .delete(schema.friendships)
        .where(and(eq(schema.friendships.id, friendshipId), eq(schema.friendships.addresseeId, userId), eq(schema.friendships.status, "pending")))
        .returning({ id: schema.friendships.id });
      return gone.length ? { ok: true } : fail("Richiesta non trovata.");
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

/** Toglie un amico o ritira una richiesta inviata. Vale per entrambi i lati. */
export async function removeFriendship(userId: string, friendshipId: string): Promise<Result> {
  const gone = await withUser(userId, (tx) =>
    tx
      .delete(schema.friendships)
      .where(and(eq(schema.friendships.id, friendshipId), sql`(${schema.friendships.requesterId} = ${userId} or ${schema.friendships.addresseeId} = ${userId})`))
      .returning({ id: schema.friendships.id }),
  );
  return gone.length ? { ok: true } : fail("Amicizia non trovata.");
}

// ---------- gruppi ----------

export async function createGroup(userId: string, input: { kind: string; theme: string; num: number; audience: GroupAudience }): Promise<Result<{ code: string }>> {
  const name = composeGroupName(input.kind, input.theme, input.num);
  if (!name) return fail("Scegli il nome del gruppo dagli elenchi.");
  if (input.audience !== "minori" && input.audience !== "adulti") return fail("Scegli a chi è aperto il gruppo.");
  const code = generateCode();
  try {
    return await withUser(userId, async (tx): Promise<Result<{ code: string }>> => {
      const { ageGroup, row } = await loadContext(tx, userId);
      if (!row?.nickname) return fail("Prima scegli un soprannome e un avatar.");
      if (!canCreateGroup(ageGroup)) return fail("Solo chi ha dichiarato almeno 18 anni può creare un gruppo. Puoi entrare in un gruppo con un codice.");
      const id = crypto.randomUUID();
      await tx.insert(schema.studyGroups).values({ id, name, ownerId: userId, audience: input.audience, joinCode: code });
      await tx.insert(schema.groupMembers).values({ groupId: id, userId });
      return { ok: true, code };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

export async function joinGroup(userId: string, codeInput: string): Promise<Result> {
  const code = normalizeCode(codeInput);
  if (!code) return fail("Il codice ha 8 caratteri, nel formato XXXX-XXXX.");
  if (tooManyAttempts(userId)) return fail("Troppi tentativi: aspetta qualche minuto e riprova.");
  try {
    return await withUser(userId, async (tx): Promise<Result> => {
      const { ageGroup, row } = await loadContext(tx, userId);
      if (!row?.nickname) return fail("Prima scegli un soprannome e un avatar.");
      const found = (await tx.execute(sql`select * from social_resolve_group_code(${code})`)).rows as { group_id: string; audience: GroupAudience; members: number }[];
      if (!found.length) return fail("Codice non valido o non disponibile.");
      const g = found[0];
      if (!canJoinGroup(ageGroup, g.audience)) return fail("Questo gruppo non è aperto alla tua fascia d'età.");
      const [already] = await tx
        .select({ g: schema.groupMembers.groupId })
        .from(schema.groupMembers)
        .where(and(eq(schema.groupMembers.userId, userId), eq(schema.groupMembers.groupId, g.group_id)));
      if (already) return fail("Sei già in questo gruppo.");
      await tx.insert(schema.groupMembers).values({ groupId: g.group_id, userId });
      return { ok: true };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

export async function leaveGroup(userId: string, groupId: string): Promise<Result> {
  return withUser(userId, async (tx): Promise<Result> => {
    const [g] = await tx.select({ owner: schema.studyGroups.ownerId }).from(schema.studyGroups).where(and(eq(schema.studyGroups.id, groupId), eq(schema.studyGroups.ownerId, userId)));
    if (g) return fail("Sei il creatore: per chiudere il gruppo usa «Elimina gruppo».");
    const gone = await tx
      .delete(schema.groupMembers)
      .where(and(eq(schema.groupMembers.userId, userId), eq(schema.groupMembers.groupId, groupId)))
      .returning({ g: schema.groupMembers.groupId });
    return gone.length ? { ok: true } : fail("Gruppo non trovato.");
  });
}

export async function deleteGroup(userId: string, groupId: string): Promise<Result> {
  const gone = await withUser(userId, (tx) =>
    tx
      .delete(schema.studyGroups)
      .where(and(eq(schema.studyGroups.id, groupId), eq(schema.studyGroups.ownerId, userId)))
      .returning({ id: schema.studyGroups.id }),
  );
  return gone.length ? { ok: true } : fail("Gruppo non trovato.");
}

export async function renewGroupCode(userId: string, groupId: string): Promise<Result<{ code: string }>> {
  const code = generateCode();
  try {
    const done = await withUser(userId, (tx) =>
      tx
        .update(schema.studyGroups)
        .set({ joinCode: code })
        .where(and(eq(schema.studyGroups.id, groupId), eq(schema.studyGroups.ownerId, userId)))
        .returning({ id: schema.studyGroups.id }),
    );
    return done.length ? { ok: true, code } : fail("Gruppo non trovato.");
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

export async function getGroups(userId: string, now = new Date()): Promise<GroupView[]> {
  const week = weekBounds(now);
  return withUser(userId, async (tx) => {
    const { row } = await loadContext(tx, userId);
    if (!row) return [];
    const mine = (await tx.execute(sql`select * from social_my_groups()`)).rows as {
      group_id: string;
      name: string;
      audience: GroupAudience;
      is_owner: boolean;
      members: number;
      join_code: string | null;
    }[];
    const out: GroupView[] = [];
    for (const g of mine) {
      const d = (await tx.execute(sql`select * from social_group_detail(${g.group_id}, ${iso(week.start)}::timestamptz, ${iso(week.end)}::timestamptz)`)).rows as {
        public_id: string;
        nickname: string;
        avatar: string;
        xp: number;
        is_owner: boolean;
        is_me: boolean;
        total_lessons: number;
        total_xp_week: number;
      }[];
      out.push({
        id: g.group_id,
        name: g.name,
        audience: g.audience,
        isOwner: g.is_owner,
        members: g.members,
        code: g.join_code,
        list: d.map((m) => ({ ref: m.public_id, nickname: m.nickname, avatar: m.avatar, xp: m.xp, isOwner: m.is_owner, isMe: m.is_me })),
        totalLessons: d[0]?.total_lessons ?? 0,
        totalXpWeek: d[0]?.total_xp_week ?? 0,
      });
    }
    return out;
  });
}

// ---------- sfide ----------

async function loadProgressData(tx: Tx, userId: string): Promise<ProgressData> {
  const lessons = await tx
    .select({ at: schema.lessonProgress.completedAt })
    .from(schema.lessonProgress)
    .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.status, "completata")));
  const xp = await tx.select({ at: schema.xpEvents.createdAt, amount: schema.xpEvents.amount }).from(schema.xpEvents).where(eq(schema.xpEvents.userId, userId));
  return { lessonDates: lessons.flatMap((l) => (l.at ? [l.at] : [])), xpEvents: xp };
}

async function loadEntries(tx: Tx, userId: string): Promise<ChallengeEntry[]> {
  return tx
    .select({ challengeId: schema.challengeEntries.challengeId, weekStart: schema.challengeEntries.weekStart, joinedAt: schema.challengeEntries.joinedAt })
    .from(schema.challengeEntries)
    .where(eq(schema.challengeEntries.userId, userId));
}

export async function getChallenges(userId: string, now = new Date()): Promise<{ week: WeekBounds; list: ChallengeView[]; wins: number }> {
  const week = weekBounds(now);
  return withUser(userId, async (tx) => {
    const [data, entries] = await Promise.all([loadProgressData(tx, userId), loadEntries(tx, userId)]);
    const list = CHALLENGES.map((c): ChallengeView => {
      const e = entries.find((x) => x.challengeId === c.id && x.weekStart === week.key);
      const p = e ? entryProgress(e, data, now) : null;
      return { id: c.id, title: c.title, hint: c.hint, target: c.target, joined: !!e, value: p?.value ?? 0, done: p?.done ?? false };
    });
    return { week, list, wins: countWins(entries, data, now) };
  });
}

/** Sfide vinte in settimane concluse: serve alle medaglie del Profilo. */
export async function getChallengeWins(userId: string, now = new Date()): Promise<number> {
  return withUser(userId, async (tx) => {
    const entries = await loadEntries(tx, userId);
    if (!entries.length) return 0;
    return countWins(entries, await loadProgressData(tx, userId), now);
  });
}

export async function setChallenge(userId: string, challengeId: string, join: boolean, now = new Date()): Promise<Result> {
  if (!challengeById(challengeId)) return fail("Sfida non trovata.");
  const week = weekBounds(now);
  await withUser(userId, async (tx) => {
    if (join) {
      await tx.insert(schema.challengeEntries).values({ userId, challengeId, weekStart: week.key, joinedAt: now }).onConflictDoNothing();
    } else {
      await tx
        .delete(schema.challengeEntries)
        .where(and(eq(schema.challengeEntries.userId, userId), eq(schema.challengeEntries.challengeId, challengeId), eq(schema.challengeEntries.weekStart, week.key)));
    }
  });
  return { ok: true };
}

// ---------- segnalazioni e blocchi ----------

/**
 * Segnala e blocca subito. Si salvano solo tipo, identificativo pubblico, motivo e data (nessun dato di
 * chi segnala). Chi segnala non vede più l'elemento: amicizia tolta o gruppo lasciato, e non lo rivede in classifica.
 */
export async function reportTarget(
  userId: string,
  input: { kind: "user" | "group"; targetId: string; reason: ReportReason },
): Promise<Result<{ reportId: string }>> {
  try {
    return await withUser(userId, async (tx): Promise<Result<{ reportId: string }>> => {
      const { row } = await loadContext(tx, userId);
      if (!row) return fail("Per segnalare serve un profilo social.");
      if (input.kind === "user" && input.targetId === row.publicId) return fail("Non puoi segnalare te stesso.");
      const since = new Date(Date.now() - 3_600_000);
      const [{ n }] = await tx
        .select({ n: sql<number>`count(*)::int` })
        .from(schema.socialBlocks)
        .where(and(eq(schema.socialBlocks.userId, userId), gte(schema.socialBlocks.createdAt, since)));
      if (n >= REPORTS_PER_HOUR) return fail("Hai fatto molte segnalazioni in poco tempo: riprova più tardi.");

      if (input.kind === "group") {
        const [own] = await tx.select({ id: schema.studyGroups.id }).from(schema.studyGroups).where(and(eq(schema.studyGroups.id, input.targetId), eq(schema.studyGroups.ownerId, userId)));
        if (own) return fail("Non puoi segnalare un gruppo creato da te.");
      }

      const reportId = crypto.randomUUID();
      const fresh = await tx.insert(schema.socialBlocks).values({ userId, kind: input.kind, targetId: input.targetId }).onConflictDoNothing().returning({ t: schema.socialBlocks.targetId });
      if (!fresh.length) return fail("Hai già segnalato e bloccato questo elemento.");
      await tx.insert(schema.socialReports).values({ id: reportId, kind: input.kind, targetId: input.targetId, reason: input.reason });

      if (input.kind === "group") {
        await tx.delete(schema.groupMembers).where(and(eq(schema.groupMembers.userId, userId), eq(schema.groupMembers.groupId, input.targetId)));
      } else {
        const friends = await friendRows(tx, weekBounds());
        for (const f of friends.filter((x) => x.public_id === input.targetId)) {
          await tx.delete(schema.friendships).where(eq(schema.friendships.id, f.friendship_id));
        }
      }
      return { ok: true, reportId };
    });
  } catch (e) {
    return fail(friendlyDbError(e));
  }
}

// ---------- esportazione dei dati ----------

/** Dati social dell'utente, per l'esportazione GDPR. Solo righe proprie: niente dati di altre persone. */
export async function exportSocial(tx: Tx, userId: string) {
  const [profilo] = await tx.select().from(schema.socialProfiles).where(eq(schema.socialProfiles.userId, userId));
  return {
    profilo: profilo ?? null,
    amicizie: await tx
      .select({ id: schema.friendships.id, inviataDaTe: sql<boolean>`${schema.friendships.requesterId} = ${userId}`, stato: schema.friendships.status, creata: schema.friendships.createdAt, accettata: schema.friendships.acceptedAt })
      .from(schema.friendships)
      .where(sql`${schema.friendships.requesterId} = ${userId} or ${schema.friendships.addresseeId} = ${userId}`),
    gruppiDoveSei: await tx.select().from(schema.groupMembers).where(eq(schema.groupMembers.userId, userId)),
    gruppiCreati: await tx.select().from(schema.studyGroups).where(eq(schema.studyGroups.ownerId, userId)),
    blocchi: await tx.select().from(schema.socialBlocks).where(eq(schema.socialBlocks.userId, userId)),
    sfide: await tx.select().from(schema.challengeEntries).where(eq(schema.challengeEntries.userId, userId)),
  };
}

/** Da chiamare quando cambia la fascia d'età nel profilo: azzera subito il social (nessun resto nella vecchia fascia). */
export async function resetSocialIfAgeChanged(userId: string): Promise<void> {
  await withUser(userId, async (tx) => {
    await loadContext(tx, userId);
  });
}
