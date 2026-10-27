import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LockIcon } from "@/components/icons";
import { COURSES } from "@/lib/content/courses";
import { search, tokenize } from "@/lib/search/search-core";
import { getSearchIndex } from "@/lib/search/search-index";
import { canOpenLesson } from "@/lib/progress/unlock";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Cerca" };

export default function CercaPage({ searchParams }: PageProps<"/cerca">) {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-muted">Apro la ricerca…</p>}>
      <Cerca searchParams={searchParams} />
    </Suspense>
  );
}

async function Cerca({ searchParams }: { searchParams: PageProps<"/cerca">["searchParams"] }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = (raw ?? "").slice(0, 100);
  const member = await requireMember(q ? `/cerca?q=${encodeURIComponent(q)}` : "/cerca");

  const results = tokenize(q).length > 0 ? search(getSearchIndex(), q, 30) : [];
  const courseName = (id: string) => COURSES.find((c) => c.id === id)?.title ?? id;

  return (
    <div className="mx-auto grid max-w-3xl gap-5 lg:mx-0">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Ricerca</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Cerca nelle lezioni</h1>
        <p className="text-muted">Titoli, testi e glossario. Non serve scrivere la parola intera né fare attenzione agli accenti.</p>
      </header>

      <form action="/cerca" method="get" role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">
          Che cosa cerchi?
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          autoComplete="off"
          maxLength={100}
          placeholder="Per esempio: hash, subnet, p-value…"
          className="min-h-12 min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 text-base"
        />
        <button type="submit" className="min-h-12 rounded-lg bg-primary px-5 font-bold text-primary-fg">
          Cerca
        </button>
      </form>

      {q && tokenize(q).length === 0 ? <p className="text-muted">Scrivi almeno due lettere.</p> : null}
      {tokenize(q).length > 0 ? (
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {results.length === 0 ? "Nessun risultato." : `${results.length} ${results.length === 1 ? "risultato" : "risultati"}${results.length === 30 ? " (primi 30)" : ""}`}
        </p>
      ) : null}

      <ul className="grid gap-3">
        {results.map((r) => {
          const isLesson = r.kind === "lezione";
          const locked = isLesson && !canOpenLesson({ id: r.id, prerequisites: r.prerequisites }, { completed: member.completed });
          const href = !isLesson ? `/glossario#${r.id}` : locked ? "/percorso" : `/lezione/${r.id}`;
          return (
            <li key={`${r.kind}:${r.id}`}>
              <Link href={href} className="grid gap-1 rounded-lg border border-border bg-surface p-4 hover:border-foreground">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display text-lg font-bold">{r.title}</span>
                  <span className="font-mono text-xs text-muted">
                    {isLesson ? `${r.id} · ${courseName(r.course)}` : `Glossario · ${courseName(r.course)}`}
                  </span>
                </span>
                <span className="text-sm text-muted">
                  {r.snippet.map((p, i) =>
                    p.hit ? (
                      <mark key={i} className="rounded-sm bg-sun px-0.5 text-sun-fg">
                        {p.text}
                      </mark>
                    ) : (
                      <span key={i}>{p.text}</span>
                    ),
                  )}
                </span>
                {locked ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-muted">
                    <LockIcon width={14} height={14} /> Lezione bloccata: si apre dal Percorso, in ordine
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
