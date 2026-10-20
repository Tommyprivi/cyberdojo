"use client";

import { useId, useState } from "react";
import type { Question } from "@/lib/tutor/engine";

/** Domanda di controllo del tutor: scelta (si risponde toccando) oppure numero (si scrive e si conferma). */
export function QuestionBox({
  question,
  onSubmit,
  disabled,
  label,
  selected,
}: {
  question: Question;
  onSubmit: (given: string) => void;
  disabled?: boolean;
  label?: string;
  /** Risposta già data (rapporto finale): si evidenzia, così si vede cosa si è scelto. */
  selected?: string;
}) {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <fieldset className="grid min-w-0 gap-2" disabled={disabled}>
      <legend className="mb-1 font-semibold">{label ? `${label} ` : ""}{question.prompt}</legend>
      {question.type === "choice" ? (
        <div className="grid gap-2">
          {question.options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onSubmit(o)}
              aria-pressed={selected === undefined ? undefined : selected === o}
              className={`min-h-11 rounded-md border-2 px-3 py-2 text-left font-semibold hover:bg-surface-muted ${
                selected === o ? "border-primary bg-surface-muted" : "border-border bg-surface"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        // Non un <form>: questo componente sta anche dentro il form del rapporto finale, e i form non si annidano.
        <div className="flex gap-2">
          <label htmlFor={id} className="sr-only">Risposta</label>
          <input
            id={id}
            className="field w-full font-mono text-lg"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (value.trim()) onSubmit(value);
              }
            }}
          />
          <button type="button" onClick={() => value.trim() && onSubmit(value)} disabled={!value.trim()} className="btn btn-primary min-h-12 px-4">
            Controlla
          </button>
        </div>
      )}
      {question.type === "number" && selected !== undefined && (
        <p className="text-sm" role="status">Risposta data: <strong className="font-mono">{selected}</strong></p>
      )}
    </fieldset>
  );
}
