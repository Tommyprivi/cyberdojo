import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CallRoom } from "@/components/social/call-room";
import { requireMember } from "@/lib/session";
import * as social from "@/lib/social/service";

export const metadata: Metadata = { title: "Studia insieme", robots: { index: false } };

type Params = { params: Promise<{ id: string }> };

export default function ChiamataPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-64 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico la chiamata" />}>
      <Chiamata params={params} />
    </Suspense>
  );
}

async function Chiamata({ params }: Params) {
  const { id } = await params;
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) notFound();
  const { user } = await requireMember(`/chiamata/${id}`);
  // Il controllo (amicizia accettata, io tra i due, entrambi adulti, nessun blocco) è sempre qui, sul server.
  const call = await social.getCall(user.id, id);
  if (!call) notFound();

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header>
        <Link href="/social" className="inline-flex min-h-12 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> I tuoi amici
        </Link>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Studia insieme</p>
        <h1 className="font-display text-3xl font-bold">Chiamata con {call.friendName ?? "il tuo amico"}</h1>
        <p className="text-muted">Voce, video e chat, dentro CyberDojo, solo tra voi due.</p>
      </header>

      <CallRoom friendshipId={id} friendName={call.friendName} fallbackUrl={call.callUrl} />

      <section aria-labelledby="consigli" className="grid gap-2 rounded-lg border border-border bg-surface p-4">
        <h2 id="consigli" className="font-semibold">
          Prima di cominciare
        </h2>
        <ul className="grid list-disc gap-1.5 pl-5 text-sm">
          <li>Usa le cuffie: si sente meglio e non c&apos;è eco.</li>
          <li>Il microfono serve; la fotocamera parte spenta e la accendi tu quando vuoi.</li>
          <li>Il tuo amico deve aprire questa pagina per collegarsi: finché non entra, vedi «In attesa».</li>
          <li>Se il browser chiede il permesso di microfono o fotocamera, scegli «Consenti» solo per questa chiamata.</li>
        </ul>
      </section>

      <section aria-labelledby="privacy" className="grid gap-2 rounded-lg border-2 border-accent p-4">
        <h2 id="privacy" className="font-semibold">
          Attenzione alla privacy
        </h2>
        <ul className="grid list-disc gap-1.5 pl-5 text-sm">
          <li>Non condividere dati personali (indirizzo, telefono, password, documenti). Puoi bloccare o segnalare l&apos;amico dal pannello amici.</li>
          <li>Voce, video e chat vanno direttamente tra voi due. CyberDojo non registra né salva nulla: né audio, né video, né messaggi.</li>
        </ul>
      </section>

      <section aria-labelledby="lezione" className="grid gap-2 rounded-lg border border-border bg-surface p-4">
        <h2 id="lezione" className="font-semibold">
          Scegliete una lezione da fare insieme
        </h2>
        <p className="text-sm text-muted">Ognuno studia le lezioni che ha già sbloccate: le regole del percorso non cambiano per nessuno.</p>
        <Link href="/percorso" className="btn btn-ghost min-h-12 w-fit">
          Vai al Percorso
        </Link>
      </section>
    </div>
  );
}
