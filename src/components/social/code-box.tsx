"use client";

import { useState } from "react";

/** Codice invito in caratteri grandi, con «Copia». Il codice si condivide fuori dal sito, da persona a persona. */
export function CodeBox({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xl font-bold tracking-[0.15em]" aria-label={`${label}: ${code.split("").join(" ")}`}>
        {code}
      </p>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* se la copia non è permessa, il codice resta leggibile a schermo */
          }
        }}
      >
        {copied ? "Copiato" : "Copia"}
      </button>
    </div>
  );
}
