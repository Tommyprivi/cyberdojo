import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Area di lavoro a tutto schermo: barra compatta in alto (uscita, strumento, titolo, stato a destra)
 * e sotto uno spazio che riempie tutto il resto. Ogni strumento organizza da sé i suoi pannelli.
 */
export function Workspace({
  tool,
  title,
  right,
  children,
}: {
  tool: string;
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
        <Link
          href="/pratica"
          className="flex min-h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm font-semibold hover:bg-surface-muted"
        >
          <span aria-hidden>←</span> Esci
        </Link>
        <span aria-hidden className="h-5 w-px bg-border" />
        <p className="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-muted">{tool}</p>
        <h1 className="min-w-0 truncate font-display text-base font-semibold">{title}</h1>
        <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
