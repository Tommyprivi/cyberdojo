"use client";

import { MAX_ROWS, TIME_LIMIT_MS } from "@/lib/sql/limits";
import { describeResult, formatCell, formatDuration, isNumericType } from "@/lib/sql/results";
import type { Outcome } from "./use-sql";

/** Risultati: griglia con intestazioni, riepilogo (righe e durata), errori spiegati e avvisi. */
export function ResultsPanel({ outcome, notice }: { outcome: Outcome | null; notice: string }) {
  if (!outcome) {
    return (
      <div className="grid h-full place-items-center p-4 text-center text-sm text-muted">
        <p>
          Scrivi una query e premi <kbd className="rounded border border-border px-1 font-mono">Esegui</kbd> (o Ctrl+Invio).
          {notice && <span className="mt-2 block text-foreground">{notice}</span>}
        </p>
      </div>
    );
  }

  if (outcome.kind === "timeout") {
    return (
      <div role="alert" className="grid content-start gap-2 p-4">
        <p className="font-semibold text-accent">Query interrotta: ha superato {TIME_LIMIT_MS / 1000} secondi.</p>
        <p className="text-sm">
          Una query così lunga di solito ha un errore logico: per esempio un JOIN senza condizione che moltiplica le righe, o una serie
          enorme di numeri. Il database è stato ripristinato come all&apos;inizio. Prova a limitare i dati con WHERE o LIMIT.
        </p>
      </div>
    );
  }

  if (outcome.kind === "error") {
    const { error, hint } = outcome;
    return (
      <div role="alert" className="grid content-start gap-3 p-4">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Errore SQL</p>
        <pre className="whitespace-pre-wrap rounded-md border border-border bg-surface-muted p-3 font-mono text-sm">{error.message}</pre>
        {hint && (
          <p className="rounded-md border-l-4 border-primary bg-surface-muted p-3 text-sm">
            <strong>Cosa significa: </strong>
            {hint}
          </p>
        )}
        {error.hint && <p className="font-mono text-xs text-muted">Suggerimento di Postgres: {error.hint}</p>}
      </div>
    );
  }

  const { result, warnings } = outcome;
  const hasTable = result.columns.length > 0;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted" aria-live="polite">
        {outcome.title && <strong className="text-foreground">{outcome.title}</strong>}
        <span className="font-bold text-foreground">{describeResult(result)}</span>
        <span>{formatDuration(result.durationMs)}</span>
        {result.statements > 1 && <span>{result.statements} istruzioni eseguite: si vede l&apos;ultimo risultato</span>}
        {result.truncated && <span>massimo {MAX_ROWS} righe mostrate</span>}
      </p>
      {warnings.map((w) => (
        <p key={w} role="note" className="border-b border-border bg-surface-muted px-3 py-2 text-sm">
          <strong className="text-accent">Attenzione: </strong>
          {w}
        </p>
      ))}
      {hasTable ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-max min-w-full border-collapse font-mono text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                <th scope="col" className="border-b border-r border-border bg-surface-muted px-2 py-1.5 text-right text-xs font-normal text-muted">#</th>
                {result.columns.map((c, i) => (
                  <th key={i} scope="col" className="border-b border-r border-border bg-surface-muted px-3 py-1.5 text-left font-bold whitespace-nowrap">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, r) => (
                <tr key={r} className="odd:bg-surface even:bg-background">
                  <td className="border-b border-r border-border px-2 py-1 text-right text-xs text-muted">{r + 1}</td>
                  {row.map((cell, c) => {
                    const f = formatCell(cell);
                    const right = f.kind === "number" || (isNumericType(result.columns[c].type) && f.kind === "text");
                    return (
                      <td
                        key={c}
                        className={`max-w-[28rem] truncate border-b border-r border-border px-3 py-1 whitespace-nowrap ${right ? "text-right" : ""} ${f.kind === "null" ? "italic text-muted" : ""}`}
                        title={f.text}
                      >
                        {f.text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {result.rows.length === 0 && <p className="p-4 text-sm text-muted">La query non ha trovato nessuna riga.</p>}
        </div>
      ) : (
        <p className="p-4 text-sm">
          Comando eseguito. {notice}
        </p>
      )}
    </div>
  );
}
