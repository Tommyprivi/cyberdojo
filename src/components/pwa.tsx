"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Registra il service worker (solo online su https, mai in sviluppo). Non mostra niente. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* senza service worker il sito funziona uguale: manca solo la pagina offline */
    });
  }, []);
  return null;
}

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const standaloneQuery = "(display-mode: standalone)";
const subscribeStandalone = (cb: () => void) => {
  const mq = window.matchMedia(standaloneQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const isStandalone = () => window.matchMedia(standaloneQuery).matches;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * «Installa l'app»: usa l'invito del browser (Android, PC). Su iPhone non esiste: mostra come fare da Condividi.
 * Se l'app è già installata non mostra niente.
 */
export function InstallApp() {
  const installed = useSyncExternalStore(subscribeStandalone, isStandalone, () => true);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const ios = useSyncExternalStore(
    () => () => {},
    isIos,
    () => false,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed || (!prompt && !ios)) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3">
      <p>
        <span className="block font-semibold">Installa l&apos;app</span>
        <span className="block text-sm text-muted">
          {prompt ? "CyberDojo sulla schermata home, come un'app." : "Su iPhone: tocca Condividi, poi «Aggiungi a Home»."}
        </span>
      </p>
      {prompt ? (
        <button
          type="button"
          className="btn btn-primary min-h-11 px-4"
          onClick={async () => {
            await prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
          }}
        >
          Installa
        </button>
      ) : null}
    </div>
  );
}
