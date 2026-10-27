"use client";

import Link from "next/link";
import { useState } from "react";
import { acceptFriendInvite } from "@/app/actions/social";
import type { AvatarId } from "@/lib/social/avatars";
import { Avatar } from "./avatar";
import { NicknameForm } from "./nickname-form";
import { NoticeLine, useAction } from "./use-action";

/** Scheda di un invito ricevuto: chi invita, cosa vedrà l'amico, e il pulsante che rende amici subito. */
export function InviteAccept({
  code,
  inviter,
  hasProfile,
  avatar,
}: {
  code: string;
  inviter: { nickname: string | null; avatar: string | null };
  hasProfile: boolean;
  avatar: AvatarId;
}) {
  const { busy, notice, run } = useAction();
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const who = inviter.nickname ?? "un amico";

  if (done !== null) {
    return (
      <div role="status" className="grid gap-3 rounded-lg border-2 border-success p-4">
        <p className="text-lg font-bold text-success">Ora siete amici.</p>
        <p>{done ? `${done} è tra i tuoi amici.` : "Il tuo nuovo amico è nell'elenco."}</p>
        <Link href="/social" className="btn btn-primary min-h-12 w-fit">
          Vai ai tuoi amici
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <Avatar id={inviter.avatar} size={56} />
        <div className="min-w-0">
          <p className="text-sm text-muted">Ti ha invitato</p>
          <p className="truncate text-xl font-bold">{who}</p>
        </div>
      </div>

      {!hasProfile && (
        <section aria-labelledby="passo-1" className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 id="passo-1" className="font-semibold">
            Primo passo: scegli come ti vedranno gli amici
          </h2>
          <p className="text-sm text-muted">Un soprannome di fantasia e un avatar. Mai il tuo nome vero, mai foto.</p>
          <NicknameForm initialNickname={null} initialAvatar={avatar} lockedUntil={null} />
        </section>
      )}

      {hasProfile && (
        <section aria-labelledby="passo-2" className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 id="passo-2" className="font-semibold">
            Cosa vede un amico di te
          </h2>
          <p className="text-sm">
            Il tuo <strong>soprannome</strong>, il tuo <strong>avatar</strong>, la tua <strong>serie</strong> di giorni e gli <strong>XP della settimana</strong>. Mai la tua email, mai il tuo nome. Puoi
            togliere un amico, segnalarlo o bloccarlo quando vuoi, e nascondere il tuo profilo dalle impostazioni Social.
          </p>
          <label className="flex min-h-12 items-start gap-3">
            <input type="checkbox" className="mt-1 h-6 w-6 shrink-0" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="text-sm">
              Voglio diventare amico di <strong>{who}</strong> e acconsento che mi veda come descritto qui sopra.
            </span>
          </label>
          <button
            type="button"
            disabled={busy || !consent}
            className="btn btn-primary min-h-12 w-full justify-center"
            onClick={async () => {
              const r = await run(() => acceptFriendInvite(code, consent));
              if (r.ok) setDone((r as { nickname: string | null }).nickname ?? "");
            }}
          >
            Accetta e diventa amico
          </button>
          <NoticeLine notice={notice} />
        </section>
      )}

      <p className="text-xs text-muted">Ragazzi (14-17 anni) e adulti non possono essere amici tra loro: un invito funziona solo nella stessa fascia d&apos;età.</p>
    </div>
  );
}
