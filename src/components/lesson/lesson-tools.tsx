"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLessonBookmark } from "./bookmark";
import { LessonCalculator } from "./lesson-calculator";
import { ListenLesson } from "./listen-lesson";
import { LessonNotes } from "./notes";

/**
 * Un solo bottone «Strumenti» in basso a destra (non quattro bottoni sparsi che coprono la lezione).
 * Apre un piccolo menu: Calcolatrice (dove serve), Appunti, Ascolta la lezione, Segnalibro.
 */
export function LessonTools({
  lessonId,
  title,
  screen,
  calculator,
  listen,
}: {
  lessonId: string;
  title: string;
  /** Schermata che stai leggendo (serve al segnalibro). */
  screen: number;
  calculator: boolean;
  listen?: string[][];
}) {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState<"calc" | "notes" | null>(null);
  const [listenRequest, setListenRequest] = useState(0);
  const [listenOk, setListenOk] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const bookmark = useLessonBookmark(lessonId, screen);
  const onAvailable = useCallback((ok: boolean) => setListenOk(ok), []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        opener.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const choose = (action: () => void) => {
    setMenu(false);
    action();
  };

  const item = "flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold hover:bg-surface-muted";

  return (
    <>
      <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-3 z-40 grid justify-items-end gap-2 lg:bottom-24 lg:right-6">
        {menu ? (
          <>
            {/* Tocca fuori per chiudere */}
            <button type="button" aria-label="Chiudi il menu" tabIndex={-1} onClick={() => setMenu(false)} className="fixed inset-0 -z-10 cursor-default" />
            <ul role="menu" aria-label="Strumenti della lezione" className="grid w-56 gap-0.5 rounded-xl border border-border bg-surface p-1.5 shadow-lg">
              {calculator ? (
                <li role="none">
                  <button type="button" role="menuitem" className={item} onClick={() => choose(() => setPanel("calc"))}>
                    <span aria-hidden>🧮</span> Calcolatrice
                  </button>
                </li>
              ) : null}
              <li role="none">
                <button type="button" role="menuitem" className={item} onClick={() => choose(() => setPanel("notes"))}>
                  <span aria-hidden>📝</span> Appunti
                </button>
              </li>
              {listenOk ? (
                <li role="none">
                  <button type="button" role="menuitem" className={item} onClick={() => choose(() => setListenRequest((n) => n + 1))}>
                    <span aria-hidden>🎧</span> Ascolta la lezione
                  </button>
                </li>
              ) : null}
              <li role="none">
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={bookmark.on}
                  disabled={bookmark.busy}
                  className={item}
                  onClick={() => void bookmark.toggle()}
                >
                  <span aria-hidden>🔖</span> {bookmark.on ? "Segnalibro messo" : "Metti un segnalibro"}
                </button>
              </li>
              {bookmark.message ? (
                <li role="status" className="px-3 pb-2 text-xs text-muted">
                  {bookmark.message}
                </li>
              ) : null}
            </ul>
          </>
        ) : null}
        <button
          ref={opener}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
          className="grid size-12 place-items-center rounded-full border border-border bg-surface text-xl shadow-md"
          title="Strumenti"
        >
          <span aria-hidden>{menu ? "✕" : "🧰"}</span>
          <span className="sr-only">Strumenti della lezione</span>
        </button>
      </div>

      {calculator ? <LessonCalculator open={panel === "calc"} onOpenChange={(o) => setPanel(o ? "calc" : null)} hideTrigger /> : null}
      <LessonNotes lessonId={lessonId} open={panel === "notes"} onOpenChange={(o) => setPanel(o ? "notes" : null)} hideTrigger />
      {listen ? <ListenLesson lessonId={lessonId} title={title} screens={listen} hideTrigger openRequest={listenRequest} onAvailable={onAvailable} /> : null}
    </>
  );
}
