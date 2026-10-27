import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TestRunner } from "@/components/mastery/test-runner";
import { COURSES } from "@/lib/content/courses";
import { courseByLetter, masteryAvailable } from "@/lib/mastery/server";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Prova di padronanza" };

type Params = { params: Promise<{ corso: string; modulo: string }> };

// Corsi e moduli sono noti in anticipo: serve al menu, che legge l'indirizzo della pagina.
export function generateStaticParams() {
  return COURSES.flatMap((c) => c.modules.map((m) => ({ corso: c.id, modulo: String(m.n) })));
}

export default function Prova({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-64 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico la prova" />}>
      <ProvaContent params={params} />
    </Suspense>
  );
}

async function ProvaContent({ params }: Params) {
  const { corso, modulo } = await params;
  const course = /^[A-Z]$/.test(corso) ? courseByLetter(corso) : undefined;
  const n = /^\d{1,2}$/.test(modulo) ? Number(modulo) : NaN;
  const mod = course?.modules.find((m) => m.n === n);
  if (!course || !mod || !masteryAvailable(course, n)) notFound();
  await requireMember(`/padronanza/${corso}/${modulo}`);

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header>
        <Link href="/padronanza" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> Prove di padronanza
        </Link>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Prova · {course.id}
          {n}
        </p>
        <h1 className="font-display text-3xl font-bold">{mod.title}</h1>
      </header>
      <TestRunner mode="mastery" course={course.id} module={n} title={mod.title} backHref="/padronanza" nextHref="/percorso" />
    </div>
  );
}
