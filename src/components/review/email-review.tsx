"use client";

import { useState, useTransition } from "react";
import { saveEmailReview } from "@/app/(app)/revisione/actions";
import { MAX_NOTE } from "@/lib/content/reviews";

/** «Le ho viste / Mi piacciono» e nota per una email. Chiave nel file: email:<id>. */
export function EmailReview({ id, seen: seen0, note: note0 }: { id: string; seen: boolean; note: string }) {
  const [seen, setSeen] = useState(seen0);
  const [note, setNote] = useState(note0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const send = (patch: { seen?: boolean; note?: string }, okText: string) =>
    start(async () => {
      const r = await saveEmailReview({ id, ...patch });
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      setSeen(r.entry.approved ?? false);
      setMsg({ ok: true, text: okText });
    });

  return (
    <div className="grid gap-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={seen}
          disabled={pending}
          onClick={() => send({ seen: !seen }, seen ? "Segno tolto." : "Salvato.")}
          className={`btn ${seen ? "btn-primary" : "btn-ghost"}`}
        >
          {seen ? "✓ Vista, mi piace" : "Le ho viste / Mi piacciono"}
        </button>
        <span role="status" className={`text-sm font-semibold ${msg?.ok === false ? "text-accent" : "text-success"}`}>
          {pending ? "Salvo…" : msg?.text}
        </span>
      </div>
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send({ note }, "Nota salvata.");
        }}
      >
        <label htmlFor={`nota-email-${id}`} className="text-sm font-bold">Nota su questa email</label>
        <textarea
          id={`nota-email-${id}`}
          value={note}
          rows={2}
          maxLength={MAX_NOTE}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-lg border border-muted bg-surface p-3"
        />
        <button type="submit" disabled={pending} className="btn btn-ghost w-fit">Salva la nota</button>
      </form>
    </div>
  );
}
