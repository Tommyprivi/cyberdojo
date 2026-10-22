"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { sendMail } from "@/lib/email";
import { welcomeEmail } from "@/lib/mail/templates";
import { profileInput } from "@/lib/profile-options";
import { getSessionUser } from "@/lib/session";

const reminderInput = z.object({ enabled: z.boolean(), hour: z.number().int().min(0).max(23) });

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Crea o aggiorna il profilo dell'utente collegato. Valida tutto sul server: il browser non è fidato. */
export async function saveProfile(input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  const parsed = profileInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  const p = parsed.data;

  const isNew = await withUser(user.id, async (tx) => {
    const [existing] = await tx.select({ id: schema.profiles.id }).from(schema.profiles).where(eq(schema.profiles.id, user.id)).limit(1);
    await tx
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
      });
    return !existing;
  });

  // Il benvenuto parte solo alla prima creazione del profilo, non a ogni salvataggio. Se l'invio
  // fallisce, la registrazione resta valida: un'email persa non deve bloccare nessuno.
  if (isNew) {
    try {
      await sendMail({ to: user.email, mail: welcomeEmail({ name: user.name, email: user.email }) });
    } catch (e) {
      console.error("Invio dell'email di benvenuto non riuscito:", e instanceof Error ? e.message : e);
    }
  }
  return { ok: true };
}

/**
 * Preferenze sui promemoria di studio. Spenti di default: si attivano solo con una scelta esplicita e
 * solo se l'email è verificata (altrimenti si scriverebbe a chi non ha chiesto nulla).
 */
export async function saveReminderPrefs(input: { enabled: boolean; hour: number }): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  const parsed = reminderInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Scegli un'ora valida." };
  if (parsed.data.enabled && !user.emailVerified) {
    return { ok: false, error: "Prima conferma la tua email: ti abbiamo mandato un link." };
  }

  await withUser(user.id, (tx) =>
    tx
      .update(schema.profiles)
      .set({ reminderEmail: parsed.data.enabled, reminderHour: parsed.data.hour })
      .where(eq(schema.profiles.id, user.id)),
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
      esami: await tx.select().from(schema.examAttempts).where(eq(schema.examAttempts.userId, user.id)),
      xp: await tx.select().from(schema.xpEvents).where(eq(schema.xpEvents.userId, user.id)),
      serie: await tx.select().from(schema.streaks).where(eq(schema.streaks.userId, user.id)),
      ripasso: await tx.select().from(schema.reviewItems).where(eq(schema.reviewItems.userId, user.id)),
      note: await tx.select().from(schema.notes).where(eq(schema.notes.userId, user.id)),
      certificati: await tx.select().from(schema.certificates).where(eq(schema.certificates.userId, user.id)),
      consensi: await tx.select().from(schema.legalConsents).where(eq(schema.legalConsents.userId, user.id)),
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
  await withUser(user.id, async (tx) => {
    // La tabella dei token non ha collegamenti con l'utente: senza questo passaggio resterebbero
    // email e token di verifica dell'account cancellato (dato personale che deve sparire).
    await tx.delete(schema.verification).where(eq(schema.verification.identifier, user.email));
    await tx.delete(schema.verification).where(eq(schema.verification.value, user.id));
    await tx.delete(schema.user).where(eq(schema.user.id, user.id));
  });
  return { ok: true };
}
