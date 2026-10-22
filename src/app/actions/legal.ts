"use server";

import { eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legal-docs";
import { getSessionUser } from "@/lib/session";
import type { ActionResult } from "./profile";

/**
 * Registra l'accettazione dei documenti legali. Serve a dimostrare che l'utente ha letto e
 * accettato (art. 7 GDPR): documento, versione e data.
 */
export async function recordLegalConsent(docs: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };

  const ids = Array.isArray(docs) ? docs.filter((d): d is LegalDocId => typeof d === "string" && d in LEGAL_DOCS) : [];
  if (!ids.length) return { ok: false, error: "Nessun documento da accettare." };

  await withUser(user.id, async (tx) => {
    for (const id of ids) {
      await tx.insert(schema.legalConsents).values({
        id: crypto.randomUUID(),
        userId: user.id,
        doc: id,
        version: LEGAL_DOCS[id].version,
      });
    }
  });
  return { ok: true };
}
