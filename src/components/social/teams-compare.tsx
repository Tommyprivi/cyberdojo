import { compareGroups } from "@/lib/community/teams";
import type { GroupView } from "@/lib/social/service";
import { BoltIcon } from "../icons";

/**
 * Sfida a squadre: confronta i gruppi dell'utente per XP della settimana. Usa solo i totali dei gruppi (mai le lezioni dei singoli).
 * Minori e adulti restano separati, come nel resto del social: la graduatoria è dentro ogni fascia.
 */
export function TeamsCompare({ groups }: { groups: GroupView[] }) {
  if (groups.length < 2) return null;
  const ranked = compareGroups(groups.map((g) => ({ id: g.id, name: g.name, totalXpWeek: g.totalXpWeek, members: g.members, audience: g.audience })));
  const max = Math.max(1, ...ranked.map((r) => r.totalXpWeek));
  return (
    <section aria-label="Sfida a squadre" className="grid gap-3 rounded-lg border border-border bg-surface p-4">
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Sfida a squadre · questa settimana</h2>
      <p className="text-sm text-muted">I tuoi gruppi a confronto per XP della settimana. Conta anche la media per persona, così i gruppi piccoli non sono svantaggiati.</p>
      <ol className="grid gap-2">
        {ranked.map((r) => (
          <li key={r.id} className="grid gap-1">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-6 text-center font-mono text-sm font-bold text-muted">{r.rank}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{r.name}</span>
              <span className="inline-flex items-center gap-1 font-mono text-sm font-bold">
                <BoltIcon width={14} height={14} /> {r.totalXpWeek} XP
              </span>
              <span className="font-mono text-xs text-muted">media {r.avg}</span>
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted" role="img" aria-label={`${r.totalXpWeek} XP${r.gap > 0 ? `, ${r.gap} dal primo` : ", in testa"}`}>
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((r.totalXpWeek / max) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
