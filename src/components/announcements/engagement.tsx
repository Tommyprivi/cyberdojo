"use client";

import { useState } from "react";
import { reactToAnnouncement, sayPhraseOnAnnouncement } from "@/app/actions/community";
import type { EngagementSummary } from "@/lib/community/reactions";

/** Reazioni (una emoji per persona) e frasi a scelta sotto un annuncio. Nessun testo libero: solo elenchi chiusi. */
export function Engagement({ id, initial }: { id: string; initial: EngagementSummary }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function react(emoji: string) {
    if (busy) return;
    const current = data.reactions.find((r) => r.mine)?.emoji ?? null;
    const next = current === emoji ? null : emoji;
    setBusy(true);
    setError(null);
    const res = await reactToAnnouncement(id, next);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setData((d) => ({
      ...d,
      reactions: d.reactions.map((r) => ({
        ...r,
        mine: r.emoji === next,
        n: r.n + (r.emoji === next ? 1 : 0) - (r.emoji === current ? 1 : 0),
      })),
    }));
  }

  async function phrase(key: string, on: boolean) {
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await sayPhraseOnAnnouncement(id, key, on);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setData((d) => ({ ...d, phrases: d.phrases.map((p) => (p.key === key ? { ...p, mine: on, n: p.n + (on ? 1 : -1) } : p)) }));
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Reazioni">
        {data.reactions.map((r) => (
          <button
            key={r.emoji}
            type="button"
            disabled={busy}
            aria-pressed={r.mine}
            onClick={() => react(r.emoji)}
            className={`inline-flex min-h-9 items-center gap-1 rounded-full border-2 px-3 text-sm font-bold ${r.mine ? "border-primary bg-primary/15" : "border-border bg-surface hover:bg-surface-muted"}`}
          >
            <span aria-hidden>{r.emoji}</span>
            <span>{r.n}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rispondi con una frase">
        {data.phrases.map((p) => (
          <button
            key={p.key}
            type="button"
            disabled={busy}
            aria-pressed={p.mine}
            onClick={() => phrase(p.key, !p.mine)}
            className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${p.mine ? "border-primary bg-primary/15" : "border-border bg-background hover:bg-surface-muted"}`}
          >
            {p.text}
            {p.n > 0 ? <span className="ml-1 text-muted">· {p.n}</span> : null}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-sm font-semibold text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
