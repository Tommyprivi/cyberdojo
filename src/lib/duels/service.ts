import { randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { COURSES } from "@/lib/content/courses";
import { schema } from "@/lib/db";
import { withUser, type Tx } from "@/lib/db/scoped";
import { gradeChoices } from "@/lib/mastery/scoring";
import { toPublic, type PoolItem, type PublicQuestion } from "@/lib/mastery/pool";
import { recordWrong } from "@/lib/mastery/review";
import { attemptSeed, courseByLetter, modulesWithLessons, poolForModule } from "@/lib/mastery/server";
import {
  canAccept,
  canAnswer,
  canCreateDuel,
  DUEL_QUESTIONS,
  DUEL_XP_KIND,
  duelExpiry,
  duelOutcome,
  effectiveStatus,
  opponentScoreToShow,
  pickDuelQuestions,
  winnerXp,
  type DuelStatus,
  type Outcome,
} from "./rules";

/*
  Duello a turni: parte con il database. Le domande si ricavano SOLO qui, dal seme del duello (salvato sul
  server, mai mandato al browser) + un segreto: il browser riceve le domande senza risposte giuste.
  Il punteggio dell'avversario lo decide la funzione SQL duel_detail: prima del tuo turno è nascosto.
  Lo stato «expired» si calcola quando si legge (e poi si scrive, per tenere ordine).
  I 5 XP al vincitore li assegna lui stesso quando apre il duello (le regole RLS non permettono di
  scrivere XP per un altro utente); il vincolo xp_once evita i doppioni.
*/

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });

export type DuelView = {
  id: string;
  status: DuelStatus;
  iAmChallenger: boolean;
  opponent: string;
  expiresAt: string;
  myScore: number | null;
  myTotal: number | null;
  theirFinished: boolean;
  /** Null finché non hai finito il tuo turno (o il duello non è chiuso). */
  theirScore: number | null;
  outcome: Outcome | null;
  canAnswer: boolean;
  canAccept: boolean;
};

type DetailRow = {
  id: string;
  status: DuelStatus;
  expires_iso: string;
  seed: string;
  course: string | null;
  i_am_challenger: boolean;
  my_score: number | null;
  my_total: number | null;
  their_finished: boolean;
  their_score: number | null;
  their_nickname: string | null;
};

/** Le date si formattano in SQL: il tipo `timestamp` non ha fuso e il driver lo leggerebbe come ora locale. */
async function detailRow(tx: Tx, id: string): Promise<DetailRow | null> {
  const r = await tx.execute(
    sql`select d.*, to_char(d.expires_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as expires_iso from duel_detail(${id}) d`,
  );
  return (r.rows[0] as DetailRow | undefined) ?? null;
}

/** Domande a cui si può attingere: tutto un corso, oppure tutti i corsi. */
export function duelPool(course: string | null): PoolItem[] {
  const courses = course ? COURSES.filter((c) => c.id === course) : COURSES;
  const seen = new Set<string>();
  const out: PoolItem[] = [];
  for (const c of courses) {
    for (const m of modulesWithLessons(c)) {
      for (const it of poolForModule(c.id, m)) {
        if (!seen.has(it.id)) {
          seen.add(it.id);
          out.push(it);
        }
      }
    }
  }
  return out;
}

const seedOf = (id: string, seed: string) => attemptSeed("duello", id, seed);

/** Sono ancora amici (un blocco o una rimozione cancella l'amicizia: il duello non si può più giocare). */
async function stillFriends(tx: Tx, userId: string, duelId: string): Promise<boolean> {
  const r = await tx.execute(sql`
    select 1 from duels d join friendships f on f.status = 'accepted'
      and ((f.requester_id = d.challenger_id and f.addressee_id = d.opponent_id) or (f.requester_id = d.opponent_id and f.addressee_id = d.challenger_id))
    where d.id = ${duelId} and (d.challenger_id = ${userId} or d.opponent_id = ${userId}) limit 1`);
  return r.rows.length > 0;
}

