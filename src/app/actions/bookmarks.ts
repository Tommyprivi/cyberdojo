"use server";

import { and, count, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { BOOKMARK_MAX, decideToggle, parseBookmarkInput } from "@/lib/bookmarks/core";
import { getRawLesson, splitScreens } from "@/lib/content/load";
import { isVisible, lessonFrontmatter } from "@/lib/content/schema";
import { getMemberData } from "@/lib/progress/queries";
import { canOpenLesson } from "@/lib/progress/unlock";
import { getSessionUser } from "@/lib/session";

/*
  Segnalibri: una schermata di una lezione, per persona (tabella lesson_bookmarks), massimo 200.
  Si aggiunge solo su lezioni che la persona può aprire («nessun salto»). Il numero di schermata
  si controlla contro le schermate vere della lezione, letta dal repository e mai dal client.
*/

export type BookmarkResult = { ok: true; saved: boolean } | { ok: false; error: string };

export async function toggleBookmark(lessonId: unknown, screen: unknown): Promise<BookmarkResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per usare i segnalibri." };

  const raw = typeof lessonId === "string" ? getRawLesson(lessonId) : undefined;
  const fm = raw ? lessonFrontmatter.safeParse(raw.data) : null;
  if (!raw || !fm?.success || !isVisible(fm.data.status)) return { ok: false, error: "Lezione non valida." };
  const input = parseBookmarkInput(lessonId, screen, splitScreens(raw.body).length);
  if (!input.ok) return input;

  const member = await getMemberData(user.id);
  if (!member.mastered.has(input.lessonId) && !canOpenLesson(fm.data, { completed: member.completed, mastered: member.mastered })) {
    return { ok: false, error: "Questa lezione non è ancora aperta." };
  }

  try {
    return await withUser(user.id, async (tx) => {
      const mine = eq(schema.lessonBookmarks.userId, user.id);
      const same = and(mine, eq(schema.lessonBookmarks.lessonId, input.lessonId), eq(schema.lessonBookmarks.screen, input.screen));
      const [exists] = await tx.select({ n: count() }).from(schema.lessonBookmarks).where(same);
      const [total] = await tx.select({ n: count() }).from(schema.lessonBookmarks).where(mine);
      const action = decideToggle((exists?.n ?? 0) > 0, total?.n ?? 0);
      if (action === "limit") return { ok: false as const, error: `Hai già ${BOOKMARK_MAX} segnalibri: toglierne uno prima.` };
      if (action === "remove") {
        await tx.delete(schema.lessonBookmarks).where(same);
        return { ok: true as const, saved: false };
      }
      await tx.insert(schema.lessonBookmarks).values({ userId: user.id, lessonId: input.lessonId, screen: input.screen }).onConflictDoNothing();
      return { ok: true as const, saved: true };
    });
  } catch {
    return { ok: false, error: "Non riesco a salvare il segnalibro, riprova tra poco." };
  }
}

/** Le schermate con segnalibro in una lezione (vuoto se non c'è l'account o il servizio non risponde). */
export async function lessonBookmarkScreens(lessonId: unknown): Promise<number[]> {
  if (typeof lessonId !== "string") return [];
  const user = await getSessionUser();
  if (!user) return [];
  try {
    const rows = await withUser(user.id, (tx) =>
      tx
        .select({ screen: schema.lessonBookmarks.screen })
        .from(schema.lessonBookmarks)
        .where(and(eq(schema.lessonBookmarks.userId, user.id), eq(schema.lessonBookmarks.lessonId, lessonId))),
    );
    return rows.map((r) => r.screen);
  } catch {
    return [];
  }
}
