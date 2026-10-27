import type { Metadata } from "next";
import { Suspense } from "react";
import { getDaily } from "@/app/actions/daily";
import { DailyChallenge } from "@/components/daily/daily-challenge";
import { DAILY_XP } from "@/lib/daily/daily-core";
import { requireMember } from "@/lib/session";
import { PageArt } from "@/components/page-art";

export const metadata: Metadata = { title: "Sfida del giorno" };

export default function SfidaPage() {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-muted">Preparo la sfida…</p>}>
      <Sfida />
    </Suspense>
  );
}

async function Sfida() {
  await requireMember("/sfida");
  const state = await getDaily();
  if (!state) return null;
  return (
    <div className="mx-auto grid max-w-2xl gap-5 lg:mx-0">
      <header className="relative grid gap-1 pr-20">
        <PageArt art="senseiLente" priority />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Ogni giorno</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Sfida del giorno</h1>
        <p className="text-muted">
          Una domanda uguale per tutti, un solo tentativo. Se rispondi bene guadagni {DAILY_XP} XP (una volta al giorno) e la serie delle sfide continua.
        </p>
      </header>
      <DailyChallenge initial={state} />
    </div>
  );
}
