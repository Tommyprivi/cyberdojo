import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
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
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <h1 className="font-display text-4xl font-bold">I corsi</h1>
        <p className="mt-2 text-muted">
          La mappa è pubblica. Le lezioni si aprono con un account e si seguono in ordine.
        </p>
        {COURSES.map((c) => (
          <section key={c.id} className="mt-10" aria-labelledby={`c-${c.id}`}>
            <h2 id={`c-${c.id}`} className="text-2xl font-bold">{c.title}</h2>
            <ol className="mt-4 grid gap-3">
              {c.modules.map((m) => {
                const found = inModule(c.folder, m.n);
                const n = found.length;
                return (
                  <li key={m.n} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-semibold">
                      {c.id}{m.n} · {m.title}
                    </p>
                    <p className="mt-1 text-muted">{m.summary}</p>
                    <p className="mt-2 text-sm">
                      {n > 0 ? (
                        <Link href={`/lezione/${found[0].data.id}`} className="underline">
                          {n} {n === 1 ? "lezione disponibile" : "lezioni disponibili"}
                        </Link>
                      ) : (
                        <span className="text-muted">In preparazione</span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}
