import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { COURSES } from "@/lib/content/courses";
import { loadCatalog } from "@/lib/content/catalog";
import { lessonIdsOfModule, masteryAvailable, modulesWithLessons, placementSet } from "@/lib/mastery/server";
import { requireMember } from "@/lib/session";
import { PageArt } from "@/components/page-art";

export const metadata: Metadata = { title: "Prove di padronanza" };

export default function Padronanza() {
  return (
    <Suspense fallback={<div className="h-80 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico le prove" />}>
      <PadronanzaContent />
    </Suspense>
  );
}

async function PadronanzaContent() {
  const { completed, mastered } = await requireMember("/padronanza");
  const catalog = loadCatalog();

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <header className="relative grid gap-1 pr-20">
        <PageArt art="padronanza" priority />
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Sai già qualcosa?</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Prove di padronanza</h1>
        <p className="text-muted">
          Un test per modulo: circa 8 domande, si supera con l&apos;80%. Se lo superi, le lezioni del modulo risultano «padroneggiate» e quelle dopo si aprono. Non danno XP.
        </p>
      </header>

      {COURSES.map((course) => {
        const mods = modulesWithLessons(course);
        if (mods.length === 0) return null;
        const hasPlacement = placementSet(course, "verifica").length > 0;
        return (
          <section key={course.id} aria-labelledby={`c-${course.id}`} className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-4">
            <h2 id={`c-${course.id}`} className="font-display text-xl font-bold">
              {course.title}
            </h2>
            {hasPlacement && (
              <Link href={`/ingresso/${course.id}`} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border-2 border-primary p-3 font-semibold hover:bg-surface-muted">
                <span>
                  Test d&apos;ingresso
                  <span className="block text-sm font-normal text-muted">Facoltativo: ti consiglia da quale modulo partire</span>
                </span>
                <span aria-hidden className="text-primary">→</span>
              </Link>
            )}
            <ul className="grid gap-2">
              {mods.map((n) => {
                const m = course.modules.find((x) => x.n === n)!;
                const ids = lessonIdsOfModule(course, n);
                const done = ids.filter((id) => completed.has(id)).length;
                const mast = ids.filter((id) => !completed.has(id) && mastered.has(id)).length;
                const all = done + mast === ids.length;
                const available = masteryAvailable(course, n);
                const status = all ? (mast > 0 ? "padroneggiato" : "completato") : `${done}/${ids.length} fatte`;
                const row = (
                  <>
                    <span className="min-w-0">
                      <span className="block font-semibold">
                        {course.id}
                        {n} · {m.title}
                      </span>
                      <span className="block font-mono text-xs text-muted">
                        {ids.length} lezioni · {status}
                        {!available && " · prova non ancora disponibile"}
                      </span>
                    </span>
                    {available && !all && <span className="shrink-0 font-bold text-primary">Prova →</span>}
                  </>
                );
                const cls = "flex min-h-14 items-center justify-between gap-3 rounded-lg border p-3";
                return (
                  <li key={n}>
                    {available && !all ? (
                      <Link href={`/padronanza/${course.id}/${n}`} className={`${cls} border-border hover:border-foreground`}>
                        {row}
                      </Link>
                    ) : (
                      <div className={`${cls} border-dashed border-border ${all ? "" : "text-muted"}`}>{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="text-sm text-muted">
        {catalog.length} lezioni disponibili. Le domande sbagliate finiscono nel <Link href="/ripasso" className="font-semibold underline">ripasso</Link>.
      </p>
    </div>
  );
}
