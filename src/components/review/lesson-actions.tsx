"use client";

import { useState, useTransition } from "react";
import { saveLessonReview } from "@/app/(app)/revisione/actions";
import { isReadyToPublish, MAX_NOTE } from "@/lib/content/reviews";

type Props = {
  id: string;
  hasVideo: boolean;
  isAttack: boolean;
  approved: boolean;
  videoReviewed: boolean;
  humanReviewed: boolean;
  note: string;
};

/** Pulsanti di approvazione e campo note per una lezione. Si salvano in content/revisioni.json. */
export function LessonActions(props: Props) {
  const { id, hasVideo, isAttack } = props;
  const [state, setState] = useState(props);
  const [note, setNote] = useState(props.note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const send = (patch: { approved?: boolean; videoReviewed?: boolean; humanReviewed?: boolean; note?: string }, okText: string) =>
    start(async () => {
      const r = await saveLessonReview({ id, ...patch });
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      setState((s) => ({
        ...s,
        approved: r.entry.approved ?? s.approved,
        videoReviewed: r.entry.videoReviewed ?? s.videoReviewed,
        humanReviewed: r.entry.humanReviewed ?? s.humanReviewed,
      }));
      setMsg({ ok: true, text: okText });
    });

  const ready = isReadyToPublish({ ...state });
  const toggle = (on: boolean, label: string, doneLabel: string, key: "approved" | "videoReviewed" | "humanReviewed") => (
    <button
      type="button"
      aria-pressed={on}
      disabled={pending}
      onClick={() => send({ [key]: !on }, on ? "Segno tolto." : "Salvato.")}
      className={`btn ${on ? "btn-primary" : "btn-ghost"}`}
    >
      {on ? `✓ ${doneLabel}` : label}
    </button>
  );

  return (
    <section aria-label="Approvazione" className="dossier grid gap-4 p-5">
      <div className="flex flex-wrap items-center gap-3">
        {toggle(state.approved, "Approvo la lezione", "Lezione approvata", "approved")}
        {hasVideo
          ? toggle(state.videoReviewed, "Ho guardato il video", "Video guardato", "videoReviewed")
          : <span className="chip text-sm text-accent">Questa lezione non ha un video</span>}
        {isAttack && toggle(state.humanReviewed, "Ho riletto questo modulo (revisione umana)", "Modulo riletto", "humanReviewed")}
      </div>
      <p
        className={`w-fit rounded-md border px-3 py-1.5 text-sm font-bold ${
          ready ? "border-success bg-success text-success-fg" : "border-border bg-surface-muted text-foreground"
        }`}
      >
        {ready
          ? "Pronta per la pubblicazione"
          : `Manca: ${[
              !state.approved && "approvazione",
              !hasVideo ? "un video" : !state.videoReviewed && "video guardato",
              isAttack && !state.humanReviewed && "rilettura umana",
            ]
              .filter(Boolean)
              .join(", ")}`}
      </p>
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send({ note }, "Nota salvata.");
        }}
      >
        <label htmlFor={`nota-${id}`} className="font-bold">Note per Claude</label>
        <textarea
          id={`nota-${id}`}
          value={note}
          maxLength={MAX_NOTE}
          rows={4}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Cosa cambiare, cosa non ti convince, cosa manca…"
          className="rounded-lg border border-muted bg-surface p-3"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn btn-primary">Salva la nota</button>
          <span className="font-mono text-xs text-muted">{note.length} / {MAX_NOTE}</span>
          <span role="status" className={`text-sm font-semibold ${msg?.ok === false ? "text-accent" : "text-success"}`}>
            {pending ? "Salvo…" : msg?.text}
          </span>
        </div>
      </form>
    </section>
  );
}
