"use client";

import { useConsent } from "./consent-provider";

/** Pulsante che riapre il banner dei cookie: serve a cambiare idea in qualsiasi momento. */
export function ConsentButton({ className = "" }: { className?: string }) {
  const { ask } = useConsent();
  return (
    <button type="button" onClick={ask} className={`w-fit hover:underline ${className}`}>
      Preferenze cookie
    </button>
  );
}
