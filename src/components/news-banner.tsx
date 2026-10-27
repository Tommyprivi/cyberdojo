"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

/** Versione del banner: cambiala quando c'è un nuovo aggiornamento, così tutti lo rivedono una volta. */
const VERSION = "2026-10-27";
const KEY = "news-banner-dismissed";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Banner «novità» chiudibile. Si ricorda la scelta nel browser (se il browser lo permette). */
export function NewsBanner() {
  const dismissedVersion = useSyncExternalStore(
    () => () => {},
    read,
    () => VERSION,
  );
  const [hidden, setHidden] = useState(false);
  if (hidden || dismissedVersion === VERSION) return null;

  return (
    <aside role="region" aria-label="Novità" className="border-b border-border bg-deep text-deep-fg">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-xs sm:gap-3 sm:py-2 sm:text-sm">
        {/* Da telefono una riga sola: il testo intero sta in /aggiornamenti. */}
        <p className="min-w-0 flex-1 truncate sm:whitespace-normal">
          <strong>Novità:</strong> CyberDojo 2.0 è qui! Sfida del giorno, negozio, leghe, duelli, laboratori di hacking e l&apos;<strong>app Android</strong> da scaricare.
        </p>
        <Link href="/aggiornamenti" className="shrink-0 font-bold underline">
          Scopri
        </Link>
        <button
          type="button"
          aria-label="Chiudi le novità"
          className="grid size-8 shrink-0 place-items-center rounded-full text-base font-bold hover:bg-white/10"
          onClick={() => {
            try {
              localStorage.setItem(KEY, VERSION);
            } catch {
              /* il browser non permette di salvare: il banner resta chiuso solo per questa visita */
            }
            setHidden(true);
          }}
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </aside>
  );
}
