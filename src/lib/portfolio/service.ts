import { eq, sql } from "drizzle-orm";
import { getDb, schema } from "../db";
import { withUser } from "../db/scoped";
import * as social from "../social/service";
import { canEnablePortfolio, isValidPublicId, parsePublicRow, type PublicPortfolio } from "./portfolio";

/**
 * Portfolio pubblico facoltativo. Ogni funzione riceve l'id dell'utente già autenticato (lo decide solo
 * src/app/actions/portfolio.ts). La pagina pubblica legge SOLO dalla funzione SQL portfolio_public()
 * (drizzle/0009): nome vero, email e id dell'account non escono mai.
 */

export type PortfolioSettings = {
  enabled: boolean;
  showCertificates: boolean;
  showBelt: boolean;
  /** Se può accenderlo; altrimenti il motivo, in italiano. */
  blockedReason: string | null;
  ref: string | null;
  nickname: string | null;
  avatar: string;
  certificateCount: number;
};

export type PortfolioInput = { enabled: boolean; showCertificates: boolean; showBelt: boolean };
type Result = { ok: true } | { ok: false; error: string };

export async function getPortfolioSettings(userId: string): Promise<PortfolioSettings> {
  const s = await social.getSettings(userId);
  const verdict = canEnablePortfolio({ ageGroup: s.ageGroup, hasNickname: s.hasProfile });
  const { row, certs } = await withUser(userId, async (tx) => {
    const [row] = await tx.select().from(schema.portfolioPages).where(eq(schema.portfolioPages.userId, userId)).limit(1);
    const [{ n }] = await tx
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.certificates)
      .where(eq(schema.certificates.userId, userId));
    return { row, certs: n };
  });
  return {
    // Se non è più adulto, la pagina conta come spenta (anche se la riga dice altro: il database non la serve).
    enabled: verdict.ok && !!row?.enabled,
    showCertificates: row?.showCertificates ?? true,
    showBelt: row?.showBelt ?? true,
    blockedReason: verdict.ok ? null : verdict.reason,
    ref: s.ref,
    nickname: s.nickname,
    avatar: s.avatar,
    certificateCount: certs,
  };
}

export async function savePortfolioSettings(userId: string, input: PortfolioInput): Promise<Result> {
  const s = await social.getSettings(userId);
  const verdict = canEnablePortfolio({ ageGroup: s.ageGroup, hasNickname: s.hasProfile });
  // Spegnere si può sempre; accendere solo se si è adulti con soprannome.
  if (input.enabled && !verdict.ok) return { ok: false, error: verdict.reason };
  try {
    await withUser(userId, (tx) =>
      tx
        .insert(schema.portfolioPages)
        .values({ userId, ...input, updatedAt: new Date() })
        .onConflictDoUpdate({ target: schema.portfolioPages.userId, set: { ...input, updatedAt: new Date() } }),
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Non riesco a salvare adesso. Riprova tra poco." };
  }
}

export type PublicLookup = { status: "ok"; portfolio: PublicPortfolio } | { status: "not-found" } | { status: "unavailable" };

/** Lettura pubblica (senza accesso). Non trovata = id sbagliato, pagina spenta, utente minorenne o senza soprannome. */
export async function getPublicPortfolio(publicId: string): Promise<PublicLookup> {
  if (!isValidPublicId(publicId)) return { status: "not-found" };
  try {
    const res = await getDb().execute(sql`select * from public.portfolio_public(${publicId})`);
    const portfolio = parsePublicRow(res.rows[0] as Parameters<typeof parsePublicRow>[0]);
    return portfolio ? { status: "ok", portfolio } : { status: "not-found" };
  } catch {
    // Funzione non ancora creata nel database (migrazione 0009 da applicare) o database non raggiungibile.
    return { status: "unavailable" };
  }
}
