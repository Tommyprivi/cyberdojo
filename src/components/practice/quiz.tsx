"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { haptic } from "@/lib/app/haptics";
import { COURSES } from "@/lib/content/courses";
import { ARP_BANK, ENCAPSULATION_BANK, makeBank, OSI_BANK, PACKET_BASICS, type BankItem } from "@/lib/practice/banks";
import { ALL_BANK_ITEMS } from "@/lib/practice/banks-all";
import type { Question } from "@/lib/practice/core";

/**
 * Quiz libero: domande a scelta prese dalle banche dei corsi. Non assegna XP né serie e non scrive
 * nel database: serve solo a ripassare. Una domanda per schermata, bersagli grandi da toccare.
 */

const COUNT = 10;

type Theme = { id: string; code: string; title: string; items: BankItem[] };

function buildThemes(): Theme[] {
  const themes: Theme[] = [
    {
      id: "f5",
      code: "F5",
      title: "Reti 1: indirizzi, OSI, ARP",
      items: [...PACKET_BASICS, ...ARP_BANK, ...OSI_BANK, ...ENCAPSULATION_BANK],
    },
  ];
  for (const course of COURSES) {
    const letter = course.id.toLowerCase();
    for (const m of course.modules) {
      if (course.id === "F" && m.n === 5) continue; // le banche di Reti 1 stanno già nel tema F5
      const prefix = `${letter}${String(m.n).padStart(2, "0")}-`;
      const items = Object.entries(ALL_BANK_ITEMS)
        .filter(([key]) => key.startsWith(prefix))
        .flatMap(([, v]) => v);
      if (items.length >= COUNT) themes.push({ id: `${letter}${m.n}`, code: `${course.id}${m.n}`, title: m.title, items });
    }
  }
  return themes;
}

const THEMES = buildThemes();
const ALL: Theme = { id: "tutti", code: "★", title: "Tutti i temi mescolati", items: THEMES.flatMap((t) => t.items) };

type Phase =
  | { kind: "choose" }
  | { kind: "play"; theme: Theme; questions: Question[] }
  | { kind: "done"; theme: Theme; questions: Question[]; picks: number[] };

export function Quiz() {
  const [phase, setPhase] = useState<Phase>({ kind: "choose" });

  const start = (theme: Theme) => {
    const questions = makeBank(`quiz-${theme.id}`, theme.items)(crypto.randomUUID(), COUNT);
    setPhase({ kind: "play", theme, questions });
  };

  if (phase.kind === "choose") return <Chooser onPick={start} />;
  if (phase.kind === "play") {
    return (
      <Session
        key={phase.questions.map((q) => q.prompt).join("|")}
        theme={phase.theme}
        questions={phase.questions}
        onExit={() => setPhase({ kind: "choose" })}
        onFinish={(picks) => setPhase({ kind: "done", theme: phase.theme, questions: phase.questions, picks })}
      />
    );
  }
  return (
    <Summary
      theme={phase.theme}
      questions={phase.questions}
      picks={phase.picks}
      onAgain={() => start(phase.theme)}
      onChange={() => setPhase({ kind: "choose" })}
    />
  );
}

