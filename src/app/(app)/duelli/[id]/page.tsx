import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DuelInviteButtons } from "@/components/duels/duel-invite-buttons";
import { DuelRunner } from "@/components/duels/duel-runner";
import { DUEL_QUESTIONS, DUEL_WIN_XP, timeLeftLabel } from "@/lib/duels/rules";
import { getDuel } from "@/lib/duels/service";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Duello", robots: { index: false } };

type Params = { params: Promise<{ id: string }> };

// Gli identificativi dei duelli nascono a ogni sfida: non si possono elencare in anticipo.
// La pagina legge `params` dentro Suspense, quindi con Cache Components il build non si ferma.
export default function DuelloPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-64 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico il duello" />}>
      <DuelloContent params={params} />
    </Suspense>
  );
}

async function DuelloContent({ params }: Params) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { user } = await requireMember(`/duelli/${id}`);
  const now = new Date();
  const d = await getDuel(user.id, id, now);
  if (!d) notFound();

  const left = timeLeftLabel(new Date(d.expiresAt), now);
  const box = "grid gap-4 rounded-2xl border-2 border-border bg-surface p-5";

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header>
        <Link href="/duelli" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> Tutti i duelli
        </Link>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Duello</p>
        <h1 className="font-display text-3xl font-bold">Tu contro {d.opponent}</h1>
      </header>

      {d.canAccept && (
        <section className={box} aria-live="polite">
          <h2 className="font-display text-xl font-bold">{d.opponent} ti ha sfidato</h2>
          <p>
            {DUEL_QUESTIONS} domande, stesse per tutti e due. Se accetti hai 24 ore per giocare il tuo turno. Vincere dà {DUEL_WIN_XP} XP.
          </p>
          <DuelInviteButtons id={d.id} />
        </section>
      )}

      {d.canAnswer && (
        <>
          {d.status === "pending" && (
            <p className="text-muted">
              {d.opponent} non ha ancora accettato: puoi giocare intanto il tuo turno. {left}.
            </p>
          )}
          {d.status === "active" && <p className="text-muted">{left}.</p>}
          <DuelRunner id={d.id} total={DUEL_QUESTIONS} />
        </>
      )}

      {d.myScore !== null && d.status !== "done" && d.status !== "expired" && (
        <section className={box} aria-live="polite">
          <h2 className="font-display text-xl font-bold">Turno finito</h2>
          <p className="text-lg">
            Hai risposto giusto a <strong>{d.myScore}</strong> domande su {d.myTotal}.
          </p>
          <p className="text-muted">
            {d.status === "pending"
              ? `${d.opponent} non ha ancora accettato l'invito. ${left}.`
              : `Aspetta che ${d.opponent} giochi il suo turno. ${left}.`}
          </p>
        </section>
      )}

      {d.status === "done" && d.myScore !== null && d.theirScore !== null && (
        <section className={box} aria-live="polite">
          <h2 className="font-display text-2xl font-bold">
            {d.outcome === "win" ? "Hai vinto!" : d.outcome === "loss" ? "Questa volta ha vinto l'altro" : "Pareggio"}
          </h2>
          <p className="text-lg">
            Tu: <strong>{d.myScore}</strong> su {d.myTotal} · {d.opponent}: <strong>{d.theirScore}</strong>
          </p>
          {d.outcome === "win" && <p className="text-muted">Hai guadagnato {DUEL_WIN_XP} XP (una sola volta per duello).</p>}
          <Link href="/social" className="btn btn-primary min-h-14 w-fit">
            Torna agli amici
          </Link>
        </section>
      )}

      {d.status === "expired" && (
        <section className={box}>
          <h2 className="font-display text-xl font-bold">Duello scaduto</h2>
          <p className="text-muted">
            Le 24 ore sono finite senza che entrambi giocassero. Nessun vincitore e nessun XP.
            {d.myScore !== null && d.theirScore !== null ? ` Punteggi: tu ${d.myScore}, ${d.opponent} ${d.theirScore}.` : ""}
          </p>
        </section>
      )}

      {d.status === "declined" && (
        <section className={box}>
          <h2 className="font-display text-xl font-bold">Invito rifiutato</h2>
          <p className="text-muted">Il duello non si fa. Puoi sfidare un altro amico dal Social.</p>
        </section>
      )}
    </div>
  );
}
