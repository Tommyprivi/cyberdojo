"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import {
  checkMastery,
  checkPlacement,
  startMastery,
  startPlacement,
  type MasteryResult,
  type PlacementResult,
} from "@/app/actions/mastery";
import type { PublicQuestion } from "@/lib/mastery/pool";

/**
 * Prova di padronanza e test d'ingresso: stessa schermata, una domanda per volta.
 * Il browser riceve solo le domande senza risposte giuste; la correzione la fa il server.
 */

type Props =
  | { mode: "mastery"; course: string; module: number; title: string; backHref: string; nextHref: string }
  | { mode: "placement"; course: string; title: string; backHref: string };

type Phase =
  | { kind: "intro"; error?: string; wait?: number }
  | { kind: "play"; attemptId: string; questions: PublicQuestion[]; picks: (number | null)[]; index: number; needed?: number; error?: string }
  | { kind: "mastery-done"; result: MasteryResult }
  | { kind: "placement-done"; result: PlacementResult };

export function TestRunner(props: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [pending, startTransition] = useTransition();
  const name = useId();

  const begin = () =>
    startTransition(async () => {
      try {
        const r = props.mode === "mastery" ? await startMastery(props.course, props.module) : await startPlacement(props.course);
        if (r.blocked) return setPhase({ kind: "intro", wait: r.minutes });
        setPhase({
          kind: "play",
          attemptId: r.attemptId,
          questions: r.questions,
          picks: r.questions.map(() => null),
          index: 0,
          needed: "needed" in r ? (r.needed as number) : undefined,
        });
      } catch (e) {
        setPhase({ kind: "intro", error: e instanceof Error ? e.message : "Qualcosa è andato storto." });
      }
    });

  if (phase.kind === "intro") {
    return (
      <section className="grid gap-4 rounded-2xl border-2 border-border bg-surface p-5">
        {props.mode === "mastery" ? (
          <>
            <h2 className="font-display text-xl font-bold">Come funziona la prova</h2>
            <ul className="grid gap-1.5 text-muted">
              <li>Circa 8 domande a scelta sul modulo «{props.title}».</li>
              <li>Si supera con l&apos;80% di risposte giuste.</li>
              <li>Se la superi, le lezioni del modulo risultano «padroneggiate» e quelle dopo si aprono. Non danno XP: i punti si prendono facendo le lezioni.</li>
              <li>Le domande sbagliate finiscono nel tuo ripasso.</li>
            </ul>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold">Come funziona il test</h2>
            <ul className="grid gap-1.5 text-muted">
              <li>Poche domande sparse lungo tutto il corso. È facoltativo e puoi saltarlo.</li>
              <li>Alla fine ti consiglia da quale modulo partire.</li>
              <li>Non sblocca niente da solo: per saltare i moduli precedenti dovrai superare la loro prova di padronanza.</li>
            </ul>
          </>
        )}
        {phase.wait ? (
          <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
            Hai fatto diversi tentativi da poco. Riprova tra {phase.wait} {phase.wait === 1 ? "minuto" : "minuti"}: nel frattempo ripassa la lezione.
          </p>
        ) : null}
        {phase.error ? (
          <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
            {phase.error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary min-h-14" onClick={begin} disabled={pending}>
            {pending ? "Preparo le domande…" : props.mode === "mastery" ? "Inizia la prova" : "Inizia il test"}
          </button>
          <Link href={props.backHref} className="btn btn-ghost min-h-14">
            {props.mode === "placement" ? "Salta, parto dall'inizio" : "Indietro"}
          </Link>
        </div>
      </section>
    );
  }

  if (phase.kind === "play") {
    const { questions, picks, index } = phase;
    const q = questions[index];
    const last = index === questions.length - 1;
    const picked = picks[index];
    const setPick = (i: number) => setPhase({ ...phase, picks: picks.map((p, k) => (k === index ? i : p)) });

    const submit = () =>
      startTransition(async () => {
        const answers = picks.map((p) => p ?? -1);
        try {
          if (props.mode === "mastery") setPhase({ kind: "mastery-done", result: await checkMastery(props.course, props.module, phase.attemptId, answers) });
          else setPhase({ kind: "placement-done", result: await checkPlacement(props.course, phase.attemptId, answers) });
        } catch (e) {
          setPhase({ ...phase, error: e instanceof Error ? e.message : "Invio non riuscito: riprova." });
        }
      });

    return (
      <section className="grid gap-4" aria-label="Domande">
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
        {phase.error ? (
          <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-3 font-semibold">
            {phase.error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {index > 0 && (
            <button type="button" className="btn btn-ghost min-h-14" onClick={() => setPhase({ ...phase, index: index - 1, error: undefined })}>
              Indietro
            </button>
          )}
          {last ? (
            <button type="button" className="btn btn-primary min-h-14" disabled={pending || picks.some((p) => p === null)} onClick={submit}>
              {pending ? "Controllo…" : "Invia le risposte"}
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

  if (phase.kind === "mastery-done" && props.mode === "mastery") {
    const r = phase.result;
    return (
      <section className="grid gap-4 rounded-2xl border-2 border-border bg-surface p-5" aria-live="polite">
        <h2 className="font-display text-2xl font-bold">{r.passed ? "Prova superata" : "Non ancora"}</h2>
        <p className="text-lg">
          Hai risposto giusto a <strong>{r.correct}</strong> domande su {r.total}. Ne servivano {r.needed}.
        </p>
        {r.passed ? (
          <p>
            {r.masteredNow > 0
              ? `${r.masteredNow} ${r.masteredNow === 1 ? "lezione è segnata" : "lezioni sono segnate"} «padroneggiata»: le lezioni dopo si aprono. Nessun XP: quelli arrivano se completi le lezioni.`
              : "Le lezioni di questo modulo erano già fatte o padroneggiate."}
          </p>
        ) : (
          <p>Le domande sbagliate sono finite nel tuo ripasso. Rivedi le lezioni e riprova tra poco.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {r.passed ? (
            <Link href={props.nextHref} className="btn btn-primary min-h-14">
              Torna al percorso
            </Link>
          ) : (
            <button type="button" className="btn btn-primary min-h-14" onClick={() => setPhase({ kind: "intro" })}>
              Riprova
            </button>
          )}
          <Link href="/ripasso" className="btn btn-ghost min-h-14">
            Vai al ripasso
          </Link>
        </div>
      </section>
    );
  }

  if (phase.kind === "placement-done") {
    const r = phase.result;
    return (
      <section className="grid gap-4 rounded-2xl border-2 border-border bg-surface p-5" aria-live="polite">
        <h2 className="font-display text-2xl font-bold">{r.recommended.allKnown ? "Vai forte, parti dalla fine" : `Ti consiglio di partire da: ${r.recommended.title}`}</h2>
        <p>
          Risposte giuste: <strong>{r.correct}</strong> su {r.total}.
        </p>
        {r.toProve.length > 0 ? (
          <div className="grid gap-2">
            <p>
              Per saltare i moduli precedenti devi superare la loro prova di padronanza (il test d&apos;ingresso, da solo, non sblocca niente):
            </p>
            <ul className="grid gap-2">
              {r.toProve.map((m) => (
                <li key={m.module}>
                  {m.available ? (
                    <Link href={`/padronanza/${props.course}/${m.module}`} className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-border p-3 font-semibold hover:border-foreground">
                      <span>
                        {props.course}
                        {m.module} · {m.title}
                      </span>
                      <span aria-hidden className="text-primary">→</span>
                    </Link>
                  ) : (
                    <p className="rounded-lg border border-dashed border-border p-3 text-muted">
                      {props.course}
                      {m.module} · {m.title}: prova non ancora disponibile, fai le lezioni.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Si parte dal primo modulo: nessuna prova da fare.</p>
        )}
        <Link href={props.backHref} className="btn btn-primary min-h-14 w-fit">
          Torna al percorso
        </Link>
      </section>
    );
  }

  return null;
}
