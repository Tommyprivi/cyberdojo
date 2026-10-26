"use client";

import { useState } from "react";
import { calculate, formatResult } from "@/lib/calculator";

const KEYS = [
  ["C", "⌫", "(", ")"],
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  ["0", ",", "%", "+"],
] as const;

const OPERATORS = new Set(["÷", "×", "−", "+"]);

/** Calcolatrice con tastierino grande (telefono) e tastiera (PC). Nessun invio di dati: tutto nel browser. */
export function Calculator() {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  const live = expr.trim() ? calculate(expr) : null;

  const press = (key: string) => {
    if (key === "C") return setExpr("");
    if (key === "⌫") return setExpr((e) => e.slice(0, -1));
    setExpr((e) => e + key);
  };

  const equals = () => {
    const r = calculate(expr);
    if (!r.ok) return;
    const text = formatResult(r.value);
    setHistory((h) => [{ expr, result: text }, ...h].slice(0, 5));
    setExpr(text.replace(/\./g, "")); // si può continuare a calcolare dal risultato
  };

  return (
    <div className="mx-auto grid w-full max-w-sm gap-3">
      <div className="grid gap-1 rounded-2xl border-2 border-border bg-surface p-4">
        <label htmlFor="calc-input" className="sr-only">
          Calcolo
        </label>
        <input
          id="calc-input"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              equals();
            }
          }}
          inputMode="none"
          autoComplete="off"
          spellCheck={false}
          maxLength={200}
          placeholder="0"
          className="w-full bg-transparent text-right font-mono text-3xl font-bold outline-none placeholder:text-muted"
        />
        <p aria-live="polite" className={`min-h-7 text-right font-mono text-lg ${live && !live.ok ? "text-accent" : "text-muted"}`}>
          {live ? (live.ok ? `= ${formatResult(live.value)}` : live.error) : ""}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {KEYS.flat().map((k) => (
          <button
            key={k}
            type="button"
            data-sound="tap"
            onClick={() => press(k)}
            aria-label={k === "⌫" ? "Cancella l'ultimo" : k === "C" ? "Azzera" : undefined}
            className={`btn min-h-14 text-xl ${OPERATORS.has(k) || k === "C" ? "btn-ghost font-bold text-primary" : ""}`}
          >
            {k}
          </button>
        ))}
        <button type="button" onClick={() => press("^")} aria-label="Elevato a" className="btn btn-ghost min-h-14 text-xl font-bold text-primary">
          ^
        </button>
        <button type="button" onClick={equals} disabled={!live?.ok} className="btn btn-primary col-span-3 min-h-14 text-xl">
          =
        </button>
      </div>

      {history.length > 0 && (
        <section aria-label="Ultimi calcoli" className="grid gap-1 rounded-2xl border-2 border-border bg-surface p-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Ultimi calcoli</h2>
          <ul className="grid gap-1">
            {history.map((h, i) => (
              <li key={`${h.expr}-${i}`} className="flex justify-between gap-3 font-mono text-sm">
                <span className="truncate text-muted">{h.expr}</span>
                <span className="font-bold">= {h.result}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
