"use server";

import { randomUUID } from "node:crypto";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser, type Tx } from "@/lib/db/scoped";
import { type CourseDef } from "@/lib/content/courses";
import { modulesToProve, recommendModule } from "@/lib/mastery/placement";
import { pickQuestions, toPublic, type PublicQuestion } from "@/lib/mastery/pool";
import { recordWrong } from "@/lib/mastery/review";
import { gradeChoices, isPassed, lessonsToMaster, neededToPass } from "@/lib/mastery/scoring";
import {
  attemptSeed,
  courseByLetter,
  lessonIdsOfModule,
  masteryAvailable,
  MASTERY_QUESTIONS,
  MAX_FAILS,
  moduleScope,
  modulesWithLessons,
  OPEN_ATTEMPT_MS,
  OPEN_SCORE,
  placementScope,
  placementSet,
  poolForModule,
  WINDOW_MS,
} from "@/lib/mastery/server";
import { getSessionUser } from "@/lib/session";

/*
  Prove di padronanza (una per modulo) e test d'ingresso (uno per corso).
  - Le domande si ricavano SOLO qui, sul server, da un seme che dipende da un segreto: il browser riceve
    l'identificativo del tentativo e le domande senza risposte giuste. Un tentativo si valuta una sola volta.
  - Il tentativo aperto ha score = -1 in mastery_attempts (la tabella non ha una colonna di stato).
  - Dopo 3 prove fallite negli ultimi 10 minuti si aspetta (stessa idea delle verifiche).
  - Superare la prova di un modulo segna le sue lezioni «padroneggiata»: sbloccano ciò che segue, ma NESSUN XP.
  - Il test d'ingresso non sblocca niente: propone un modulo di partenza.
*/

async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Accedi per fare la prova.");
  return user;
}

function parseModule(courseId: unknown, module: unknown): { course: CourseDef; module: number } {
  if (typeof courseId !== "string" || typeof module !== "number" || !Number.isInteger(module)) throw new Error("Richiesta non valida");
  const course = courseByLetter(courseId);
  if (!course || !course.modules.some((m) => m.n === module) || !masteryAvailable(course, module)) throw new Error("Questa prova non esiste.");
  return { course, module };
}

function parseAnswers(answerId: unknown, answers: unknown): { attemptId: string; answers: unknown[] } {
  if (typeof answerId !== "string" || answerId.length > 64 || !Array.isArray(answers) || answers.length > 50) throw new Error("Richiesta non valida");
  return { attemptId: answerId, answers };
}

export type MasteryStart =
  | { blocked: false; attemptId: string; questions: PublicQuestion[]; needed: number }
  | { blocked: true; minutes: number };

type Gate = { blocked: true; minutes: number } | { blocked: false; attemptId: string; total: number };

/** Controlla l'attesa e riprende il tentativo aperto (stesse domande) oppure ne apre uno nuovo. */
async function openAttempt(
  tx: Tx,
  userId: string,
  scope: string,
  total: () => number,
  countOnlyFails: boolean,
): Promise<Gate> {
  const evaluated = await tx
    .select({ createdAt: schema.masteryAttempts.createdAt })
    .from(schema.masteryAttempts)
    .where(
      and(
        eq(schema.masteryAttempts.userId, userId),
        eq(schema.masteryAttempts.scope, scope),
        gte(schema.masteryAttempts.score, 0),
        gte(schema.masteryAttempts.createdAt, new Date(Date.now() - WINDOW_MS)),
        ...(countOnlyFails ? [eq(schema.masteryAttempts.passed, false)] : []),
      ),
    )
    .orderBy(schema.masteryAttempts.createdAt);
  if (evaluated.length >= MAX_FAILS) {
    const until = evaluated[0].createdAt.getTime() + WINDOW_MS;
    return { blocked: true, minutes: Math.max(1, Math.ceil((until - Date.now()) / 60_000)) };
  }

  const [open] = await tx
    .select()
    .from(schema.masteryAttempts)
    .where(
      and(
        eq(schema.masteryAttempts.userId, userId),
        eq(schema.masteryAttempts.scope, scope),
        eq(schema.masteryAttempts.score, OPEN_SCORE),
        gte(schema.masteryAttempts.createdAt, new Date(Date.now() - OPEN_ATTEMPT_MS)),
      ),
    )
    .orderBy(desc(schema.masteryAttempts.createdAt))
    .limit(1);
  if (open) return { blocked: false, attemptId: open.id, total: open.total };

  const attemptId = randomUUID();
  const n = total();
  await tx.insert(schema.masteryAttempts).values({ id: attemptId, userId, scope, score: OPEN_SCORE, total: n, passed: false });
  return { blocked: false, attemptId, total: n };
}

