import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountActions } from "@/components/account-actions";
import { ReminderSettings } from "@/components/reminder-settings";
import { displayName } from "@/lib/display-name";
import { GOALS } from "@/lib/profile-options";
import { effectiveStreak, localDay } from "@/lib/progress/streak";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Profilo", robots: { index: false } };

export default function ProfiloPage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="font-display text-3xl font-semibold">Il tuo profilo</h1>
      <Suspense fallback={<div className="h-64 rounded-3xl bg-surface-muted" aria-busy="true" />}>
        <ProfiloContent />
      </Suspense>
    </div>
  );
}

async function ProfiloContent() {
  const { user, profile, completed, xp, streak } = await requireMember("/profilo");
  const today = localDay(new Date(), profile.timezone);
  const goal = GOALS.find((g) => g.id === profile.goal)?.label ?? "—";

  const rows: [string, string][] = [
    ["Nome", displayName(user)],
    ["Email", user.email],
    ["Fascia d'età", profile.ageBand === "41+" ? "41 anni o più" : `${profile.ageBand ?? "—"} anni`],
    ["Obiettivo", goal],
    ["Tempo al giorno", `${profile.dailyMinutes ?? "—"} minuti`],
    ["Obiettivo giornaliero", `${profile.dailyGoal} ${profile.dailyGoal === 1 ? "lezione" : "lezioni"}`],
    ["Fuso orario", profile.timezone],
  ];

  return (
    <>
      <section className="card grid gap-4 p-5" aria-label="I tuoi numeri">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["XP", String(xp)],
            ["Lezioni completate", String(completed.size)],
            ["Serie", String(effectiveStreak(streak, today))],
            ["Record", String(streak.best)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface-muted p-3 text-center">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-2xl font-extrabold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card p-5" aria-labelledby="dati">
        <h2 id="dati" className="mb-3 font-display text-xl font-semibold">I tuoi dati</h2>
        <dl className="grid gap-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2 last:border-0">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card grid gap-3 p-5" aria-labelledby="promemoria">
        <h2 id="promemoria" className="font-display text-xl font-semibold">Promemoria di studio</h2>
        <ReminderSettings
          initialEnabled={profile.reminderEmail}
          initialHour={profile.reminderHour}
          emailVerified={user.emailVerified}
          email={user.email}
        />
      </section>

      <section className="card grid gap-3 p-5" aria-labelledby="diritti">
        <h2 id="diritti" className="font-display text-xl font-semibold">I tuoi diritti sui dati</h2>
        <p className="text-muted">
          Puoi scaricare tutto ciò che sappiamo di te, o cancellare l&apos;account. Non conserviamo la tua data di
          nascita: solo la fascia d&apos;età.
        </p>
        <AccountActions email={user.email} />
      </section>
    </>
  );
}
