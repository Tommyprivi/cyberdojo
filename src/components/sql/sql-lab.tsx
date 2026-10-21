"use client";

import { useEffect, useState } from "react";
import { DATABASES, DEFAULT_DB_ID, getDatabase } from "@/lib/sql/databases";
import { HISTORY_SIZE } from "@/lib/sql/limits";
import { pushHistory } from "@/lib/sql/results";
import { SqlWorkbench } from "./sql-workbench";

const HISTORY_KEY = "cyberdojo:sql:history";
const QUERY_KEY = "cyberdojo:sql:query";

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* il browser non permette di salvare: si lavora comunque */
  }
}

/** Pagina a tutto schermo /pratica/sql: selettore del database, esempi cliccabili e cronologia. */
export function SqlLab() {
  const [dbId, setDbId] = useState(DEFAULT_DB_ID);
  const db = getDatabase(dbId)!;
  const [query, setQuery] = useState(db.examples[0].sql);
  const [history, setHistory] = useState<string[]>([]);
  const [side, setSide] = useState<"esempi" | "cronologia">("esempi");

  useEffect(() => {
    // Il salvataggio vive solo nel browser: lo si legge dopo il primo disegno per non rompere l'idratazione.
    const saved = readStore<string | null>(QUERY_KEY, null);
    const hist = readStore<string[]>(HISTORY_KEY, []);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setQuery(saved);
    setHistory(hist);
  }, []);

  function changeQuery(q: string) {
    setQuery(q);
    writeStore(QUERY_KEY, q);
  }

  function changeDb(id: string) {
    setDbId(id);
    changeQuery(getDatabase(id)!.examples[0].sql);
  }

  function executed(sql: string) {
    setHistory((h) => {
      const next = pushHistory(h, sql, HISTORY_SIZE);
      writeStore(HISTORY_KEY, next);
      return next;
    });
  }

  const tab = (id: typeof side, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={side === id}
      onClick={() => setSide(id)}
      className={`min-h-8 flex-1 border-b-2 px-2 text-sm font-semibold ${side === id ? "border-foreground" : "border-transparent text-muted hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  const items = side === "esempi" ? db.examples.map((e) => ({ label: e.title, sql: e.sql })) : history.map((h) => ({ label: h.replace(/\s+/g, " "), sql: h }));

  const sidebar = (
    <div className="flex h-[38%] min-h-32 shrink-0 flex-col border-t border-border">
      <div role="tablist" aria-label="Esempi e cronologia" className="flex border-b border-border">
        {tab("esempi", "Esempi")}
        {tab("cronologia", `Cronologia (${history.length})`)}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto p-1">
        {items.length === 0 && <li className="p-2 text-sm text-muted">Le query che esegui compariranno qui.</li>}
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => changeQuery(it.sql)}
              title={it.sql}
              className={`w-full rounded px-2 py-1.5 text-left hover:bg-surface-muted ${side === "esempi" ? "text-sm" : "truncate font-mono text-xs"}`}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const toolbar = (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-semibold">Database</span>
      <select value={dbId} onChange={(e) => changeDb(e.target.value)} className="min-h-9 rounded-md border border-border bg-surface px-2" title={db.description}>
        {DATABASES.map((d) => (
          <option key={d.id} value={d.id}>
            {d.title}
          </option>
        ))}
      </select>
    </label>
  );

  return <SqlWorkbench dbId={dbId} query={query} onQueryChange={changeQuery} onExecuted={executed} toolbar={toolbar} sidebar={sidebar} className="h-full border-0" />;
}
