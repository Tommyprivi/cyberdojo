"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  binaryToDecimal,
  binaryToDecimalSteps,
  diagnoseBinaryToDecimal,
  type Difficulty,
} from "@/lib/practice/generators";

const LEVELS: { id: Difficulty; label: string; help: string }[] = [
  { id: "facile", label: "Facile", help: "4 bit, correzione mentre scrivi e passi guidati." },
  { id: "medio", label: "Medio", help: "8 bit, correzione mentre scrivi. I passi costano XP." },
  { id: "severo", label: "Severo", help: "8 bit casuali, nessun aiuto. Si corregge solo alla fine." },
];

const STEP_COST_XP = 2;
const COUNT = 5;

type Status = "non iniziato" | "in corso" | "superato";

/**
 * Esercizio libero. Qui la risposta giusta sta nel browser perché serve alla correzione
 * in tempo reale: va bene perché la Pratica non assegna lezioni né certificati.
 */
export function BinaryExercise() {
  // Il seme è casuale: l'esercizio si monta solo nel browser per evitare differenze con il server.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return isClient ? <Exercise /> : <p className="mt-6">Preparo gli esercizi…</p>;
}

function Exercise() {
  const [level, setLevel] = useState<Difficulty>("facile");
  const [seed, setSeed] = useState<string>(() => crypto.randomUUID());
  const [answers, setAnswers] = useState<string[]>(Array(COUNT).fill(""));
  const [stepsShown, setStepsShown] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [tries, setTries] = useState(0);
  const [passed, setPassed] = useState(false);
  const [xpSpent, setXpSpent] = useState(0);

  const fresh = (l: Difficulty) => {
    setSeed(crypto.randomUUID());
    setAnswers(Array(COUNT).fill(""));
    setStepsShown({});
    setChecked(false);
    setLevel(l);
  };

  const questions = useMemo(() => (seed ? binaryToDecimal(seed, COUNT, level) : []), [seed, level]);
  const live = level !== "severo" || checked;
  const allRight = questions.length > 0 && questions.every((q, i) => answers[i]?.trim() === String(q.answer));
  const status: Status = passed ? "superato" : tries > 0 || answers.some(Boolean) ? "in corso" : "non iniziato";

  return (
    <div className="mt-6 grid gap-6">
      <div role="radiogroup" aria-label="Difficoltà" className="grid gap-2 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={level === l.id}
            onClick={() => fresh(l.id)}
            className={`min-h-12 rounded-lg border px-3 py-2 text-left ${
              level === l.id ? "border-accent bg-surface-muted" : "border-border"
            }`}
          >
            <span className="font-semibold">{l.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{LEVELS.find((l) => l.id === level)!.help}</p>
      <p className="text-sm" aria-live="polite">
        Stato: <strong>{status}</strong> · tentativi: {tries}
        {xpSpent > 0 && ` · XP spesi in aiuti: ${xpSpent}`}
      </p>

      <ol className="grid gap-5">
        {questions.map((q, i) => {
          const diag = live ? diagnoseBinaryToDecimal(q.data, answers[i] ?? "") : null;
          const shown = stepsShown[i] ?? 0;
          const steps = binaryToDecimalSteps(q.data);
          return (
            <li key={`${seed}-${i}`} className="rounded-xl border border-border bg-surface p-4">
              <label className="grid gap-2">
                <span>
                  {i + 1}. Converti <span className="font-mono text-xl tracking-wider">{q.data}</span>
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="off"
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
                  aria-describedby={`fb-${i}`}
                  className="min-h-12 rounded-lg border border-border bg-background px-3 font-mono text-lg"
                />
              </label>
              <p id={`fb-${i}`} role="status" className={`mt-2 min-h-6 text-sm ${diag?.ok ? "text-belt-green" : "text-accent"}`}>
                {diag?.message}
              </p>
              {level !== "severo" && (
                <div className="mt-2">
                  {steps.slice(0, shown).map((s, k) => (
                    <p key={k} className="text-sm">{k + 1}. {s}</p>
                  ))}
                  {shown < steps.length && (
                    <button
                      type="button"
                      onClick={() => {
                        setStepsShown((s) => ({ ...s, [i]: shown + 1 }));
                        if (level === "medio") setXpSpent((x) => x + STEP_COST_XP);
                      }}
                      className="mt-1 min-h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
                    >
                      Mostrami il passo successivo{level === "medio" ? ` (−${STEP_COST_XP} XP)` : ""}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setChecked(true);
            setTries((t) => t + 1);
            if (allRight) setPassed(true);
          }}
          className="min-h-12 rounded-lg bg-accent px-5 font-semibold text-accent-fg"
        >
          Controlla
        </button>
        <button
          type="button"
          onClick={() => fresh(level)}
          className="min-h-12 rounded-lg border border-border px-5 font-medium hover:bg-surface-muted"
        >
          Nuovi esercizi
        </button>
      </div>
      {checked && (
        <p role="status" className="font-semibold">
          {allRight ? "Tutte giuste." : "Non ancora: controlla le risposte segnate."}
        </p>
      )}
      <p className="text-sm text-muted">
        Stato e XP non vengono ancora salvati: arriveranno con l&apos;account.
      </p>
    </div>
  );
}
