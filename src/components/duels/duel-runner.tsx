"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { startDuelTurn, submitDuelTurn } from "@/app/actions/duels";
import type { PublicQuestion } from "@/lib/mastery/pool";

/**
 * Il tuo turno del duello: una domanda per volta. Il browser riceve solo le domande senza risposte giuste;
 * la correzione la fa il server e il punteggio dell'avversario si vede solo dopo l'invio.
 */

type Phase =
  | { kind: "intro"; error?: string }
  | { kind: "play"; questions: PublicQuestion[]; picks: (number | null)[]; index: number; error?: string };

export function DuelRunner({ id, total }: { id: string; total: number }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [pending, startTransition] = useTransition();
  const name = useId();

  const begin = () =>
    startTransition(async () => {
      try {
        const r = await startDuelTurn(id);
        if (!r.ok) return setPhase({ kind: "intro", error: r.error });
        setPhase({ kind: "play", questions: r.questions, picks: r.questions.map(() => null), index: 0 });
      } catch {
        setPhase({ kind: "intro", error: "Qualcosa è andato storto: riprova." });
      }
    });

  if (phase.kind === "intro") {
    return (
      <section className="grid gap-4 rounded-2xl border-2 border-border bg-surface p-5">
        <h2 className="font-display text-xl font-bold">Il tuo turno</h2>
        <ul className="grid gap-1.5 text-muted">
          <li>{total} domande a scelta, una alla volta. Le domande sono le stesse per tutti e due.</li>
          <li>Il turno si fa una volta sola: dopo l&apos;invio non si cambia.</li>
          <li>Vedrai il punteggio dell&apos;altro solo dopo aver finito il tuo.</li>
        </ul>
        {phase.error && (
          <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
            {phase.error}
          </p>
        )}
        <button type="button" className="btn btn-primary min-h-14 w-fit" onClick={begin} disabled={pending}>
          {pending ? "Preparo le domande…" : "Inizia il mio turno"}
        </button>
      </section>
    );
  }

  const { questions, picks, index } = phase;
  const q = questions[index];
  const last = index === questions.length - 1;
  const picked = picks[index];
  const setPick = (i: number) => setPhase({ ...phase, picks: picks.map((p, k) => (k === index ? i : p)) });

  const submit = () =>
    startTransition(async () => {
      try {
        const r = await submitDuelTurn(id, picks.map((p) => p ?? -1));
        if (!r.ok) return setPhase({ ...phase, error: r.error });
        router.refresh();
      } catch {
        setPhase({ ...phase, error: "Invio non riuscito: riprova." });
      }
    });

  return (
    <section className="grid gap-4" aria-label="Domande del duello">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-sm font-bold text-muted" aria-live="polite">
          Domanda {index + 1} di {questions.length}
        </p>
        <div
          role="progressbar"
          aria-label="Avanzamento"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
          className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-muted"
        >
          <div className="h-full bg-primary" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      <fieldset key={q.id} className="grid gap-3">
        <legend className="mb-1 text-lg font-bold">{q.prompt}</legend>
        {q.choices.map((c, i) => (
          <label
            key={c}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 ${
              picked === i ? "border-primary bg-surface-muted" : "border-border bg-surface"
            }`}
          >
            <input type="radio" name={`${name}-${index}`} checked={picked === i} onChange={() => setPick(i)} className="size-5 shrink-0 accent-[var(--primary)]" />
            <span>{c}</span>
          </label>
        ))}
      </fieldset>
      {phase.error && (
        <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
          {phase.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {index > 0 && (
          <button type="button" className="btn btn-ghost min-h-14" onClick={() => setPhase({ ...phase, index: index - 1, error: undefined })}>
            Indietro
          </button>
        )}
        {last ? (
          <button type="button" className="btn btn-primary min-h-14" disabled={pending || picks.some((p) => p === null)} onClick={submit}>
            {pending ? "Controllo…" : "Invia il mio turno"}
          </button>
        ) : (
          <button type="button" className="btn btn-primary min-h-14" disabled={picked === null} onClick={() => setPhase({ ...phase, index: index + 1, error: undefined })}>
            Avanti
          </button>
        )}
      </div>
      {last && picks.some((p) => p === null) && <p className="text-sm text-muted">Rispondi a tutte le domande per inviare (usa «Indietro» per quelle saltate).</p>}
    </section>
  );
}
