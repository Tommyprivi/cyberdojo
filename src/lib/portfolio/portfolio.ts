import { beltOf, levelOf, type BeltColor } from "../progress/profile-stats";
import { isAvatarId, type AvatarId } from "../social/avatars";
import type { AgeGroup } from "../social/rules";

/** Logica pura del portfolio pubblico (nessun accesso al database). */

const PUBLIC_ID = /^[a-hj-km-np-z2-9]{12}$/;

/** Stesso formato degli identificativi pubblici del Social (src/lib/social/codes.ts). */
export function isValidPublicId(id: string): boolean {
  return PUBLIC_ID.test(id);
}

export const portfolioPath = (publicId: string) => `/p/${publicId}`;

/** Solo adulti con un profilo social (soprannome): i minori non possono mai avere una pagina pubblica. */
export function canEnablePortfolio(i: { ageGroup: AgeGroup | null; hasNickname: boolean }): { ok: true } | { ok: false; reason: string } {
  if (i.ageGroup === null) return { ok: false, reason: "Completa prima la fascia d'età nel profilo." };
  if (i.ageGroup !== "adulti") return { ok: false, reason: "La pagina pubblica è disponibile solo per chi ha dichiarato almeno 18 anni." };
  if (!i.hasNickname) return { ok: false, reason: "Scegli prima un soprannome e un avatar nel Social." };
  return { ok: true };
}

export type PublicCertificate = { course: string; belt: string; issuedAt: string; code: string };
export type PublicPortfolio = {
  nickname: string;
  avatar: AvatarId;
  belt: { xp: number; levelName: string; color: BeltColor; beltName: string } | null;
  certificates: PublicCertificate[];
};

/** Riga restituita da portfolio_public(): si rimette in forma e si scarta tutto ciò che non torna. */
export function parsePublicRow(row: { nickname?: unknown; avatar?: unknown; xp?: unknown; certificates?: unknown } | undefined): PublicPortfolio | null {
  if (!row || typeof row.nickname !== "string" || !row.nickname) return null;
  const xp = typeof row.xp === "number" && Number.isFinite(row.xp) ? row.xp : null;
  const lvl = xp === null ? null : levelOf(xp);
  const belt = lvl && xp !== null ? { xp, levelName: lvl.name, ...(({ color, name }) => ({ color, beltName: name }))(beltOf(lvl.level)) } : null;
  const raw = Array.isArray(row.certificates) ? row.certificates : [];
  const certificates: PublicCertificate[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    if (typeof o.course !== "string" || typeof o.code !== "string" || !o.code) continue;
    const issued = new Date(String(o.issued_at ?? ""));
    certificates.push({
      course: o.course,
      belt: typeof o.belt === "string" ? o.belt : "",
      issuedAt: Number.isNaN(issued.getTime()) ? "" : issued.toISOString(),
      code: o.code.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40),
    });
  }
  return { nickname: row.nickname, avatar: isAvatarId(row.avatar) ? row.avatar : "sensei", belt, certificates };
}
