import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/*
  Parte pura dei laboratori CTF (nessun database, nessun browser).
  - La bandiera di ogni utente è derivata sul server da un segreto: il client non la vede mai.
  - La verifica confronta l'hash SHA-256 con sale della bandiera inviata con quello della bandiera attesa.
*/

export const FLAG_RE = /^cyberdojo\{[a-z0-9_.-]{1,60}\}$/;
export const MAX_FLAG_CHARS = 120;

export type Level = "facile" | "medio" | "difficile";
export const LEVELS: readonly Level[] = ["facile", "medio", "difficile"];
export const LEVEL_LABEL: Record<Level, string> = { facile: "Facile", medio: "Medio", difficile: "Difficile" };

/** Punti per sfida risolta (una volta sola). */
export const XP_BY_LEVEL: Record<Level, number> = { facile: 15, medio: 25, difficile: 40 };
export const CTF_XP_KIND = "ctf";

/** Limite di tentativi sbagliati: 10 ogni 10 minuti per ogni sfida (come le verifiche). */
export const MAX_FAILS = 10;
export const WINDOW_MS = 10 * 60 * 1000;

/** Spazi ai lati e maiuscole non contano: «  CyberDojo{Ciao} » = «cyberdojo{ciao}». */
export function normalizeFlag(raw: string): string {
  return raw.trim().toLowerCase();
}

export function hashFlag(flag: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${normalizeFlag(flag)}`).digest("hex");
}

/** Confronto a tempo costante tra gli hash con sale. */
export function verifyFlag(submitted: unknown, expectedFlag: string, salt: string): boolean {
  if (typeof submitted !== "string" || submitted.length > MAX_FLAG_CHARS) return false;
  const a = Buffer.from(hashFlag(submitted, salt), "hex");
  const b = Buffer.from(hashFlag(expectedFlag, salt), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Seme personale: dipende dal segreto del server, dall'utente e dalla sfida. */
export function challengeSeed(secret: string, userId: string, challengeId: string): string {
  return createHmac("sha256", secret).update(`ctf-seed|${userId}|${challengeId}`).digest("hex");
}

/** Sale della sfida (uguale per tutti, ma segreto). */
export function challengeSalt(secret: string, challengeId: string): string {
  return createHmac("sha256", secret).update(`ctf-salt|${challengeId}`).digest("hex");
}

/** `failedAt`: istanti dei tentativi sbagliati. Blocca dopo MAX_FAILS nella finestra. */
export function rateLimit(failedAt: readonly Date[], now: Date = new Date(), max = MAX_FAILS, windowMs = WINDOW_MS): { blocked: false } | { blocked: true; minutes: number } {
  const recent = failedAt.map((d) => d.getTime()).filter((t) => t > now.getTime() - windowMs).sort((x, y) => x - y);
  if (recent.length < max) return { blocked: false };
  const until = recent[recent.length - max] + windowMs;
  return { blocked: true, minutes: Math.max(1, Math.ceil((until - now.getTime()) / 60_000)) };
}

export function xpForSolve(level: Level, challengeId: string): { kind: string; amount: number; refId: string } {
  return { kind: CTF_XP_KIND, amount: XP_BY_LEVEL[level], refId: challengeId };
}

/** Punti ancora da dare: 0 se la sfida è già nell'elenco di quelle premiate (vincolo xp_once). */
export function xpToAward(level: Level, challengeId: string, alreadyAwarded: ReadonlySet<string>): number {
  return alreadyAwarded.has(challengeId) ? 0 : XP_BY_LEVEL[level];
}
