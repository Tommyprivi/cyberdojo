import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { LessonActions } from "@/components/review/lesson-actions";
import { reviewComponents } from "@/components/review/review-mdx";
import { ReviewPlayerProvider } from "@/components/review/review-player";
import { VoteBox } from "@/components/review/vote-box";
import { getRawLesson } from "@/lib/content/load";
import { sceneKey } from "@/lib/content/reviews";
import { readReviews } from "@/lib/content/reviews-store";
import { loadLessonRows } from "@/lib/content/review-data";
import { splitScreens } from "@/lib/content/load";
import { LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Lettura per la revisione", robots: { index: false, follow: false } };

// Pagina interna: la barra laterale legge il percorso, quindi la rotta può bloccare il prerendering.
export const instant = false;

export default function ReviewLessonPage({ params }: PageProps<"/revisione/lezioni/[id]">) {
  return (
    <Suspense fallback={<p className="p-6">Carico la lezione…</p>}>
      <ReviewLesson params={params} />
    </Suspense>
  );
}

/**
 * Lezione intera in un solo scroll, senza accesso, senza ordine dei prerequisiti e senza scrivere
 * progressi: il video usa un contesto finto e la verifica mostra la banca di domande.
 */
async function ReviewLesson({ params }: { params: PageProps<"/revisione/lezioni/[id]">["params"] }) {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const { id } = await params;
  if (!LESSON_ID.test(id)) notFound();
  const raw = getRawLesson(id);
  const parsed = raw && lessonFrontmatter.safeParse(raw.data);
  if (!raw || !parsed || !parsed.success) notFound();
  const fm = parsed.data;

  const reviews = readReviews();
  const rows = loadLessonRows(reviews).sort((a, b) => a.id.localeCompare(b.id));
  const row = rows.find((r) => r.id === id)!;
  const at = rows.findIndex((r) => r.id === id);
  const prev = rows[at - 1];
  const next = rows[at + 1];

  const components = reviewComponents({ generator: fm.verification.generator, pass: fm.verification.pass, retries: fm.verification.retries, type: fm.verification.type });
  const screens = await Promise.all(
    splitScreens(raw.body).map(async (source, i) => {
      const { content } = await compileMDX({
        source,
        components,
        // blockJS: false come nella lezione vera: sicuro solo perché l'MDX arriva dal repository.
        options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
      });
      return { n: i + 1, title: /<Scene\s+title="([^"]+)"/.exec(source)?.[1] ?? `Schermata ${i + 1}`, node: content };
    }),
  );

  const nav = (
    <nav aria-label="Lezioni vicine" className="flex flex-wrap items-center justify-between gap-3">
      {prev ? <Link href={`/revisione/lezioni/${prev.id}`} className="btn btn-ghost">← {prev.id}</Link> : <span />}
      <Link href="/revisione" className="font-semibold text-primary underline">Torna al centro</Link>
      {next ? <Link href={`/revisione/lezioni/${next.id}`} className="btn btn-ghost">{next.id} →</Link> : <span />}
    </nav>
  );

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      {nav}
      <header className="dossier grid gap-3 p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{fm.id} · cintura {fm.belt} · {fm.duration_min} min · {fm.status}</p>
        <h1 className="font-display text-3xl font-semibold">{fm.title}</h1>
        <p className="text-sm text-muted">
          Vista di revisione: tutte le schermate di seguito. Non serve l&apos;accesso e non si salva nessun progresso.
        </p>
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Obiettivi</h2>
          <ul className="mt-1 list-disc pl-5">{fm.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        {fm.known_pitfalls.length > 0 && (
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Errori tipici</h2>
            <ul className="mt-1 list-disc pl-5">{fm.known_pitfalls.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        )}
        {row.isAttack && (
          <p role="note" className="rounded-md border border-accent p-3 text-sm font-semibold text-accent">
            Modulo di attacco etico: serve una rilettura umana prima della pubblicazione.
          </p>
        )}
        {!fm.video && <p className="text-sm font-semibold text-accent">Questa lezione non ha ancora un video.</p>}
      </header>

      <LessonActions
        id={fm.id}
        hasVideo={row.hasVideo}
        isAttack={row.isAttack}
        approved={row.approved}
        videoReviewed={row.videoReviewed}
        humanReviewed={row.humanReviewed}
        note={reviews[fm.id]?.note ?? ""}
      />

      <ReviewPlayerProvider lessonId={fm.id} video={fm.video}>
        {screens.map((s) => (
          <section key={s.n} id={`schermata-${s.n}`} aria-labelledby={`h-${s.n}`} className="card grid gap-4 p-5 scroll-mt-6">
            <h2 id={`h-${s.n}`} className="flex items-baseline gap-3 font-display text-2xl font-semibold">
              <span className="font-mono text-sm font-bold text-accent">{s.n}/{screens.length}</span>
              {s.title}
            </h2>
            <div className="grid gap-4">{s.node}</div>
            <VoteBox target={{ kind: "scene", id: fm.id, n: s.n }} label={`Schermata ${s.n}: ${s.title}`} entry={reviews[sceneKey(fm.id, s.n)]} />
          </section>
        ))}
      </ReviewPlayerProvider>

      <p className="text-sm text-muted">
        Le domande di questa verifica si rivedono anche una per una in{" "}
        <Link className="font-semibold text-primary underline" href={`/revisione/domande?lezione=${fm.id}`}>Domande</Link>.
      </p>
      {nav}
    </div>
  );
}
