"use client";

import { useState } from "react";

export function Guided({ steps }: { steps: string[] }) {
  const [shown, setShown] = useState(1);
  return (
    <div className="my-2 grid gap-4">
      <ol className="grid gap-3">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="pop flex gap-3 rounded-2xl border-2 border-border bg-surface-muted p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-fg">
              {i + 1}
            </span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
      {shown < steps.length && (
        <button type="button" onClick={() => setShown((n) => n + 1)} className="btn btn-ghost w-fit">
          Mostrami il passo successivo
        </button>
      )}
    </div>
  );
}
