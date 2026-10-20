"use client";

import { useState } from "react";
import { BitGrid } from "./bits";

type Step = string | { text: string; bits?: string };

/** Esempio svolto un passo alla volta. Un passo può mostrare lo schema dei bit. */
export function Guided({ steps }: { steps: Step[] }) {
  const [shown, setShown] = useState(1);
  return (
    <div className="my-2 grid gap-4">
      <ol className="grid gap-3">
        {steps.slice(0, shown).map((raw, i) => {
          const s = typeof raw === "string" ? { text: raw } : raw;
          return (
            <li key={i} className="pop grid gap-2 rounded-lg border border-border bg-surface-muted p-3">
              <div className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-md font-mono bg-primary font-bold text-primary-fg">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s.text}</span>
              </div>
              {s.bits && <BitGrid bits={s.bits} />}
            </li>
          );
        })}
      </ol>
      {shown < steps.length && (
        <button type="button" onClick={() => setShown((n) => n + 1)} className="btn btn-ghost w-fit">
          Mostrami il passo successivo
        </button>
      )}
    </div>
  );
}