/** Costruisce la vista; mette in ordine lo stato nel database e assegna i 5 XP al vincitore (una volta sola). */
async function settle(tx: Tx, userId: string, first: DetailRow, now: Date): Promise<DuelView> {
  let row = first;
  let status = row.status;
  if (row.my_score !== null && row.their_finished) status = "done";
  else status = effectiveStatus(status, new Date(row.expires_iso), now);
  if (status !== row.status && (status === "done" || status === "expired")) {
    await tx.update(schema.duels).set({ status }).where(eq(schema.duels.id, row.id));
    // Con lo stato nuovo cambia ciò che si può vedere: si rilegge.
    const fresh = await detailRow(tx, row.id);
    if (fresh) row = fresh;
  }
  const iFinished = row.my_score !== null;
  const theirScore = opponentScoreToShow({ iFinished, status, theirScore: row.their_score });
  const outcome = status === "done" && row.my_score !== null && theirScore !== null ? duelOutcome(row.my_score, theirScore) : null;
  const xp = winnerXp(outcome, status);
  if (xp > 0) {
    await tx.insert(schema.xpEvents).values({ id: randomUUID(), userId, kind: DUEL_XP_KIND, amount: xp, refId: row.id }).onConflictDoNothing();
  }
  return {
    id: row.id,
    status,
    iAmChallenger: row.i_am_challenger,
    opponent: row.their_nickname ?? "Un amico",
    expiresAt: row.expires_iso,
    myScore: row.my_score,
    myTotal: row.my_total,
    theirFinished: row.their_finished,
    theirScore,
    outcome,
    canAnswer: canAnswer(status, row.i_am_challenger, iFinished),
    canAccept: canAccept(status, row.i_am_challenger),
  };
}

export async function getDuel(userId: string, id: string, now = new Date()): Promise<DuelView | null> {
  return withUser(userId, async (tx) => {
    const row = await detailRow(tx, id);
    return row ? settle(tx, userId, row, now) : null;
  });
}

export type DuelList = { invites: DuelView[]; open: DuelView[]; closed: DuelView[] };

export async function listDuels(userId: string, now = new Date()): Promise<DuelList> {
  return withUser(userId, async (tx) => {
    const ids = await tx.select({ id: schema.duels.id }).from(schema.duels).orderBy(desc(schema.duels.createdAt)).limit(30);
    const views: DuelView[] = [];
    for (const { id } of ids) {
      const row = await detailRow(tx, id);
      if (row) views.push(await settle(tx, userId, row, now));
    }
    return {
      invites: views.filter((v) => v.canAccept),
      open: views.filter((v) => (v.status === "pending" || v.status === "active") && !v.canAccept),
      closed: views.filter((v) => v.status === "done" || v.status === "declined" || v.status === "expired"),
    };
  });
}

/** Sfida un amico (si indica l'amicizia, non la persona: l'identità dell'amico non esce mai). */
export async function createDuel(userId: string, friendshipId: string, courseLetter: string | null, now = new Date()): Promise<Result<{ id: string }>> {
  if (courseLetter !== null && !courseByLetter(courseLetter)) return fail("Corso non valido.");
  if (duelPool(courseLetter).length < DUEL_QUESTIONS) return fail("Per questo corso non ci sono ancora abbastanza domande.");
  return withUser(userId, async (tx) => {
    const [f] = await tx
      .select()
      .from(schema.friendships)
      .where(and(eq(schema.friendships.id, friendshipId), eq(schema.friendships.status, "accepted")))
      .limit(1);
    if (!f || (f.requesterId !== userId && f.addresseeId !== userId)) return fail("Puoi sfidare solo i tuoi amici.");
    const opponentId = f.requesterId === userId ? f.addresseeId : f.requesterId;

    // Le policy mostrano solo i duelli miei: sono i miei duelli aperti (non scaduti).
    const open = await tx
      .select({ challengerId: schema.duels.challengerId, opponentId: schema.duels.opponentId })
      .from(schema.duels)
      .where(and(inArray(schema.duels.status, ["pending", "active"]), gt(schema.duels.expiresAt, now)));
    const withFriend = open.some((d) => d.challengerId === opponentId || d.opponentId === opponentId);
    const can = canCreateDuel(open.length, withFriend);
    if (!can.ok) return fail(can.error);

    const id = randomUUID();
    await tx.insert(schema.duels).values({
      id,
      challengerId: userId,
      opponentId,
      seed: randomBytes(16).toString("hex"),
      course: courseLetter,
      status: "pending",
      expiresAt: duelExpiry(now),
    });
    return { ok: true as const, id };
  });
}

