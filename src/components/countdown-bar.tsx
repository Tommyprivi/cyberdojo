"use client";

import { useEffect, useState } from "react";
import { countdownState, formatRemaining } from "@/lib/countdown";

/**
 * Barretta sottile con il conto alla rovescia dell'aggiornamento. Non interrompe nessuno:
 * niente finestre, niente suoni, niente ricarica automatica, il lettore di schermo non la rilegge a ogni secondo.
 * Scaduto il tempo invita a ricaricare la pagina quando si ha finito.
 */
export function CountdownBar({ endsAt, label }: { endsAt: number; label: string }) {
  // Prima del montaggio non si conosce l'ora del browser: si evita così una differenza tra server e browser.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;
  const state = countdownState(endsAt, now);
  if (state === "hidden") return null;

  return (
    <div role="timer" aria-live="off" className="border-b border-border bg-sun text-sun-fg">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 px-4 py-1.5 text-sm font-semibold">
        {state === "running" ? (
          <>
            <span aria-hidden>⏳</span>
            <span>Aggiornamento{label ? `: ${label}` : ""} tra</span>
            <span className="font-mono font-extrabold tabular-nums">{formatRemaining(endsAt - now)}</span>
            <span className="font-normal">· puoi continuare a studiare, non cambia niente mentre lo fai.</span>
          </>
        ) : (
          <>
            <span aria-hidden>✨</span>
            <span>L&apos;aggiornamento{label ? ` (${label})` : ""} è arrivato. Ricarica la pagina quando hai finito la lezione.</span>
          </>
        )}
      </p>
    </div>
  );
}
