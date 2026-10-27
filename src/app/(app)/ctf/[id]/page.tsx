import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChallengePlay } from "@/components/ctf/challenge-play";
import { buildFor, CHALLENGES, findChallenge, toPublic } from "@/lib/ctf/catalog";
import { ctfSecret, solvedIds } from "@/lib/ctf/server";
import { withUser } from "@/lib/db/scoped";
import { requireMember } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Sfida CTF" };

// Le sfide sono note in anticipo: serve al build con Cache Components.
export function generateStaticParams() {
  return CHALLENGES.map((c) => ({ id: c.id }));
}

export default function CtfChallengePage({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-80 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico la sfida" />}>
      <ChallengeContent params={params} />
    </Suspense>
  );
}

async function ChallengeContent({ params }: Params) {
  const { id } = await params;
  const c = findChallenge(id);
  if (!c) notFound();
  const { user } = await requireMember(`/ctf/${c.id}`);
  const solved = (await withUser(user.id, (tx) => solvedIds(tx, user.id))).has(c.id);
  // I dati sono personali (derivati dal segreto del server); la spiegazione parte solo se la sfida è già risolta.
  const pub = toPublic(c, buildFor(ctfSecret(), user.id, c));

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <Link href="/ctf" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
        <span aria-hidden>←</span> Tutte le sfide
      </Link>
      <ChallengePlay challenge={pub} initiallySolved={solved} info={solved ? { explanation: c.explanation, defense: c.defense } : null} />
    </div>
  );
}
