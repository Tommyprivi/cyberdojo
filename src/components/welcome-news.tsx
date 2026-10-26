"use client";

import { useEffect, useState } from "react";
import { playSound } from "@/lib/sounds";
import { NEWS_SEEN_KEY, NewsCelebration } from "./news-celebration";

/**
 * Grande animazione di benvenuto con le novità, quando si entra nell'app e c'è un aggiornamento nuovo.
 * Compare una sola volta per novità (lo ricorda il browser). Non compare nelle lezioni.
 * Se il conto alla rovescia dell'aggiornamento sta ancora scorrendo aspetta: la festa parte a fine conteggio.
 */
export function WelcomeNews({ version, countdownEndsAt }: { version: string; countdownEndsAt: number | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!version) return;
    if (countdownEndsAt !== null && Date.now() < countdownEndsAt) return;
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(NEWS_SEEN_KEY);
    } catch {
      /* senza memoria nel browser la festa parte a ogni visita: meglio saltarla */
      return;
    }
    if (seen === version) return;
    // Un attimo dopo il caricamento, così la pagina è già a posto quando parte.
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(NEWS_SEEN_KEY, version);
      } catch {
        /* già gestito sopra */
      }
      setOpen(true);
      playSound("celebrate");
    }, 700);
    return () => window.clearTimeout(id);
  }, [version, countdownEndsAt]);

  return open ? <NewsCelebration big onClose={() => setOpen(false)} /> : null;
}
