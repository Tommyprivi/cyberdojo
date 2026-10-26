"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { and, count, desc, eq, gte, isNotNull, isNull, sql } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { getRawLesson } from "@/lib/content/load";
import { isVisible, LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
import { GENERATORS, isGeneratorId, type GeneratorId, type PublicQuestion } from "@/lib/practice/generators";
import { applyStreak, localDay } from "@/lib/progress/streak";
import { loadCatalog } from "@/lib/content/catalog";
import { allowedDuringMaintenance, MAINTENANCE_HEADER } from "@/lib/maintenance";
import { getMemberData } from "@/lib/progress/queries";
import { canOpenLesson } from "@/lib/progress/unlock";
import { xpForPass } from "@/lib/progress/xp";
import { getSessionUser } from "@/lib/session";

/*
  Verifica pratica valutata, registrata sul server.
  - La configurazione (generatore, soglia, tentativi) viene SEMPRE dal file della lezione, mai dal client.
  - Il seme sta nel tentativo salvato nel database: il client riceve solo un identificativo, quindi non
    può scegliersi le domande né rigiocare lo stesso tentativo. Le risposte giuste non lasciano il server.
  - Tentativi: `retries` falliti negli ultimi 10 minuti, poi si aspetta che il primo esca dalla finestra.
  - Quando si supera: lezione completata, XP (una sola volta, vincolo xp_once) e serie aggiornata.
*/

// Attesa dopo i tentativi falliti: decisa dal titolare il 2026-10-15 (10 minuti).
const WINDOW_MS = 10 * 60 * 1000;
const OPEN_ATTEMPT_MS = 60 * 60 * 1000;

function config(lessonId: string) {
  if (!LESSON_ID.test(lessonId)) throw new Error("ID lezione non valido");
  const raw = getRawLesson(lessonId);
  if (!raw) throw new Error("Lezione inesistente");
  const fm = lessonFrontmatter.parse(raw.data);
  if (!isVisible(fm.status)) throw new Error("Lezione inesistente");
  const gen = fm.verification.generator;
  if (fm.verification.type !== "generated-numeric" || !gen || !isGeneratorId(gen)) {
    throw new Error("Questa lezione non ha una verifica numerica");
  }
  const [need, total] = fm.verification.pass.split("/").map(Number);
  return { gen, need, total, retries: fm.verification.retries, prerequisites: fm.prerequisites };
}

async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Accedi per fare la verifica.");
  return user;
}

export type StartResult =
  | { blocked: false; attemptId: string; questions: PublicQuestion[]; retries: number; generator: GeneratorId; needed: number; attemptNumber: number }
  | { blocked: true; until: string; minutes: number; retries: number };

/** In manutenzione la verifica parte solo per i corsi già iniziati (il proxy segna la richiesta). */
async function assertMaintenanceAccess(userId: string, lessonId: string) {
  if ((await headers()).get(MAINTENANCE_HEADER) !== "1") return;
  const { completed } = await getMemberData(userId);
  if (!allowedDuringMaintenance(lessonId, completed, loadCatalog())) {
    throw new Error("Il sito è in manutenzione: puoi continuare solo i corsi che hai già iniziato.");
  }
}

export async function startVerification(lessonId: string): Promise<StartResult> {
  const user = await requireUser();
  const { gen, need, total, retries, prerequisites } = config(lessonId);
  await assertMaintenanceAccess(user.id, lessonId);

  return withUser(user.id, async (tx) => {
    // Si può fare la verifica solo se i prerequisiti sono stati completati (avanzamento in ordine).
    if (prerequisites.length > 0) {
      const done = await tx
        .select({ id: schema.lessonProgress.lessonId })
        .from(schema.lessonProgress)
        .where(and(eq(schema.lessonProgress.userId, user.id), eq(schema.lessonProgress.status, "completata")));
      const doneIds = new Set(done.map((d) => d.id));
      if (!canOpenLesson({ id: lessonId, prerequisites }, { completed: doneIds })) throw new Error("Completa prima le lezioni precedenti.");
    }

    const since = new Date(Date.now() - WINDOW_MS);
    const failed = await tx
      .select({ createdAt: schema.attempts.createdAt })
      .from(schema.attempts)
      .where(
        and(
          eq(schema.attempts.userId, user.id),
          eq(schema.attempts.lessonId, lessonId),
          eq(schema.attempts.passed, false),
          isNotNull(schema.attempts.result),
          gte(schema.attempts.createdAt, since),
        ),
      )
      .orderBy(schema.attempts.createdAt);

    if (failed.length >= retries) {
      const until = new Date(failed[0].createdAt.getTime() + WINDOW_MS);
      const minutes = Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60_000));
      return { blocked: true as const, until: until.toISOString(), minutes, retries };
    }

    // Se c'è un tentativo aperto di recente (pagina ricaricata), si riprende: stesse domande.
    const [open] = await tx
      .select()
      .from(schema.attempts)
      .where(
        and(
          eq(schema.attempts.userId, user.id),
          eq(schema.attempts.lessonId, lessonId),
          isNull(schema.attempts.result),
          gte(schema.attempts.createdAt, new Date(Date.now() - OPEN_ATTEMPT_MS)),
        ),
      )
      .orderBy(desc(schema.attempts.createdAt))
      .limit(1);

    let attemptId = open?.id;
    let seed = open?.seed;
    if (!attemptId || !seed) {
      attemptId = randomUUID();
      seed = randomUUID();
      await tx.insert(schema.attempts).values({ id: attemptId, userId: user.id, lessonId, seed, score: 0, passed: false });
    }

    const questions = GENERATORS[gen]
      .generate(seed, total)
      .map(({ prompt, data, choices }): PublicQuestion => ({ prompt, data, ...(choices ? { choices } : {}) }));
    return { blocked: false as const, attemptId, questions, retries, generator: gen, needed: need, attemptNumber: failed.length + 1 };
  });
}

