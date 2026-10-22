"use client";

import { useState } from "react";
import { CONTACT_KINDS, sendContactMessage } from "@/app/actions/contact";

/**
 * Modulo di contatto: serve per le domande, per segnalare un bug, per un problema di
 * accessibilità e per le richieste sui dati. Chi non ha un account può scrivere lo stesso.
 */
export function ContactForm({ defaultKind = "domanda" }: { defaultKind?: (typeof CONTACT_KINDS)[number]["id"] }) {
  const [kind, setKind] = useState<string>(defaultKind);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", where: "", trap: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await sendContactMessage({ ...form, kind });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "", where: "", trap: "" });
  };

  if (sent) {
    return (
      <div className="dossier grid gap-3 p-6">
        <h2 className="font-display text-xl font-bold">Messaggio inviato.</h2>
        <p className="text-muted">
          Grazie: è partito. Rispondiamo in italiano entro qualche giorno. Se è una richiesta sui tuoi
          dati, ricorda che puoi anche scaricarli o cancellare l&apos;account direttamente dal profilo,
          senza aspettare nessuna risposta.
        </p>
        <button type="button" className="btn btn-ghost w-fit" onClick={() => setSent(false)}>
          Scrivi un altro messaggio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="dossier grid gap-4 p-6">
      <div className="grid gap-1.5">
        <label htmlFor="contact-kind" className="font-semibold">
          Che cosa vuoi segnalare
        </label>
        <select
          id="contact-kind"
          className="field"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          {CONTACT_KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-semibold">Come ti chiami (facoltativo)</span>
          <input className="field" autoComplete="name" maxLength={80} value={form.name} onChange={set("name")} />
        </label>
        <label className="grid gap-1.5">
          <span className="font-semibold">La tua email</span>
          <input className="field" type="email" autoComplete="email" required maxLength={160} value={form.email} onChange={set("email")} />
          <span className="text-sm text-muted">Serve solo per risponderti.</span>
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="font-semibold">Oggetto</span>
        <input className="field" required minLength={3} maxLength={140} value={form.subject} onChange={set("subject")} />
      </label>

      <label className="grid gap-1.5">
        <span className="font-semibold">Messaggio</span>
        <textarea
          className="field min-h-40 py-2"
          required
          minLength={10}
          maxLength={4000}
          value={form.message}
          onChange={set("message")}
        />
        <span className="text-sm text-muted">
          Più dettagli ci dai, prima sistemiamo: per un bug, la lezione o la pagina e cosa hai visto.
        </span>
      </label>

      <label className="grid gap-1.5">
        <span className="font-semibold">Dove l&apos;hai visto (facoltativo)</span>
        <input
          className="field"
          maxLength={200}
          placeholder="Esempio: lezione C.13.002, il pulsante «Ascolta»"
          value={form.where}
          onChange={set("where")}
        />
      </label>

      {/* trappola per i robot: invisibile agli umani, compilata solo da chi non lo è */}
      <div className="hidden" aria-hidden="true">
        <label>
          Non compilare
          <input tabIndex={-1} autoComplete="off" value={form.trap} onChange={set("trap")} />
        </label>
      </div>

      {error && (
        <p role="alert" className="font-semibold text-accent">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-fit">
        {busy ? "Invio…" : "Invia"}
      </button>
    </form>
  );
}
