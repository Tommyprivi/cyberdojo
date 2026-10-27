import { LESSON_ID } from "@/lib/content/schema";

/** Massimo di segnalibri per persona. */
export const BOOKMARK_MAX = 200;

export type BookmarkInput = { ok: true; lessonId: string; screen: number } | { ok: false; error: string };

/** Controlla id lezione e numero di schermata (da 0), dato quante schermate ha davvero la lezione. */
export function parseBookmarkInput(lessonId: unknown, screen: unknown, screenCount: number): BookmarkInput {
  if (typeof lessonId !== "string" || !LESSON_ID.test(lessonId)) return { ok: false, error: "Lezione non valida." };
  if (typeof screen !== "number" || !Number.isInteger(screen) || screen < 0 || screen >= screenCount) {
    return { ok: false, error: "Schermata non valida." };
  }
  return { ok: true, lessonId, screen };
}

/** Il segnalibro funziona da interruttore: se c'è si toglie, se non c'è si aggiunge (entro il limite). */
export function decideToggle(exists: boolean, count: number): "add" | "remove" | "limit" {
  if (exists) return "remove";
  return count >= BOOKMARK_MAX ? "limit" : "add";
}
