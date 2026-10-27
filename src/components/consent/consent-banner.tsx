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
      className="consent-banner fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg sm:py-4"
    >
      <div className="mx-auto grid max-w-3xl gap-2 sm:gap-3">
        <h2 id="cookie-banner-title" className="consent-title font-display text-base font-bold sm:text-lg">
          Due cookie tecnici, nient&apos;altro
        </h2>
        <p className="text-xs text-muted sm:text-sm">
          Un solo cookie, quello che ti tiene collegato; nessuno pubblicitario o di tracciamento. I video
          vengono da YouTube: per vederli nella pagina autorizzi i contenuti di terze parti. Senza permesso
          trovi sempre il link per aprirli su YouTube.
        </p>
        <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <button type="button" className="btn btn-primary min-h-11 px-3 text-sm" onClick={() => decide("third-party")}>
            Accetto i video
          </button>
          <button type="button" className="btn btn-ghost min-h-11 px-3 text-sm" onClick={() => decide("essential")}>
            Solo necessari
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