export async function startMastery(courseId: string, moduleN: number): Promise<MasteryStart> {
  const user = await requireUser();
  const { course, module } = parseModule(courseId, moduleN);
  const scope = moduleScope(course.id, module);
  const pool = poolForModule(course.id, module);

  return withUser(user.id, async (tx) => {
    const gate = await openAttempt(tx, user.id, scope, () => pickQuestions(pool, "conteggio", MASTERY_QUESTIONS).length, true);
    if (gate.blocked) return gate;
    const questions = pickQuestions(pool, attemptSeed(user.id, gate.attemptId, scope), gate.total);
    return { blocked: false as const, attemptId: gate.attemptId, questions: questions.map(toPublic), needed: neededToPass(questions.length) };
  });
}

export type MasteryResult = {
  results: boolean[];
  correct: number;
  total: number;
  needed: number;
  passed: boolean;
  /** Lezioni segnate «padroneggiata» ora (0 se non superata o già tutte fatte). */
  masteredNow: number;
};

export async function checkMastery(courseId: string, moduleN: number, attemptId: string, answers: unknown[]): Promise<MasteryResult> {
  const user = await requireUser();
  const { course, module } = parseModule(courseId, moduleN);
  const input = parseAnswers(attemptId, answers);
  const scope = moduleScope(course.id, module);

  return withUser(user.id, async (tx) => {
    const [attempt] = await tx
      .select()
      .from(schema.masteryAttempts)
      .where(and(eq(schema.masteryAttempts.id, input.attemptId), eq(schema.masteryAttempts.userId, user.id), eq(schema.masteryAttempts.scope, scope)))
      .limit(1);
    if (!attempt) throw new Error("Tentativo inesistente");
    if (attempt.score !== OPEN_SCORE) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    const expected = pickQuestions(poolForModule(course.id, module), attemptSeed(user.id, attempt.id, scope), attempt.total);
    const { results, correct } = gradeChoices(expected.map((q) => q.answer), input.answers);
    const total = expected.length;
    const passed = isPassed(correct, total);

    // Si chiude solo se è ancora aperto: un doppio invio non conta due volte.
    const closed = await tx
      .update(schema.masteryAttempts)
      .set({ score: correct, total, passed })
      .where(and(eq(schema.masteryAttempts.id, attempt.id), eq(schema.masteryAttempts.score, OPEN_SCORE)))
      .returning({ id: schema.masteryAttempts.id });
    if (closed.length === 0) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    // Ciò che si sbaglia entra nel ripasso intelligente.
    await recordWrong(tx, user.id, expected.filter((_, i) => !results[i]).map((q) => q.id));

    let masteredNow = 0;
    if (passed) {
      const ids = lessonIdsOfModule(course, module);
      const rows = await tx
        .select({ id: schema.lessonProgress.lessonId, status: schema.lessonProgress.status })
        .from(schema.lessonProgress)
        .where(and(eq(schema.lessonProgress.userId, user.id), inArray(schema.lessonProgress.lessonId, ids)));
      const completed = new Set(rows.filter((r) => r.status === "completata").map((r) => r.id));
      const mastered = new Set(rows.filter((r) => r.status === "padroneggiata").map((r) => r.id));
      const toMaster = lessonsToMaster(ids, completed, mastered);
      for (const lessonId of toMaster) {
        // Nessun XP, nessuna serie: solo il segno «padroneggiata». Non tocca mai una lezione già completata.
        await tx
          .insert(schema.lessonProgress)
          .values({ userId: user.id, lessonId, status: "padroneggiata", completedAt: null, attempts: 0 })
          .onConflictDoUpdate({
            target: [schema.lessonProgress.userId, schema.lessonProgress.lessonId],
            set: { status: "padroneggiata" },
            setWhere: sql`${schema.lessonProgress.status} = 'in_corso'`,
          });
      }
      masteredNow = toMaster.length;
    }
    return { results, correct, total, needed: neededToPass(total), passed, masteredNow };
  });
}

