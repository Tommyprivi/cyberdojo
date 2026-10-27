"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { haptic } from "@/lib/app/haptics";
import { CheckIcon, LockIcon } from "../icons";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "../nav-icons";
import { Mascot } from "../mascot";
import { ThemeToggle } from "../theme-toggle";
import { AskPush } from "../push/ask-push";
import { LessonNotes } from "./notes";
import { LessonBookmark } from "./bookmark";
import { PlayerContext, type LessonVideo } from "./player-context";
import { PageArt } from "@/components/page-art";

export type PlayerScreen = { title: string; gated: boolean; node: ReactNode };

const pad = (n: number) => String(n).padStart(2, "0");

// Il Sensei cambia espressione da una schermata all'altra; serio sulla verifica.
const MOODS = ["happy", "attento", "happy", "stern"] as const;

/**
 * Player della lezione, con due impianti:
 * - telefono/tablet: «carte» una per schermata, intestazione con uscita e segmenti di avanzamento,
 *   pulsante Continua fisso in basso (grande, con area sicura), scorrimento col dito;
 * - PC: a schermo intero, indice laterale con tutte le schermate, area di lettura larga, barra sobria.
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
  const [done, setDone] = useState(false);
  const ctx = useMemo(() => ({ lessonId, video, markVerified: () => setVerified(true) }), [lessonId, video]);

  const screen = screens[index];
  const last = index === screens.length - 1;
  const blocked = screen.gated && !verified;
  const pct = Math.round(((index + 1) / screens.length) * 100);

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
    mainRef.current?.scrollTo({ top: 0 });
  }, [index]);

  // Telefono: scorrimento orizzontale col dito (non su campi, tabelle scorrevoli, video).
  const mainRef = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.target;
    const skip = t instanceof Element && t.closest("input, textarea, select, iframe, .overflow-x-auto");
    touch.current = skip ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && !last && !blocked) go(index + 1);
    if (dx > 0 && index > 0) go(index - 1);
  };

  // Una schermata dopo la verifica si apre solo a verifica superata.
  const gateIndex = screens.findIndex((s) => s.gated);
  const reachable = (i: number) => i <= reached && (verified || gateIndex < 0 || i <= gateIndex);

  return (
    <PlayerContext.Provider value={ctx}>
      <div className="lg:grid lg:h-dvh lg:grid-cols-[19rem_minmax(0,1fr)]">
        {/* PC: indice della lezione, a tutta altezza */}
        <aside className="hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-border bg-surface px-6 py-7 lg:flex">
          <Link href="/percorso" className="flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-muted hover:text-foreground">
            <ChevronLeftIcon width={18} height={18} /> Torna al percorso
          </Link>
          <div className="grid gap-1.5 border-b border-border pb-6">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">{lessonId}</p>
            <h2 className="font-display text-2xl font-bold leading-tight">{title}</h2>
          </div>
          <nav aria-label="Schermate della lezione">
            <ol className="grid">
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
                      className={`relative flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left text-sm ${
                        current ? "bg-surface-muted font-semibold" : "hover:bg-surface-muted disabled:hover:bg-transparent"
                      } ${ok ? "" : "text-muted opacity-70"}`}
                    >
                      {current && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />}
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded font-mono text-xs ${
                          seen && !current ? "bg-success text-success-fg" : current ? "bg-primary text-primary-fg" : "border border-border"
                        }`}
                      >
                        {seen && !current ? <CheckIcon width={13} height={13} /> : ok ? pad(i + 1) : <LockIcon width={11} height={11} />}
                      </span>
                      <span className="min-w-0 truncate">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <Link href={`/dojo?lezione=${lessonId}`} className="btn btn-ghost mt-auto min-h-11 text-sm">
            Chiedi al Sensei su questa lezione
          </Link>
          <p className="text-xs text-muted">Frecce ← → della tastiera per muoverti tra le schermate.</p>
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-col lg:h-dvh lg:min-h-0">
          {/* Telefono: uscita e avanzamento a segmenti */}
          <header className="sticky top-0 z-20 grid gap-2 border-b border-border bg-background/95 px-4 pb-3 pt-[calc(0.5rem+env(safe-area-inset-top))] backdrop-blur lg:hidden">
            <div className="flex items-center gap-2">
              <Link href="/percorso" aria-label="Esci dalla lezione" className="-ml-2 grid size-11 shrink-0 place-items-center rounded-md">
                <CloseIcon width={24} height={24} />
              </Link>
              <div
                role="progressbar"
                aria-label="Avanzamento nella lezione"
                aria-valuemin={1}
                aria-valuemax={screens.length}
                aria-valuenow={index + 1}
                className="flex flex-1 gap-1"
              >
                {screens.map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-primary" : i <= reached ? "bg-primary/40" : "bg-surface-muted"}`} />
                ))}
              </div>
              <p className="w-12 shrink-0 text-right font-mono text-xs text-muted">
                {index + 1}/{screens.length}
              </p>
              <ThemeToggle />
            </div>
            <p className="truncate font-mono text-xs uppercase tracking-widest text-muted">
              {lessonId} · {title}
            </p>
            <Link href={`/dojo?lezione=${lessonId}`} className="flex min-h-11 w-fit items-center text-sm font-semibold text-primary underline underline-offset-2">
              Chiedi al Sensei su questa lezione
            </Link>
          </header>

          {/* PC: barra sobria con percorso e avanzamento */}
          <div className="hidden items-center gap-6 border-b border-border px-14 py-4 lg:flex">
            <p className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted">
              {lessonId} · schermata {pad(index + 1)} di {pad(screens.length)}
            </p>
            <div
              role="progressbar"
              aria-label="Avanzamento nella lezione"
              aria-valuemin={1}
              aria-valuemax={screens.length}
              aria-valuenow={index + 1}
              className="h-1 flex-1 overflow-hidden rounded-full bg-surface-muted"
            >
              <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <p className="font-mono text-xs text-muted">{pct}%</p>
            <ThemeToggle />
          </div>

          <main
            ref={mainRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex-1 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 lg:overflow-y-auto lg:px-14 lg:pb-12 lg:pt-10 2xl:px-20"
          >
            <article className="mx-auto w-full max-w-2xl rounded-lg border border-border bg-surface p-5 sm:p-8 lg:mx-0 lg:max-w-[84rem] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-[1.0625rem]">
              {done ? (
                <div className="rise grid justify-items-center gap-4 py-10 text-center">
                  <PageArt art="senseiCelebra" size={160} inline priority />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Lezione finita</p>
                  <h1 className="font-display text-4xl font-bold lg:text-5xl">Ottimo lavoro!</h1>
                  <p className="max-w-md text-muted">
                    Hai finito «{title}». Il Sensei è soddisfatto, per oggi. Torna al percorso per la prossima.
                  </p>
                  <AskPush />
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/percorso" className="btn btn-primary min-h-14 min-w-56 text-base">
                      Avanti con il percorso
                    </Link>
                    <button type="button" onClick={() => setDone(false)} className="btn btn-ghost min-h-14">
                      Rivedi la lezione
                    </button>
                  </div>
                </div>
              ) : null}
              <div hidden={done} className="mb-6 flex items-center gap-4 lg:mb-8">
                <Mascot size={64} mood={screen.gated ? "stern" : MOODS[index % MOODS.length]} className="shrink-0 max-sm:size-12" />
                <div className="min-w-0">
                  <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    Schermata {pad(index + 1)} di {pad(screens.length)}
                  </p>
                  <h1 className="font-display text-3xl font-bold lg:max-w-4xl lg:text-5xl">{screen.title}</h1>
                </div>
              </div>
              {/* Tutte le schermate restano montate: la verifica non perde lo stato se si torna indietro. */}
              {screens.map((s, i) => (
                <section key={i} hidden={done || i !== index} aria-hidden={done || i !== index} className={i === index ? "rise" : ""} style={{ "--d": "0s" } as React.CSSProperties}>
                  {s.node}
                </section>
              ))}
            </article>
          </main>

          {/* Telefono: Continua fisso in basso */}
          <nav
            aria-label="Muoviti nella lezione"
            className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
          >
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Schermata precedente"
              className="btn btn-ghost size-14 shrink-0 !p-0"
            >
              <ChevronLeftIcon width={24} height={24} />
            </button>
            {done ? (
              <Link href="/percorso" className="btn btn-primary min-h-14 flex-1 text-base">
                Avanti con il percorso
              </Link>
            ) : last ? (
              <button type="button" onClick={() => {
                setDone(true);
                haptic("complete");
              }} className="btn btn-primary min-h-14 flex-1 text-base">
                Completa la lezione
              </button>
            ) : (
              <button type="button" onClick={() => go(index + 1)} disabled={blocked} className="btn btn-primary min-h-14 flex-1 text-base">
                {blocked ? "Prima la verifica" : "Continua"}
              </button>
            )}
          </nav>

          {/* PC: barra in basso */}
          <nav aria-label="Muoviti nella lezione" className="hidden items-center justify-between gap-3 border-t border-border bg-surface px-14 py-4 lg:flex">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn btn-ghost gap-2">
              <span className="inline-flex items-center gap-2">
                <ChevronLeftIcon width={18} height={18} /> Indietro
              </span>
            </button>
            {done ? (
              <Link href="/percorso" className="btn btn-primary min-w-48">
                Avanti con il percorso
              </Link>
            ) : last ? (
              <button type="button" onClick={() => {
                setDone(true);
                haptic("complete");
              }} className="btn btn-primary min-w-48">
                Completa la lezione
              </button>
            ) : (
              <button type="button" onClick={() => go(index + 1)} disabled={blocked} className="btn btn-primary min-w-48">
                <span className="inline-flex items-center gap-2">
                  {blocked ? "Prima la verifica" : "Avanti"} {!blocked && <ChevronRightIcon width={18} height={18} />}
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>
      <LessonNotes lessonId={lessonId} />
      <LessonBookmark lessonId={lessonId} screen={index} />
    </PlayerContext.Provider>
  );
}
