import Link from "next/link";
import { COURSES } from "@/lib/content/courses";
import type { PublicPortfolio } from "@/lib/portfolio/portfolio";
import { BeltArt } from "../profilo/graphics";
import { Avatar } from "../social/avatar";

const fmt = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "Europe/Rome" });

/** Pagina pubblica di un adulto: soprannome, avatar, cintura/XP e certificati se li ha voluti mostrare. Mai nome vero né email. */
export function PortfolioCard({ p }: { p: PublicPortfolio }) {
  return (
    <article className="grid gap-5">
      <header className="flex items-center gap-4">
        <Avatar id={p.avatar} size={72} label={`Avatar di ${p.nickname}`} />
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Portfolio</p>
          <h1 className="font-display text-3xl font-bold leading-tight [overflow-wrap:anywhere]">{p.nickname}</h1>
        </div>
      </header>

      {p.belt && (
        <section aria-label="Cintura e punti" className="grid gap-2 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Cintura</h2>
          <BeltArt color={p.belt.color} name={p.belt.beltName} className="h-14 w-auto max-w-56" />
          <p>
            Cintura <strong>{p.belt.beltName.toLowerCase()}</strong> · livello {p.belt.levelName} · <strong>{p.belt.xp}</strong> XP
          </p>
        </section>
      )}

      {p.certificates.length > 0 && (
        <section aria-label="Certificati" className="grid gap-2 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Certificati</h2>
          <ul className="grid gap-2">
            {p.certificates.map((c) => (
              <li key={c.code} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3">
                <span>
                  <strong>{COURSES.find((x) => x.id === c.course)?.title ?? c.course}</strong>
                  {c.issuedAt && <span className="block text-sm text-muted">Emesso il {fmt.format(new Date(c.issuedAt))}</span>}
                </span>
                <Link href={`/verifica/${encodeURIComponent(c.code)}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-2">
                  Verifica il certificato
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!p.belt && p.certificates.length === 0 && <p className="text-muted">Questa persona non ha scelto di mostrare altro.</p>}
    </article>
  );
}
