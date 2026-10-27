"use client";

import { useState, useTransition } from "react";
import { answerDaily, type DailyState } from "@/app/actions/daily";
import { CheckIcon, FlameIcon } from "../icons";

/** Sfida del giorno: una domanda, un solo tentativo. La risposta giusta arriva dal server solo dopo aver risposto. */
export function DailyChallenge({ initial }: { initial: DailyState }) {
  const [state, setState] = useState(initial);
  const [picked, setPicked] = useState<string | null>(null);
  const [gained, setGained] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const answered = state.status !== "todo";

  const choose = (choice: string) => {
    if (answered || pending) return;
    setPicked(choice);
    setError(null);
    start(async () => {
      const res = await answerDaily(choice);
      if (!res.ok) {
        setError(res.error);
        setPicked(null);
        return;
      }
      setGained(res.xpGained);
      setState(res.state);
    });
  };

  return (
    <section aria-labelledby="sfida-domanda" className="grid gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Sfida di oggi · {state.day}</p>
        <p className="flex items-center gap-1.5 font-mono text-sm font-bold" aria-label={`Serie della sfida: ${state.streak} giorni`}>
          <FlameIcon width={16} height={16} /> {state.streak}
        </p>
      </div>
      <h2 id="sfida-domanda" className="font-display text-2xl font-bold">
        {state.question.question}
      </h2>

      <ul className="grid gap-2">
        {state.question.choices.map((c) => {
          const isCorrect = answered && c === state.correct;
          const isWrongPick = answered && state.status === "lost" && c === picked && c !== state.correct;
          return (
            <li key={c}>
              <button
                type="button"
                onClick={() => choose(c)}
                disabled={answered || pending}
                aria-pressed={picked === c}
                className={`flex min-h-12 w-full items-center gap-2 rounded-lg border px-4 py-2 text-left font-semibold ${
                  isCorrect ? "border-success bg-success text-success-fg" : isWrongPick ? "border-accent text-accent" : "border-border hover:border-foreground"
                } disabled:cursor-default`}
              >
                {isCorrect ? <CheckIcon width={18} height={18} /> : null}
                {c}
              </button>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p role="alert" className="text-sm font-semibold text-accent">
          {error}
        </p>
      ) : null}
      <p aria-live="polite" className="font-semibold">
        {state.status === "won" ? (gained > 0 ? `Giusto! +${gained} XP. Torna domani per la prossima.` : "Sfida di oggi già vinta. Torna domani per la prossima.") : null}
        {state.status === "lost" ? "Non questa volta: la risposta giusta è evidenziata. Domani c'è una nuova domanda." : null}
      </p>
    </section>
  );
}
