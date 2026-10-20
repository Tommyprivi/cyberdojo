"use server";

import { revalidatePath } from "next/cache";
import { readRawLessons } from "@/lib/content/load";
import { internalToolsEnabled } from "@/lib/internal";
import {
  emailKey,
  emailReviewInput,
  gfxKey,
  gfxReviewInput,
  lessonKey,
  lessonReviewInput,
  questionReviewInput,
  sceneKey,
  sceneReviewInput,
  uxKey,
  uxReviewInput,
  type QuestionEntry,
  type ReviewEntry,
} from "@/lib/content/reviews";
import { updateQuestionReview, updateReview } from "@/lib/content/reviews-store";
import { gfxCatalog } from "@/lib/content/graphics";
import { loadQuestions } from "@/lib/content/questions";

export type SaveResult = { ok: true; entry: ReviewEntry } | { ok: false; error: string };

/*
  Azioni del centro di revisione. Scrivono solo content/revisioni.json e solo quando gli strumenti
  interni sono attivi (mai in produzione). Ogni input è validato con zod.
*/

const CLOSED = { ok: false, error: "Strumento chiuso." } as const;

async function save(run: () => Promise<ReviewEntry>): Promise<SaveResult> {
  try {
    const entry = await run();
    revalidatePath("/revisione", "layout");
    return { ok: true, entry };
  } catch {
    return { ok: false, error: "Non sono riuscito a salvare. Riprova." };
  }
}

const firstError = (e: { issues: { message: string }[] }) => e.issues[0]?.message ?? "Dati non validi";

export async function saveLessonReview(input: unknown): Promise<SaveResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = lessonReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  const { id, ...patch } = p.data;
  if (!readRawLessons().some((l) => l.data.id === id)) return { ok: false, error: "Lezione inesistente" };
  return save(() => updateReview(lessonKey(id), patch));
}

export async function saveEmailReview(input: unknown): Promise<SaveResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = emailReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  return save(() => updateReview(emailKey(p.data.id), { approved: p.data.seen, note: p.data.note }));
}

export async function saveUxReview(input: unknown): Promise<SaveResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = uxReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  const { path, ...patch } = p.data;
  return save(() => updateReview(uxKey(path), patch));
}

export async function saveSceneReview(input: unknown): Promise<SaveResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = sceneReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  const { id, n, ...patch } = p.data;
  if (!readRawLessons().some((l) => l.data.id === id)) return { ok: false, error: "Lezione inesistente" };
  return save(() => updateReview(sceneKey(id, n), patch));
}

export async function saveGfxReview(input: unknown): Promise<SaveResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = gfxReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  const { id, ...patch } = p.data;
  if (!gfxCatalog().some((g) => g.id === id)) return { ok: false, error: "Elemento sconosciuto" };
  return save(() => updateReview(gfxKey(id), patch));
}

export type SaveQuestionResult = { ok: true; entry: QuestionEntry } | { ok: false; error: string };

export async function saveQuestionReview(input: unknown): Promise<SaveQuestionResult> {
  if (!internalToolsEnabled()) return CLOSED;
  const p = questionReviewInput.safeParse(input);
  if (!p.success) return { ok: false, error: firstError(p.error) };
  const { id, ...patch } = p.data;
  if (!loadQuestions().some((q) => q.id === id)) return { ok: false, error: "Domanda sconosciuta" };
  try {
    const entry = await updateQuestionReview(id, patch);
    revalidatePath("/revisione", "layout");
    return { ok: true, entry };
  } catch {
    return { ok: false, error: "Non sono riuscito a salvare. Riprova." };
  }
}
