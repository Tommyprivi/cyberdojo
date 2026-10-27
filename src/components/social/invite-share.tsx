"use client";

import { useState, useSyncExternalStore } from "react";
import { inviteUrl, whatsappInviteText, whatsappShareUrl } from "@/lib/social/invite";

const noop = () => () => {};

/**
 * Invito per WhatsApp: un solo link per persona (`/invito/<codice>`). Nel messaggio c'è solo il soprannome,
 * e solo se la persona ha scelto di mostrarlo agli amici (`nickname` arriva già null altrimenti).
 */
export function InviteShare({ code, nickname }: { code: string; nickname: string | null }) {
  // Solo nel browser: l'indirizzo del sito non si conosce prima (sul server resta null e non si disegna nulla).
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => null);
  const canShare = useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);
  const [status, setStatus] = useState("");

  if (!origin) return null;
  const link = inviteUrl(origin, code);
  const text = whatsappInviteText(link, nickname);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setStatus("Link copiato: ora puoi incollarlo dove vuoi.");
    } catch {
      setStatus("Non riesco a copiare da solo: tieni premuto sul link qui sopra e copialo.");
    }
  }

  async function share() {
    try {
      await navigator.share({ title: "Invito su CyberDojo", text });
    } catch {
      /* chi chiude il foglio di condivisione non ha sbagliato nulla */
    }
  }

  return (
    <div className="grid gap-2">
      <a href={whatsappShareUrl(text)} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-12 w-full justify-center">
        Invita su WhatsApp
      </a>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost min-h-12 flex-1" onClick={copy}>
          Copia il link
        </button>
        {canShare && (
          <button type="button" className="btn btn-ghost min-h-12 flex-1" onClick={share}>
            Condividi
          </button>
        )}
      </div>
      <p className="break-all rounded-md border border-border bg-background px-3 py-2 font-mono text-xs" aria-label="Il tuo link di invito">
        {link}
      </p>
      <p role="status" aria-live="polite" className="min-h-5 text-sm font-semibold text-success">
        {status}
      </p>
      <p className="text-xs text-muted">Nel messaggio non c&apos;è il tuo nome né la tua email{nickname ? ": solo il tuo soprannome" : ""}. Chi apre il link deve avere un account e la tua stessa fascia d&apos;età.</p>
    </div>
  );
}
