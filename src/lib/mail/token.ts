import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Link di disiscrizione firmato: contiene l'utente e una firma HMAC calcolata con il segreto del sito.
 * Chi ha il link può disattivare i promemoria di quell'utente (e nient'altro), senza accedere.
 * La firma è legata allo scopo («unsub»): lo stesso segreto non vale per altri usi.
 */

const PURPOSE = "unsub";

function secret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error("BETTER_AUTH_SECRET non impostato.");
  return s;
}

const sign = (userId: string) => createHmac("sha256", secret()).update(`${PURPOSE}:${userId}`).digest("base64url");

export function makeUnsubscribeToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

/** L'utente a cui appartiene il token, oppure null se la firma non torna. */
export function verifyUnsubscribeToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1 || token.length > 300) return null;
  const userId = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(userId));
  return given.length === expected.length && timingSafeEqual(given, expected) ? userId : null;
}
