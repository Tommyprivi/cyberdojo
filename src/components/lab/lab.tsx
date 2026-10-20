"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { loadLabNotes, recordLabResult, saveLabNotes } from "@/app/actions/lab";
import { CheckIcon } from "@/components/icons";
import { Workspace } from "./workspace";
import { Mascot } from "@/components/mascot";
import {
  checkAnswer,
  MODES,
  scoreReport,
  stepProgress,
  type CalcState,
  type Mode,
  type Scenario,
  type Step,
} from "@/lib/tutor/engine";
import { SCENARIOS } from "@/lib/tutor/scenarios";
import { Calculator } from "./calculator";
import { QuestionBox } from "./question-box";

// ---- Modalità scelta: si ricorda nel browser (nessun dato personale) ----
const listeners = new Set<() => void>();
let memoryMode: Mode = "guidato";
const isMode = (v: unknown): v is Mode => MODES.some((m) => m.id === v);

function readMode(): Mode {
  try {
    const v = localStorage.getItem("lab-mode");
    return isMode(v) ? v : memoryMode;
  } catch {
    return memoryMode;
  }
}
function writeMode(m: Mode) {
  memoryMode = m;
  try {
    localStorage.setItem("lab-mode", m);
  } catch {
    /* vale solo per questa visita */
  }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

/** Un passo della missione. Sta fuori da Lab: dentro il rendering si ricreerebbe a ogni tasto e perderebbe il focus. */
function StepCard({
  step, index, expanded, mode, calc, answer, isDone, wrongCount, hinted, onToggleHint, onSubmit, onComplete,
}: {
  step: Step;
  index: number;
  expanded: boolean;
  mode: Mode;
  calc: CalcState;
  answer: string | undefined;
  isDone: boolean;
  wrongCount: number;
  hinted: boolean;
  onToggleHint: () => void;
  onSubmit: (given: string) => void;
  onComplete: () => void;
}) {
  const p = stepProgress(step, calc, answer);
  const showHint = hinted || wrongCount >= 2;
  return (
    <article className={`grid gap-3 rounded-lg border-2 p-4 ${isDone ? "border-primary bg-surface" : "border-border bg-surface-muted"}`}>
      <header className="flex items-start gap-3">
        <span className={`grid size-8 shrink-0 place-items-center rounded-full font-bold ${isDone ? "bg-primary text-primary-fg" : "bg-surface text-foreground"}`}>
          {isDone ? <CheckIcon width={18} height={18} /> : index + 1}
        </span>
        <div>
          <h3 className="font-bold">{step.title}</h3>
          <p>{step.instruction}</p>
        </div>
      </header>

      {(expanded || showHint) && !isDone && (
        <p className="rounded-md bg-surface p-3 text-sm">
          <strong>A cosa serve: </strong>
          {step.why}
        </p>
      )}

      {!isDone && p.nudge && <p role="status" className="font-semibold text-accent">{p.nudge}</p>}

      {!isDone && (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onToggleHint} className="chip min-h-9 px-3 text-sm hover:bg-surface-muted" aria-expanded={showHint}>
            {mode === "aiutami" ? "Aiutami" : "Come si fa?"}
          </button>
        </div>
      )}
      {!isDone && showHint && (
        <p className="rounded-md border border-border bg-surface p-3 text-sm">
          <strong>Aiuto: </strong>
          {step.hint}
          {mode === "aiutami" && (
            <>
              <br />
              <strong>A cosa serve: </strong>
              {step.why}
            </>
          )}
        </p>
      )}

      {!isDone && p.askNow && step.question && (
        <div className="grid gap-2 rounded-md bg-surface p-3">
          <QuestionBox question={step.question} onSubmit={onSubmit} />
          {wrongCount > 0 && (
            <p role="status" className="font-semibold text-accent">
              Non ancora. {step.question.whyWrong}
            </p>
          )}
        </div>
      )}
      {!isDone && p.actionDone && !step.question && (
        <button type="button" onClick={onComplete} className="btn btn-primary w-fit">Fatto</button>
      )}

      {isDone && (
        <p className="rounded-md bg-surface-muted p-3 text-sm" role="status">
          <strong>Ricordati: </strong>
          {step.remember}
        </p>
      )}
    </article>
  );
}

export function Lab({ scenarioId }: { scenarioId: string }) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return <p role="alert">Missione non trovata.</p>;
  return <LabInner scenarioId={scenarioId} scenario={scenario} />;
}

