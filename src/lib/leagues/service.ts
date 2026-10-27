import { and, eq, gte, lt, sql } from "drizzle-orm";
import { schema } from "../db";
import { withUser } from "../db/scoped";
import { weekBounds } from "../social/week";
import { divisionIndex } from "./divisions";

export type LeagueState = {
  /** XP della settimana in corso. */
  thisWeekXp: number;
  /** Divisione di questa settimana (dagli XP della scorsa) e di quella prima. */
  currentIdx: number;
  previousIdx: number;
};

/** XP dell'utente in tre settimane consecutive, dai suoi eventi XP. Divisione = XP della settimana prima. */
export async function getLeagueState(userId: string, now = new Date()): Promise<LeagueState> {
  const w0 = weekBounds(now);
  const w1 = weekBounds(new Date(w0.start.getTime() - 1));
  const w2 = weekBounds(new Date(w1.start.getTime() - 1));
  const xpBetween = async (tx: Parameters<Parameters<typeof withUser>[1]>[0], from: Date, to: Date) => {
    const [r] = await tx
      .select({ total: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int` })
      .from(schema.xpEvents)
      .where(and(eq(schema.xpEvents.userId, userId), gte(schema.xpEvents.createdAt, from), lt(schema.xpEvents.createdAt, to)));
    return r?.total ?? 0;
  };
  return withUser(userId, async (tx) => {
    const [cur, prev, prevPrev] = [await xpBetween(tx, w0.start, w0.end), await xpBetween(tx, w1.start, w1.end), await xpBetween(tx, w2.start, w2.end)];
    return { thisWeekXp: cur, currentIdx: divisionIndex(prev), previousIdx: divisionIndex(prevPrev) };
  });
}
