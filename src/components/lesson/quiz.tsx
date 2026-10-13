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
    <fieldset className="my-2 grid gap-3">
      <legend className="mb-1 text-lg font-bold">{question}</legend>
      {options.map((o, i) => {
        const isRight = done && i === answer;
        const isWrong = done && picked === i && !correct;
        return (
          <label
            key={o}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-2 ${
              isRight ? "border-primary bg-surface-muted" : isWrong ? "border-accent bg-surface-muted" : "border-border bg-surface"
            }`}
          >
            <input
              type="radio"
              name={name}
              disabled={done}
              checked={picked === i}
              onChange={() => setPicked(i)}
              className="size-5 accent-[var(--primary)]"
            />
            <span className="font-mono text-lg">{o}</span>
            {isRight && <span className="ml-auto text-sm font-bold text-primary">Giusta</span>}
            {isWrong && <span className="ml-auto text-sm font-bold text-accent">Non è questa</span>}
          </label>
        );
      })}
      <p role="status" className="min-h-6 text-sm">
        {done && (correct ? "Corretto. " : "")}
        {done && explain}
      </p>
    </fieldset>
  );
}