function Chooser({ onPick }: { onPick: (t: Theme) => void }) {
  return (
    <section aria-labelledby="quiz-tema" className="grid gap-4">
      <div>
        <h2 id="quiz-tema" className="font-display text-2xl font-semibold">Scegli un tema</h2>
        <p className="mt-1 text-muted">Dieci domande veloci, una per schermata. Nessun punteggio da salvare: serve a ripassare.</p>
      </div>
      <button
        type="button"
        onClick={() => onPick(ALL)}
        className="dossier flex min-h-16 items-center gap-4 p-4 text-left hover:bg-surface-muted"
      >
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-md bg-primary font-mono text-sm font-bold text-primary-fg">★</span>
        <span>
          <span className="block font-display text-lg font-semibold">Quiz misto</span>
          <span className="block text-sm text-muted">Domande da tutti i temi</span>
        </span>
      </button>
      <ul className="grid gap-2 md:grid-cols-2">
        {THEMES.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onPick(t)}
              className="card flex min-h-16 w-full items-center gap-4 p-3 text-left hover:bg-surface-muted"
            >
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-surface-muted font-mono text-sm font-bold">
                {t.code}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold leading-snug">{t.title}</span>
                <span className="block font-mono text-xs text-muted">{t.items.length} domande</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Session({
  theme, questions, onExit, onFinish,
}: {
  theme: Theme;
  questions: Question[];
  onExit: () => void;
  onFinish: (picks: number[]) => void;
}) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const q = questions[i];
  const choices = useMemo(() => q.choices ?? [], [q]);
  const answered = picked !== null;
  const isLast = i === questions.length - 1;

  // Focus alla domanda nuova (lettori di schermo e tastiera) e al pulsante «Avanti» dopo la risposta.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [i]);
  useEffect(() => {
    if (answered) nextRef.current?.focus({ preventScroll: true });
  }, [answered]);

  const next = () => {
    const all = [...picks, picked as number];
    if (isLast) return onFinish(all);
    setPicks(all);
    setPicked(null);
    setI(i + 1);
  };

  const done = i + (answered ? 1 : 0);

  return (
    <section aria-label={`Quiz: ${theme.title}`} className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">{theme.code} · {theme.title}</p>
        <button type="button" onClick={onExit} className="chip min-h-11 shrink-0 text-sm hover:bg-surface-muted">Esci</button>
      </div>
      <div>
        <div
          role="progressbar"
          aria-label="Avanzamento del quiz"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={done}
          className="h-2 overflow-hidden rounded-sm bg-surface-muted"
        >
          <div className="h-full bg-primary transition-[width]" style={{ width: `${(done / questions.length) * 100}%` }} />
        </div>
        <p className="mt-1.5 font-mono text-xs text-muted">Domanda {i + 1} di {questions.length}</p>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold leading-snug outline-none md:text-2xl">
        {q.prompt}
      </h2>

      <div role="group" aria-label="Risposte" className="grid gap-2.5">
        {choices.map((c, k) => {
          const isRight = k === q.answer;
          const isPicked = picked === k;
          const state = !answered
            ? "border-border bg-surface hover:bg-surface-muted"
            : isRight
              ? "border-success bg-[color-mix(in_srgb,var(--success)_14%,var(--surface))]"
              : isPicked
                ? "border-accent bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))]"
                : "border-border bg-surface opacity-70";
          return (
            <button
              key={c}
              type="button"
              disabled={answered}
              aria-pressed={isPicked}
              onClick={() => {
                setPicked(k);
                haptic(k === q.answer ? "right" : "wrong");
              }}
              className={`flex min-h-14 items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left font-medium disabled:cursor-default ${state}`}
            >
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-surface font-mono text-sm font-bold">
                {answered && isRight ? "✓" : answered && isPicked ? "✗" : String.fromCharCode(65 + k)}
              </span>
              <span>{c}</span>
            </button>
          );
        })}
      </div>

      <div role="status" aria-live="polite" className="min-h-6">
        {answered && (
          <p className="pop font-semibold">
            {picked === q.answer ? (
              <span className="text-success">Giusto.</span>
            ) : (
              <>
                <span className="text-accent">Non proprio. </span>
                <span className="font-normal">La risposta giusta è: <strong>{choices[q.answer]}</strong></span>
              </>
            )}
          </p>
        )}
      </div>

      <button ref={nextRef} type="button" onClick={next} disabled={!answered} className="btn btn-primary min-h-14 w-full md:w-fit md:px-10">
        {isLast ? "Vedi il risultato" : "Avanti"}
      </button>
    </section>
  );
}

function Summary({
  theme, questions, picks, onAgain, onChange,
}: {
  theme: Theme;
  questions: Question[];
  picks: number[];
  onAgain: () => void;
  onChange: () => void;
}) {
  const score = questions.filter((q, k) => picks[k] === q.answer).length;
  const wrong = questions.map((q, k) => ({ q, k })).filter(({ q, k }) => picks[k] !== q.answer);
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  const verdict =
    score === questions.length ? "Perfetto." : score >= 7 ? "Ben fatto." : score >= 4 ? "Si può migliorare." : "Rivedi le lezioni e riprova.";

  return (
    <section aria-label="Risultato del quiz" className="grid gap-5">
      <div className="dossier p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">{theme.code} · {theme.title}</p>
        <h2 ref={ref} tabIndex={-1} className="mt-1 font-display text-3xl font-semibold outline-none">
          {score} su {questions.length}
        </h2>
        <p className="mt-1 text-muted">{verdict} Il quiz libero non assegna XP né serie.</p>
      </div>

      {wrong.length > 0 && (
        <div className="grid gap-2">
          <h3 className="font-display text-lg font-semibold">Da rivedere</h3>
          <ul className="grid gap-2">
            {wrong.map(({ q, k }) => (
              <li key={k} className="card border-l-4 border-l-accent p-3">
                <p className="font-semibold">{q.prompt}</p>
                <p className="mt-1 text-sm text-muted">La tua risposta: {q.choices?.[picks[k]]}</p>
                <p className="text-sm">Giusta: <strong>{q.choices?.[q.answer]}</strong></p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2.5 sm:flex">
        <button type="button" onClick={onAgain} className="btn btn-primary min-h-14 px-8">Altre 10 domande</button>
        <button type="button" onClick={onChange} className="btn btn-ghost min-h-14 px-8">Cambia tema</button>
      </div>
    </section>
  );
}
