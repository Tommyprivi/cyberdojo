"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Mascot } from "../mascot";
import type { ChallengeView, FriendRow, GroupView, LeaderRow, SocialSettings } from "@/lib/social/service";
import { ChallengesPanel } from "./challenges-panel";
import { FriendsPanel } from "./friends-panel";
import { GroupsPanel } from "./groups-panel";
import { LeaderboardPanel } from "./leaderboard-panel";
import { NicknameForm } from "./nickname-form";

export type SocialData = {
  settings: SocialSettings;
  resetIn: string;
  leaderboard: LeaderRow[];
  friends: FriendRow[];
  groups: GroupView[];
  challenges: ChallengeView[];
  wins: number;
};

const TABS = [
  { id: "classifica", label: "Classifica" },
  { id: "amici", label: "Amici" },
  { id: "gruppi", label: "Gruppi" },
  { id: "sfide", label: "Sfide" },
] as const;

/** Primo accesso: si sceglie un soprannome e un avatar prima di vedere qualsiasi altra cosa. */
function Setup({ settings }: { settings: SocialSettings }) {
  const minor = settings.ageGroup === "minori";
  return (
    <div className="mx-auto grid w-full max-w-2xl content-start gap-4 lg:my-auto">
      <div className="grid gap-4 rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <Mascot size={88} mood="attento" animate />
          <div>
            <h2 className="font-display text-2xl font-bold">Studiare insieme, se vuoi</h2>
            <p className="text-sm text-muted">Classifica, amici, gruppi e sfide. Tutto facoltativo e spento di default.</p>
          </div>
        </div>
        <ul className="grid list-disc gap-1.5 pl-5 text-sm">
          <li>Per farti riconoscere scegli un <strong>soprannome</strong> di fantasia e un <strong>avatar</strong> dell&apos;elenco. Mai il tuo nome vero, mai foto.</li>
          <li>Non esistono chat né messaggi privati: nessuno può scriverti, e non puoi scrivere a nessuno.</li>
          <li>Nessuno può cercarti: si entra in contatto solo con un codice invito che dai tu.</li>
          <li>
            Vedi e sei visto solo da persone della tua fascia d&apos;età ({minor ? "14-17 anni" : "18 anni e più"}).
            {minor && " I ragazzi non sono mai mischiati con gli adulti, salvo l'adulto responsabile di un gruppo."}
          </li>
          <li>Puoi segnalare qualsiasi soprannome o gruppo, e smettere in qualsiasi momento.</li>
        </ul>
        <NicknameForm initialNickname={null} initialAvatar={settings.avatar} lockedUntil={null} />
      </div>
      <p className="text-center text-sm text-muted">
        Come trattiamo i dati:{" "}
        <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
          informativa privacy
        </Link>
        {minor && (
          <>
            {" · "}
            <Link href="/minori" className="font-semibold text-primary underline underline-offset-2">
              per i minori e le famiglie
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function SocialApp({ data }: { data: SocialData }) {
  const { settings } = data;
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const pendingIn = data.friends.filter((f) => f.status === "pending" && f.incoming).length;

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + TABS.length) % TABS.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Social</p>
          <h1 className="font-display text-3xl font-bold leading-tight">Studiare insieme</h1>
        </div>
        {settings.hasProfile && (
          <Link href="/profilo/social" className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-muted">
            Privacy e consensi
          </Link>
        )}
      </header>

      {!settings.ageGroup ? (
        <p className="rounded-lg border border-border bg-surface p-5">
          Per usare il Social serve la tua fascia d&apos;età, così i ragazzi restano separati dagli adulti.{" "}
          <Link href="/benvenuto?next=/social" className="font-semibold text-primary underline underline-offset-2">
            Completa il profilo
          </Link>
          .
        </p>
      ) : !settings.hasProfile ? (
        <Setup settings={settings} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div role="tablist" aria-label="Social" onKeyDown={onKey} className="grid grid-cols-4 border-b border-border">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-t-${t.id}`}
                aria-selected={active === i}
                aria-controls={`${base}-p-${t.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={`-mb-px min-h-12 border-b-2 px-1 text-sm font-semibold sm:px-3 sm:text-base ${
                  active === i ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {t.label}
                {t.id === "amici" && pendingIn > 0 && (
                  <span className="ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-accent px-1.5 font-mono text-xs text-accent-fg" aria-label={`${pendingIn} richieste in arrivo`}>
                    {pendingIn}
                  </span>
                )}
              </button>
            ))}
          </div>

          {TABS.map((t, i) => (
            <div key={t.id} role="tabpanel" id={`${base}-p-${t.id}`} aria-labelledby={`${base}-t-${t.id}`} hidden={active !== i} className="min-h-0 flex-1">
              {t.id === "classifica" && <LeaderboardPanel settings={settings} rows={data.leaderboard} resetIn={data.resetIn} />}
              {t.id === "amici" && <FriendsPanel settings={settings} friends={data.friends} />}
              {t.id === "gruppi" && <GroupsPanel settings={settings} groups={data.groups} />}
              {t.id === "sfide" && <ChallengesPanel list={data.challenges} wins={data.wins} resetIn={data.resetIn} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
