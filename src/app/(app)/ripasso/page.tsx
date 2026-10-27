import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ReviewRunner } from "@/components/mastery/review-runner";
import { withUser } from "@/lib/db/scoped";
import { loadDueReview } from "@/lib/mastery/review";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Ripasso" };

export default function Ripasso() {
  return (
    <Suspense fallback={<div className="h-64 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico il ripasso" />}>
      <RipassoContent />
    </Suspense>
  );
}

async function RipassoContent() {
  const { user } = await requireMember("/ripasso");
  const batch = await withUser(user.id, (tx) => loadDueReview(tx, user.id));

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Ripasso intelligente</p>
        <h1 className="font-display text-3xl font-bold">Ripassa quello che dimentichi</h1>
        <p className="text-muted">Le domande che sbagli nelle prove tornano qui: domani, poi tra 3, 7 e 21 giorni, se continui a rispondere bene.</p>
      </header>
      {batch.questions.length > 0 ? (
        <ReviewRunner questions={batch.questions} />
      ) : (
        <section className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-5">
          <h2 className="font-display text-xl font-bold">Niente da ripassare adesso</h2>
          <p className="text-muted">
            {batch.waiting > 0
              ? `Hai ${batch.waiting} ${batch.waiting === 1 ? "domanda" : "domande"} in attesa: torneranno quando sarà ora.`
              : "Il ripasso si riempie con gli errori delle prove di padronanza e del test d'ingresso."}
          </p>
          <Link href="/padronanza" className="btn btn-primary min-h-14 w-fit">
            Vai alle prove
          </Link>
        </section>
      )}
    </div>
  );
}
