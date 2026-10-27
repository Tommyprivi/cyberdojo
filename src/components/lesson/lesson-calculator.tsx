"use client";

import { useEffect, useRef, useState } from "react";
import { Calculator } from "@/components/practice/calculator";

/**
 * Calcolatrice dentro la lezione: pannello in basso sul telefono, a lato su PC. Si chiude con «Chiudi» o con Esc.
 * Di solito la apre il menu «Strumenti» (open/onOpenChange); da sola mostra un bottone proprio. Tutto resta nel browser.
 */
export function LessonCalculator({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setOpenState(v);
  };
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onOpenChange) onOpenChange(false);
        else setOpenState(false);
        opener.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <>
      {hideTrigger ? null : (
        <button
          ref={opener}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] left-3 z-40 min-h-11 rounded-full border border-border bg-surface px-4 text-sm font-semibold shadow-sm lg:bottom-36 lg:left-auto lg:right-40"
        >
          <span aria-hidden>🧮 </span>Calcolatrice
        </button>
      )}
      {open ? (
        <div
          ref={panel}
          role="dialog"
          aria-label="Calcolatrice"
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 z-50 grid max-h-[85dvh] gap-3 overflow-y-auto border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg outline-none lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[24rem] lg:rounded-lg lg:border"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">Calcolatrice</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                opener.current?.focus();
              }}
              className="min-h-11 px-3 text-sm font-semibold underline"
            >
              Chiudi
            </button>
          </div>
          <Calculator />
        </div>
      ) : null}
    </>
  );
}
