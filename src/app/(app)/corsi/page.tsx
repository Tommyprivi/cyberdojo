import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COURSES, type CourseId } from "@/lib/content/courses";
import { COURSE_COVER, moduleCover } from "@/lib/content/covers";
import { readRawLessons } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Corsi",
  description: "I due corsi di CyberDojo: Fondamenta IT, Linux e Reti, e Cybersecurity. Moduli, argomenti e obiettivi.",
};

const BLURB: Record<CourseId, { lead: string; for: string }> = {
  D: {
    lead: "Dai fogli di calcolo a SQL e Python, dalla statistica alla visualizzazione e al machine learning: come si trasformano i dati in decisioni, con tutte le strade del mestiere (analista, data engineer, data scientist).",
    for: "Per chi vuole lavorare con i dati, anche partendo da zero.",
  },
  F: {
    lead: "Parti da zero: come funziona un computer, Linux da terminale, le reti dal primo bit al routing. È la base senza cui la sicurezza non ha senso.",
    for: "Per chi non ha mai aperto un terminale.",
  },
  C: {
    lead: "Crittografia, autenticazione, web, difesa e attacco etico in laboratorio isolato, forensics. Ogni argomento si impara su un caso da risolvere.",
    for: "Per chi ha finito Fondamenta o sa già usare Linux e le reti.",
  },
};

export default function Corsi() {
  const lessons = readRawLessons();
  const inModule = (folder: string, n: number) =>
    lessons.filter((l) => l.file.startsWith(`${folder}/`) && l.data.module === n);

  return (
    <div className="grid gap-12 lg:gap-16">
      <header className="grid gap-2">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Catalogo</p>
        <h1 className="font-display text-4xl font-bold lg:text-5xl">I corsi</h1>
        <p className="max-w-2xl text-lg text-muted">
          Due percorsi in ordine, gratis. La mappa è pubblica; le lezioni si aprono con un account e si seguono una dopo l&apos;altra.
        </p>
      </header>

      {COURSES.map((c) => {
        const total = c.modules.length;
        const available = c.modules.filter((m) => inModule(c.folder, m.n).length > 0).length;
        return (
          <section key={c.id} aria-labelledby={`c-${c.id}`} className="grid gap-6">
            <div className="grid overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-[1.1fr_1fr]">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-72">
                <Image src={COURSE_COVER[c.id]} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" priority={c.id === "F"} />
              </div>
              <div className="grid content-center gap-3 p-6 lg:p-8">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Corso {COURSES.indexOf(c) + 1}</p>
                <h2 id={`c-${c.id}`} className="font-display text-3xl font-bold">{c.title}</h2>
                <p className="text-muted">{BLURB[c.id].lead}</p>
                <p className="font-semibold">{BLURB[c.id].for}</p>
                <p className="font-mono text-sm text-muted">{total} moduli · {available} con lezioni pronte</p>
              </div>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {c.modules.map((m) => {
                const found = inModule(c.folder, m.n);
                const cover = moduleCover(c.id, m.n);
                return (
                  <li key={m.n} className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="relative aspect-[16/9] bg-surface-muted">
                      <Image
                        src={cover.src}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
                        className={`object-cover ${cover.own ? "" : "opacity-60 saturate-50"}`}
                      />
                      <span className="absolute left-3 top-3 rounded-md bg-deep px-2 py-1 font-mono text-sm font-bold text-deep-fg">
                        {c.id}{m.n}
                      </span>
                    </div>
                    <div className="grid gap-1 p-4">
                      <h3 className="font-display text-xl font-bold">{m.title}</h3>
                      <p className="text-sm text-muted">{m.summary}</p>
                      <p className="mt-2 text-sm font-semibold">
                        {found.length > 0 ? (
                          <Link href={`/lezione/${found[0].data.id}`} className="text-primary underline">
                            {found.length} {found.length === 1 ? "lezione disponibile" : "lezioni disponibili"}
                          </Link>
                        ) : (
                          <span className="text-muted">In preparazione</span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
