"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * La notizia del momento: appare in cima al percorso finché non la chiudi.
 * "Chiusa" vuol dire "per ora", non "per sempre": il giorno dopo la si riapre.
 */
export function NewsCard({ id, title, summary }: { id: string; title: string; summary: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(window.localStorage.getItem(`cyberdojo-news-${id}`) === "1");
  }, [id]);

  if (hidden) return null;

  const close = () => {
    window.localStorage.setItem(`cyberdojo-news-${id}`, "1");
    setHidden(true);
  };

  return (
    <aside
      aria-label="Novità"
      className="rise grid gap-3 rounded-lg border-2 border-accent/40 bg-surface p-5 sm:p-6 lg:col-start-1"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Novità</p>
        <button
          type="button"
          onClick={close}
          aria-label="Chiudi la notizia"
          className="-m-2 grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>
      </div>
      <h2 className="font-display text-xl font-bold leading-snug">{title}</h2>
      <p className="text-sm text-muted">{summary}</p>
      <p>
        <Link href="/aggiornamenti" className="font-semibold text-primary underline">
          Leggi l&apos;aggiornamento
        </Link>
      </p>
    </aside>
  );
}
