"use client";

import { useState } from "react";
import { loadCourseLeaderboard } from "@/app/actions/community";
import { saveSocialToggles } from "@/app/actions/social";
import { COURSES } from "@/lib/content/courses";
import { BoltIcon } from "../icons";
import type { LeaderRow, SocialSettings } from "@/lib/social/service";
import { AGE_GROUP_LABEL } from "@/lib/social/rules";
import { Avatar } from "./avatar";
import { NoticeLine, useAction } from "./use-action";
import { ReportButton } from "./report-button";

export function LeaderboardPanel({ settings, rows: allRows, resetIn }: { settings: SocialSettings; rows: LeaderRow[]; resetIn: string }) {
  const { busy, notice, run } = useAction();
  // "" = classifica generale; una lettera = classifica di quel corso (XP delle sole lezioni del corso).
  const [course, setCourse] = useState("");
  const [courseRows, setCourseRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const rows = course ? courseRows : allRows;

  async function pick(next: string) {
    setCourse(next);
    setCourseError(null);
    if (!next) return;
    setLoading(true);
    try {
      const r = await loadCourseLeaderboard(next);
      if (r.ok) setCourseRows(r.rows);
      else {
        setCourseRows([]);
        setCourseError(r.error);
      }
    } catch {
      setCourseRows([]);
      setCourseError("Connessione persa. Riprova.");
    } finally {
      setLoading(false);
    }
  }
  const toggles = { joinLeaderboard: settings.joinLeaderboard, showToFriends: settings.showToFriends, acceptRequests: settings.acceptRequests };
  const me = rows.find((r) => r.isMe);
  const group = settings.ageGroup ? AGE_GROUP_LABEL[settings.ageGroup] : "";

  if (!settings.joinLeaderboard) {
    return (
      <div className="grid max-w-xl content-start gap-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-2xl font-bold">Classifica della settimana</h2>
        <p>
          La classifica mette in fila chi ha guadagnato più XP in questa settimana (da lunedì a domenica) e si azzera ogni lunedì. È <strong>facoltativa</strong>: finché non partecipi, non la vedi e
          nessuno ti vede.
        </p>
        <p className="rounded-md border border-border bg-background p-3 text-sm">
          <strong>Cosa vedono gli altri se partecipi:</strong> solo il tuo soprannome «{settings.nickname}», il tuo avatar e gli XP della settimana. Vedono solo persone della tua fascia ({group}). Puoi uscire quando vuoi.
        </p>
        <button type="button" disabled={busy} className="btn btn-primary w-fit" onClick={() => run(() => saveSocialToggles({ ...toggles, joinLeaderboard: true }), "Ora partecipi alla classifica.")}>
          Partecipo alla classifica
        </button>
        <NoticeLine notice={notice} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section aria-label="Classifica" className="rounded-lg border border-border bg-surface lg:flex lg:min-h-0 lg:flex-col">
        <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Classifica · {group}</h2>
          <p className="font-mono text-xs text-muted">si azzera tra {resetIn}</p>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
          <label htmlFor="course-board" className="text-sm font-semibold">
            Corso
          </label>
          <select id="course-board" value={course} disabled={loading} onChange={(e) => void pick(e.target.value)} className="min-h-11 rounded-md border-2 border-border bg-background px-2 text-sm">
            <option value="">Tutti i corsi</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {loading && <span className="text-sm text-muted" aria-live="polite">Carico…</span>}
          {courseError && <span role="alert" className="text-sm font-semibold text-accent">{courseError}</span>}
        </div>
        {rows.length <= 1 && <p className="px-4 pt-3 text-sm text-muted">Per ora ci sei solo tu. Più persone partecipano, più la classifica diventa interessante.</p>}
        <ol className="grid gap-1 p-2 lg:min-h-0 lg:overflow-y-auto">
          {rows.map((r) => (
            <li key={r.ref} className={`flex flex-wrap items-center gap-3 rounded-md px-2 py-1.5 ${r.isMe ? "bg-surface-muted font-bold" : ""}`}>
              <span className="w-8 text-center font-mono text-sm font-bold text-muted">{r.rank}</span>
              <Avatar id={r.avatar} size={40} />
              <span className="min-w-0 flex-1 truncate">
                {r.nickname}
                {r.isMe && <span className="ml-1 text-sm font-semibold text-muted">(tu)</span>}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-sm font-bold">
                <BoltIcon width={14} height={14} /> {r.xp} XP
              </span>
              {!r.isMe && <ReportButton kind="user" targetId={r.ref} what={`il soprannome ${r.nickname}`} />}
            </li>
          ))}
        </ol>
      </section>

      <aside className="grid content-start gap-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">La tua settimana</h2>
        <p className="font-mono text-4xl font-bold leading-none">
          {me ? `#${me.rank}` : "—"} <span className="font-sans text-base font-semibold text-muted">{me ? `con ${me.xp} XP` : ""}</span>
        </p>
        <p className="text-sm text-muted">Gli XP si guadagnano completando lezioni e verifiche. La classifica riparte da zero ogni lunedì a mezzanotte (ora italiana).</p>
        <p className="rounded-md border border-border bg-background p-3 text-xs">
          Gli altri vedono di te solo soprannome, avatar e XP della settimana, e solo persone della tua fascia ({group}).
        </p>
        <button type="button" disabled={busy} className="btn btn-ghost w-fit" onClick={() => run(() => saveSocialToggles({ ...toggles, joinLeaderboard: false }), "Sei uscito dalla classifica.")}>
          Esci dalla classifica
        </button>
        <NoticeLine notice={notice} />
      </aside>
    </div>
  );
}
