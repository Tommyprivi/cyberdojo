"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DOWNLOAD_HINT } from "@/lib/python/config";
import { CodeEditor } from "./code-editor";
import { usePython, type Seg, type SegChannel } from "./use-python";

const SEG_CLASS: Record<SegChannel, string> = {
  out: "text-deep-fg",
  err: "text-[#ff9b8a]",
  in: "text-[#9ec1ff]",
  cmd: "text-[#9ec1ff]",
  sys: "block my-1 italic text-[#d9d1c0]",
  help: "block my-2 border-l-4 border-[#ffd98a] bg-white/5 py-1.5 pl-3 not-italic text-[#ffe3a8]",
};

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* comodità, non essenziale */
  }
}

function Output({ segs, empty }: { segs: Seg[]; empty: string }) {
  return (
    <pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm leading-6">
      {segs.length === 0 && <span className="text-[#b9b09d]">{empty}</span>}
      {segs.map((s, i) =>
        s.channel === "help" ? (
          <span key={i} className={SEG_CLASS.help}>
            <strong>Aiuto del Sensei: </strong>
            {s.text}
          </span>
        ) : (
          <span key={i} className={SEG_CLASS[s.channel]}>
            {s.text}
          </span>
        ),
      )}
    </pre>
  );
}

/**
 * Editor + pulsanti + pannello di output. `stacked` (lezioni): codice sopra, output sotto, altezza fissa.
 * `split` (strumento a tutto schermo): codice a sinistra, terminale a destra, a tutta altezza.
 */
