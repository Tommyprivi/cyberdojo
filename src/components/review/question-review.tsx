"use client";

import { useState, useTransition } from "react";
import { saveQuestionReview } from "@/app/(app)/revisione/actions";
import { MAX_NOTE, QUESTION_VERDICTS, type QuestionEntry, type QuestionVerdict } from "@/lib/content/reviews";

const STYLE: Record<QuestionVerdict, string> = {
  ok: "bg-success text-success-fg",
  fix: "bg-belt-yellow text-belt-yellow-fg",
  remove: "bg-accent text-accent-fg",
};

/** «Giusta e chiara / Da correggere / Da togliere» e nota, per una domanda. Salva in revisioni-domande.json. */
export function QuestionReview({ id, entry }: { id: string; entry?: QuestionEntry }) {
  const [verdict, setVerdict] = useState(entry?.verdict);
  const [note, setNote] = useState(entry?.note ?? "");
  const [open, setOpen] = useState(!!entry?.note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const send = (patch: { verdict?: QuestionVerdict | null; note?: string }, okText: string) =>
    start(async () => {
      const r = await saveQuestionReview({ id, ...patch });
      setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: r.error });
    });

  return (
    <div className="grid gap-2 text-sm" role="group" aria-label={`Giudizio sulla domanda ${id}`}>
      <div className="flex flex-wrap items-center gap-2">
        {QUESTION_VERDICTS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={verdict === v.id}
            disabled={pending}
            onClick={() => {
              const next = verdict === v.id ? null : v.id;
              setVerdict(next ?? undefined);
              send({ verdict: next }, next ? "Salvato." : "Giudizio tolto.");
            }}
            className={`btn min-h-10 px-3 ${verdict === v.id ? STYLE[v.id] : "btn-ghost"}`}
          >
            {verdict === v.id ? `✓ ${v.label}` : v.label}
          </button>
        ))}
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
          <label htmlFor={`q-${id}`} className="sr-only">Nota sulla domanda {id}</label>
          <textarea id={`q-${id}`} value={note} rows={2} maxLength={MAX_NOTE} onChange={(e) => setNote(e.target.value)} className="rounded-lg border border-muted bg-surface p-2" placeholder="Cosa non va in questa domanda…" />
          <button type="submit" disabled={pending} className="btn btn-ghost min-h-10 w-fit px-3">Salva la nota</button>
        </form>
      )}
    </div>
  );
}
