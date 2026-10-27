import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { InviteAccept } from "@/components/social/invite-accept";
import { SITE } from "@/lib/config";
import { getSessionUser, requireMember } from "@/lib/session";
import { isAvatarId } from "@/lib/social/avatars";
import { inviteCodeFromParam } from "@/lib/social/invite";
import * as social from "@/lib/social/service";

// Il link contiene un codice personale: non va indicizzato.
export const metadata: Metadata = { title: "Invito su CyberDojo", robots: { index: false, follow: false } };

type Params = { params: Promise<{ codice: string }> };

export default function InvitoPage({ params }: Params) {
  return (
    <Suspense fallback={<p className="p-6 font-mono text-sm text-muted">Controllo l&apos;invito…</p>}>
      <Invito params={params} />
    </Suspense>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid max-w-xl gap-4 p-4 sm:p-6">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{SITE.name} · invito</p>
      <h1 className="font-display text-3xl font-bold">Hai ricevuto un invito su CyberDojo</h1>
      {children}
    </main>
  );
}

async function Invito({ params }: Params) {
  const code = inviteCodeFromParam((await params).codice);
  if (!code) {
    return (
      <Shell>
        <p role="status" className="rounded-lg border border-accent p-4 font-semibold">
          Questo link di invito non è valido. Controlla di averlo copiato per intero, oppure chiedi un nuovo invito al tuo amico.
        </p>
      </Shell>
    );
  }

  const user = await getSessionUser();
  const here = `/invito/${code}`;
  if (!user) {
    const next = encodeURIComponent(here);
    return (
      <Shell>
        <p>Un amico ti invita a studiare la sicurezza informatica insieme a lui. Per accettare serve un account gratuito.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href={`/registrati?next=${next}`} className="btn btn-primary min-h-12 justify-center">
            Registrati
          </Link>
          <Link href={`/accedi?next=${next}`} className="btn btn-ghost min-h-12 justify-center">
            Accedi
          </Link>
        </div>
        <p className="text-sm text-muted">Ragazzi (14-17 anni) e adulti non possono essere amici tra loro: l&apos;invito funziona solo nella stessa fascia d&apos;età.</p>
      </Shell>
    );
  }

  // Profilo completo (fascia d'età inclusa) prima di tutto: altrimenti rimanda a /benvenuto e poi torna qui.
  await requireMember(here);
  const preview = await social.getInvitePreview(user.id, code);
  if (!preview.ok) {
    return (
      <Shell>
        <p role="status" className="rounded-lg border border-border p-4">
          {preview.error}
        </p>
        <Link href="/social" className="btn btn-ghost min-h-12 w-fit">
          Vai ai tuoi amici
        </Link>
      </Shell>
    );
  }
  const settings = await social.getSettings(user.id);
  return (
    <Shell>
      <InviteAccept code={code} inviter={preview.invite} hasProfile={settings.hasProfile} avatar={isAvatarId(settings.avatar) ? settings.avatar : "sensei"} />
    </Shell>
  );
}