function LabInner({ scenarioId, scenario }: { scenarioId: string; scenario: Scenario }) {
  const mode = useSyncExternalStore(subscribe, readMode, () => "guidato" as Mode);

  const [calc, setCalc] = useState<CalcState>({ ip: "", prefix: 24 });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<Record<string, number>>({});
  const [hinted, setHinted] = useState<string[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [report, setReport] = useState<Record<string, string>>({});
  const [reportResult, setReportResult] = useState<{ correct: number; total: number; passed: boolean } | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "ok" | "login">("idle");
  const recorded = useRef(false);

  // Taccuino già salvato da questo utente (vuoto se non è collegato).
  useEffect(() => {
    let off = false;
    loadLabNotes(scenarioId).then((ids) => !off && setSaved(ids)).catch(() => {});
    return () => {
      off = true;
    };
  }, [scenarioId]);

  const { steps } = scenario;
  const finished = mode === "solo" ? reportResult?.passed === true : steps.every((s) => done.includes(s.id));
  const seen = new Set([...saved, ...done, ...(finished ? steps.map((s) => s.id) : [])]);
  const notebook = steps.filter((s) => seen.has(s.id));

  // Missione completata: si registra una volta sola e si salva il taccuino.
  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    const ids = steps.map((s) => s.id);
    Promise.all([recordLabResult(scenarioId, mode), saveLabNotes(scenarioId, [...new Set([...saved, ...ids])])])
      .then(([r, n]) => setSaveState(r.ok && n.ok ? "ok" : "login"))
      .catch(() => setSaveState("login"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const completeStep = (id: string) => {
    setDone((d) => (d.includes(id) ? d : [...d, id]));
    if (mode === "guidato") setPending(id);
    // Si salva subito anche il progresso parziale (silenziosamente: senza account non succede nulla).
    saveLabNotes(scenarioId, [...new Set([...saved, ...done, id])]).catch(() => {});
  };

  const submitAnswer = (step: Step, given: string) => {
    if (!step.question) return;
    setAnswers((a) => ({ ...a, [step.id]: given }));
    if (checkAnswer(step.question, given)) completeStep(step.id);
    else setWrong((w) => ({ ...w, [step.id]: (w[step.id] ?? 0) + 1 }));
  };

  const reset = () => {
    setCalc({ ip: "", prefix: 24 });
    setAnswers({});
    setDone([]);
    setWrong({});
    setHinted([]);
    setPending(null);
    setReport({});
    setReportResult(null);
    setSaveState("idle");
    recorded.current = false;
  };

  const toggleHint = (id: string) => setHinted((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));

  const pendingStep = pending ? steps.find((s) => s.id === pending) : undefined;
  const currentIdx = steps.findIndex((s) => !done.includes(s.id));

  /* Postazione a tutto schermo: strumento a sinistra su tutta l'altezza, tutor in colonna a destra, ognuno con il suo scorrimento. */
  return (
    <Workspace tool="Calcolatore di rete" title={scenario.title} right={<span className="chip min-h-8 text-sm">{MODES.find((m) => m.id === mode)!.label}</span>}>
      <div className="grid h-full min-h-0 md:grid-cols-[minmax(0,1fr)_clamp(22rem,30vw,32rem)]">
        <main className="min-h-0 overflow-y-auto p-6 lg:p-10">
          <Calculator state={calc} onChange={setCalc} />
        </main>

        <aside aria-label="Il tutor" className="flex min-h-0 flex-col gap-4 overflow-y-auto border-l border-border bg-surface p-5">
        <header className="flex items-center gap-3">
          <Mascot size={56} mood="stern" animate />
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Missione</p>
            <h2 className="font-display text-xl font-semibold leading-tight">{scenario.title}</h2>
          </div>
        </header>

        <div role="tablist" aria-label="Modalità del tutor" className="grid grid-cols-3 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              type="button"
              aria-selected={mode === m.id}
              onClick={() => writeMode(m.id)}
              className={`min-h-10 rounded-md border-2 text-sm font-bold ${mode === m.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="-mt-2 text-sm text-muted">{MODES.find((m) => m.id === mode)!.help}</p>

        {!finished && <p className="rounded-md bg-surface-muted p-3">{mode === "solo" ? scenario.goal : scenario.intro}</p>}

        {/* GUIDATO: un passo alla volta */}
        {mode === "guidato" && !finished && (
          <div className="grid gap-3">
            <div
              role="progressbar"
              aria-label="Avanzamento della missione"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={done.length}
              className="h-3 overflow-hidden rounded-full bg-surface-muted"
            >
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${(done.length / steps.length) * 100}%` }} />
            </div>
            <p className="text-sm text-muted">Passo {Math.min(done.length + 1, steps.length)} di {steps.length}</p>

            {pendingStep ? (
              <div className="pop grid gap-3 rounded-lg border-2 border-primary bg-surface p-4" role="status">
                <p className="text-lg font-extrabold">Giusto!</p>
                <p><strong>Ricordati: </strong>{pendingStep.remember}</p>
                <button type="button" className="btn btn-primary w-fit" onClick={() => setPending(null)}>
                  Avanti
                </button>
              </div>
            ) : (
              currentIdx >= 0 && <StepCard
                step={steps[currentIdx]}
                index={currentIdx}
                expanded={true}
                mode={mode}
                calc={calc}
                answer={answers[steps[currentIdx].id]}
                isDone={done.includes(steps[currentIdx].id)}
                wrongCount={wrong[steps[currentIdx].id] ?? 0}
                hinted={hinted.includes(steps[currentIdx].id)}
                onToggleHint={() => toggleHint(steps[currentIdx].id)}
                onSubmit={(g) => submitAnswer(steps[currentIdx], g)}
                onComplete={() => completeStep(steps[currentIdx].id)}
              />
            )}
          </div>
        )}

        {/* AIUTAMI: tutti i passi, in libertà */}
        {mode === "aiutami" && !finished && (
          <ol className="grid gap-3">
            {steps.map((s, i) => (
              <li key={s.id}>
                <StepCard
                step={s}
                index={i}
                expanded={false}
                mode={mode}
                calc={calc}
                answer={answers[s.id]}
                isDone={done.includes(s.id)}
                wrongCount={wrong[s.id] ?? 0}
                hinted={hinted.includes(s.id)}
                onToggleHint={() => toggleHint(s.id)}
                onSubmit={(g) => submitAnswer(s, g)}
                onComplete={() => completeStep(s.id)}
              />
              </li>
            ))}
          </ol>
        )}

        {/* DA SOLO: nessun aiuto, rapporto finale */}
        {mode === "solo" && !finished && (
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setReportResult(scoreReport(scenario, report));
            }}
          >
            <h3 className="font-display text-lg font-semibold">Rapporto</h3>
            {scenario.report.map((r, i) => (
              <QuestionBox
                key={r.id}
                question={r}
                label={`${i + 1}.`}
                selected={report[r.id]}
                onSubmit={(g) => setReport((x) => ({ ...x, [r.id]: g }))}
              />
            ))}
            <p className="text-sm text-muted">
              Risposte date: {scenario.report.filter((r) => report[r.id] !== undefined).length} di {scenario.report.length}.
            </p>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={scenario.report.some((r) => report[r.id] === undefined)}
            >
              Consegna il rapporto
            </button>
            {reportResult && !reportResult.passed && (
              <p role="status" className="font-semibold text-accent">
                {reportResult.correct} su {reportResult.total} giuste. Non ancora: rivedi i numeri nel calcolatore e riprova.
              </p>
            )}
          </form>
        )}

        {/* FINE */}
        {finished && (
          <div className="pop grid gap-3 rounded-lg border-2 border-primary bg-surface p-4" role="status">
            <p className="text-xl font-extrabold">Missione compiuta.</p>
            <p>{scenario.closing}</p>
            <p className="text-sm text-muted">
              {saveState === "ok" && "Risultato e taccuino salvati."}
              {saveState === "login" && (
                <>
                  <Link href={`/accedi?next=${encodeURIComponent("/pratica/calcolatore")}`} className="font-semibold text-primary underline">
                    Accedi
                  </Link>{" "}
                  per salvare risultato e taccuino.
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={reset}>Ricomincia</button>
              {mode !== "solo" && (
                <button type="button" className="btn btn-ghost" onClick={() => { reset(); writeMode("solo"); }}>
                  Provala da solo
                </button>
              )}
            </div>
          </div>
        )}

        {/* TACCUINO */}
        <section aria-labelledby="taccuino" className="grid gap-2 rounded-lg border-2 border-dashed border-border p-4">
          <h3 id="taccuino" className="font-display text-lg font-semibold">Da ricordare</h3>
          {notebook.length === 0 ? (
            <p className="text-sm text-muted">
              {mode === "solo" ? "In questa modalità il taccuino si riempie alla fine." : "Qui si raccolgono i punti che il Sensei ti dice di ricordare."}
            </p>
          ) : (
            <ul className="grid list-disc gap-1.5 pl-5">
              {notebook.map((s) => <li key={s.id}>{s.remember}</li>)}
            </ul>
          )}
        </section>

        {!finished && (done.length > 0 || calc.ip !== "") && (
          <button type="button" onClick={reset} className="chip w-fit text-sm hover:bg-surface-muted">Ricomincia la missione</button>
        )}
        </aside>
      </div>
    </Workspace>
  );
}
