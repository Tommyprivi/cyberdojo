import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { readAnnouncements } from "../announcements";
import { schema } from "../db";
import { withUser } from "../db/scoped";
import { mergeAnnouncements, type MergedAnnouncement } from "./merge";
import {
  summarize,
  type EngagementSummary,
  type Emoji,
  type PhraseCountRow,
  type PhraseKey,
  type ReactionCountRow,
} from "./reactions";
import { isStaffUser } from "./staff";
import { makeAnnouncementId, type AnnouncementInput } from "./validation";

/**
 * Annunci (file + database), reazioni e frasi. Ogni lettura/scrittura di dati utente passa da `withUser`.
 * Se la migrazione 0006 non è ancora applicata le letture dal database danno un elenco vuoto invece di rompere la pagina.
 */

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });

/** Gli annunci dei file, nella forma comune. */
export function fileAnnouncements(): MergedAnnouncement[] {
  return readAnnouncements().map((a) => ({ ...a, source: "file" as const, pinned: false }));
}

const day = (d: Date) => d.toISOString().slice(0, 10);

/** Tutti gli annunci (database + file), fissati in cima poi per data. Senza utente: solo i file. */
export async function getAllAnnouncements(userId: string | null): Promise<MergedAnnouncement[]> {
  const files = fileAnnouncements();
  if (!userId) return files;
  try {
    const rows = await withUser(userId, (tx) => tx.select().from(schema.announcements).orderBy(desc(schema.announcements.publishedAt)).limit(200));
    const db: MergedAnnouncement[] = rows.map((r) => ({
      id: r.id,
      date: day(r.publishedAt),
      title: r.title,
      summary: r.summary,
      body: r.body,
      tags: r.tags,
      source: "db",
      pinned: r.pinned,
    }));
    return mergeAnnouncements(files, db);
  } catch (e) {
    console.error("Annunci dal database non disponibili:", e instanceof Error ? e.message : e);
    return mergeAnnouncements(files, []);
  }
}

// ---------- staff ----------

