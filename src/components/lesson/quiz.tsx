"use client";

import { useId, useState } from "react";

export function Quiz({
  question,
  options,
  answer,
  explain,
}: {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}) {
  const name = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  const correct = picked === answer;

  return (
    <fieldset className="my-6 rounded-xl border border-border bg-surface p-4">
      <legend className="px-1 font-semibold">{question}</legend>
      <div className="mt-2 grid gap-2">
        {options.map((o, i) => (
          <label
            key={o}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${
              done && i === answer ? "border-belt-green bg-surface-muted" : "border-border"
            }`}
          >
            <input
              type="radio"
              name={name}
              disabled={done}
              checked={picked === i}
              onChange={() => setPicked(i)}
              className="size-5"
            />
            <span className="font-mono">{o}</span>
          </label>
        ))}
      </div>
      <p role="status" className="mt-3 min-h-6 text-sm">
        {done && (correct ? "Corretto. " : "Non è questa. ")}
        {done && explain}
      </p>
    </fieldset>
  );
}
