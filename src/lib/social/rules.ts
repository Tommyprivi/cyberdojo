/**
 * Regole del lato social: tutte le soglie e i controlli di età in un posto solo.
 * Le stesse regole sono ripetute dentro il database (trigger), come seconda barriera:
 * se cambi un numero qui, cambia anche la migrazione social (vedi docs/social.md).
 */

export const MAX_FRIENDS = 30;
export const MAX_GROUP_SIZE = 40;
export const MAX_OWNED_GROUPS = 3;
export const MAX_JOINED_GROUPS = 5;
/** Giorni minimi tra due cambi di soprannome (il primo è libero). */
export const NICKNAME_COOLDOWN_DAYS = 7;
export const LEADERBOARD_LIMIT = 50;
/** Segnalazioni al massimo per ora, per chi segnala. */
export const REPORTS_PER_HOUR = 10;

/** Due soli gruppi di età: i minori non sono mai mischiati con gli adulti. */
export type AgeGroup = "minori" | "adulti";

export const AGE_GROUP_LABEL: Record<AgeGroup, string> = { minori: "14-17 anni", adulti: "18 anni e più" };

/** Dalla fascia dichiarata al gruppo. Senza fascia (profilo incompleto) non si usa il social. */
export function ageGroupOf(ageBand: string | null | undefined): AgeGroup | null {
  if (ageBand === "14-17") return "minori";
  if (ageBand === "18-25" || ageBand === "26-40" || ageBand === "41+") return "adulti";
  return null;
}

/** Amici solo dentro lo stesso gruppo di età. */
export function canBeFriends(a: AgeGroup | null, b: AgeGroup | null): boolean {
  return a !== null && a === b;
}

/** A chi è aperto un gruppo: solo ai ragazzi (con un adulto responsabile) oppure solo agli adulti. */
export type GroupAudience = "minori" | "adulti";

/** Solo chi ha dichiarato almeno 18 anni può creare un gruppo. */
export function canCreateGroup(owner: AgeGroup | null): boolean {
  return owner === "adulti";
}

/** Si entra in un gruppo solo se la sua fascia coincide con la propria (il creatore adulto è l'unica eccezione). */
export function canJoinGroup(member: AgeGroup | null, audience: GroupAudience): boolean {
  return member !== null && member === audience;
}

export const REPORT_REASONS = [
  { id: "offensivo", label: "Nome o avatar offensivo" },
  { id: "molestie", label: "Mi dà fastidio o mi molesta" },
  { id: "personale", label: "Sembra mostrare dati personali" },
  { id: "sicurezza", label: "Mi preoccupa per la sicurezza" },
  { id: "altro", label: "Altro" },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]["id"];
export const REPORT_REASON_IDS = REPORT_REASONS.map((r) => r.id) as [ReportReason, ...ReportReason[]];
