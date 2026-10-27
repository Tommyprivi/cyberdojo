import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { schema } from "@/lib/db";
import type { Tx } from "@/lib/db/scoped";
import { dueNow, nextReview } from "./leitner";
import { pickQuestions, toPublic, type PublicQuestion } from "./pool";
import { itemById } from "./server";

/** Quante domande di ripasso per volta. */
export const REVIEW_BATCH = 10;

/** Le domande sbagliate entrano nel ripasso: scatola 1, da rivedere domani. Va chiamata dentro withUser. */
export async function recordWrong(tx: Tx, userId: string, itemIds: readonly string[], now = new Date()) {
  const ids = [...new Set(itemIds)].filter((id) => itemById(id));
  for (const itemId of ids) {
    const { box, dueAt } = nextReview(1, false, now);
    await tx
      .insert(schema.reviewItems)
      .values({ userId, itemId, box, dueAt })
      .onConflictDoUpdate({ target: [schema.reviewItems.userId, schema.reviewItems.itemId], set: { box, dueAt } });
  }
}

export type ReviewBatch = { questions: PublicQuestion[]; dueTotal: number; waiting: number };

/** Domande scadute da ripassare (senza risposte giuste). Va chiamata dentro withUser. */
export async function loadDueReview(tx: Tx, userId: string, now = new Date()): Promise<ReviewBatch> {
  const rows = await tx.select().from(schema.reviewItems).where(eq(schema.reviewItems.userId, userId));
  const due = rows.filter((r) => r.dueAt.getTime() <= now.getTime());
  const batch = dueNow(rows, now, REVIEW_BATCH);

  // Le voci il cui testo non esiste più (banca modificata) si tolgono da sole.
  const gone = batch.filter((r) => !itemById(r.itemId)).map((r) => r.itemId);
  if (gone.length) await tx.delete(schema.reviewItems).where(and(eq(schema.reviewItems.userId, userId), inArray(schema.reviewItems.itemId, gone)));

  const questions = batch.flatMap((r) => {
    const item = itemById(r.itemId);
    // Le opzioni si rimescolano a ogni richiesta: a ripasso conta capire, non ricordare la posizione.
    return item ? [toPublic(pickQuestions([item], randomUUID(), 1)[0])] : [];
  });
  return { questions, dueTotal: due.length - gone.length, waiting: rows.length - due.length };
}
