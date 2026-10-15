"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { getSessionUser } from "@/lib/session";
import { MODES } from "@/lib/tutor/engine";
import { SCENARIOS } from "@/lib/tutor/scenarios";
import type { ActionResult } from "./profile";

/*
  Laboratorio: taccuino «ricordati» e missioni completate, per utente.
  Il taccuino salva solo gli ID dei passi (mai testo scritto dal browser): il testo si ricostruisce
  dalla missione sul server, quindi nessuno può scriverci altro. Il laboratorio non assegna XP né
  serie (decisione ancora aperta con il titolare).
*/

const noteKey = (scenarioId: string) => `lab:${scenarioId}`;

/** ID dei passi già «ricordati» da questo utente per questa missione. Vuoto se non è collegato. */
export async function loadLabNotes(scenarioId: string): Promise<string[]> {
  const scenario = SCENARIOS[scenarioId];
  const user = await getSessionUser();
  if (!scenario || !user) return [];

  const [row] = await withUser(user.id, (tx) =>
    tx
      .select({ body: schema.notes.body })
      .from(schema.notes)
      .where(and(eq(schema.notes.userId, user.id), eq(schema.notes.lessonId, noteKey(scenarioId))))
      .limit(1),
  );
  if (!row) return [];
  try {
    const ids = JSON.parse(row.body) as unknown;
    const valid = new Set(scenario.steps.map((s) => s.id));
    return Array.isArray(ids) ? ids.filter((i): i is string => typeof i === "string" && valid.has(i)) : [];
  } catch {
    return [];
  }
}

export async function saveLabNotes(scenarioId: string, stepIds: string[]): Promise<ActionResult> {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return { ok: false, error: "Missione inesistente." };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per salvare il tuo taccuino." };

  const valid = new Set(scenario.steps.map((s) => s.id));
  const ids = [...new Set(Array.isArray(stepIds) ? stepIds : [])].filter((i) => typeof i === "string" && valid.has(i));

  await withUser(user.id, (tx) =>
    tx
      .insert(schema.notes)
      .values({ userId: user.id, lessonId: noteKey(scenarioId), body: JSON.stringify(ids) })
      .onConflictDoUpdate({
        target: [schema.notes.userId, schema.notes.lessonId],
        set: { body: JSON.stringify(ids), updatedAt: new Date() },
      }),
  );
  return { ok: true };
}

/** Registra una missione completata (nella tabella dei tentativi, tipo «lab:missione:modalità»). */
export async function recordLabResult(scenarioId: string, mode: string): Promise<ActionResult> {
  if (!SCENARIOS[scenarioId] || !MODES.some((m) => m.id === mode)) return { ok: false, error: "Richiesta non valida." };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Accedi per salvare i tuoi risultati." };

  await withUser(user.id, (tx) =>
    tx.insert(schema.attempts).values({
      id: randomUUID(),
      userId: user.id,
      exerciseId: `lab:${scenarioId}:${mode}`,
      seed: "lab",
      score: 1,
      passed: true,
      result: { mode },
    }),
  );
  return { ok: true };
}
