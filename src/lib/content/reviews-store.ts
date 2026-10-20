import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  applyPatch,
  applyQuestionPatch,
  parseQuestionReviews,
  parseReviews,
  type QuestionEntry,
  type QuestionReviews,
  type ReviewEntry,
  type Reviews,
} from "./reviews";

/** content/revisioni.json: scritto solo dalle azioni del centro di revisione (mai in produzione). */
export const reviewsFile = (dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "content")) =>
  path.join(/*turbopackIgnore: true*/ dir, "revisioni.json");

export function readReviews(dir?: string): Reviews {
  const file = reviewsFile(dir);
  if (!existsSync(file)) return {};
  try {
    return parseReviews(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return {};
  }
}

// Le azioni arrivano una alla volta: si accodano per non perdere modifiche (leggi, cambia, scrivi).
let queue: Promise<unknown> = Promise.resolve();

export function updateReview(
  key: string,
  patch: Parameters<typeof applyPatch>[1],
  dir?: string,
): Promise<ReviewEntry> {
  const run = queue.then(() => {
    const all = readReviews(dir);
    const entry = applyPatch(all[key], patch, new Date());
    const sorted = Object.fromEntries(Object.entries({ ...all, [key]: entry }).sort(([a], [b]) => a.localeCompare(b)));
    const file = reviewsFile(dir);
    mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(sorted, null, 2) + "\n", "utf8");
    renameSync(tmp, file);
    return entry;
  });
  queue = run.catch(() => undefined);
  return run;
}

// ---- Domande: file separato, per non appesantire revisioni.json ----
export const questionReviewsFile = (dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "content")) =>
  path.join(/*turbopackIgnore: true*/ dir, "revisioni-domande.json");

export function readQuestionReviews(dir?: string): QuestionReviews {
  const file = questionReviewsFile(dir);
  if (!existsSync(file)) return {};
  try {
    return parseQuestionReviews(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return {};
  }
}

let qQueue: Promise<unknown> = Promise.resolve();

export function updateQuestionReview(
  id: string,
  patch: Parameters<typeof applyQuestionPatch>[1],
  dir?: string,
): Promise<QuestionEntry> {
  const run = qQueue.then(() => {
    const all = readQuestionReviews(dir);
    const entry = applyQuestionPatch(all[id], patch, new Date());
    const file = questionReviewsFile(dir);
    mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify({ ...all, [id]: entry }, null, 1) + "\n", "utf8");
    renameSync(tmp, file);
    return entry;
  });
  qQueue = run.catch(() => undefined);
  return run;
}
