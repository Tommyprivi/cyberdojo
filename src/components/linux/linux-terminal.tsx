"use client";

import { useRef, useState } from "react";
import { isScenarioId, scenarioInfo, type ScenarioId } from "@/lib/linux/scenarios";
import { Terminal, type TerminalHandle } from "./terminal";

/**
 * Terminale Linux simulato per le lezioni.
 * Uso nell'MDX: <LinuxTerminal goal="Elenca i file" scenario="base" commands={["ls -l", "pwd"]} />
 */
export function LinuxTerminal({
  goal,
  scenario = "base",
  commands,
}: {
  goal?: string;
  scenario?: "base" | "logs" | "permessi" | "scripting";
  commands?: string[];
}) {
  const sid: ScenarioId = isScenarioId(scenario) ? scenario : "base";
  const info = scenarioInfo(sid);
  const [run, setRun] = useState(0);
  const handle = useRef<TerminalHandle>(null);
  const suggestions = commands ?? info.commands.slice(0, 4);

  return (
    <section className="dossier not-prose my-4 overflow-hidden" aria-label="Terminale Linux">
      <p role="note" className="p-4 md:hidden">
        <strong>Il terminale si usa da computer o tablet</strong>
        <span className="mt-1 block text-sm text-muted">Servono una tastiera e più spazio. Da telefono puoi leggere la lezione e fare i quiz.</span>
      </p>
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Terminale Linux</p>
            {goal && (
              <p className="mt-0.5">
                <span className="font-semibold">Obiettivo:</span> {goal}
              </p>
            )}
          </div>
          <button type="button" className="chip text-sm" onClick={() => setRun((n) => n + 1)}>
            Ricomincia
          </button>
        </div>
        <Terminal key={`${sid}-${run}`} ref={handle} scenario={sid} className="h-80" />
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5">
            <span className="text-sm text-muted">Prova:</span>
            {suggestions.map((c) => (
              <button key={c} type="button" className="chip font-mono text-sm" onClick={() => handle.current?.fill(c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
