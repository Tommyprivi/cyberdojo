import { and, eq, gte } from "drizzle-orm";
import { schema } from "@/lib/db";
import type { Tx } from "@/lib/db/scoped";
import { CTF_XP_KIND, WINDOW_MS } from "./core";

/** Segreto del server per sementi e sali (lo stesso delle altre prove). Mai verso il browser. */
export function ctfSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("Manca BETTER_AUTH_SECRET");
  return secret ?? "solo-sviluppo";
}

export const exerciseKey = (challengeId: string) => `ctf:${challengeId}`;

/** Id delle sfide già risolte (hanno l'evento XP «ctf»). */
export async function solvedIds(tx: Tx, userId: string): Promise<Set<string>> {
  const rows = await tx
    .select({ ref: schema.xpEvents.refId })
    .from(schema.xpEvents)
    .where(and(eq(schema.xpEvents.userId, userId), eq(schema.xpEvents.kind, CTF_XP_KIND)));
  return new Set(rows.flatMap((r) => (r.ref ? [r.ref] : [])));
}

/** Istanti dei tentativi sbagliati nella finestra (per il limite). */
export async function recentFails(tx: Tx, userId: string, challengeId: string): Promise<Date[]> {
  const rows = await tx
    .select({ at: schema.attempts.createdAt })
    .from(schema.attempts)
    .where(
      and(
        eq(schema.attempts.userId, userId),
        eq(schema.attempts.exerciseId, exerciseKey(challengeId)),
        eq(schema.attempts.passed, false),
        gte(schema.attempts.createdAt, new Date(Date.now() - WINDOW_MS)),
      ),
    );
  return rows.map((r) => r.at);
}
