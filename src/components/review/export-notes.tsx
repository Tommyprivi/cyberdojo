"use client";

import { useRef, useState } from "react";

/** «Esporta le mie note»: tutte le note in un riquadro copiabile da incollare in chat. */
export function ExportNotes({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      area.current?.select(); // se il browser non lascia copiare, resta selezionato: basta Ctrl+C
    }
  };

  return (
    <section id="note" aria-labelledby="note-h" className="dossier grid gap-3 p-5">
      <h2 id="note-h" className="font-display text-2xl font-semibold">Esporta le mie note</h2>
      <p className="text-muted">Raccoglie tutte le note (lezioni, email, schermate) in un unico testo. Copialo e incollalo in chat.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Nascondi le note" : "Mostra le mie note"}
        </button>
        {open && (
          <button type="button" className="btn btn-ghost" onClick={copy}>
            {copied ? "Copiato!" : "Copia tutto"}
          </button>
        )}
      </div>
      {open && (
        <>
          <label htmlFor="note-testo" className="sr-only">Le tue note</label>
          <textarea
            id="note-testo"
            ref={area}
            readOnly
            value={text}
            rows={Math.min(24, Math.max(6, text.split("\n").length + 1))}
            onFocus={(e) => e.currentTarget.select()}
            className="rounded-lg border border-muted bg-surface p-3 font-mono text-sm"
          />
        </>
      )}
    </section>
  );
}
