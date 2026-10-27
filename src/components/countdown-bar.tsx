"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { countdownState, formatRemaining } from "@/lib/countdown-format";
import { playSound } from "@/lib/sounds";
import { NEWS_SEEN_KEY, NewsCelebration } from "./news-celebration";

const KEY = "countdown-dismissed";
const CELEBRATED_KEY = "countdown-celebrated";

function readDismissed(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Conto alla rovescia dell'aggiornamento. Non interrompe nessuno: niente finestre, niente suoni,
 * niente ricarica automatica, il lettore di schermo non lo rilegge a ogni secondo.
 * - «bar»: barretta in alto nelle pagine dell'app;
 * - «floating»: pastiglia fissa in basso dentro le lezioni, piccola e fuori dal testo.
 * Si può chiudere: la scelta vale per questo aggiornamento, in tutto il sito (nel browser).
 * Scaduto il tempo invita a ricaricare la pagina quando si ha finito.
 */
export function CountdownBar({
  endsAt,
  label,
  variant = "bar",
  newsVersion = "",
  maintenance = false,
}: {
  endsAt: number;
  label: string;
  variant?: "bar" | "floating";
  /** Allo scadere il sito va in manutenzione: il testo lo dice, invece di invitare a ricaricare. */
  maintenance?: boolean;
  /** Id dell'ultima novità: segnata come vista quando parte la festa, così all'ingresso successivo non si ripete. */
  newsVersion?: string;
}) {
  // Prima del montaggio non si conosce l'ora del browser: si evita così una differenza tra server e browser.
  const [now, setNow] = useState<number | null>(null);
  const dismissedFor = useSyncExternalStore(
    () => () => {},
    readDismissed,
    () => String(endsAt), // sul server resta nascosto fino al montaggio
  );
  const [closed, setClosed] = useState(false);
  const [party, setParty] = useState(false);
  // Era ancora «in corso» quando la pagina era aperta? Solo allora, scaduto il tempo, c'è la festa.
  const wasRunning = useRef(false);

  useEffect(() => {
    const tick = () => {
      const n = Date.now();
      setNow(n);
      if (n < endsAt) {
        wasRunning.current = true;
      } else if (wasRunning.current) {
        wasRunning.current = false;
        let seen = false;
        try {
          seen = localStorage.getItem(CELEBRATED_KEY) === String(endsAt);
          localStorage.setItem(CELEBRATED_KEY, String(endsAt));
          if (newsVersion) localStorage.setItem(NEWS_SEEN_KEY, newsVersion);
        } catch {
          /* senza memoria nel browser la festa parte una volta per visita */
        }
        if (!seen) {
          setParty(true);
          playSound("celebrate");
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt, newsVersion]);

  if (now === null) return null;
  const celebration = party ? <NewsCelebration onClose={() => setParty(false)} /> : null;
  if (closed || dismissedFor === String(endsAt)) return celebration;
  const state = countdownState(endsAt, now);
  if (state === "hidden") return celebration;

  const close = () => {
    try {
      localStorage.setItem(KEY, String(endsAt));
    } catch {
      /* il browser non permette di salvare: si chiude solo per questa visita */
    }
    setClosed(true);
  };

  const closeButton = (
    <button type="button" onClick={close} aria-label="Nascondi il conto alla rovescia" className="ml-1 grid size-8 shrink-0 place-items-center rounded-full font-bold hover:bg-black/10">
      <span aria-hidden>×</span>
    </button>
  );

  const content =
    state === "running" ? (
      <>
        <span aria-hidden>⏳</span>
        <span>
          {maintenance ? (
            "Sito in manutenzione, riapriamo tra"
          ) : (
            <>
              Aggiornamento<span className="hidden sm:inline">{label ? `: ${label}` : ""}</span> tra
            </>
          )}
        </span>
        <span className="font-mono font-extrabold tabular-nums">{formatRemaining(endsAt - now)}</span>
        {variant === "bar" ? (
          <>
            <span className="hidden font-normal sm:inline">{maintenance ? "· continua il tuo corso." : "· puoi continuare a studiare."}</span>
            <Link href="/aggiornamenti" className="hidden font-bold underline sm:inline">
              Scopri di più
            </Link>
          </>
        ) : null}
      </>
    ) : (
      <>
        <span aria-hidden>✨</span>
        <span>
          {maintenance
            ? "Il sito è di nuovo aperto! Ricarica la pagina a fine lezione."
            : `L'aggiornamento${label ? ` (${label})` : ""} è arrivato. ${variant === "bar" ? "Ricarica la pagina quando hai finito la lezione." : "Ricarica a fine lezione."}`}
        </span>
      </>
    );

  if (variant === "floating") {
    return (
      <>
        {celebration}
      <div
        role="timer"
        aria-live="off"
        className="pointer-events-auto fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-sun-fg/20 bg-sun px-3 py-1 text-xs font-semibold text-sun-fg shadow-lg lg:bottom-24 lg:left-auto lg:right-6 lg:translate-x-0"
      >
        {content}
        {closeButton}
      </div>
      </>
    );
  }

  return (
    <>
      {celebration}
      <div role="timer" aria-live="off" className="border-b border-border bg-sun text-sun-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-2 px-4 py-1.5 text-sm font-semibold">
          <p className="flex flex-wrap items-center justify-center gap-x-2">{content}</p>
          {closeButton}
        </div>
      </div>
    </>
  );
}
