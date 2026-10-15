"use server";

import { eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { verifyUnsubscribeToken } from "@/lib/mail/token";
import type { ActionResult } from "./profile";

/**
 * Disattiva i promemoria a chi ha il link firmato dell'email, senza bisogno di accedere.
 * L'identità arriva dalla firma del token: può disattivare solo i promemoria di quell'utente.
 */
export async function unsubscribeReminders(token: string): Promise<ActionResult> {
  const userId = verifyUnsubscribeToken(typeof token === "string" ? token : "");
  if (!userId) return { ok: false, error: "Questo link non è valido o è stato modificato." };

  await withUser(userId, (tx) =>
    tx.update(schema.profiles).set({ reminderEmail: false }).where(eq(schema.profiles.id, userId)),
  );
  return { ok: true };
}