export async function respondToDuel(userId: string, id: string, accept: boolean, now = new Date()): Promise<Result> {
  return withUser(userId, async (tx) => {
    const row = await detailRow(tx, id);
    if (!row) return fail("Duello non trovato.");
    const status = effectiveStatus(row.status, new Date(row.expires_iso), now);
    if (!canAccept(status, row.i_am_challenger)) return fail("Questo invito non è più valido.");
    if (!(await stillFriends(tx, userId, id))) return fail("Non siete più amici: il duello non si può fare.");
    // L'attesa riparte: 24 ore da quando accetti.
    const set = accept ? { status: "active" as const, expiresAt: duelExpiry(now) } : { status: "declined" as const };
    const done = await tx
      .update(schema.duels)
      .set(set)
      .where(and(eq(schema.duels.id, id), eq(schema.duels.status, "pending")))
      .returning({ id: schema.duels.id });
    return done.length ? { ok: true as const } : fail("Questo invito non è più valido.");
  });
}

export type DuelStart = { questions: PublicQuestion[] };

async function loadAnswerable(tx: Tx, userId: string, id: string, now: Date): Promise<Result<{ row: DetailRow }>> {
  const row = await detailRow(tx, id);
  if (!row) return fail("Duello non trovato.");
  const status = effectiveStatus(row.status, new Date(row.expires_iso), now);
  if (row.my_score !== null) return fail("Hai già giocato il tuo turno.");
  if (!canAnswer(status, row.i_am_challenger, false)) return fail(status === "expired" ? "Il tempo è scaduto." : "Questo duello non è giocabile ora.");
  if (!(await stillFriends(tx, userId, id))) return fail("Non siete più amici: il duello non si può fare.");
  return { ok: true as const, row };
}

/** Le domande, senza risposte giuste. */
export async function startDuel(userId: string, id: string, now = new Date()): Promise<Result<DuelStart>> {
  return withUser(userId, async (tx) => {
    const g = await loadAnswerable(tx, userId, id, now);
    if (!g.ok) return g;
    const qs = pickDuelQuestions(duelPool(g.row.course), seedOf(id, g.row.seed));
    return { ok: true as const, questions: qs.map(toPublic) };
  });
}

/** Corregge sul server. Il risultato si salva una sola volta (chiave duello + utente). */
export async function submitDuel(userId: string, id: string, answers: unknown, now = new Date()): Promise<Result<{ correct: number; total: number }>> {
  if (!Array.isArray(answers) || answers.length > 50) return fail("Richiesta non valida.");
  return withUser(userId, async (tx) => {
    const g = await loadAnswerable(tx, userId, id, now);
    if (!g.ok) return g;
    const expected = pickDuelQuestions(duelPool(g.row.course), seedOf(id, g.row.seed));
    const { results, correct } = gradeChoices(expected.map((q) => q.answer), answers);
    const total = expected.length;
    const saved = await tx
      .insert(schema.duelResults)
      .values({ duelId: id, userId, score: correct, total })
      .onConflictDoNothing()
      .returning({ d: schema.duelResults.duelId });
    if (!saved.length) return fail("Hai già giocato il tuo turno.");
    await recordWrong(tx, userId, expected.filter((_, i) => !results[i]).map((q) => q.id));
    // Se l'altro ha già finito, il duello si chiude (se non succede ora, lo mette a posto la lettura).
    if (g.row.their_finished) await tx.update(schema.duels).set({ status: "done" }).where(eq(schema.duels.id, id));
    return { ok: true as const, correct, total };
  });
}
