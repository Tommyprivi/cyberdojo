"use client";

import { useState, type ReactNode } from "react";
import { SQL_DOWNLOAD_HINT } from "@/lib/sql/config";
import { previewSql } from "@/lib/sql/schema";
import { ErDiagram } from "./er-diagram";
import { ResultsPanel } from "./results-panel";
import { SchemaExplorer } from "./schema-explorer";
import { SqlEditor } from "./sql-editor";
import { useSql } from "./use-sql";

type Tab = "risultati" | "er";

/**
 * Ambiente SQL completo (stile pgAdmin): esploratore a sinistra, editor in alto, risultati sotto.
 * Lo usano sia la pagina /pratica/sql sia il componente <SqlPlayground> delle lezioni.
 */
export function SqlWorkbench({
  dbId,
  query,
  onQueryChange,
  onExecuted,
  toolbar,
  sidebar,
  explorerOpen = true,
  className = "",
  style,
}: {
  dbId: string;
  query: string;
  onQueryChange: (q: string) => void;
  onExecuted?: (sql: string) => void;
  /** Elementi in più nella barra (per esempio il selettore del database). */
  toolbar?: ReactNode;
  /** Pannello sotto l'esploratore (esempi, cronologia). */
  sidebar?: ReactNode;
  explorerOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const sql = useSql(dbId);
  const [tab, setTab] = useState<Tab>("risultati");
  const [showExplorer, setShowExplorer] = useState(explorerOpen);
  const ready = sql.status === "ready";
  const busy = sql.running || sql.status === "loading";

  async function run(selection: string | null) {
    if (!ready) return;
    setTab("risultati");
    const text = selection ?? query;
    const out = await sql.execute(text);
    if (out) onExecuted?.(text);
  }

  async function preview(table: string) {
    setTab("risultati");
    await sql.execute(previewSql(table), `Anteprima di ${table}`);
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`min-h-8 border-b-2 px-3 text-sm font-semibold ${tab === id ? "border-foreground" : "border-transparent text-muted hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  return (
    <div className={`flex min-h-0 overflow-hidden border border-border bg-background ${className}`} style={style}>
      {showExplorer && (
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface" aria-label="Schema del database">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <SchemaExplorer schema={sql.schema} onPreview={preview} disabled={busy || !ready} />
          </div>
          {sidebar}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-2 py-1.5">
          <button
            type="button"
            onClick={() => setShowExplorer((v) => !v)}
            aria-pressed={showExplorer}
            className="min-h-9 rounded-md border border-border px-2.5 text-sm font-semibold hover:bg-surface-muted"
          >
            Tabelle
          </button>
          {toolbar}
          <span className="ml-auto flex items-center gap-2">
            <button type="button" className="btn btn-ghost !min-h-9 !px-3 text-sm" disabled={!ready || busy} onClick={() => void sql.reset()}>
              Ripristina database
            </button>
            <button type="button" className="btn btn-primary !min-h-9 !px-4 text-sm" disabled={!ready || busy} onClick={() => void run(null)}>
              {sql.running ? "In corso…" : "Esegui (Ctrl+Invio)"}
            </button>
          </span>
        </div>
        <SqlEditor value={query} onChange={onQueryChange} onRun={(s) => void run(s)} className="h-[38%] min-h-24 border-b border-border" />
        <div role="tablist" aria-label="Risultati" className="flex items-center gap-1 border-b border-border bg-surface px-2">
          {tabBtn("risultati", "Risultati")}
          {tabBtn("er", "Diagramma ER")}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden bg-surface" role="tabpanel">
          {sql.status === "idle" || sql.status === "loading" || sql.status === "error" ? (
            <div className="grid h-full place-items-center p-4 text-center">
              <div className="grid max-w-md justify-items-center gap-3">
                {sql.status === "error" && (
                  <p role="alert" className="text-sm text-accent">
                    Non sono riuscito ad avviare il database: {sql.fatal}. Riprova; se continua, ricarica la pagina.
                  </p>
                )}
                {sql.status === "loading" ? (
                  <p role="status" className="font-semibold">{sql.progress || "Avvio in corso…"}</p>
                ) : (
                  <>
                    <p className="text-sm text-muted">
                      Un vero database PostgreSQL che gira dentro il tuo browser: niente da installare, nessun dato esce dal tuo computer.
                      Il primo avvio scarica il motore ({SQL_DOWNLOAD_HINT}).
                    </p>
                    <button type="button" className="btn btn-primary" onClick={() => void sql.start()}>
                      Avvia il database
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : tab === "er" ? (
            <ErDiagram schema={sql.schema} />
          ) : (
            <ResultsPanel outcome={sql.outcome} notice={sql.notice} />
          )}
        </div>
      </div>
    </div>
  );
}
