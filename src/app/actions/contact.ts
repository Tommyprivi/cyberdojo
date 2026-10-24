"use server";

import { z } from "zod";
import { sendMail } from "@/lib/email";
import { contactEmail } from "@/lib/mail/templates";
import { CONTACT_KINDS } from "@/lib/contact-kinds";

/**
 * Modulo pubblico di contatto: domande, segnalazioni di bug, richieste sui dati.
 * Non serve l'account, e non rispondiamo a chi scrive solo per fare rumore.
 */

const input = z.object({
  kind: z.enum(["domanda", "bug", "accessibilita", "privacy", "altro"]),
  name: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email("Indirizzo email non valido.").max(160),
  subject: z.string().trim().min(3, "Scrivi almeno qualche parola.").max(140),
  message: z.string().trim().min(10, "Scrivi almeno una frase.").max(4000),
  where: z.string().trim().max(200).optional().default(""),
  // Campo trappola: nascosto agli umani, compilato solo dai robot.
  trap: z.string().max(0).optional().default(""),
});

export type ContactResult = { ok: true } | { ok: false; error: string };

// Limitatore best effort: blocca le raffiche dallo stesso indirizzo per some minuti.
// In un ambiente senza stato (serverless) può valere per una sola istanza: meglio che niente.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function tooMany(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function sendContactMessage(raw: unknown): Promise<ContactResult> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  const d = parsed.data;

  // Bot: se il campo trappola è pieno, si esce senza dire niente.
  if (d.trap) return { ok: true };

  if (tooMany(d.email.toLowerCase())) {
    return { ok: false, error: "Hai già inviato diverse richieste poc'è fa. Aspetta qualche minuto e riprova." };
  }

  const kindLabel = CONTACT_KINDS.find((k) => k.id === d.kind)?.label ?? "Contatto";
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL?.trim() || process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1]?.trim() || "",
      mail: contactEmail({
        kind: kindLabel,
        name: d.name || null,
        email: d.email,
        subject: d.subject,
        message: d.message,
        where: d.where || null,
      }),
    });
  } catch (e) {
    console.error("Invio del modulo di contatto non riuscito:", e instanceof Error ? e.message : e);
    return { ok: false, error: "L'invio non è riuscito. Riprova tra poco." };
  }
  return { ok: true };
}
