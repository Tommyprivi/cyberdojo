"use server";

import { randomUUID } from "node:crypto";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { buildFor, findChallenge, saltFor } from "@/lib/ctf/catalog";
import { rateLimit, verifyFlag, xpForSolve } from "@/lib/ctf/core";
import { ctfSecret, exerciseKey, recentFails, solvedIds } from "@/lib/ctf/server";
import { LOGIN_SELECT, LOGIN_TEMPLATE, MAX_FIELD, runQuery, SEARCH_SELECT, SEARCH_TEMPLATE } from "@/lib/ctf/sqlsim";
import { getSessionUser } from "@/lib/session";

/*
  Laboratori CTF (sfide simulate e didattiche, mai contro sistemi reali).
  - La bandiera attesa si ricava qui dal segreto del server: il browser non la riceve mai.
  - Si confronta l'hash SHA-256 con sale della bandiera inviata con quello della bandiera attesa.
  - Tentativi: 10 errori ogni 10 minuti per sfida, poi si aspetta.
  - XP: una sola volta per sfida (evento «ctf», refId = id sfida, vincolo xp_once).
*/

async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Accedi per giocare.");
  return user;
}

export type FlagResult =
  | { status: "blocked"; minutes: number }
  | { status: "wrong"; left: number }
  | { status: "solved"; xpGained: number; explanation: string; defense: string };

export async function submitFlag(challengeId: string, flag: string): Promise<FlagResult> {
  const user = await requireUser();
  const c = findChallenge(challengeId);
  if (!c || typeof flag !== "string") throw new Error("Richiesta non valida");
  const secret = ctfSecret();

  return withUser(user.id, async (tx) => {
    const fails = await recentFails(tx, user.id, c.id);
    const limit = rateLimit(fails);
    if (limit.blocked) return { status: "blocked" as const, minutes: limit.minutes };

    const ok = verifyFlag(flag, buildFor(secret, user.id, c).flag, saltFor(secret, c.id));
    await tx.insert(schema.attempts).values({
      id: randomUUID(),
      userId: user.id,
      exerciseId: exerciseKey(c.id),
      seed: "ctf",
      score: ok ? 1 : 0,
      passed: ok,
      result: { kind: "ctf" },
    });
    if (!ok) return { status: "wrong" as const, left: Math.max(0, 9 - fails.length) };

    const e = xpForSolve(c.level, c.id);
    const inserted = await tx
      .insert(schema.xpEvents)
      .values({ id: randomUUID(), userId: user.id, kind: e.kind, amount: e.amount, refId: e.refId })
      .onConflictDoNothing()
      .returning({ amount: schema.xpEvents.amount });
    return { status: "solved" as const, xpGained: inserted[0]?.amount ?? 0, explanation: c.explanation, defense: c.defense };
  });
}

/** Spiegazione di una sfida già risolta (per riaprirla più tardi). */
export async function solvedInfo(challengeId: string): Promise<{ explanation: string; defense: string } | null> {
  const user = await requireUser();
  const c = findChallenge(challengeId);
  if (!c) return null;
  const done = await withUser(user.id, (tx) => solvedIds(tx, user.id));
  return done.has(c.id) ? { explanation: c.explanation, defense: c.defense } : null;
}

export type SqlTry = { query: string; error?: string; rows: Record<string, string | number>[]; welcome?: string };

/** Il simulatore SQL: tutto in memoria sul server, nessun database vero. */
export async function trySql(challengeId: string, fields: string[]): Promise<SqlTry> {
  const user = await requireUser();
  const c = findChallenge(challengeId);
  if (!c || !Array.isArray(fields) || fields.length > 2 || fields.some((f) => typeof f !== "string" || f.length > MAX_FIELD)) {
    throw new Error("Richiesta non valida");
  }
  const built = buildFor(ctfSecret(), user.id, c);
  if (built.artifact.kind !== "sqlform" || !built.sql) throw new Error("Questa sfida non ha il simulatore");

  if (built.artifact.variant === "login") {
    const out = runQuery(LOGIN_SELECT, LOGIN_TEMPLATE, [fields[0] ?? "", fields[1] ?? ""], built.sql.rows);
    const first = out.rows[0];
    return {
      query: out.query,
      error: out.error,
      rows: [],
      welcome: first ? `Accesso riuscito come «${first.nome}».${first.note ? ` Nota: ${first.note}` : ""}` : undefined,
    };
  }
  const out = runQuery(SEARCH_SELECT, SEARCH_TEMPLATE, [fields[0] ?? ""], built.sql.rows);
  return { query: out.query, error: out.error, rows: out.rows.map((r) => ({ nome: r.nome, prezzo: r.prezzo, note: r.note })) };
}
