/** Sfide a squadre (sui gruppi di studio esistenti) e scelta del corso per la classifica. Logica pura. */

export const COURSE_IDS = ["F", "C", "D", "T", "H"] as const;
export type CourseLetter = (typeof COURSE_IDS)[number];
export const isCourseId = (v: unknown): v is CourseLetter => typeof v === "string" && (COURSE_IDS as readonly string[]).includes(v);

export type TeamInput = { id: string; name: string; totalXpWeek: number; members: number; audience: "minori" | "adulti" };
export type TeamRank = TeamInput & { rank: number; /** XP che mancano al primo della stessa fascia. */ gap: number; /** XP medi per persona. */ avg: number };

/**
 * Confronta i gruppi dell'utente. Minori e adulti restano separati: la graduatoria si fa dentro ogni fascia
 * (a pari XP, stesso posto). La media per persona aiuta a confrontare gruppi di dimensioni diverse.
 */
export function compareGroups(groups: TeamInput[]): TeamRank[] {
  const out: TeamRank[] = [];
  for (const audience of ["minori", "adulti"] as const) {
    const list = groups.filter((g) => g.audience === audience).sort((a, b) => b.totalXpWeek - a.totalXpWeek || a.name.localeCompare(b.name));
    const top = list[0]?.totalXpWeek ?? 0;
    list.forEach((g, i) => {
      const rank = i > 0 && list[i - 1].totalXpWeek === g.totalXpWeek ? out[out.length - 1].rank : i + 1;
      out.push({ ...g, rank, gap: top - g.totalXpWeek, avg: g.members > 0 ? Math.round(g.totalXpWeek / g.members) : 0 });
    });
  }
  return out;
}
