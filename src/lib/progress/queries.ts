import { and, eq, sql } from "drizzle-orm";
import { schema } from "../db";
import { withUser } from "../db/scoped";
import type { StreakState } from "./streak";

export type MemberProfile = typeof schema.profiles.$inferSelect;

export type MemberData = {
  profile: MemberProfile | null;
  /** ID delle lezioni con verifica superata. */
  completed: Set<string>;
  /** ID delle lezioni sbloccate con la prova di padronanza (nessun XP). */
  mastered: Set<string>;
  /** Quando ogni lezione è stata completata (per l'obiettivo giornaliero). */
  completedAt: Map<string, Date>;
  xp: number;
  streak: StreakState;
};

const EMPTY_STREAK: StreakState = { current: 0, best: 0, lastDay: null, freezes: 0 };

/** Tutto ciò che serve a Percorso e Profilo, in una sola transazione con la protezione per riga attiva. */
export async function getMemberData(userId: string): Promise<MemberData> {
  return withUser(userId, async (tx) => {
    const [profile] = await tx.select().from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1);

    const done = await tx
      .select({ lessonId: schema.lessonProgress.lessonId, completedAt: schema.lessonProgress.completedAt })
      .from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.status, "completata")));

    const masteredRows = await tx
      .select({ lessonId: schema.lessonProgress.lessonId })
      .from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.status, "padroneggiata")));

    const [{ total }] = await tx
      .select({ total: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int` })
      .from(schema.xpEvents)
      .where(eq(schema.xpEvents.userId, userId));

    const [streakRow] = await tx.select().from(schema.streaks).where(eq(schema.streaks.userId, userId)).limit(1);

    return {
      profile: profile ?? null,
      completed: new Set(done.map((d) => d.lessonId)),
      mastered: new Set(masteredRows.map((d) => d.lessonId)),
      completedAt: new Map(done.filter((d) => d.completedAt).map((d) => [d.lessonId, d.completedAt as Date])),
      xp: total,
      streak: streakRow
        ? { current: streakRow.current, best: streakRow.best, lastDay: streakRow.lastDay, freezes: streakRow.freezes }
        : EMPTY_STREAK,
    };
  });
}
