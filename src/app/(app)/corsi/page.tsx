import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/lib/content/courses";
import { readRawLessons } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Corsi",
  description: "La mappa dei corsi di CyberDojo: moduli, titoli e obiettivi.",
};

export default function Corsi() {
  const lessons = readRawLessons();
  const inModule = (folder: string, n: number) =>
    lessons.filter((l) => l.file.startsWith(`${folder}/`) && l.data.module === n);

  return (
    <div className="grid gap-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold">I corsi</h1>
        <p className="mt-1 text-muted">
          La mappa è pubblica. Le lezioni si aprono con un account e si seguono in ordine.
        </p>
      </header>
      {COURSES.map((c) => (
        <section key={c.id} aria-labelledby={`c-${c.id}`} className="grid gap-3">
          <h2 id={`c-${c.id}`} className="font-display text-2xl font-extrabold">{c.title}</h2>
          <ol className="grid gap-3">
            {c.modules.map((m) => {
              const found = inModule(c.folder, m.n);
              return (
                <li key={m.n} className="card flex items-start gap-4 p-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-deep font-extrabold text-deep-fg">
                    {c.id}{m.n}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold">{m.title}</p>
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
      ))}
    </div>
  );
}