export async function hasStaffRole(userId: string): Promise<boolean> {
  try {
    const rows = await withUser(userId, (tx) => tx.select({ id: schema.staffRoles.userId }).from(schema.staffRoles).where(and(eq(schema.staffRoles.userId, userId), inArray(schema.staffRoles.role, ["staff", "admin"]))).limit(1));
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Controllo staff SEMPRE lato server: riga in staff_roles oppure email verificata in STAFF_EMAILS. */
export async function checkStaff(user: { id: string; email?: string | null; emailVerified?: boolean | null }): Promise<boolean> {
  return isStaffUser({
    hasRole: await hasStaffRole(user.id),
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    staffEmails: process.env.STAFF_EMAILS,
  });
}

/** Registro di chi ha fatto cosa (nei log del server, senza testo degli annunci). */
function audit(action: string, userId: string, id: string) {
  console.info(JSON.stringify({ audit: "annunci", action, by: userId, announcement: id, at: new Date().toISOString() }));
}

export async function createAnnouncement(userId: string, input: AnnouncementInput, now = new Date()): Promise<Result<{ id: string }>> {
  const id = makeAnnouncementId(input.title, now, Math.random().toString(36).slice(2, 6));
  try {
    await withUser(userId, (tx) =>
      tx.insert(schema.announcements).values({ id, title: input.title, summary: input.summary, body: input.body, tags: input.tags, pinned: input.pinned, authorId: userId, publishedAt: now }),
    );
  } catch (e) {
    console.error("Creazione annuncio non riuscita:", e instanceof Error ? e.message : e);
    return fail("Non sono riuscito a salvare l'annuncio.");
  }
  audit("crea", userId, id);
  return { ok: true, id };
}

export async function updateAnnouncement(userId: string, id: string, input: AnnouncementInput): Promise<Result> {
  try {
    const done = await withUser(userId, (tx) =>
      tx.update(schema.announcements).set({ title: input.title, summary: input.summary, body: input.body, tags: input.tags, pinned: input.pinned }).where(eq(schema.announcements.id, id)).returning({ id: schema.announcements.id }),
    );
    if (done.length === 0) return fail("Annuncio non trovato (quelli dei file non si modificano da qui).");
  } catch {
    return fail("Non sono riuscito a salvare le modifiche.");
  }
  audit("modifica", userId, id);
  return { ok: true };
}

export async function setPinned(userId: string, id: string, pinned: boolean): Promise<Result> {
  try {
    const done = await withUser(userId, (tx) => tx.update(schema.announcements).set({ pinned }).where(eq(schema.announcements.id, id)).returning({ id: schema.announcements.id }));
    if (done.length === 0) return fail("Annuncio non trovato.");
  } catch {
    return fail("Non sono riuscito a cambiare lo stato.");
  }
  audit(pinned ? "fissa" : "stacca", userId, id);
  return { ok: true };
}

export async function deleteAnnouncement(userId: string, id: string): Promise<Result> {
  try {
    const done = await withUser(userId, (tx) => tx.delete(schema.announcements).where(eq(schema.announcements.id, id)).returning({ id: schema.announcements.id }));
    if (done.length === 0) return fail("Annuncio non trovato.");
  } catch {
    return fail("Non sono riuscito a cancellare l'annuncio.");
  }
  audit("cancella", userId, id);
  return { ok: true };
}

// ---------- reazioni e frasi ----------

/** Conteggi (funzioni SQL aggregate, senza nomi) e scelte proprie (query dentro withUser). */
export async function getEngagement(userId: string, ids: string[]): Promise<Record<string, EngagementSummary>> {
  const empty = Object.fromEntries(ids.map((id) => [id, summarize(id, [], [], { emoji: null, phrases: [] })]));
  if (ids.length === 0) return empty;
  try {
    return await withUser(userId, async (tx) => {
      const list = sql`array[${sql.join(ids.map((i) => sql`${i}`), sql`, `)}]::text[]`;
      const reactions = (await tx.execute(sql`select * from announcement_reaction_counts(${list})`)).rows as ReactionCountRow[];
      const phrases = (await tx.execute(sql`select * from announcement_phrase_counts(${list})`)).rows as PhraseCountRow[];
      const myR = await tx
        .select({ id: schema.announcementReactions.announcementId, emoji: schema.announcementReactions.emoji })
        .from(schema.announcementReactions)
        .where(and(eq(schema.announcementReactions.userId, userId), inArray(schema.announcementReactions.announcementId, ids)));
      const myP = await tx
        .select({ id: schema.announcementPhrases.announcementId, key: schema.announcementPhrases.phraseKey })
        .from(schema.announcementPhrases)
        .where(and(eq(schema.announcementPhrases.userId, userId), inArray(schema.announcementPhrases.announcementId, ids)));
      return Object.fromEntries(
        ids.map((id) => [
          id,
          summarize(id, reactions, phrases, { emoji: myR.find((r) => r.id === id)?.emoji ?? null, phrases: myP.filter((p) => p.id === id).map((p) => p.key) }),
        ]),
      );
    });
  } catch (e) {
    console.error("Reazioni non disponibili:", e instanceof Error ? e.message : e);
    return empty;
  }
}

/** Una sola emoji per persona e annuncio: stessa emoji = la tolgo, un'altra = cambio. `null` = tolgo. */
export async function setReaction(userId: string, announcementId: string, emoji: Emoji | null): Promise<Result> {
  try {
    await withUser(userId, async (tx) => {
      if (emoji === null) {
        await tx.delete(schema.announcementReactions).where(and(eq(schema.announcementReactions.userId, userId), eq(schema.announcementReactions.announcementId, announcementId)));
        return;
      }
      await tx
        .insert(schema.announcementReactions)
        .values({ announcementId, userId, emoji })
        .onConflictDoUpdate({ target: [schema.announcementReactions.announcementId, schema.announcementReactions.userId], set: { emoji, createdAt: new Date() } });
    });
    return { ok: true };
  } catch {
    return fail("Non sono riuscito a salvare la reazione.");
  }
}

export async function setPhrase(userId: string, announcementId: string, key: PhraseKey, on: boolean): Promise<Result> {
  try {
    await withUser(userId, async (tx) => {
      if (on) {
        await tx.insert(schema.announcementPhrases).values({ announcementId, userId, phraseKey: key }).onConflictDoNothing();
      } else {
        await tx
          .delete(schema.announcementPhrases)
          .where(and(eq(schema.announcementPhrases.userId, userId), eq(schema.announcementPhrases.announcementId, announcementId), eq(schema.announcementPhrases.phraseKey, key)));
      }
    });
    return { ok: true };
  } catch {
    return fail("Non sono riuscito a salvare la frase.");
  }
}

// ---------- novità viste per account ----------

export async function getSeenNews(userId: string): Promise<string | null> {
  try {
    const [row] = await withUser(userId, (tx) => tx.select({ v: schema.profiles.seenNewsVersion }).from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1));
    return row?.v ?? null;
  } catch {
    return null;
  }
}

export async function saveSeenNews(userId: string, version: string): Promise<Result> {
  try {
    await withUser(userId, (tx) => tx.update(schema.profiles).set({ seenNewsVersion: version }).where(eq(schema.profiles.id, userId)));
    return { ok: true };
  } catch {
    return fail("Non sono riuscito a ricordare la novità.");
  }
}
