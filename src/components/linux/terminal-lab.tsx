"use client";

import { useRef, useState } from "react";
import { LAB_PASSWORD } from "@/lib/linux/users";
import { SCENARIOS, scenarioInfo, type ScenarioId } from "@/lib/linux/scenarios";
import { Terminal, type TerminalHandle } from "./terminal";

/** Pagina a tutto schermo: terminale a sinistra, pannello del tutor a destra. */
export function TerminalLab() {
  const [scenario, setScenario] = useState<ScenarioId>("base");
  const [run, setRun] = useState(0);
  const handle = useRef<TerminalHandle>(null);
  const info = scenarioInfo(scenario);

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_22rem] overflow-hidden">
      <Terminal key={`${scenario}-${run}`} ref={handle} scenario={scenario} className="h-full" />

      <aside aria-label="Tutor" className="min-h-0 overflow-y-auto border-l border-border bg-surface p-4">
        <div className="grid gap-5">
          <section aria-labelledby="obiettivo" className="grid gap-2">
            <h2 id="obiettivo" className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Obiettivo</h2>
            <p>{info.goal}</p>
            <ol className="grid list-decimal gap-1 pl-5 text-sm text-muted">
              {info.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="comandi" className="grid gap-2">
            <h2 id="comandi" className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Comandi utili</h2>
            <p className="text-sm text-muted">Clicca per scrivere il comando nel terminale, poi premi Invio.</p>
            <ul className="flex flex-wrap gap-2">
              {info.commands.map((c) => (
                <li key={c}>
                  <button type="button" className="chip font-mono text-xs" onClick={() => handle.current?.fill(c)}>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="scenari" className="grid gap-2">
            <h2 id="scenari" className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Scenari</h2>
            <ul className="grid gap-2">
              {SCENARIOS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={s.id === scenario}
                    onClick={() => {
                      setScenario(s.id);
                      setRun((n) => n + 1);
                    }}
                    className={`w-full rounded-md border px-3 py-2 text-left ${s.id === scenario ? "border-foreground bg-surface-muted" : "border-border hover:border-foreground"}`}
                  >
                    <span className="block font-semibold">{s.label}</span>
                    <span className="block text-sm text-muted">{s.blurb}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="dossier grid gap-1 p-3 text-sm">
            <p>
              <strong>Ricordati:</strong> per i comandi da amministratore scrivi <code className="font-mono">sudo</code> davanti. La password di laboratorio è{" "}
              <code className="font-mono font-bold">{LAB_PASSWORD}</code> (in un computer vero non si vede mentre la scrivi).
            </p>
            <p className="text-muted">Tutto è simulato: puoi sbagliare, rompere e ricominciare senza conseguenze.</p>
          </section>

          <button type="button" className="btn btn-ghost" onClick={() => setRun((n) => n + 1)}>
            Ricomincia
          </button>
        </div>
      </aside>
    </div>
  );
}
