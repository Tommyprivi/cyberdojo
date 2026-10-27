import type { Metadata } from "next";
import { COURSES } from "@/lib/content/courses";
import { GLOSSARY, glossarySlug } from "@/lib/glossary/terms";

export const metadata: Metadata = {
  title: "Glossario",
  description: "Le parole di informatica, cybersecurity, dati e finanza usate nei corsi, spiegate in breve.",
};

export default function Glossario() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "it"));
  const letters = [...new Set(sorted.map((t) => t.term[0].toUpperCase()))];
  const courseName = (id: string) => COURSES.find((c) => c.id === id)?.title ?? id;

  return (
    <div className="mx-auto grid max-w-3xl gap-6 lg:mx-0">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Glossario</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Le parole dei corsi</h1>
        <p className="text-muted">{sorted.length} termini, in ordine alfabetico. Per cercarne uno usa la ricerca del browser o la pagina Cerca.</p>
      </header>

      <nav aria-label="Lettere" className="flex flex-wrap gap-1">
        {letters.map((l) => (
          <a key={l} href={`#lettera-${l}`} className="grid size-9 place-items-center rounded-md border border-border font-mono text-sm font-bold hover:border-foreground">
            {l}
          </a>
        ))}
      </nav>

      {letters.map((l) => (
        <section key={l} id={`lettera-${l}`} aria-label={`Lettera ${l}`} className="grid gap-2">
          <h2 className="border-b border-border font-display text-2xl font-bold">{l}</h2>
          <dl className="grid gap-3">
            {sorted
              .filter((t) => t.term[0].toUpperCase() === l)
              .map((t) => (
                <div key={t.term} id={glossarySlug(t.term)} className="scroll-mt-20 target:rounded-md target:bg-surface-muted target:p-2">
                  <dt className="font-bold">
                    {t.term} <span className="ml-1 font-mono text-xs font-normal text-muted">{courseName(t.course)}</span>
                  </dt>
                  <dd className="text-muted">{t.def}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
