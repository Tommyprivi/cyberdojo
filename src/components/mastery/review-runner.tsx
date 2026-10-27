"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { answerReview, type ReviewAnswer } from "@/app/actions/ripasso";
import type { PublicQuestion } from "@/lib/mastery/pool";

/** Ripasso: una domanda per volta. Il server controlla e rivela la risposta giusta solo dopo l'invio. */
export function ReviewRunner({ questions }: { questions: PublicQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<ReviewAnswer | null>(null);
  const [right, setRight] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (index >= questions.length) {
    return (
      <section className="grid gap-4 rounded-2xl border-2 border-border bg-surface p-5" aria-live="polite">
        <h2 className="font-display text-2xl font-bold">Ripasso finito</h2>
        <p className="text-lg">
          Ne hai indovinate <strong>{right}</strong> su {questions.length}. Quelle sbagliate tornano domani; quelle giuste tornano fra più tempo.
        </p>
        <Link href="/percorso" className="btn btn-primary min-h-14 w-fit">
          Torna al percorso
        </Link>
      </section>
    );
  }

  const q = questions[index];
  const send = () => {
    if (picked === null) return;
    startTransition(async () => {
      try {
        const a = await answerReview(q.id, picked);
        setAnswer(a);
        setError(null);
        if (a.correct) setRight((n) => n + 1);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invio non riuscito: riprova.");
      }
    });
  };
  const next = () => {
    setIndex(index + 1);
    setPicked(null);
    setAnswer(null);
  };

  return (
    <section className="grid gap-4" aria-label="Ripasso">
      <p className="font-mono text-sm font-bold text-muted" aria-live="polite">
        Domanda {index + 1} di {questions.length}
      </p>
      <fieldset key={q.id} className="grid gap-3" disabled={answer !== null}>
        <legend className="mb-1 text-lg font-bold">{q.prompt}</legend>
        {q.choices.map((c) => {
          const isRight = answer !== null && c === answer.right;
          const isWrong = answer !== null && c === picked && !answer.correct;
          return (
            <label
              key={c}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 ${
                isRight ? "border-primary bg-surface-muted" : isWrong ? "border-accent bg-surface-muted" : picked === c ? "border-primary bg-surface-muted" : "border-border bg-surface"
              }`}
            >
              <input type="radio" name={`r-${q.id}`} checked={picked === c} onChange={() => setPicked(c)} className="size-5 shrink-0 accent-[var(--primary)]" />
              <span>{c}</span>
              {isRight && <span className="ml-auto text-sm font-bold text-primary">Giusta</span>}
              {isWrong && <span className="ml-auto text-sm font-bold text-accent">Non è questa</span>}
            </label>
          );
        })}
      </fieldset>
      <p role="status" className="min-h-6 font-semibold">
        {answer ? (answer.correct ? "Giusto. Ci rivediamo più avanti." : "Questa la rivedi domani.") : ""}
      </p>
      {error ? (
        <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
          {error}
        </p>
      ) : null}
      {answer ? (
        <button type="button" className="btn btn-primary min-h-14 w-fit" onClick={next}>
          {index === questions.length - 1 ? "Concludi" : "Avanti"}
        </button>
      ) : (
        <button type="button" className="btn btn-primary min-h-14 w-fit" disabled={picked === null || pending} onClick={send}>
          {pending ? "Controllo…" : "Controlla"}
        </button>
      )}
    </section>
  );
}
