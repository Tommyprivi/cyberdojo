/** Unione e ordinamento delle due fonti di annunci (file e database). Logica pura. */

export type MergedAnnouncement = {
  id: string;
  date: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  source: "file" | "db";
  pinned: boolean;
};

/** Fissati in cima, poi per data (più recente prima), poi per id. Un id doppio: vince il database. */
export function mergeAnnouncements(files: MergedAnnouncement[], db: MergedAnnouncement[]): MergedAnnouncement[] {
  const byId = new Map<string, MergedAnnouncement>();
  for (const f of files) byId.set(f.id, f);
  for (const d of db) byId.set(d.id, d);
  return [...byId.values()].sort((x, y) => Number(y.pinned) - Number(x.pinned) || y.date.localeCompare(x.date) || y.id.localeCompare(x.id));
}
