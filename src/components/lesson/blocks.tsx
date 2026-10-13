import type { ReactNode } from "react";

export function Scene({ children }: { title?: string; children: ReactNode }) {
  // Il titolo serve al player (barra di avanzamento); qui si mostra solo il contenuto.
  return <div className="grid gap-4">{children}</div>;
}

const VOICES = {
  sensei: { label: "Sensei", style: "border-l-4 border-belt-black bg-surface-muted" },
  assistente: { label: "Assistente", style: "border-l-4 border-accent bg-surface" },
} as const;

/** Testo delle due voci. Resta sempre visibile come trascrizione; l'audio si aggancia con la pipeline TTS (E6). */
export function Say({ who, children }: { who: keyof typeof VOICES; children: ReactNode }) {
  const v = VOICES[who];
  return (
    <aside className={`my-4 rounded-lg border border-border p-3 ${v.style}`} aria-label={`Parla ${v.label}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{v.label}</p>
      <p className="mt-1">{children}</p>
    </aside>
  );
}

export function Recap({ xp, children }: { xp: number; children: ReactNode }) {
  return (
    <section className="my-4 rounded-xl border border-border bg-surface p-4">
      <h3 className="text-lg font-semibold">Cosa porti a casa</h3>
      <div className="mt-2">{children}</div>
      <p className="mt-4 font-semibold text-accent">+{xp} XP quando completi la lezione</p>
    </section>
  );
}
