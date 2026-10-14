"use server";

import { eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { profileInput } from "@/lib/profile-options";
import { getSessionUser } from "@/lib/session";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Crea o aggiorna il profilo dell'utente collegato. Valida tutto sul server: il browser non è fidato. */
export async function saveProfile(input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  const parsed = profileInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  const p = parsed.data;

  await withUser(user.id, (tx) =>
    tx
      .insert(schema.profiles)
      .values({
        id: user.id,
        ageBand: p.ageBand,
        confirmedAge14: true,
        goal: p.goal,
        dailyMinutes: p.dailyMinutes,
        dailyGoal: p.dailyGoal,
        timezone: p.timezone,
      })
      .onConflictDoUpdate({
        target: schema.profiles.id,
        set: { ageBand: p.ageBand, goal: p.goal, dailyMinutes: p.dailyMinutes, dailyGoal: p.dailyGoal, timezone: p.timezone },
      }),
  );
  return { ok: true };
}

/** Tutti i dati personali dell'utente in un unico file (diritto di accesso e portabilità, GDPR). */
export async function exportMyData(): Promise<{ ok: true; json: string; filename: string } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  const data = await withUser(user.id, async (tx) => {
    const [account] = await tx.select().from(schema.user).where(eq(schema.user.id, user.id));
    const [profile] = await tx.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
    return {
      account: account && { id: account.id, nome: account.name, email: account.email, creato: account.createdAt },
      profilo: profile ?? null,
      lezioni: await tx.select().from(schema.lessonProgress).where(eq(schema.lessonProgress.userId, user.id)),
      tentativi: await tx.select().from(schema.attempts).where(eq(schema.attempts.userId, user.id)),
      xp: await tx.select().from(schema.xpEvents).where(eq(schema.xpEvents.userId, user.id)),
      serie: await tx.select().from(schema.streaks).where(eq(schema.streaks.userId, user.id)),
      ripasso: await tx.select().from(schema.reviewItems).where(eq(schema.reviewItems.userId, user.id)),
      note: await tx.select().from(schema.notes).where(eq(schema.notes.userId, user.id)),
      certificati: await tx.select().from(schema.certificates).where(eq(schema.certificates.userId, user.id)),
    };
  });

  return {
    ok: true,
    json: JSON.stringify({ esportatoIl: new Date().toISOString(), ...data }, null, 2),
    filename: "cyberdojo-i-miei-dati.json",
  };
}

/** Cancella l'account e tutto ciò che contiene (cascata). Richiede di riscrivere l'email, per evitare errori. */
export async function deleteMyAccount(confirmEmail: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };
  if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
    return { ok: false, error: "L'email non coincide: l'account non è stato cancellato." };
  }
  await withUser(user.id, (tx) => tx.delete(schema.user).where(eq(schema.user.id, user.id)));
  return { ok: true };
}
