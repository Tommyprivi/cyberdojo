import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { NicknameForm } from "@/components/social/nickname-form";
import { SocialSettings } from "@/components/social/social-settings";
import { AGE_GROUP_LABEL } from "@/lib/social/rules";
import * as social from "@/lib/social/service";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Social e privacy", robots: { index: false } };

export default function SocialSettingsPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico le impostazioni" />}>
      <SocialSettingsContent />
    </Suspense>
  );
}

async function SocialSettingsContent() {
  const { user } = await requireMember("/profilo/social");
  const s = await social.getSettings(user.id);

  return (
    <div className="mx-auto grid w-full max-w-3xl content-start gap-4 lg:mx-0 lg:max-w-4xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Profilo · Social</p>
          <h1 className="font-display text-3xl font-bold leading-tight">Social e privacy</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/profilo" className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-muted">
            Torna al profilo
          </Link>
          {s.hasProfile && (
            <Link href="/social" className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-muted">
              Vai al Social
            </Link>
          )}
        </div>
      </header>

      {!s.ageGroup ? (
        <p className="rounded-lg border border-border bg-surface p-4">Per usare il Social serve la fascia d&apos;età nel profilo.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="grid content-start gap-3 rounded-lg border border-border bg-surface p-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Soprannome e avatar</h2>
            <NicknameForm initialNickname={s.nickname} initialAvatar={s.avatar} lockedUntil={s.nicknameLockedUntil} />
          </section>
          <section className="grid content-start gap-3 rounded-lg border border-border bg-surface p-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Cosa vedono gli altri</h2>
            <p className="text-sm text-muted">
              Fascia d&apos;età per il Social: <strong className="text-foreground">{AGE_GROUP_LABEL[s.ageGroup]}</strong>. Vedi e sei visto solo da persone della tua fascia. Se cambi la fascia nel
              profilo, il Social si azzera (soprannome, amici, gruppi).
            </p>
            <SocialSettings
              initial={{ joinLeaderboard: s.joinLeaderboard, showToFriends: s.showToFriends, acceptRequests: s.acceptRequests }}
              canToggle={s.hasProfile}
              blocked={s.blocked}
            />
          </section>
        </div>
      )}
      <p className="text-sm text-muted">
        Cancellando l&apos;account (dal Profilo, scheda «Diritti») sparisce tutto il Social. I dati si scaricano dalla stessa scheda. Dettagli nell&apos;{" "}
        <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
          informativa privacy
        </Link>
        .
      </p>
    </div>
  );
}
