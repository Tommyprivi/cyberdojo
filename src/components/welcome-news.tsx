"use client";

import { useEffect, useState } from "react";
import { markNewsSeen, readNewsSeen } from "@/app/actions/community";
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
    let cancelled = false;
    let timer: number | undefined;
    (async () => {
      let local: string | null = null;
      let localOk = true;
      try {
        local = localStorage.getItem(NEWS_SEEN_KEY);
      } catch {
        localOk = false;
      }
      if (local === version) return;
      // La memoria dell'account vale su tutti i dispositivi; senza sessione resta solo il browser.
      let server: { signedIn: boolean; version: string | null } = { signedIn: false, version: null };
      try {
        server = await readNewsSeen();
      } catch {
        /* rete assente: si usa il browser */
      }
      if (cancelled) return;
      if (server.version === version) {
        try {
          localStorage.setItem(NEWS_SEEN_KEY, version);
        } catch {
          /* niente */
        }
        return;
      }
      // Senza account e senza memoria nel browser la festa partirebbe a ogni visita: meglio saltarla.
      if (!server.signedIn && !localOk) return;
      // Un attimo dopo il caricamento, così la pagina è già a posto quando parte.
      // Una finestra alla volta: se è aperto il tutorial di benvenuto, la festa aspetta che si chiuda.
      const show = () => {
        if (cancelled) return;
        if (document.querySelector('[data-overlay="tutorial"]')) {
          timer = window.setTimeout(show, 800);
          return;
        }
        try {
          localStorage.setItem(NEWS_SEEN_KEY, version);
        } catch {
          /* già gestito sopra */
        }
        if (server.signedIn) void markNewsSeen(version).catch(() => {});
        setOpen(true);
        playSound("celebrate");
      };
      timer = window.setTimeout(show, 700);
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [version, countdownEndsAt]);

  return open ? <NewsCelebration big onClose={() => setOpen(false)} /> : null;
}
