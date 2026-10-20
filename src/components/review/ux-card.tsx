"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveUxReview } from "@/app/(app)/revisione/actions";
import { MAX_NOTE, UX_CRITERIA, type ReviewEntry, type UxCriterion } from "@/lib/content/reviews";

type Props = {
  path: string;
  label: string;
  login: boolean;
  entry: Pick<ReviewEntry, "verdict" | "ratings" | "star" | "note">;
};

/** Cornice con una pagina viva della stessa origine, rimpicciolita per stare nello spazio. */
function Frame({ src, w, h, kind }: { src: string; w: number; h: number; kind: "PC" | "telefono" }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(kind === "PC" ? 0.5 : 0.4);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={box} className="w-full min-w-0">
      <div className="overflow-hidden rounded-md border border-border bg-white" style={{ width: w * scale, maxWidth: "100%", height: h * scale }}>
        <iframe
          title={`Anteprima ${kind}: ${src}`}
          src={src}
          loading="lazy"
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }}
        />
      </div>
    </div>
  );
}

/** Scheda di una schermata: anteprime PC e telefono, «Mi piace / Da cambiare», voti 1-5, nota. */
export function UxCard({ path, label, login, entry }: Props) {
  const [verdict, setVerdict] = useState(entry.verdict);
  const [ratings, setRatings] = useState(entry.ratings ?? {});
  const [star, setStar] = useState(!!entry.star);
  const [note, setNote] = useState(entry.note ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [show, setShow] = useState(false);

  const send = (patch: Record<string, unknown>, okText: string) =>
    start(async () => {
      const r = await saveUxReview({ path, ...patch });
      setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: r.error });
    });

  const setRating = (c: UxCriterion, n: number) => {
    setRatings((r) => ({ ...r, [c]: n }));
    send({ ratings: { [c]: n } }, "Voto salvato.");
  };

  return (
    <article className="dossier grid gap-4 p-4 sm:p-5" aria-labelledby={`ux-${path}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 id={`ux-${path}`} className="font-display text-2xl font-semibold">{label}</h3>
          <p className="font-mono text-xs text-muted">{path}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {login && <span className="chip text-accent">serve l&apos;accesso</span>}
          {verdict === "like" && <span className="chip font-bold text-success">Mi piace</span>}
          {verdict === "change" && <span className="chip font-bold text-accent">Da cambiare</span>}
          {star && <span className="chip">★ stella</span>}
        </div>
      </header>

      {login && (
        <p className="rounded-md border border-border bg-surface-muted p-3 text-sm">
          Questa schermata è privata. Se in questo browser non hai fatto l&apos;accesso, qui sotto vedrai la pagina di accesso, non la schermata vera:
          accedi in un&apos;altra scheda (poi ricarica) per vederla davvero.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-ghost" aria-expanded={show} onClick={() => setShow((s) => !s)}>
          {show ? "Nascondi le anteprime" : "Mostra le anteprime (PC e telefono)"}
        </button>
        <a href={path} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Apri a pagina intera</a>
      </div>

      {show && (
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
          <section aria-label="Su PC" className="grid gap-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Su PC · 1440 × 900</h4>
            <Frame src={path} w={1440} h={900} kind="PC" />
          </section>
          <section aria-label="Su telefono" className="grid gap-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Su telefono · 390 × 844</h4>
            <Frame src={path} w={390} h={844} kind="telefono" />
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Giudizio">
        <button
          type="button"
          aria-pressed={verdict === "like"}
          disabled={pending}
          className={`btn ${verdict === "like" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => {
            const v = verdict === "like" ? null : "like";
            setVerdict(v ?? undefined);
            send({ verdict: v }, v ? "Salvato: mi piace." : "Giudizio tolto.");
          }}
        >
          {verdict === "like" ? "✓ Mi piace" : "Mi piace"}
        </button>
        <button
          type="button"
          aria-pressed={verdict === "change"}
          disabled={pending}
          className={`btn ${verdict === "change" ? "bg-accent text-accent-fg" : "btn-ghost"}`}
          onClick={() => {
            const v = verdict === "change" ? null : "change";
            setVerdict(v ?? undefined);
            send({ verdict: v }, v ? "Salvato: da cambiare." : "Giudizio tolto.");
          }}
        >
          {verdict === "change" ? "✓ Da cambiare" : "Da cambiare"}
        </button>
        <button
          type="button"
          aria-pressed={star}
          disabled={pending}
          className={`btn ${star ? "btn-primary" : "btn-ghost"}`}
          onClick={() => {
            setStar(!star);
            send({ star: !star }, "Salvato.");
          }}
        >
          {star ? "★ Stella messa" : "☆ Metti una stella"}
        </button>
        <span role="status" className={`text-sm font-semibold ${msg?.ok === false ? "text-accent" : "text-success"}`}>
          {pending ? "Salvo…" : msg?.text}
        </span>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1 font-bold">Scheda di controllo (voto da 1 a 5)</legend>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {UX_CRITERIA.map((c) => (
            <div key={c.id} role="radiogroup" aria-label={c.label} className="grid gap-1 rounded-md border border-border bg-surface-muted p-2">
              <span className="text-sm font-semibold">{c.label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={ratings[c.id] === n}
                    aria-label={`${c.label}: ${n} su 5`}
                    disabled={pending}
                    onClick={() => setRating(c.id, n)}
                    className={`grid size-10 place-items-center rounded-md border font-mono font-bold ${
                      ratings[c.id] === n ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send({ note }, "Nota salvata.");
        }}
      >
        <label htmlFor={`cambio-${path}`} className="font-bold">Cosa cambiare</label>
        <textarea
          id={`cambio-${path}`}
          value={note}
          rows={3}
          maxLength={MAX_NOTE}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Scrivi cosa non va o cosa vorresti diverso."
          className="rounded-lg border border-muted bg-surface p-3"
        />
        <button type="submit" disabled={pending} className="btn btn-primary w-fit">Salva la nota</button>
      </form>
    </article>
  );
}
