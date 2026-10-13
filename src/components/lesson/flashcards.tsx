"use client";

import { useState } from "react";

/**
 * Schede di ripasso: prima provi a ricordare, poi giri la scheda.
 * Richiamare a memoria fissa i concetti meglio che rileggerli.
 */
export function Flashcards({ cards }: { cards: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<boolean[]>(() => cards.map(() => false));
  const seen = open.filter(Boolean).length;

  return (
    <div className="my-2 grid gap-3">
      <p className="text-sm font-bold text-muted">
        Prova a rispondere a mente, poi gira la scheda. {seen} di {cards.length} girate.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => (
          <li key={i}>
            <button
              type="button"
              aria-expanded={open[i]}
              onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
              className={`grid min-h-28 w-full content-center gap-1 rounded-3xl border-2 p-4 text-left shadow-[0_4px_0_var(--border)] ${
                open[i] ? "border-primary bg-surface" : "border-border bg-surface-muted"
              }`}
            >
              <span className="font-bold">{c.q}</span>
              {open[i] ? (
                <span className="pop text-lg font-extrabold text-primary">{c.a}</span>
              ) : (
                <span className="text-sm text-muted">Tocca per vedere la risposta</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
