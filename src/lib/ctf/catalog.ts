import { rng } from "@/lib/practice/core";
import { challengeSalt, challengeSeed } from "./core";
import { CRYPTO } from "./challenges/crypto";
import { LOGS } from "./challenges/logs";
import { NETWORK } from "./challenges/network";
import { OSINT } from "./challenges/osint";
import { PASSWORD } from "./challenges/password";
import { WEB } from "./challenges/web";
import type { Built, Challenge, PublicChallenge } from "./types";

/*
  Catalogo delle sfide. SOLO SERVER: contiene i generatori delle bandiere.
  Al browser arriva soltanto `toPublic` (senza bandiera e senza spiegazione).
*/

export const CHALLENGES: readonly Challenge[] = [...CRYPTO, ...LOGS, ...WEB, ...PASSWORD, ...NETWORK, ...OSINT];

export const CHALLENGE_ID = /^[a-z0-9-]{3,48}$/;

export function findChallenge(id: unknown): Challenge | undefined {
  return typeof id === "string" && CHALLENGE_ID.test(id) ? CHALLENGES.find((c) => c.id === id) : undefined;
}

/** I dati della sfida per quell'utente: stessa sfida, stessa bandiera, ma diversa da utente a utente. */
export function buildFor(secret: string, userId: string, c: Challenge): Built {
  return c.build(rng(challengeSeed(secret, userId, c.id)));
}

export const saltFor = challengeSalt;

export function toPublic(c: Challenge, built: Built): PublicChallenge {
  const { id, title, category, level, story, goal, hints } = c;
  return { id, title, category, level, story, goal, hints, artifact: built.artifact };
}

/** Elenco per la pagina principale (senza dati personalizzati). */
export function listing() {
  return CHALLENGES.map(({ id, title, category, level, story }) => ({ id, title, category, level, story }));
}
