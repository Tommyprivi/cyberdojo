"use server";

import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { checkDaily, dailyStreak, dailyXpEvent, pickDaily, publicDaily, type PublicDaily } from "@/lib/daily/daily-core";
import { ALL_BANK_ITEMS } from "@/lib/practice/banks-all";
import { localDay } from "@/lib/progress/streak";
import { getSessionUser } from "@/lib/session";

/*
  Sfida del giorno. La domanda dipende solo dalla data (uguale per tutti); la risposta giusta non lascia
  mai il server. Un solo tentativo al giorno: sia la risposta giusta (5 XP) sia quella sbagliata (0 XP)
  si registrano in xp_events con riferimento = data, e il vincolo xp_once impedisce il secondo evento.
  La serie della sfida si calcola dai giorni vinti: non tocca la serie principale delle lezioni.
*/

export type DailyState = {
  day: string;
  question: PublicDaily;
  status: "todo" | "won" | "lost";
  streak: number;
  /** Presente solo dopo aver risposto. */
  correct?: string;
};

async function userAndDay(userId: string) {
  const [p] = await withUser(userId, (tx) =>
    tx.select({ tz: schema.profiles.timezone }).from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1),
  );
  return localDay(new Date(), p?.tz ?? "Europe/Rome");
}

async function readState(userId: string, day: string): Promise<DailyState> {
  const pick = pickDaily(day, ALL_BANK_ITEMS);
  const rows = await withUser(userId, (tx) =>
    tx
      .select({ kind: schema.xpEvents.kind, refId: schema.xpEvents.refId })
      .from(schema.xpEvents)
      .where(and(eq(schema.xpEvents.userId, userId), inArray(schema.xpEvents.kind, ["daily", "daily_miss"]))),
  );
  const won = rows.filter((r) => r.kind === "daily" && r.refId).map((r) => r.refId as string);
  const today = rows.find((r) => r.refId === day);
  const status = !today ? "todo" : today.kind === "daily" ? "won" : "lost";
  return {
    day,
    question: publicDaily(pick),
    status,
    streak: dailyStreak(won, day),
    ...(status === "todo" ? {} : { correct: pick.correct }),
  };
}

export async function getDaily(): Promise<DailyState | null> {
  const user = await getSessionUser();
  if (!user) return null;
  return readState(user.id, await userAndDay(user.id));
}

export async function answerDaily(chosen: string): Promise<{ ok: true; correct: boolean; xpGained: number; state: DailyState } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per fare la sfida del giorno." };
  if (typeof chosen !== "string" || chosen.length > 300) return { ok: false, error: "Richiesta non valida." };

  const day = await userAndDay(user.id);
  const pick = pickDaily(day, ALL_BANK_ITEMS);
  if (!pick.choices.includes(chosen)) return { ok: false, error: "Scelta non valida." };

  const correct = checkDaily(pick, chosen);
  const ev = dailyXpEvent(day, correct);
  const inserted = await withUser(user.id, (tx) =>
    tx
      .insert(schema.xpEvents)
      .values({ id: randomUUID(), userId: user.id, kind: ev.kind, amount: ev.amount, refId: ev.refId })
      .onConflictDoNothing()
      .returning({ amount: schema.xpEvents.amount }),
  );
  // Se l'evento esisteva già (secondo tentativo, o doppio clic) non si assegna nulla.
  const fresh = inserted.length > 0;
  const state = await readState(user.id, day);
  return { ok: true, correct: fresh ? correct : state.status === "won", xpGained: fresh ? ev.amount : 0, state };
}
