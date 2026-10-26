"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

/** Versione del banner: cambiala quando c'è un nuovo aggiornamento, così tutti lo rivedono una volta. */
const VERSION = "2026-10-26";
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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 text-sm">
        <p className="flex-1">
          <strong>Novità:</strong> nuova grafica più semplice anche da telefono, <strong>piano di studio consigliato</strong> in base al tuo obiettivo, lezioni con schemi illustrati, cinture per livello. In arrivo: app Android e calcolatrice integrata.
        </p>
        <Link href="/aggiornamenti" className="font-bold underline">
          Scopri di più
        </Link>
        <button
          type="button"
          className="font-bold underline"
          onClick={() => {
            try {
              localStorage.setItem(KEY, VERSION);
            } catch {
              /* il browser non permette di salvare: il banner resta chiuso solo per questa visita */
            }
            setHidden(true);
          }}
        >
          Chiudi
        </button>
      </div>
    </aside>
  );
}