export type VerificationResult = {
  results: boolean[];
  correct: number;
  total: number;
  /** Risposte giuste necessarie per passare (dal frontmatter, es. 4 su 5). */
  needed: number;
  passed: boolean;
  /** Presenti solo se la verifica è superata. */
  reward?: { xpGained: number; xpTotal: number; streak: number; freezeEarned: boolean; firstTryPerfect: boolean; alreadyDone: boolean };
};

export async function checkVerification(lessonId: string, attemptId: string, answers: string[]): Promise<VerificationResult> {
  const user = await requireUser();
  const { gen, need, total } = config(lessonId);
  if (typeof attemptId !== "string" || attemptId.length > 64 || !Array.isArray(answers) || answers.length > 50) {
    throw new Error("Richiesta non valida");
  }

  return withUser(user.id, async (tx) => {
    const [attempt] = await tx
      .select()
      .from(schema.attempts)
      .where(and(eq(schema.attempts.id, attemptId), eq(schema.attempts.userId, user.id), eq(schema.attempts.lessonId, lessonId)))
      .limit(1);
    if (!attempt) throw new Error("Tentativo inesistente");
    if (attempt.result !== null) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    const { generate, parse } = GENERATORS[gen];
    const expected = generate(attempt.seed, total);
    const results = expected.map((q, i) => parse(String(answers[i] ?? "")) === q.answer);
    const correct = results.filter(Boolean).length;
    const passed = correct >= need;

    // Si chiude il tentativo solo se è ancora aperto: un doppio invio non conta due volte.
    const closed = await tx
      .update(schema.attempts)
      .set({ score: correct / total, passed, result: { results, correct, total } })
      .where(and(eq(schema.attempts.id, attemptId), isNull(schema.attempts.result)))
      .returning({ id: schema.attempts.id });
    if (closed.length === 0) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    const base = { results, correct, total, needed: need, passed };
    if (!passed) return base;

    // Primo tentativo perfetto: nessun altro tentativo concluso prima, e tutte le risposte giuste.
    const [{ before }] = await tx
      .select({ before: count() })
      .from(schema.attempts)
      .where(and(eq(schema.attempts.userId, user.id), eq(schema.attempts.lessonId, lessonId), isNotNull(schema.attempts.result), sql`${schema.attempts.id} <> ${attemptId}`));
    const firstTryPerfect = before === 0 && correct === total;

    const [existing] = await tx
      .select({ status: schema.lessonProgress.status })
      .from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, user.id), eq(schema.lessonProgress.lessonId, lessonId)))
      .limit(1);
    const alreadyDone = existing?.status === "completata";

    await tx
      .insert(schema.lessonProgress)
      .values({ userId: user.id, lessonId, status: "completata", completedAt: new Date(), attempts: 1 })
      .onConflictDoUpdate({
        target: [schema.lessonProgress.userId, schema.lessonProgress.lessonId],
        set: {
          attempts: sql`${schema.lessonProgress.attempts} + 1`,
          ...(alreadyDone ? {} : { status: "completata" as const, completedAt: new Date() }),
        },
      });

    // XP: una sola volta per lezione (indice unico utente+tipo+lezione).
    let xpGained = 0;
    for (const e of xpForPass({ firstTryPerfect })) {
      const inserted = await tx
        .insert(schema.xpEvents)
        .values({ id: randomUUID(), userId: user.id, kind: e.kind, amount: e.amount, refId: lessonId })
        .onConflictDoNothing()
        .returning({ amount: schema.xpEvents.amount });
      xpGained += inserted[0]?.amount ?? 0;
    }
    const [{ xpTotal }] = await tx
      .select({ xpTotal: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int` })
      .from(schema.xpEvents)
      .where(eq(schema.xpEvents.userId, user.id));

    // Serie: oggi conta, nel fuso dell'utente.
    const [profile] = await tx.select({ tz: schema.profiles.timezone }).from(schema.profiles).where(eq(schema.profiles.id, user.id));
    const today = localDay(new Date(), profile?.tz ?? "Europe/Rome");
    const [row] = await tx.select().from(schema.streaks).where(eq(schema.streaks.userId, user.id)).limit(1);
    const next = applyStreak(
      row ? { current: row.current, best: row.best, lastDay: row.lastDay, freezes: row.freezes } : { current: 0, best: 0, lastDay: null, freezes: 0 },
      today,
    );
    await tx
      .insert(schema.streaks)
      .values({ userId: user.id, current: next.current, best: next.best, lastDay: next.lastDay, freezes: next.freezes })
      .onConflictDoUpdate({
        target: schema.streaks.userId,
        set: { current: next.current, best: next.best, lastDay: next.lastDay, freezes: next.freezes },
      });

    return { ...base, reward: { xpGained, xpTotal, streak: next.current, freezeEarned: next.freezeEarned, firstTryPerfect, alreadyDone } };
  });
}
