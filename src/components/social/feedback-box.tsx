"use client";

import { useState } from "react";
import { sendFeedback } from "@/app/actions/feedback";
import { FEEDBACK_TYPES } from "@/lib/feedback";

/** Scheda «Lascia un feedback» in fondo alla Community: idee, problemi, complimenti. */
export function FeedbackBox() {
  const [type, setType] = useState<(typeof FEEDBACK_TYPES)[number]["id"]>("idea");
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await sendFeedback({ type, message, wantReply });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setSent(true);
    setMessage("");
  };

  if (sent) {
    return (
      <section aria-live="polite" className="dossier mt-6 grid gap-2 p-5">
        <h2 className="font-display text-xl font-bold">Grazie, è arrivato.</h2>
        <p className="text-muted">Leggiamo tutto. Le idee migliori finiscono negli aggiornamenti.</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost w-fit">
          Scrivine un altro
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="feedback-title" className="dossier mt-6 grid gap-4 p-5">
      <div>
        <h2 id="feedback-title" className="font-display text-xl font-bold">
          Lascia un feedback
        </h2>
        <p className="text-muted">Dicci cosa aggiungere, cosa non va o cosa ti è piaciuto. Basta una frase.</p>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Tipo di feedback</legend>
          {FEEDBACK_TYPES.map((t) => (
            <label key={t.id} className={`chip cursor-pointer ${type === t.id ? "border-primary bg-primary/10" : ""}`} title={t.hint}>
              <input type="radio" name="feedback-type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </fieldset>
        <label className="grid gap-1">
          <span className="font-semibold">Il tuo messaggio</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={2000}
            required
            className="field min-h-28 py-2"
            placeholder={FEEDBACK_TYPES.find((t) => t.id === type)?.hint}
          />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={wantReply} onChange={(e) => setWantReply(e.target.checked)} className="mt-1 size-4" />
          <span>Puoi rispondermi via email. Se non la spunti, il feedback resta anonimo.</span>
        </label>
        {error ? (
          <p role="alert" className="font-semibold text-accent">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy || message.trim().length < 10} className="btn btn-primary w-fit">
          {busy ? "Invio…" : "Invia il feedback"}
        </button>
      </form>
    </section>
  );
}
