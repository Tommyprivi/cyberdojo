"use client";

import { useState } from "react";

export function Guided({ steps }: { steps: string[] }) {
  const [shown, setShown] = useState(1);
  return (
    <div className="my-6 rounded-xl border border-border bg-surface p-4">
      <ol className="grid gap-2">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-sm text-accent-fg">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      {shown < steps.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + 1)}
          className="mt-4 min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-muted"
        >
          Mostrami il passo successivo
        </button>
      )}
    </div>
  );
}
