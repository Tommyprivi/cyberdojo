import Link from "next/link";
import { LEGAL_DOC_LIST, LEGAL_PAGES } from "@/lib/legal-docs";

/**
 * Contenitore comune delle pagine legali: titolo, data dell'ultima aggiornamento,
 * corpo del testo e rimandi alle altre pagine. Le pagine restano leggibili anche
 * stampate: niente menu che sparisce, niente effetti.
 */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
        Ultimo aggiornamento: {updated}
      </p>
      {intro ? <p className="mt-4 text-lg text-muted">{intro}</p> : null}

      <div className="legal-body mt-8">{children}</div>

      <nav aria-label="Altre pagine legali" className="mt-12 border-t border-border pt-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
          Altre pagine legali
        </p>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {LEGAL_DOC_LIST.map((d) => (
            <li key={d.id}>
              <Link href={`/${d.slug}`} className="font-semibold text-primary underline">
                {d.title}
              </Link>
            </li>
          ))}
          {LEGAL_PAGES.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`} className="font-semibold text-primary underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
