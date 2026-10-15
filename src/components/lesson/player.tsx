"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CheckIcon, LockIcon } from "../icons";
import { PlayerContext, type LessonVideo } from "./player-context";

export type PlayerScreen = { title: string; gated: boolean; node: ReactNode };

/**
 * Player della lezione, con due impianti:
 * - telefono: intestazione con uscita e barra di avanzamento, una colonna;
 * - PC: indice laterale con tutte le schermate (dove sei, cosa hai visto) e testo largo al centro.
 */
export function LessonPlayer({
  lessonId,
  title,
  screens,
  video,
}: {
  lessonId: string;
  title: string;
  screens: PlayerScreen[];
  video?: LessonVideo;
}) {
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(0); // schermata più avanti raggiunta: fin lì l'indice è cliccabile
  const [verified, setVerified] = useState(false);
  const ctx = useMemo(() => ({ lessonId, video, markVerified: () => setVerified(true) }), [lessonId, video]);

  const screen = screens[index];
  const last = index === screens.length - 1;
  const blocked = screen.gated && !verified;

  const go = (i: number) => {
    setIndex(i);
    setReached((r) => Math.max(r, i));
  };

  // Tastiera su PC: frecce per muoversi tra le schermate (non mentre si scrive in un campo).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof Element && t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight" && !last && !blocked) go(index + 1);
      if (e.key === "ArrowLeft" && index > 0) go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, last, blocked]);

  // Cambiando schermata si riparte dall'alto.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  // Una schermata dopo la verifica si apre solo a verifica superata.
  const gateIndex = screens.findIndex((s) => s.gated);
  const reachable = (i: number) => i <= reached && (verified || gateIndex < 0 || i <= gateIndex);

  return (
    <PlayerContext.Provider value={ctx}>
      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* PC: indice della lezione */}
        <aside className="sticky top-0 hidden h-dvh flex-col gap-5 overflow-y-auto border-r border-border bg-surface px-5 py-6 lg:flex">
          <Link href="/percorso" className="flex min-h-10 items-center gap-2 font-semibold text-muted hover:text-foreground">
            <span aria-hidden>←</span> Percorso
          </Link>
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{lessonId}</p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight">{title}</h2>
          </div>
          <nav aria-label="Schermate della lezione">
            <ol className="grid gap-0.5">
              {screens.map((s, i) => {
                const current = i === index;
                const seen = i < reached || (i <= reached && !current);
                const ok = reachable(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={!ok}
                      onClick={() => go(i)}
                      aria-current={current ? "step" : undefined}
                      className={`flex w-full items-center gap-3 rounded-md border-l-4 px-3 py-2 text-left text-sm ${
                        current ? "border-accent bg-surface-muted font-semibold" : "border-transparent hover:bg-surface-muted disabled:hover:bg-transparent"
                      } ${ok ? "" : "text-muted opacity-70"}`}
                    >
                      <span className="grid size-5 shrink-0 place-items-center font-mono text-xs">
                        {seen && !current ? <CheckIcon width={14} height={14} className="text-success" /> : ok ? String(i + 1).padStart(2, "0") : <LockIcon width={12} height={12} />}
                      </span>
                      <span className="min-w-0 truncate">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <p className="mt-auto text-xs text-muted">Usa le frecce ← → della tastiera per muoverti.</p>
        </aside>

        <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-4 pt-3 lg:max-w-none lg:px-0 lg:pb-0 lg:pt-0">
          {/* Telefono: uscita e avanzamento */}
          <header className="grid gap-3 lg:hidden">
            <div className="flex items-center gap-3">
              <Link
                href="/percorso"
                aria-label="Esci dalla lezione"
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-surface text-xl font-bold"
              >
                ×
              </Link>
              <div
                role="progressbar"
                aria-label="Avanzamento nella lezione"
                aria-valuemin={1}
                aria-valuemax={screens.length}
                aria-valuenow={index + 1}
                className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted"
              >
                <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${((index + 1) / screens.length) * 100}%` }} />
              </div>
              <button type="button" disabled title="L'audio arriva con la pipeline TTS (E6)" className="chip shrink-0 text-sm opacity-60">
                Audio: presto
              </button>
            </div>
            <p className="text-sm text-muted">
              {lessonId} · {title} · schermata {index + 1} di {screens.length}
            </p>
          </header>

          {/* PC: barra con l'avanzamento */}
          <div className="hidden items-center gap-4 border-b border-border px-12 py-4 lg:flex">
            <p className="font-mono text-sm text-muted">
              {String(index + 1).padStart(2, "0")} / {String(screens.length).padStart(2, "0")}
            </p>
            <div
              role="progressbar"
              aria-label="Avanzamento nella lezione"
              aria-valuemin={1}
              aria-valuemax={screens.length}
              aria-valuenow={index + 1}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"
            >
              <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${((index + 1) / screens.length) * 100}%` }} />
            </div>
            <button type="button" disabled title="L'audio arriva con la pipeline TTS (E6)" className="chip text-sm opacity-60">
              Audio: presto
            </button>
          </div>

          <main className="card mt-4 flex-1 p-5 sm:p-8 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[52rem] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-12 lg:py-12 lg:text-[1.0625rem]">
            <h1 className="mb-6 font-display text-3xl font-bold lg:text-5xl">{screen.title}</h1>
            {/* Tutte le schermate restano montate: la verifica non perde lo stato se si torna indietro. */}
            {screens.map((s, i) => (
              <section key={i} hidden={i !== index} aria-hidden={i !== index}>
                {s.node}
              </section>
            ))}
          </main>

          <nav className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:mx-0 lg:mt-0 lg:px-12">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn btn-ghost">
              Indietro
            </button>
            {last ? (
              <Link href="/percorso" className="btn btn-primary">
                Completa la lezione
              </Link>
            ) : (
              <button type="button" onClick={() => go(index + 1)} disabled={blocked} className="btn btn-primary">
                {blocked ? "Prima la verifica" : "Avanti"}
              </button>
            )}
          </nav>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}
