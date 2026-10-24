"use client";

import { setWeeklyChallenge } from "@/app/actions/social";
import { CheckIcon, TargetIcon } from "../icons";
import type { ChallengeView } from "@/lib/social/service";
import { NoticeLine, useAction } from "./use-action";

export function ChallengesPanel({ list, wins, resetIn }: { list: ChallengeView[]; wins: number; resetIn: string }) {
  const { busy, notice, run } = useAction();
  return (
    <div className="grid content-start gap-4 lg:min-h-0 lg:overflow-y-auto">
      <p className="max-w-3xl text-sm">
        Le sfide sono <strong>facoltative</strong>: scegli tu a quali partecipare. Contano solo le lezioni e gli XP da quando ti iscrivi, fino a domenica sera (ora italiana). Se raggiungi l&apos;obiettivo, a fine settimana
        ricevi una medaglia nel Profilo (sezione «Medaglie»). Nuova settimana tra {resetIn}.
      </p>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const pct = Math.round((c.value / c.target) * 100);
          return (
            <li key={c.id} className="grid content-start gap-3 rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className={`grid size-12 shrink-0 place-items-center rounded-lg ${c.done ? "bg-success text-success-fg" : "bg-surface-muted text-primary"}`}>
                  {c.done ? <CheckIcon width={26} height={26} /> : <TargetIcon width={26} height={26} />}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold leading-tight">{c.title}</h3>
                  <p className="text-sm text-muted">{c.hint}</p>
                </div>
              </div>
              {c.joined ? (
                <>
                  <div className="grid gap-1">
                    <div className="flex justify-between font-mono text-xs">
                      <span>
                        {c.value}/{c.target}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div role="progressbar" aria-label={`Avanzamento: ${c.title}`} aria-valuemin={0} aria-valuemax={c.target} aria-valuenow={c.value} className="h-3 overflow-hidden rounded-full bg-surface-muted">
                      <div className={`h-full rounded-full ${c.done ? "bg-success" : "bg-primary"}`} style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                  {c.done ? (
                    <p className="text-sm font-semibold text-success">Obiettivo raggiunto. La medaglia arriva lunedì.</p>
                  ) : (
                    <button type="button" disabled={busy} className="btn btn-ghost w-fit" onClick={() => run(() => setWeeklyChallenge(c.id, false), "Hai lasciato la sfida.")}>
                      Lascia la sfida
                    </button>
                  )}
                </>
              ) : (
                <button type="button" disabled={busy} className="btn btn-primary w-fit" onClick={() => run(() => setWeeklyChallenge(c.id, true), "Sei iscritto alla sfida: buona settimana.")}>
                  Partecipo
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="font-mono text-xs text-muted">Sfide vinte finora: {wins}</p>
      <NoticeLine notice={notice} />
    </div>
  );
}
