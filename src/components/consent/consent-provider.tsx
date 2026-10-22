"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Consenso ai contenuti di terze parti.
 *
 * CyberDojo usa solo cookie tecnici, quindi il banner non chiede il permesso per i cookie: chiede
 * il permesso per i video di YouTube, che altrimenti caricherebbero contenuti di terze parti.
 * La scelta vive nel localStorage del browser (nessun dato lascia il computer).
 */
export type ConsentChoice = "unknown" | "essential" | "third-party";

const STORAGE_KEY = "cyberdojo-consent";

type ConsentState = {
  choice: ConsentChoice;
  /** Vero solo se i contenuti di terze parti (i video) sono autorizzati. */
  thirdParty: boolean;
  /** Il banner è aperto e l'utente deve scegliere. */
  open: boolean;
  decide: (choice: Exclude<ConsentChoice, "unknown">) => void;
  ask: () => void;
  close: () => void;
};

const ConsentContext = createContext<ConsentState | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice>("unknown");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v === "essential" || v === "third-party") {
        setChoice(v);
        return;
      }
    } catch {
      // Browser con localStorage bloccato: si resta con i soli cookie necessari.
    }
    // Prima visita: il banner si apre da solo e spiega che cosa stiamo chiedendo.
    setOpen(true);
  }, []);

  const decide = useCallback((c: Exclude<ConsentChoice, "unknown">) => {
    setChoice(c);
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Se non si può salvare, la scelta vale per questa sessione.
    }
  }, []);

  const value = useMemo<ConsentState>(
    () => ({
      choice,
      thirdParty: choice === "third-party",
      open,
      decide,
      ask: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [choice, open, decide],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentState {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent va usato dentro <ConsentProvider>");
  return ctx;
}
