"use client";

import { useRef, useState } from "react";
import { MAX_CODE_CHARS } from "@/lib/ai/code-review";

/** «Chiedi al Sensei di rivedere il codice»: spiega l'errore e dà un indizio, senza la soluzione. */
export function SenseiReview({ code, errorText }: { code: string; errorText: string }) {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  const tooLong = code.length > MAX_CODE_CHARS;

  async function ask() {
    if (loading || tooLong || !code.trim()) return;
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    const timer = setTimeout(() => c.abort(), 25_000);
    setLoading(true);
    setError(null);
    setReply(null);
    try {
      const res = await fetch("/api/dojo/codice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, ...(errorText.trim() ? { error: errorText.slice(-1500) } : {}) }),
        signal: c.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) setError(data.error ?? "Qualcosa è andato storto. Riprova.");
      else setReply(data.reply);
    } catch {
      setError("Il Sensei ci mette troppo o non c'è connessione. Riprova.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2 border-t border-border bg-surface-muted px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={ask} disabled={loading || tooLong || !code.trim()} className="btn btn-ghost min-h-11 px-3 text-sm">
          {loading ? "Il Sensei sta leggendo…" : "Chiedi al Sensei di rivedere il codice"}
        </button>
        {tooLong && <span className="text-xs text-accent">Codice troppo lungo (massimo {MAX_CODE_CHARS} caratteri).</span>}
      </div>
      <p className="text-xs leading-snug text-muted">
        Il codice (e l&apos;errore) va a un servizio esterno: non scrivere dati personali. Il Sensei spiega e dà un indizio, non la soluzione.
      </p>
      <div role="status" aria-live="polite">
        {error && <p className="text-sm font-semibold text-accent">{error}</p>}
        {reply && (
          <p className="whitespace-pre-wrap rounded-md border border-border bg-surface p-3 text-sm leading-relaxed">
            <strong>Sensei: </strong>
            {reply}
          </p>
        )}
      </div>
    </div>
  );
}
