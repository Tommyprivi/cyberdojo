"use server";

import { eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { getSessionUser } from "@/lib/session";

/** Segna il tutorial di benvenuto come visto (o saltato): non ricompare più. Non riceve dati dal browser. */
export async function completeTutorial(): Promise<{ ok: boolean }> {
  const user = await getSessionUser();
  if (!user) return { ok: false };
  await withUser(user.id, (tx) => tx.update(schema.profiles).set({ tutorialDone: true }).where(eq(schema.profiles.id, user.id)));
  return { ok: true };
}
