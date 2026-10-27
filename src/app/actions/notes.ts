"use server";

import { and, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { getRawLesson } from "@/lib/content/load";
import { isVisible, LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
import { cleanNote, NOTE_MAX } from "@/lib/notes/note-core";
import { getSessionUser } from "@/lib/session";
import type { ActionResult } from "./profile";

/*
  Appunti personali di una lezione: solo testo semplice, massimo NOTE_MAX caratteri, uno per lezione.
  Stanno nella tabella notes (utente + lezione). Il testo non viene mai interpretato come HTML.
*/

function validLesson(lessonId: unknown): lessonId is string {
  if (typeof lessonId !== "string" || !LESSON_ID.test(lessonId)) return false;
  const raw = getRawLesson(lessonId);
  const fm = raw ? lessonFrontmatter.safeParse(raw.data) : null;
  return Boolean(fm?.success && isVisible(fm.data.status));
}

export async function loadNote(lessonId: string): Promise<string> {
  if (!validLesson(lessonId)) return "";
  const user = await getSessionUser();
  if (!user) return "";
  const [row] = await withUser(user.id, (tx) =>
    tx
      .select({ body: schema.notes.body })
      .from(schema.notes)
      .where(and(eq(schema.notes.userId, user.id), eq(schema.notes.lessonId, lessonId)))
      .limit(1),
  );
  return row?.body ?? "";
}

export async function saveNote(lessonId: string, body: string): Promise<ActionResult> {
  if (!validLesson(lessonId)) return { ok: false, error: "Lezione non valida." };
  if (typeof body === "string" && body.length > NOTE_MAX * 2) return { ok: false, error: `Massimo ${NOTE_MAX} caratteri.` };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per salvare gli appunti." };

  const text = cleanNote(body);
  await withUser(user.id, async (tx) => {
    if (text === "") {
      await tx.delete(schema.notes).where(and(eq(schema.notes.userId, user.id), eq(schema.notes.lessonId, lessonId)));
      return;
    }
    await tx
      .insert(schema.notes)
      .values({ userId: user.id, lessonId, body: text })
      .onConflictDoUpdate({ target: [schema.notes.userId, schema.notes.lessonId], set: { body: text, updatedAt: new Date() } });
  });
  return { ok: true };
}
