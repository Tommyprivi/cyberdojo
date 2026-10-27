"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckIcon, LockIcon, PlayIcon } from "../icons";

export type MapLesson = { id: string; title: string; minutes: number; state: "done" | "mastered" | "open" | "locked" };
export type MapModule = { n: number; title: string; summary: string; cover: string; own: boolean; lessons: MapLesson[] };
export type MapCourse = { id: string; title: string; done: number; total: number; modules: MapModule[] };

/**
 * Mappa dei corsi per PC: un selettore di corso, una fila di moduli e, sotto, il modulo scelto con le sue
 * lezioni. Una cosa per volta, così l'intera schermata sta nell'altezza dello schermo.
 */
export function CourseMap({ courses, initialCourse, initialModule }: { courses: MapCourse[]; initialCourse: string; initialModule: number }) {
  const [courseId, setCourseId] = useState(initialCourse);
  const [picked, setPicked] = useState<Record<string, number>>({ [initialCourse]: initialModule });
  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const firstWithLessons = course.modules.find((m) => m.lessons.length > 0)?.n ?? course.modules[0].n;
  const moduleN = picked[course.id] ?? firstWithLessons;
  const mod = course.modules.find((m) => m.n === moduleN) ?? course.modules[0];
  const doneInMod = mod.lessons.filter((l) => l.state === "done").length;

  return (
    <section aria-label="Mappa dei corsi" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-stretch justify-between gap-4 border-b border-border">
        <div role="group" aria-label="Corso" className="flex">
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === course.id}
              onClick={() => setCourseId(c.id)}
              className={`-mb-px min-h-12 border-b-2 px-4 text-left text-sm font-semibold ${
                c.id === course.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <span className="mr-2 font-mono text-xs">{c.id}</span>
              {c.title}
            </button>
          ))}
        </div>
        <p className="self-center whitespace-nowrap pr-4 font-mono text-xs text-muted">
          {course.done}/{course.total} lezioni
        </p>
      </div>

      <ul aria-label="Moduli" className="flex flex-wrap gap-1 border-b border-border p-2.5">
        {course.modules.map((m) => {
          const done = m.lessons.filter((l) => l.state === "done").length;
          const empty = m.lessons.length === 0;
          const complete = !empty && done === m.lessons.length;
          const hasOpen = m.lessons.some((l) => l.state === "open");
          const selected = m.n === mod.n;
          return (
            <li key={m.n}>
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`${course.id}${m.n} ${m.title}: ${empty ? "in preparazione" : `${done} di ${m.lessons.length}`}`}
                title={m.title}
                onClick={() => setPicked((p) => ({ ...p, [course.id]: m.n }))}
                className={`relative grid h-11 w-12 place-items-center overflow-hidden rounded-md border font-mono text-sm font-bold ${
                  selected ? "border-foreground bg-foreground text-background" : complete ? "border-success bg-success text-success-fg" : hasOpen ? "border-primary text-primary" : empty ? "border-dashed border-border text-muted" : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {course.id}
                {m.n}
                {!empty && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-surface-muted/60">
                    <span className="block h-full bg-primary" style={{ width: `${(done / m.lessons.length) * 100}%` }} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="grid min-h-0 flex-1 grid-cols-[11rem_minmax(0,1fr)] gap-5 p-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="grid content-start gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-muted">
            <Image src={mod.cover} alt="" fill sizes="224px" className={`object-cover ${mod.own ? "" : "opacity-60 saturate-50"}`} />
          </div>
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              {course.id}
              {mod.n}
            </p>
            <h3 className="font-display text-xl font-bold leading-tight">{mod.title}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-muted">{mod.summary}</p>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto pr-1">
          {mod.lessons.length === 0 ? (
            <p className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-muted">
              <LockIcon width={16} height={16} /> In preparazione: le lezioni di questo modulo arrivano presto.
            </p>
          ) : (
            <>
              <p className="mb-2 font-mono text-xs text-muted">
                {doneInMod} di {mod.lessons.length} completate
              </p>
              <ol className="grid gap-2 2xl:grid-cols-2">
                {mod.lessons.map((l, i) => {
                  const row = (
                    <>
                      <span
                        aria-hidden
                        className={`grid size-10 shrink-0 place-items-center rounded-md font-mono text-sm font-bold ${
                          l.state === "done" ? "bg-success text-success-fg" : l.state === "open" || l.state === "mastered" ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted"
                        }`}
                      >
                        {l.state === "done" || l.state === "mastered" ? <CheckIcon width={18} height={18} /> : l.state === "locked" ? <LockIcon width={16} height={16} /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{l.title}</span>
                        <span className="block font-mono text-xs text-muted">
                          {l.id} · {l.minutes} min · {l.state === "done" ? "fatta" : l.state === "mastered" ? "padroneggiata" : l.state === "open" ? "da fare" : "bloccata"}
                        </span>
                      </span>
                      {l.state === "open" && <PlayIcon width={18} height={18} className="shrink-0 text-primary" />}
                    </>
                  );
                  return (
                    <li key={l.id}>
                      {l.state === "locked" ? (
                        <div
                          role="img"
                          aria-label={`Bloccata: ${l.title}. Completa prima le lezioni precedenti.`}
                          className="flex min-h-14 items-center gap-3 rounded-md border border-dashed border-border p-2.5 text-muted"
                        >
                          {row}
                        </div>
                      ) : (
                        <Link
                          href={`/lezione/${l.id}`}
                          aria-label={`${l.state === "done" || l.state === "mastered" ? "Rivedi" : "Inizia"}: ${l.title}`}
                          className={`flex min-h-14 items-center gap-3 rounded-md border p-2.5 hover:border-foreground ${l.state === "open" ? "border-primary" : "border-border"}`}
                        >
                          {row}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
