"use server";

import { and, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { nextReview } from "@/lib/mastery/leitner";
import { itemById } from "@/lib/mastery/server";
import { getSessionUser } from "@/lib/session";

/*
  Ripasso intelligente. Ogni domanda del ripasso è una voce di review_items dell'utente (ci entrano gli errori
  delle prove). Si risponde una domanda per volta: il server controlla, aggiorna la scatola (1, 3, 7, 21 giorni)
  e solo allora rivela la risposta giusta. Il ripasso non dà XP né serie: non c'è nulla da barare.
*/

export type ReviewAnswer = { correct: boolean; right: string; box: number };

export async function answerReview(itemId: string, choice: string): Promise<ReviewAnswer> {
  const user = await getSessionUser();
  if (!user) throw new Error("Accedi per ripassare.");
  if (typeof itemId !== "string" || itemId.length > 120 || typeof choice !== "string" || choice.length > 600) throw new Error("Richiesta non valida");
  const item = itemById(itemId);
  if (!item) throw new Error("Domanda inesistente");

  return withUser(user.id, async (tx) => {
    const [row] = await tx
      .select()
      .from(schema.reviewItems)
      .where(and(eq(schema.reviewItems.userId, user.id), eq(schema.reviewItems.itemId, itemId)))
      .limit(1);
    // Solo le domande che sono davvero nel tuo ripasso e già scadute: niente interrogazioni a raffica.
    if (!row || row.dueAt.getTime() > Date.now()) throw new Error("Questa domanda non è da ripassare adesso.");

    const correct = choice === item.ok;
    const next = nextReview(row.box, correct, new Date());
    await tx
      .update(schema.reviewItems)
      .set(next)
      .where(and(eq(schema.reviewItems.userId, user.id), eq(schema.reviewItems.itemId, itemId)));
    return { correct, right: item.ok, box: next.box };
  });
}
