import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DuelInviteButtons } from "@/components/duels/duel-invite-buttons";
import { timeLeftLabel } from "@/lib/duels/rules";
import { listDuels, type DuelView } from "@/lib/duels/service";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Duelli", robots: { index: false } };

export default function DuelliPage() {
  return (
    <Suspense fallback={<div className="h-80 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico i duelli" />}>
      <DuelliContent />
    </Suspense>
  );
}

function closedLabel(d: DuelView): string {
  if (d.status === "declined") return "Rifiutato";
  if (d.status === "expired") return "Scaduto";
  if (d.outcome === "win") return `Hai vinto ${d.myScore}–${d.theirScore}`;
  if (d.outcome === "loss") return `Hai perso ${d.myScore}–${d.theirScore}`;
  return `Pareggio ${d.myScore}–${d.theirScore}`;
}

function openLabel(d: DuelView, now: Date): string {
  const left = timeLeftLabel(new Date(d.expiresAt), now);
  if (d.myScore !== null) return `Hai finito (${d.myScore}/${d.myTotal}). Aspetto ${d.opponent}. ${left}`;
  if (d.status === "pending" && d.iAmChallenger) return `Invito inviato a ${d.opponent}: puoi già giocare. ${left}`;
  return `Tocca a te. ${left}`;
}

async function DuelliContent() {
  const { user } = await requireMember("/duelli");
  const now = new Date();
  const { invites, open, closed } = await listDuels(user.id, now);

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Tra amici</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Duelli</h1>
        <p className="text-muted">
          Stesse 10 domande per tutti e due. Ognuno gioca quando vuole, entro 24 ore. Vince il punteggio più alto. Per sfidare qualcuno vai in{" "}
          <Link href="/social" className="font-semibold underline">
            Social
          </Link>{" "}
          e tocca «Sfida» accanto a un amico.
        </p>
      </header>

      <section aria-labelledby="inviti" className="grid gap-3">
        <h2 id="inviti" className="font-display text-xl font-bold">
          Inviti ricevuti
        </h2>
        {invites.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-muted">Nessun invito per ora.</p>
        ) : (
          <ul className="grid gap-3">
            {invites.map((d) => (
              <li key={d.id} className="grid gap-3 rounded-xl border-2 border-primary bg-surface p-4">
                <p className="font-semibold">{d.opponent} ti sfida a un duello</p>
                <p className="text-sm text-muted">{timeLeftLabel(new Date(d.expiresAt), now)}</p>
                <DuelInviteButtons id={d.id} goTo />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="corso" className="grid gap-3">
        <h2 id="corso" className="font-display text-xl font-bold">
          In corso
        </h2>
        {open.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-muted">Nessun duello in corso.</p>
        ) : (
          <ul className="grid gap-2">
            {open.map((d) => (
              <li key={d.id}>
                <Link href={`/duelli/${d.id}`} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border-2 border-border bg-surface p-3 hover:border-foreground">
                  <span>
                    <span className="block font-semibold">Duello con {d.opponent}</span>
                    <span className="block text-sm text-muted">{openLabel(d, now)}</span>
                  </span>
                  <span aria-hidden className="text-primary">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="conclusi" className="grid gap-3">
        <h2 id="conclusi" className="font-display text-xl font-bold">
          Conclusi
        </h2>
        {closed.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-muted">Ancora nessun duello concluso.</p>
        ) : (
          <ul className="grid gap-2">
            {closed.map((d) => (
              <li key={d.id}>
                <Link href={`/duelli/${d.id}`} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 hover:border-foreground">
                  <span>
                    <span className="block font-semibold">Duello con {d.opponent}</span>
                    <span className="block text-sm text-muted">{closedLabel(d)}</span>
                  </span>
                  <span aria-hidden className="text-primary">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
