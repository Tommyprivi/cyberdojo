"use client";

import Link from "next/link";
import { useConsent } from "./consent-provider";

/**
 * Banner dei cookie. Il sito usa solo cookie tecnici: il permesso qui richiesto riguarda i
 * contenuti di terze parti (i video di YouTube), che si caricano solo dopo il clic.
 */
export function ConsentBanner() {
  const { choice, open, decide, close } = useConsent();
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="consent-banner fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-surface px-4 py-4 shadow-lg"
    >
      <div className="mx-auto grid max-w-3xl gap-3">
        <h2 id="cookie-banner-title" className="consent-title font-display text-lg font-bold">
          Due cookie tecnici, nient&apos;altro
        </h2>
        <p className="text-sm text-muted">
          Usiamo un solo cookie, quello che ti tiene collegato, e non usiamo cookie pubblicitari o di
          tracciamento. I video delle lezioni vengono da YouTube: per vederli dentro la pagina
          autorizzi i contenuti di terze parti, che potrebbero usare cookie propri. Senza questo permesso
          i video non si caricano, ma trovi sempre il link per aprirli su YouTube.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => decide("third-party")}>
            Accetta i video di YouTube
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => decide("essential")}>
            Solo i cookie necessari
          </button>
          <Link href="/cookie" className="text-sm font-semibold text-primary underline">
            Leggi la cookie policy
          </Link>
          {choice !== "unknown" ? (
            <button type="button" onClick={close} className="text-sm font-semibold text-muted underline">
              Chiudi
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
