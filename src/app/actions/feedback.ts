"use server";

import { sendMail } from "@/lib/email";
import { createFeedbackLimiter, feedbackInput, FEEDBACK_TYPES } from "@/lib/feedback";
import { contactEmail } from "@/lib/mail/templates";
import { getSessionUser } from "@/lib/session";

/** Feedback dalla pagina Community. Serve l'account; resta anonimo a meno che chi scrive non chieda risposta. */

export type FeedbackResult = { ok: true } | { ok: false; error: string };

const tooMany = createFeedbackLimiter();

export async function sendFeedback(raw: unknown): Promise<FeedbackResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per lasciare un feedback." };

  const parsed = feedbackInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  const d = parsed.data;

  if (tooMany(user.id)) return { ok: false, error: "Hai appena scritto più feedback: aspetta qualche minuto e riprova." };

  const label = FEEDBACK_TYPES.find((t) => t.id === d.type)?.label ?? "Feedback";
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL?.trim() || process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1]?.trim() || "",
      mail: contactEmail({
        kind: `Feedback community: ${label}`,
        name: d.wantReply ? null : "anonimo",
        email: d.wantReply ? user.email : "anonimo (non vuole risposta)",
        subject: d.message.length > 60 ? `${d.message.slice(0, 57)}…` : d.message,
        message: d.message,
        where: "Pagina Community",
      }),
    });
  } catch (e) {
    console.error("Invio del feedback non riuscito:", e instanceof Error ? e.message : e);
    return { ok: false, error: "L'invio non è riuscito. Riprova tra poco." };
  }
  return { ok: true };
}
