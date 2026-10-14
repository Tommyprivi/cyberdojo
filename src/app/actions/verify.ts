"use server";

import { randomUUID } from "node:crypto";
import { getRawLesson } from "@/lib/content/load";
import { LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
import {
  GENERATORS,
  isGeneratorId,
  type GeneratorId,
  type PublicQuestion,
} from "@/lib/practice/generators";

/*
  Verifica pratica valutata. La configurazione (generatore, soglia) viene SEMPRE dal file della
  lezione sul server, mai dal client. Le risposte giuste non lasciano mai il server.
  TODO (con auth e DB): salvare seed e tentativi in `attempts`, far rispettare `retries`,
  assegnare XP una sola volta (vincolo xp_once) e aggiornare lo streak.
*/

function config(lessonId: string) {
  if (!LESSON_ID.test(lessonId)) throw new Error("ID lezione non valido");
  const raw = getRawLesson(lessonId);
  if (!raw) throw new Error("Lezione inesistente");
  const fm = lessonFrontmatter.parse(raw.data);
  const gen = fm.verification.generator;
  if (fm.verification.type !== "generated-numeric" || !gen || !isGeneratorId(gen)) {
    throw new Error("Questa lezione non ha una verifica numerica");
  }
  const [need, total] = fm.verification.pass.split("/").map(Number);
  return { gen, need, total, retries: fm.verification.retries };
}

export async function startVerification(lessonId: string): Promise<{
  seed: string;
  questions: PublicQuestion[];
  retries: number;
  generator: GeneratorId;
  needed: number;
}> {
  const { gen, need, total, retries } = config(lessonId);
  const seed = randomUUID();
  // Si inviano al client solo testo, dato e scelte: mai la risposta giusta.
  const questions = GENERATORS[gen]
    .generate(seed, total)
    .map(({ prompt, data, choices }): PublicQuestion => ({ prompt, data, ...(choices ? { choices } : {}) }));
  return { seed, questions, retries, generator: gen, needed: need };
}

export type VerificationResult = {
  results: boolean[];
  correct: number;
  total: number;
  /** Risposte giuste necessarie per passare (dal frontmatter, es. 4 su 5). */
  needed: number;
  passed: boolean;
};

export async function checkVerification(
  lessonId: string,
  seed: string,
  answers: string[],
): Promise<VerificationResult> {
  const { gen, need, total } = config(lessonId);
  if (typeof seed !== "string" || seed.length > 64 || !Array.isArray(answers)) {
    throw new Error("Richiesta non valida");
  }
  const { generate, parse } = GENERATORS[gen];
  const expected = generate(seed, total);
  const results = expected.map((q, i) => parse(String(answers[i] ?? "")) === q.answer);
  const correct = results.filter(Boolean).length;
  return { results, correct, total, needed: need, passed: correct >= need };
}
