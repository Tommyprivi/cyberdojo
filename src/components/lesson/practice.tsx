"use client";

import { useEffect, useId, useState, useTransition } from "react";
import {
  checkVerification,
  startVerification,
  type VerificationResult,
} from "@/app/actions/verify";
import type { GeneratorId, PublicQuestion } from "@/lib/practice/generators";
import { usePlayer } from "./player-context";

type Session = { seed: string; questions: PublicQuestion[]; retries: number; generator: GeneratorId; needed: number };

/** Esercizi che riguardano gli ottetti: per loro ha senso il promemoria dei pesi. */
const BIT_GENERATORS: GeneratorId[] = ["binary-to-decimal", "decimal-to-binary"];

/**
 * Verifica pratica valutata dal server. Le props scritte nell'MDX (generator, pass, retries) sono
 * solo leggibili da chi scrive la lezione: il server legge sempre il frontmatter, mai il client.
 */
export function Practice() {
  const { lessonId, markVerified } = usePlayer();
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const groupId = useId();

  const apply = (s: Session) => {
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
  const hasTyping = session.questions.some((q) => !q.choices);
  const setAnswer = (i: number, value: string) => setAnswers((a) => a.map((v, j) => (j === i ? value : v)));

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

  const verdict = (i: number) =>
    result && (
      <span className={`text-sm font-bold ${result.results[i] ? "text-primary" : "text-accent"}`}>
        {result.results[i] ? "Giusta" : "Sbagliata"}
      </span>
    );

  return (
    <form
      className="my-2 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!result) submit();
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="chip text-sm">
          Tentativo {Math.min(attempt, session.retries)} di {session.retries}
        </p>
        <p className="chip text-sm">Per passare: {session.needed} giuste su {session.questions.length}</p>
        {BIT_GENERATORS.includes(session.generator) && (
          <p className="chip font-mono text-sm" aria-label="Promemoria dei pesi">
            Pesi: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1
          </p>
        )}
        {hasTyping && <p className="hidden text-sm text-muted lg:block">Invio passa alla domanda successiva.</p>}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {session.questions.map((q, i) =>
          q.choices ? (
            <fieldset key={i} className="min-w-0 lg:col-span-2">
              {/* La domanda sta sopra il riquadro: una legend dentro il bordo si sovrappone se va a capo. */}
              <legend className="mb-2 px-1">
                <span className="font-bold">{i + 1}.</span>{" "}
                {q.data && <span className="mr-2 rounded-lg bg-surface px-2 py-0.5 font-mono text-lg font-medium tracking-wider">{q.data}</span>}
                {q.prompt}
              </legend>
              <div className="grid gap-2 rounded-2xl border-2 border-border bg-surface-muted p-3 sm:grid-cols-2">
                {q.choices.map((c, k) => (
                  <label
                    key={c}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 ${
                      answers[i] === String(k) ? "border-primary bg-surface" : "border-border bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${groupId}-${i}`}
                      value={k}
                      disabled={!!result}
                      checked={answers[i] === String(k)}
                      onChange={() => setAnswer(i, String(k))}
                      className="size-5 accent-[var(--primary)]"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
              {result && <p className="mt-1 px-1">{verdict(i)}</p>}
            </fieldset>
          ) : (
            <label key={i} className="grid gap-1.5 rounded-2xl border-2 border-border bg-surface-muted p-3">
              <span>
                <span className="font-bold">{i + 1}.</span>{" "}
                <span className="mr-2 font-mono text-xl font-medium tracking-wider">{q.data}</span>
                {q.prompt}
              </span>
              <input
                inputMode="numeric"
                autoComplete="off"
                maxLength={session.generator === "decimal-to-binary" ? 9 : 6}
                placeholder={session.generator === "decimal-to-binary" ? "00000000" : undefined}
                disabled={!!result}
                value={answers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                onKeyDown={(e) => {
                  // Invio: alla domanda successiva; sull'ultima invia il modulo come di consueto.
                  if (e.key !== "Enter" || i === session.questions.length - 1) return;
                  e.preventDefault();
                  const inputs = e.currentTarget.form?.querySelectorAll<HTMLInputElement>("input[inputmode=numeric]");
                  inputs?.[i + 1]?.focus();
                }}
                aria-invalid={result ? !result.results[i] : undefined}
                className="field font-mono text-lg"
              />
              {verdict(i)}
            </label>
          ),
        )}
      </div>

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
              : `${result.correct} su ${result.total}. Non basta: ${result.needed} su ${result.total} per passare.`}
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
