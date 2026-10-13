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
}> {
  const { gen, total, retries } = config(lessonId);
  const seed = randomUUID();
  const questions = GENERATORS[gen].generate(seed, total).map(({ prompt, data }) => ({ prompt, data }));
  return { seed, questions, retries, generator: gen };
}

export type VerificationResult = {
  results: boolean[];
  correct: number;
  total: number;
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
  return { results, correct, total, passed: correct >= need };
}
