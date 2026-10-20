"use client";

import { useState, useTransition } from "react";
import { saveGfxReview, saveSceneReview } from "@/app/(app)/revisione/actions";
import { MAX_NOTE, type ReviewEntry } from "@/lib/content/reviews";

type Target = { kind: "scene"; id: string; n: number } | { kind: "gfx"; id: string };

/**
 * Giudizio compatto: «Mi piace / Da cambiare», voto da 1 a 5 e nota.
 * Serve per ogni schermata di lezione (scene) e per ogni elemento grafico (gfx).
 */
export function VoteBox({ target, entry, label }: { target: Target; entry?: Pick<ReviewEntry, "verdict" | "rating" | "note">; label: string }) {
  const [verdict, setVerdict] = useState(entry?.verdict);
  const [rating, setRating] = useState(entry?.rating);
  const [note, setNote] = useState(entry?.note ?? "");
  const [open, setOpen] = useState(!!entry?.note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const uid = target.kind === "scene" ? `${target.id}-${target.n}` : target.id;

  const send = (patch: Record<string, unknown>, okText: string) =>
    start(async () => {
      const r = await (target.kind === "scene" ? saveSceneReview({ ...target, ...patch }) : saveGfxReview({ ...target, ...patch }));
      setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: r.error });
    });

  const vote = (v: "like" | "change") => {
    const next = verdict === v ? null : v;
    setVerdict(next ?? undefined);
    send({ verdict: next }, next ? "Salvato." : "Giudizio tolto.");
  };

  return (
    <div className="grid gap-2 border-t border-border pt-3 text-sm" role="group" aria-label={`Giudizio: ${label}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={verdict === "like"} disabled={pending} onClick={() => vote("like")} className={`btn min-h-10 px-3 ${verdict === "like" ? "btn-primary" : "btn-ghost"}`}>
          {verdict === "like" ? "✓ Mi piace" : "Mi piace"}
        </button>
        <button type="button" aria-pressed={verdict === "change"} disabled={pending} onClick={() => vote("change")} className={`btn min-h-10 px-3 ${verdict === "change" ? "bg-accent text-accent-fg" : "btn-ghost"}`}>
          {verdict === "change" ? "✓ Da cambiare" : "Da cambiare"}
        </button>
        <div role="radiogroup" aria-label="Voto da 1 a 5" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`Voto ${n} su 5`}
              disabled={pending}
              onClick={() => {
                setRating(n);
                send({ rating: n }, "Voto salvato.");
              }}
              className={`grid size-9 place-items-center rounded-md border font-mono font-bold ${rating === n ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="font-semibold text-primary underline">
          {open ? "Chiudi la nota" : note ? "Vedi la nota" : "Scrivi una nota"}
        </button>
        <span role="status" className={`font-semibold ${msg?.ok === false ? "text-accent" : "text-success"}`}>
          {pending ? "Salvo…" : msg?.text}
        </span>
      </div>
      {open && (
        <form
          className="grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send({ note }, "Nota salvata.");
          }}
        >
          <label htmlFor={`v-${uid}`} className="sr-only">Nota: {label}</label>
          <textarea id={`v-${uid}`} value={note} rows={2} maxLength={MAX_NOTE} onChange={(e) => setNote(e.target.value)} className="rounded-lg border border-muted bg-surface p-2" placeholder="Cosa cambiare…" />
          <button type="submit" disabled={pending} className="btn btn-ghost min-h-10 w-fit px-3">Salva la nota</button>
        </form>
      )}
    </div>
  );
}
