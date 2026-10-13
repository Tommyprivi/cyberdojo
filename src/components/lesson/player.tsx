"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { PlayerContext } from "./player-context";

export type PlayerScreen = { title: string; gated: boolean; node: ReactNode };

export function LessonPlayer({
  lessonId,
  title,
  screens,
}: {
  lessonId: string;
  title: string;
  screens: PlayerScreen[];
}) {
  const [index, setIndex] = useState(0);
  const [verified, setVerified] = useState(false);
  const ctx = useMemo(() => ({ lessonId, markVerified: () => setVerified(true) }), [lessonId]);

  const screen = screens[index];
  const last = index === screens.length - 1;
  const blocked = screen.gated && !verified;

  return (
    <PlayerContext.Provider value={ctx}>
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-4 pt-3">
        <header className="grid gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/percorso"
              aria-label="Esci dalla lezione"
              className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-border bg-surface text-xl font-bold"
            >
              ×
            </Link>
            <div
              role="progressbar"
              aria-label="Avanzamento nella lezione"
              aria-valuemin={1}
              aria-valuemax={screens.length}
              aria-valuenow={index + 1}
              className="h-4 flex-1 overflow-hidden rounded-full bg-surface-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${((index + 1) / screens.length) * 100}%` }}
              />
            </div>
            <button
              type="button"
              disabled
              title="L'audio arriva con la pipeline TTS (E6)"
              className="chip shrink-0 text-sm opacity-60"
            >
              Audio: presto
            </button>
          </div>
          <p className="text-sm text-muted">
            {lessonId} · {title} · schermata {index + 1} di {screens.length}
          </p>
        </header>

        <main className="card mt-4 flex-1 p-5 sm:p-7">
          <h1 className="mb-4 font-display text-3xl font-extrabold">{screen.title}</h1>
          {/* Tutte le schermate restano montate: la verifica non perde lo stato se si torna indietro. */}
          {screens.map((s, i) => (
            <section key={i} hidden={i !== index} aria-hidden={i !== index}>
              {s.node}
            </section>
          ))}
        </main>

        <nav className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-between gap-3 bg-background/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="btn btn-ghost"
          >
            Indietro
          </button>
          {last ? (
            <Link href="/percorso" className="btn btn-primary">
              Completa la lezione
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              disabled={blocked}
              className="btn btn-primary"
            >
              {blocked ? "Prima la verifica" : "Avanti"}
            </button>
          )}
        </nav>
      </div>
    </PlayerContext.Provider>
  );
}
