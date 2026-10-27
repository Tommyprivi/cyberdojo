"use client";

import { useEffect, useState } from "react";
import { lessonBookmarkScreens, toggleBookmark } from "@/app/actions/bookmarks";

/** Segnalibro discreto: segna o toglie la schermata che stai leggendo. Vedi tutti i segnalibri in /segnalibri. */
export function LessonBookmark({ lessonId, screen }: { lessonId: string; screen: number }) {
  const [saved, setSaved] = useState<ReadonlySet<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    lessonBookmarkScreens(lessonId)
      .then((s) => alive && setSaved(new Set(s)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [lessonId]);

  const on = saved.has(screen);
  const toggle = async () => {
    setBusy(true);
    setMessage("");
    try {
      const r = await toggleBookmark(lessonId, screen);
      if (r.ok) {
        setSaved((prev) => {
          const next = new Set(prev);
          if (r.saved) next.add(screen);
          else next.delete(screen);
          return next;
        });
      } else setMessage(r.error);
    } catch {
      setMessage("Serve la rete per usare i segnalibri.");
    }
    setBusy(false);
  };

  return (
    <div className="fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] right-3 z-40 grid justify-items-end gap-1 lg:bottom-36 lg:right-6">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={on}
        className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm font-semibold shadow-sm"
      >
        {on ? "Segnalibro messo" : "Segnalibro"}
      </button>
      {message ? (
        <p role="status" className="max-w-56 rounded-md border border-border bg-surface p-2 text-xs">
          {message}
        </p>
      ) : null}
    </div>
  );
}
