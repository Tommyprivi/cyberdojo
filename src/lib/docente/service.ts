import { and, eq, sql } from "drizzle-orm";
import { schema } from "../db";
import { withUser } from "../db/scoped";
import { canSeeClass, toProgressRow, type ProgressRow } from "./rules";

/**
 * Lato server del ruolo docente. Il ruolo si legge SEMPRE dal database (staff_roles), mai dal browser.
 * I progressi degli studenti arrivano solo dalla funzione SQL class_progress (migrazione 0009), che a sua volta
 * ripete il controllo (docente + creatore del gruppo) e restituisce solo chi ha acceso il consenso.
 */

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export type TeacherClass = { id: string; name: string; code: string; members: number; rows: ProgressRow[] };

export async function getRole(userId: string): Promise<string | null> {
  try {
    const rows = await withUser(userId, (tx) => tx.select({ role: schema.staffRoles.role }).from(schema.staffRoles).where(eq(schema.staffRoles.userId, userId)).limit(1));
    return rows[0]?.role ?? null;
  } catch {
    return null;
  }
}

export async function isTeacher(userId: string): Promise<boolean> {
  return canSeeClass({ role: await getRole(userId), isOwner: true });
}

/** Le classi create dal docente, con i progressi dei soli studenti consenzienti. Null se non è docente. */
export async function getTeacherClasses(userId: string): Promise<{ classes: TeacherClass[]; unavailable: boolean } | null> {
  if (!(await isTeacher(userId))) return null;
  try {
    const classes = await withUser(userId, async (tx) => {
      const owned = await tx
        .select({ id: schema.studyGroups.id, name: schema.studyGroups.name, code: schema.studyGroups.joinCode })
        .from(schema.studyGroups)
        .where(eq(schema.studyGroups.ownerId, userId))
        .orderBy(schema.studyGroups.name);
      const out: TeacherClass[] = [];
      for (const g of owned) {
        const members = await tx.select({ u: schema.groupMembers.userId }).from(schema.groupMembers).where(eq(schema.groupMembers.groupId, g.id));
        const prog = (await tx.execute(sql`select * from class_progress(${g.id})`)).rows as Record<string, unknown>[];
        // Il docente è membro del proprio gruppo ma non è uno studente: non lo contiamo.
        out.push({ ...g, members: Math.max(0, members.length - 1), rows: prog.map(toProgressRow) });
      }
      return out;
    });
    return { classes, unavailable: false };
  } catch (e) {
    console.error("Classi del docente non disponibili:", e instanceof Error ? e.message : e);
    return { classes: [], unavailable: true };
  }
}

/** Stato del consenso dello studente per un gruppo (solo la propria riga). */
export async function getShareState(userId: string, groupId: string): Promise<boolean | null> {
  try {
    const rows = await withUser(userId, (tx) =>
      tx.select({ s: schema.groupMembers.shareProgress }).from(schema.groupMembers).where(and(eq(schema.groupMembers.groupId, groupId), eq(schema.groupMembers.userId, userId))).limit(1),
    );
    return rows[0]?.s ?? null;
  } catch {
    return null;
  }
}

/** Accende o spegne il consenso. Tocca solo la propria riga (la RLS lo garantisce comunque). */
export async function setShareProgress(userId: string, groupId: string, share: boolean): Promise<Result> {
  try {
    const done = await withUser(userId, (tx) =>
      tx
        .update(schema.groupMembers)
        .set({ shareProgress: share })
        .where(and(eq(schema.groupMembers.groupId, groupId), eq(schema.groupMembers.userId, userId)))
        .returning({ g: schema.groupMembers.groupId }),
    );
    return done.length ? { ok: true } : { ok: false, error: "Non sei in questo gruppo." };
  } catch (e) {
    console.error("Consenso progressi non salvato:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Non sono riuscito a salvare la scelta: riprova tra poco." };
  }
}
