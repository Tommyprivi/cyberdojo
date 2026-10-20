import Link from "next/link";
import { SITE } from "@/lib/config";
import { Seal } from "./seal";

const COLS = [
  { t: "Impara", links: [["I corsi", "/corsi"], ["Pratica", "/pratica"], ["Il tuo percorso", "/percorso"]] },
  { t: "Account", links: [["Registrati", "/registrati"], ["Accedi", "/accedi"], ["Recupera la password", "/password-dimenticata"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="grid content-start gap-3">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold">
            <Seal size={36} />
            {SITE.name}
          </p>
          <p className="max-w-sm text-muted">La scuola gratuita di cybersecurity in italiano. Si impara risolvendo casi, in ordine, con una prova pratica a ogni lezione.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.t} aria-label={c.t} className="grid content-start gap-2">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">{c.t}</p>
            {c.links.map(([label, href]) => (
              <Link key={href} href={href} className="w-fit hover:underline">{label}</Link>
            ))}
          </nav>
        ))}
      </div>
      <p className="border-t border-border px-4 py-5 text-center text-sm text-muted">
        Le voci del Sensei e dell&apos;Assistente sono sintetiche. Le tecniche di attacco si praticano solo in laboratori isolati, mai su sistemi reali.
      </p>
    </footer>
  );
}
