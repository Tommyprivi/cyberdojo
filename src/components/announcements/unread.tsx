"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const KEY = "announcements-read";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

/** Segna l'ultimo annuncio come letto (lo ricorda il browser). Messo nella pagina degli annunci. */
export function MarkAnnouncementsRead({ latestId }: { latestId: string }) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, latestId);
      } catch {
        /* il pallino tornerà a ogni visita */
      }
      listeners.forEach((l) => l());
    }, 800);
    return () => window.clearTimeout(id);
  }, [latestId]);
  return null;
}

/** C'è un annuncio che questo browser non ha ancora aperto? Sul server si assume di no, per non mostrare un pallino sbagliato. */
function useHasUnread(latestId: string): boolean {
  const seen = useSyncExternalStore(subscribe, read, () => latestId);
  return Boolean(latestId) && seen !== latestId;
}

/** Voce «# annunci» con il pallino rosso se c'è qualcosa di nuovo. */
export function AnnouncementsLink({ latestId, variant = "row" }: { latestId: string; variant?: "row" | "card" }) {
  const unread = useHasUnread(latestId);
  const dot = unread ? <span aria-label="Nuovo annuncio" className="size-2.5 shrink-0 rounded-full bg-accent" /> : null;

  if (variant === "card") {
    return (
      <Link href="/annunci" className="nav-press flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-surface p-4 hover:bg-surface-muted">
        <span>
          <span className="block font-semibold"># annunci</span>
          <span className="block text-sm text-muted">Gli aggiornamenti di CyberDojo, come in una chat</span>
        </span>
        {dot ?? <span aria-hidden className="font-bold text-primary">→</span>}
      </Link>
    );
  }
  return (
    <Link href="/annunci" className="nav-press flex min-h-11 items-center justify-between gap-3 rounded-md px-3 font-semibold text-muted hover:bg-surface-muted hover:text-foreground">
      <span># annunci</span>
      {dot}
    </Link>
  );
}
