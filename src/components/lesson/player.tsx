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
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-6 pt-4">
        <header className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="min-h-11 content-center text-sm underline">
              Esci
            </Link>
            <p className="truncate text-sm text-muted">{lessonId} · {title}</p>
            <button
              type="button"
              disabled
              title="L'audio arriva con la pipeline TTS (E6)"
              className="min-h-11 rounded-lg border border-border px-3 text-sm opacity-60"
            >
              Audio non ancora disponibile
            </button>
          </div>
          <div
            role="progressbar"
            aria-label="Avanzamento nella lezione"
            aria-valuemin={1}
            aria-valuemax={screens.length}
            aria-valuenow={index + 1}
            className="h-2 overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${((index + 1) / screens.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted">
            Schermata {index + 1} di {screens.length}
          </p>
        </header>

        <main className="flex-1 py-6">
          <h1 className="mb-4 text-3xl font-bold">{screen.title}</h1>
          {/* Tutte le schermate restano montate: la verifica non perde lo stato se si torna indietro. */}
          {screens.map((s, i) => (
            <section key={i} hidden={i !== index} aria-hidden={i !== index}>
              {s.node}
            </section>
          ))}
        </main>

        <nav className="sticky bottom-0 flex items-center justify-between gap-3 bg-background py-3">
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="min-h-12 rounded-lg border border-border px-5 font-medium disabled:opacity-40"
          >
            Indietro
          </button>
          {last ? (
            <Link href="/" className="grid min-h-12 place-items-center rounded-lg bg-accent px-5 font-semibold text-accent-fg">
              Completa la lezione
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              disabled={blocked}
              className="min-h-12 rounded-lg bg-accent px-5 font-semibold text-accent-fg disabled:opacity-40"
            >
              {blocked ? "Supera la verifica per continuare" : "Avanti"}
            </button>
          )}
        </nav>
      </div>
    </PlayerContext.Provider>
  );
}
