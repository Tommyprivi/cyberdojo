import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TestRunner } from "@/components/mastery/test-runner";
import { COURSES } from "@/lib/content/courses";
import { courseByLetter, placementSet } from "@/lib/mastery/server";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Test d'ingresso" };

type Params = { params: Promise<{ corso: string }> };

// I corsi sono noti in anticipo: serve al menu, che legge l'indirizzo della pagina.
export function generateStaticParams() {
  return COURSES.map((c) => ({ corso: c.id }));
}

export default function Ingresso({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-64 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico il test" />}>
      <IngressoContent params={params} />
    </Suspense>
  );
}

async function IngressoContent({ params }: Params) {
  const { corso } = await params;
  const course = /^[A-Z]$/.test(corso) ? courseByLetter(corso) : undefined;
  if (!course || placementSet(course, "verifica").length === 0) notFound();
  await requireMember(`/ingresso/${corso}`);

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header>
        <Link href="/padronanza" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> Prove di padronanza
        </Link>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Test d&apos;ingresso</p>
        <h1 className="font-display text-3xl font-bold">{course.title}</h1>
      </header>
      <TestRunner mode="placement" course={course.id} title={course.title} backHref="/percorso" />
    </div>
  );
}
