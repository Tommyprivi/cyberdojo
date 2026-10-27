import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DIVISIONS, divisionFor, movement, movementMessage, xpToNext } from "@/lib/leagues/divisions";
import { getLeagueState } from "@/lib/leagues/service";
import { requireMember } from "@/lib/session";
import * as social from "@/lib/social/service";
import { resetLabel, weekBounds } from "@/lib/social/week";

export const metadata: Metadata = { title: "Leghe", robots: { index: false } };

export default function LeghePage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico le leghe" />}>
      <LegheContent />
    </Suspense>
  );
}

async function LegheContent() {
  const { user } = await requireMember("/leghe");
  const now = new Date();
  const settings = await social.getSettings(user.id);

  // Solo chi ha attivato la partecipazione (e ha un soprannome) entra nelle leghe.
  if (!settings.hasProfile || !settings.joinLeaderboard || !settings.ageGroup) {
    return (
      <div className="grid max-w-xl gap-3">
        <h1 className="font-display text-3xl font-bold">Leghe settimanali</h1>
        <p className="text-sm">
          Le leghe sono facoltative. Per partecipare scegli un soprannome e attiva la classifica nelle impostazioni social: finché non lo fai, nessuno vede nulla di te.
        </p>
        <Link href="/profilo/social" className="inline-flex min-h-11 w-fit items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg">
          Apri le impostazioni social
        </Link>
      </div>
    );
  }

  const [league, board] = await Promise.all([getLeagueState(user.id, now), social.getLeaderboard(user.id, now)]);
  const div = DIVISIONS[league.currentIdx];
  const mv = movement(league.previousIdx, league.currentIdx);
  const next = xpToNext(league.thisWeekXp);
  const week = weekBounds(now);

  return (
    <div className="grid gap-4">
      <header>
        <h1 className="font-display text-3xl font-bold">Leghe settimanali</h1>
        <p className="mt-1 text-sm text-muted">
          La divisione dipende dagli XP della settimana scorsa. Nuova settimana tra {resetLabel(now, week.end)}.
        </p>
      </header>

      <section className="grid gap-2 rounded-lg border border-border bg-surface p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">La tua divisione</p>
        <p className="font-display text-4xl font-bold" style={{ color: div.color }}>
          {div.name}
        </p>
        <p className="text-sm">
          {mv === "promosso" ? "⬆ " : mv === "retrocesso" ? "⬇ " : ""}
          {movementMessage(league.previousIdx, league.currentIdx)}
        </p>
        <p className="text-sm text-muted">
          Questa settimana: <strong>{league.thisWeekXp} XP</strong> ({divisionFor(league.thisWeekXp).name}).
          {next ? ` Ne mancano ${next.missing} per arrivare a ${next.next.name}.` : " Sei al massimo!"}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Le divisioni</h2>
        <ol className="mt-2 grid gap-1 text-sm">
          {DIVISIONS.map((d, i) => (
            <li key={d.id} className={i === league.currentIdx ? "font-bold" : ""}>
              <span style={{ color: d.color }}>●</span> {d.name} · da {d.minXp} XP a settimana
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Classifica della settimana</h2>
        <p className="mt-1 text-xs text-muted">Solo chi partecipa, e solo della tua fascia d&apos;età.</p>
        <ol className="mt-2 grid gap-1 text-sm">
          {board.rows.map((r) => (
            <li key={r.ref} className={r.isMe ? "font-bold" : ""}>
              {r.rank}. {r.nickname} · {r.xp} XP · <span style={{ color: divisionFor(r.xp).color }}>{divisionFor(r.xp).name}</span>
            </li>
          ))}
          {board.rows.length === 0 && <li className="text-muted">Ancora nessuno questa settimana.</li>}
        </ol>
      </section>
    </div>
  );
}