export function PythonWorkbench({
  storageKey,
  initialCode,
  layout,
  height = 320,
}: {
  storageKey: string;
  initialCode: string;
  layout: "stacked" | "split";
  height?: number;
}) {
  const py = usePython();
  const [code, setCode] = useState(initialCode);
  const [line, setLine] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const lineInput = useRef<HTMLInputElement>(null);

  // Recupera il codice salvato (solo nel browser, dopo il primo disegno per non differire dal server).
  useEffect(() => {
    const saved = storageGet(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved !== null) setCode(saved);
  }, [storageKey]);

  const segs = py.mode === "program" ? py.program : py.repl;
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [segs, py.status]);

  useEffect(() => {
    if (py.status === "input" || (py.mode === "repl" && py.status === "ready")) lineInput.current?.focus();
  }, [py.status, py.mode]);

  function change(v: string) {
    setCode(v);
    storageSet(storageKey, v === initialCode ? null : v);
  }

  const started = py.status !== "off";
  const busy = py.status === "running" || py.status === "input";
  const canRun = py.status === "ready";

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = line;
    setLine("");
    if (py.status === "input") py.submitInput(text);
    else if (py.mode === "repl" && py.status === "ready") py.replLine(text);
  }

  const showLine = py.status === "input" || (py.mode === "repl" && (py.status === "ready" || py.status === "running"));
  const prompt = py.status === "input" ? "›" : py.replMore ? "..." : ">>>";

  const split = layout === "split";
  return (
    <div
      className={`overflow-hidden border border-border bg-surface ${split ? "grid h-full grid-cols-2 grid-rows-1 border-0" : "flex flex-col rounded-lg"}`}
    >
      <div className={`flex min-h-0 flex-col ${split ? "border-r border-border" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-muted px-3 py-2">
          {!started ? (
            <button type="button" onClick={py.start} className="btn btn-primary min-h-10 px-4 text-sm">
              Avvia Python
            </button>
          ) : (
            <button
              type="button"
              onClick={() => py.run(code)}
              disabled={!canRun}
              className="btn btn-primary min-h-10 px-4 text-sm"
              title="Ctrl + Invio"
            >
              ▶ Esegui
            </button>
          )}
          <button type="button" onClick={py.stop} disabled={!busy} className="btn btn-ghost min-h-10 px-3 text-sm">
            ■ Ferma
          </button>
          <button
            type="button"
            onClick={() => {
              setCode(initialCode);
              storageSet(storageKey, null);
            }}
            disabled={code === initialCode}
            className="btn btn-ghost min-h-10 px-3 text-sm"
          >
            Ripristina codice
          </button>
          <span className="ml-auto font-mono text-xs text-muted" role="status">
            {py.status === "off" && "Python non avviato"}
            {py.status === "loading" && `${py.progress.label}… ${Math.round(py.progress.fraction * 100)}%`}
            {py.status === "ready" && "Python pronto"}
            {py.status === "running" &&
              (py.progress.fraction < 1
                ? `${py.progress.label}… ${Math.round(py.progress.fraction * 100)}%`
                : "In esecuzione…")}
            {py.status === "input" && "Il programma aspetta una risposta"}
          </span>
        </div>
        <div className={split ? "flex min-h-0 flex-1" : "flex"} style={split ? undefined : { height }}>
          <CodeEditor
            value={code}
            onChange={change}
            onRun={() => canRun && py.run(code)}
            label="Codice Python"
            className="min-h-0 flex-1"
          />
        </div>
        <p className="border-t border-border bg-surface-muted px-3 py-1.5 font-mono text-[0.7rem] text-muted">
          Tab = 4 spazi · Esc poi Tab per uscire · Ctrl+Invio esegue
        </p>
      </div>

      <div className="flex min-h-0 flex-col bg-deep text-deep-fg">
        <div className="flex items-center gap-1 border-b border-white/15 px-2 py-1.5" role="tablist" aria-label="Modalità del terminale">
          {(["program", "repl"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={py.mode === m}
              onClick={() => py.setMode(m)}
              className={`min-h-8 rounded px-3 font-mono text-xs font-bold uppercase tracking-wider ${
                py.mode === m ? "bg-white/15 text-deep-fg" : "text-[#b9b09d] hover:text-deep-fg"
              }`}
            >
              {m === "program" ? "Programma" : "REPL"}
            </button>
          ))}
          <button
            type="button"
            onClick={py.clear}
            className="ml-auto min-h-8 rounded px-3 font-mono text-xs text-[#b9b09d] hover:text-deep-fg"
          >
            Pulisci
          </button>
        </div>
        <div
          ref={scroller}
          className="min-h-0 flex-1 overflow-auto p-3"
          style={split ? undefined : { minHeight: 160, maxHeight: Math.max(160, height * 0.6) }}
          role="log"
          aria-live="polite"
          aria-label="Output di Python"
          tabIndex={0}
        >
          {py.status === "off" && (
            <div className="grid gap-2 text-sm text-[#d9d1c0]">
              <p>
                Python gira nel tuo browser: niente da installare e il tuo codice non lascia mai il tuo computer. Premi{" "}
                <strong>Avvia Python</strong> ({DOWNLOAD_HINT}).
              </p>
              {py.fatal && (
                <p className="text-[#ff9b8a]">
                  Non sono riuscito ad avviare Python: {py.fatal}. Controlla la connessione e riprova.
                </p>
              )}
            </div>
          )}
          {py.status === "loading" && (
            <div className="grid gap-2 text-sm">
              <p>
                {py.progress.label}… ({DOWNLOAD_HINT})
              </p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(py.progress.fraction * 100)}
                className="h-2 w-full overflow-hidden rounded bg-white/15"
              >
                <div className="h-full bg-[#9ec1ff]" style={{ width: `${Math.round(py.progress.fraction * 100)}%` }} />
              </div>
            </div>
          )}
          {py.status !== "off" && py.status !== "loading" && (
            <Output
              segs={segs}
              empty={py.mode === "program" ? "L'output del programma comparirà qui. Premi Esegui." : "Scrivi una riga di Python qui sotto e premi Invio."}
            />
          )}
          {showLine && (
            <form onSubmit={submit} className="mt-1 flex items-center gap-2">
              <label htmlFor={`${storageKey}-line`} className="font-mono text-sm text-[#9ec1ff]">
                {prompt}
              </label>
              <input
                id={`${storageKey}-line`}
                ref={lineInput}
                value={line}
                onChange={(e) => setLine(e.target.value)}
                disabled={py.status === "running"}
                autoComplete="off"
                spellCheck={false}
                aria-label={py.status === "input" ? "Risposta per input()" : "Riga di Python"}
                className="min-w-0 flex-1 border-b border-white/25 bg-transparent py-0.5 font-mono text-sm text-deep-fg outline-none focus:border-[#9ec1ff]"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
