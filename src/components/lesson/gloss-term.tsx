"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { glossarySlug } from "@/lib/glossary/terms";

/**
 * Parola del glossario dentro una lezione: sottolineata a puntini; tocco o Invio aprono una piccola
 * finestra con la definizione breve. Esc o tocco fuori la chiudono. Su telefono è un pannello in basso.
 * La definizione è solo testo del glossario: nessun link a lezioni (regola «nessun salto»).
 */
export function GlossTerm({ term, def, children }: { term: string; def: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (trigger.current?.contains(t) || document.getElementById(id)?.contains(t)) return;
      close(false);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close, id]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help rounded-sm bg-transparent p-0 font-[inherit] text-inherit underline decoration-primary decoration-dotted decoration-2 underline-offset-4 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {children ?? term}
      </button>
      {open && (
        <span
          id={id}
          role="dialog"
          aria-label={`Che cos'è: ${term}`}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-md gap-2 rounded-t-xl border border-border bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-left text-base font-normal leading-relaxed text-foreground shadow-lg sm:bottom-6 sm:rounded-xl"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">Parola del glossario</span>
          <strong className="font-display text-xl">{term}</strong>
          <span>{def}</span>
          <span className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Link href={`/glossario#${glossarySlug(term)}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-2">
              Tutto il glossario
            </Link>
            <button
              ref={closeBtn}
              type="button"
              onClick={() => close(true)}
              className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold hover:bg-surface-muted"
            >
              Chiudi
            </button>
          </span>
        </span>
      )}
    </>
  );
}
