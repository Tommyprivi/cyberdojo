import { pickQuestions, type FullQuestion, type PoolItem } from "@/lib/mastery/pool";

/**
 * Regole del duello a turni. Tutto puro (nessun database): i numeri e i controlli stanno qui,
 * il lavoro col database sta in service.ts. Vedi DECISIONS.md.
 */

export const DUEL_QUESTIONS = 10;
export const DUEL_HOURS = 24;
export const MAX_OPEN_DUELS = 5;
/** Simbolico: solo al vincitore, una volta per duello (vincolo xp_once). */
export const DUEL_WIN_XP = 5;
export const DUEL_XP_KIND = "duel";

export type DuelStatus = "pending" | "active" | "done" | "declined" | "expired";
export type Outcome = "win" | "loss" | "draw";

export const duelExpiry = (from: Date): Date => new Date(from.getTime() + DUEL_HOURS * 3_600_000);

/** Lo stato «expired» non si scrive per forza: si calcola quando si legge. */
export function effectiveStatus(status: DuelStatus, expiresAt: Date, now: Date): DuelStatus {
  if ((status === "pending" || status === "active") && expiresAt.getTime() <= now.getTime()) return "expired";
  return status;
}

export function duelOutcome(mine: number, theirs: number): Outcome {
  return mine > theirs ? "win" : mine < theirs ? "loss" : "draw";
}

export function canCreateDuel(openCount: number, alreadyWithFriend: boolean): { ok: true } | { ok: false; error: string } {
  if (alreadyWithFriend) return { ok: false, error: "Hai già un duello aperto con questo amico: finitelo prima." };
  if (openCount >= MAX_OPEN_DUELS) return { ok: false, error: `Hai già ${MAX_OPEN_DUELS} duelli aperti: finiscine uno prima di sfidare ancora.` };
  return { ok: true };
}

/** Lo sfidante può giocare subito; lo sfidato solo dopo aver accettato. */
export function canAnswer(status: DuelStatus, iAmChallenger: boolean, iFinished: boolean): boolean {
  if (iFinished) return false;
  return status === "active" || (status === "pending" && iAmChallenger);
}

export const canAccept = (status: DuelStatus, iAmChallenger: boolean): boolean => status === "pending" && !iAmChallenger;

/** Il punteggio dell'avversario si vede solo dopo il proprio turno, o a duello chiuso. */
export function opponentScoreToShow(p: { iFinished: boolean; status: DuelStatus; theirScore: number | null }): number | null {
  return p.iFinished || p.status === "done" || p.status === "expired" ? p.theirScore : null;
}

export const winnerXp = (outcome: Outcome | null, status: DuelStatus): number => (outcome === "win" && status === "done" ? DUEL_WIN_XP : 0);

/** Le 10 domande del duello: dipendono solo dal seme (uguali per i due sfidanti). */
export function pickDuelQuestions(pool: readonly PoolItem[], seed: string): FullQuestion[] {
  const q = pickQuestions(pool, `duello:${seed}`, DUEL_QUESTIONS);
  if (q.length < DUEL_QUESTIONS) throw new Error("Non ci sono abbastanza domande per un duello.");
  return q;
}

/** «Scade tra 5 ore», «Scade tra 40 minuti», «Scaduto». */
export function timeLeftLabel(expiresAt: Date, now: Date): string {
  const ms = expiresAt.getTime() - now.getTime();
  if (ms <= 0) return "Scaduto";
  const minutes = Math.ceil(ms / 60_000);
  if (minutes < 60) return `Scade tra ${minutes} ${minutes === 1 ? "minuto" : "minuti"}`;
  const hours = Math.ceil(minutes / 60);
  return `Scade tra ${hours} ${hours === 1 ? "ora" : "ore"}`;
}
