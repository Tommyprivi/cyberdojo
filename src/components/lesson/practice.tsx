"use client";

import { useEffect, useState, useTransition } from "react";
import {
  checkVerification,
  startVerification,
  type VerificationResult,
} from "@/app/actions/verify";
import type { PublicQuestion } from "@/lib/practice/generators";
import { usePlayer } from "./player-context";

/**
 * Verifica pratica valutata dal server. Le props scritte nell'MDX (generator, pass, retries) sono
 * solo leggibili da chi scrive la lezione: il server legge sempre il frontmatter, mai il client.
 */
export function Practice() {
  const { lessonId, markVerified } = usePlayer();
  const [session, setSession] = useState<{ seed: string; questions: PublicQuestion[]; retries: number } | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const apply = (s: { seed: string; questions: PublicQuestion[]; retries: number }) => {
    setSession(s);
    setAnswers(Array(s.questions.length).fill(""));
    setResult(null);
  };

  // Prime domande al montaggio (setState solo dopo la risposta del server).
  useEffect(() => {
    let cancelled = false;
    startVerification(lessonId)
      .then((s) => !cancelled && apply(s))
      .catch(() => !cancelled && setError("Non riesco a caricare la verifica. Riprova tra poco."));
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  // Nuovo tentativo: domande nuove, su richiesta dell'utente.
  const retry = () => {
    setError(null);
    setAttempt((n) => n + 1);
    start(async () => {
      try {
        apply(await startVerification(lessonId));
      } catch {
        setError("Non riesco a caricare la verifica. Riprova tra poco.");
      }
    });
  };

  if (error) return <p role="alert" className="my-6 text-accent">{error}</p>;
  if (!session) return <p className="my-6">Preparo le domande…</p>;

  const passed = result?.passed === true;
  const outOfTries = !!result && !passed && attempt >= session.retries;

  const submit = () =>
    start(async () => {
      try {
        const r = await checkVerification(lessonId, session.seed, answers);
        setResult(r);
        if (r.passed) markVerified();
      } catch {
        setError("Non riesco a controllare le risposte. Riprova.");
      }
    });

  return (
    <form
      className="my-2 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!result) submit();
      }}
    >
      <p className="chip w-fit text-sm">
        Tentativo {Math.min(attempt, session.retries)} di {session.retries}
      </p>
      {session.questions.map((q, i) => (
        <label key={i} className="grid gap-1.5 rounded-2xl border-2 border-border bg-surface-muted p-3">
          <span>
            {i + 1}. Converti <span className="font-mono text-xl font-medium tracking-wider">{q.data}</span> in decimale
          </span>
          <input
            inputMode="numeric"
            autoComplete="off"
            disabled={!!result}
            value={answers[i] ?? ""}
            onChange={(e) => setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
            aria-invalid={result ? !result.results[i] : undefined}
            className="field font-mono text-lg"
          />
          {result && (
            <span className={`text-sm font-bold ${result.results[i] ? "text-primary" : "text-accent"}`}>
              {result.results[i] ? "Giusta" : "Sbagliata"}
            </span>
          )}
        </label>
      ))}

      {!result && (
        <button type="submit" disabled={pending || answers.some((a) => a.trim() === "")} className="btn btn-primary">
          Controlla le risposte
        </button>
      )}

      {result && (
        <div role="status" className="pop grid gap-3 rounded-2xl border-2 border-border bg-surface-muted p-4">
          <p className="text-lg font-extrabold">
            {passed
              ? `Superata: ${result.correct} su ${result.total}!`
              : `${result.correct} su ${result.total}. Servono tutte.`}
          </p>
          {!passed && !outOfTries && (
            <button type="button" onClick={retry} className="btn btn-ghost w-fit">
              Riprova con nuove domande
            </button>
          )}
          {outOfTries && (
            <p>Tentativi finiti. Ripassa la spiegazione e torna più tardi: la sezione Allenati ti aiuta a esercitarti.</p>
          )}
        </div>
      )}
    </form>
  );
}