// ---------------- Test d'ingresso ----------------

export type PlacementStart =
  | { blocked: false; attemptId: string; questions: PublicQuestion[] }
  | { blocked: true; minutes: number };

function parsePlacementCourse(courseId: unknown): CourseDef {
  const course = typeof courseId === "string" ? courseByLetter(courseId) : undefined;
  if (!course || placementSet(course, "verifica").length === 0) throw new Error("Il test d'ingresso di questo corso non esiste.");
  return course;
}

export async function startPlacement(courseId: string): Promise<PlacementStart> {
  const user = await requireUser();
  const course = parsePlacementCourse(courseId);
  const scope = placementScope(course.id);
  return withUser(user.id, async (tx) => {
    const gate = await openAttempt(tx, user.id, scope, () => placementSet(course, "conteggio").length, false);
    if (gate.blocked) return gate;
    const set = placementSet(course, attemptSeed(user.id, gate.attemptId, scope));
    return { blocked: false as const, attemptId: gate.attemptId, questions: set.map((s) => toPublic(s.question)) };
  });
}

export type PlacementResult = {
  correct: number;
  total: number;
  recommended: { module: number; title: string; allKnown: boolean };
  /** Moduli precedenti: per saltarli serve superare la loro prova di padronanza. */
  toProve: { module: number; title: string; available: boolean }[];
};

export async function checkPlacement(courseId: string, attemptId: string, answers: unknown[]): Promise<PlacementResult> {
  const user = await requireUser();
  const course = parsePlacementCourse(courseId);
  const input = parseAnswers(attemptId, answers);
  const scope = placementScope(course.id);

  return withUser(user.id, async (tx) => {
    const [attempt] = await tx
      .select()
      .from(schema.masteryAttempts)
      .where(and(eq(schema.masteryAttempts.id, input.attemptId), eq(schema.masteryAttempts.userId, user.id), eq(schema.masteryAttempts.scope, scope)))
      .limit(1);
    if (!attempt) throw new Error("Tentativo inesistente");
    if (attempt.score !== OPEN_SCORE) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    const set = placementSet(course, attemptSeed(user.id, attempt.id, scope));
    const { results, correct } = gradeChoices(set.map((s) => s.question.answer), input.answers);
    const total = set.length;

    const closed = await tx
      .update(schema.masteryAttempts)
      .set({ score: correct, total, passed: isPassed(correct, total) })
      .where(and(eq(schema.masteryAttempts.id, attempt.id), eq(schema.masteryAttempts.score, OPEN_SCORE)))
      .returning({ id: schema.masteryAttempts.id });
    if (closed.length === 0) throw new Error("Questo tentativo è già stato valutato: ricomincia.");

    await recordWrong(tx, user.id, set.filter((_, i) => !results[i]).map((s) => s.question.id));

    const byModule = new Map<number, number>();
    set.forEach((s, i) => byModule.set(s.module, (byModule.get(s.module) ?? 0) + (results[i] ? 1 : 0)));
    const rec = recommendModule([...byModule].map(([module, c]) => ({ module, correct: c })));
    const title = (n: number) => course.modules.find((m) => m.n === n)?.title ?? `Modulo ${n}`;
    const toProve = modulesToProve(modulesWithLessons(course), rec.module).map((n) => ({ module: n, title: title(n), available: masteryAvailable(course, n) }));
    return { correct, total, recommended: { module: rec.module, title: title(rec.module), allKnown: rec.allKnown }, toProve };
  });
}

