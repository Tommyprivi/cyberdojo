import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AccountActions } from "@/components/account-actions";
import { BoltIcon, FlameIcon } from "@/components/icons";
import { SenseiPreview } from "@/components/shop/sensei-preview";
import { BeltArt, MedalArt, StreakCalendar } from "@/components/profilo/graphics";
import { ProfileTabs } from "@/components/profilo/profile-tabs";
import { SecuritySection } from "@/components/profilo/security-section";
import { ReminderSettings } from "@/components/reminder-settings";
import { InstallApp } from "@/components/pwa";
import { HapticsToggle } from "@/components/haptics-toggle";
import { SoundToggle } from "@/components/sound-toggle";
import { AgeSettings } from "@/components/profilo/age-settings";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/user-menu";
import { displayName } from "@/lib/display-name";
import { GOALS } from "@/lib/profile-options";
import { beltOf, levelOf, medalsFor } from "@/lib/progress/profile-stats";
import { effectiveStreak, localDay } from "@/lib/progress/streak";
import { requireMember } from "@/lib/session";
import { getEquippedIds } from "@/lib/shop/service";
import { getChallengeWins } from "@/lib/social/service";

export const metadata: Metadata = { title: "Profilo", robots: { index: false } };

export default function ProfiloPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico il profilo" />}>
      <ProfiloContent />
    </Suspense>
  );
}

const Eyebrow = ({ children, className = "text-muted" }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${className}`}>{children}</h2>
);

const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-lg border border-border bg-surface ${className}`}>{children}</section>
);

/** Il Sensei commenta i tuoi numeri: severo ma caldo. */
function senseiSays(lessons: number, streak: number) {
  if (lessons === 0) return "Non hai ancora aperto nessun caso. Comincia: ti aspetto.";
  if (streak >= 7) return "Sette giorni di fila. Il dojo ti riconosce.";
  if (streak >= 3) return "Tre giorni e oltre. L'abitudine sta mettendo radici.";
  if (streak >= 1) return "La serie è accesa. Domani non saltare.";
  return "La serie si è spenta. Si riaccende con una lezione.";
}

async function ProfiloContent() {
  const { user, profile, completed, completedAt, xp, streak } = await requireMember("/profilo");
  const equippedIds = await getEquippedIds(user.id);
  const tz = profile.timezone;
  const today = localDay(new Date(), tz);
  const goal = GOALS.find((g) => g.id === profile.goal)?.label ?? "—";
  const name = displayName(user);
  const streakNow = effectiveStreak(streak, today);
  const lvl = levelOf(xp);

  const belt = beltOf(lvl.level);
  const beltDone = lvl.level >= 2;

  const doneDays = new Set([...completedAt.values()].map((d) => localDay(d, tz)));
  const challengesWon = await getChallengeWins(user.id);
  const medals = medalsFor({ xp, lessons: completed.size, bestStreak: streak.best, beltDone, challengesWon });
  const unlocked = medals.filter((m) => m.unlocked).length;

  const rows: [string, string][] = [
    ["Fascia d'età", profile.ageBand === "41+" ? "41 anni o più" : `${profile.ageBand ?? "—"} anni`],
    ["Obiettivo", goal],
    ["Tempo al giorno", `${profile.dailyMinutes ?? "—"} minuti`],
    ["Obiettivo giornaliero", `${profile.dailyGoal} ${profile.dailyGoal === 1 ? "lezione" : "lezioni"}`],
    ["Fuso orario", profile.timezone],
  ];

  const tabs = [
    {
      id: "dati",
      label: "Dati",
      content: (
        <div className="grid gap-4">
          <dl className="grid grid-cols-2 gap-2">
            <div className="col-span-2 rounded-md border border-border bg-background p-3">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">Email</dt>
              <dd className="break-all font-semibold">{user.email}</dd>
            </div>
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-md border border-border bg-background p-3">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">{k}</dt>
                <dd className="break-words font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <AgeSettings current={profile.ageBand} />
          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3">
            <p>
              <span className="block font-semibold">Tema</span>
              <span className="block text-sm text-muted">Chiaro, scuro o del dispositivo.</span>
            </p>
            <span className="flex flex-wrap gap-2">
              <ThemeToggle />
              <SoundToggle withLabel />
              <HapticsToggle withLabel />
            </span>
          </div>
          <InstallApp />
          <Link
            href="/social"
            className="flex min-h-11 items-center justify-between gap-3 rounded-xl border-2 border-primary bg-background p-3 hover:bg-surface-muted"
          >
            <span>
              <span className="block font-semibold">Amici e sfide</span>
              <span className="block text-sm text-muted">Sfida i tuoi amici e guarda la classifica.</span>
            </span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/profilo/social"
            className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-background p-3 hover:bg-surface-muted"
          >
            <span>
              <span className="block font-semibold">Social e privacy</span>
              <span className="block text-sm text-muted">Soprannome, avatar e cosa vedono gli altri.</span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      ),
    },
    {
      id: "promemoria",
      label: "Promemoria",
      content: (
        <ReminderSettings
          initialEnabled={profile.reminderEmail}
          initialHour={profile.reminderHour}
          emailVerified={user.emailVerified}
          email={user.email}
        />
      ),
    },
    {
      id: "sicurezza",
      label: "Sicurezza",
      content: <SecuritySection userId={user.id} email={user.email} enabled={Boolean(user.twoFactorEnabled)} />,
    },
    {
      id: "diritti",
      label: "Diritti",
      content: (
        <div className="grid gap-3">
          <p className="text-muted">
            Puoi scaricare tutto ciò che sappiamo di te, o cancellare l&apos;account. Non conserviamo la tua data di nascita: solo la fascia d&apos;età.
          </p>
          <AccountActions email={user.email} />
        </div>
      ),
    },
  ];

  return (
    <div className="grid content-start gap-4 lg:h-full lg:grid-cols-2 lg:gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_22rem] xl:grid-rows-1">
      {/* Colonna 1: tu, il livello, la cintura */}
      <div className="grid content-start gap-4 lg:gap-5 xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)]">
        <Panel className="grid gap-4 p-5">
          <div className="flex items-center gap-4">
            <SenseiPreview equipped={equippedIds} mood={streakNow > 0 ? "happy" : "stern"} animate className="size-28" />
            <div className="min-w-0">
              <Eyebrow className="text-accent">Profilo</Eyebrow>
              <p className="truncate font-display text-3xl font-bold leading-tight">{name}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-deep px-2 py-1 font-mono text-xs font-bold text-deep-fg">
                <BoltIcon width={14} height={14} /> Livello {lvl.level} · {lvl.name}
              </p>
            </div>
          </div>
          <p className="relative rounded-md border border-border bg-background px-3 py-2.5 text-sm before:absolute before:-top-1.5 before:left-8 before:size-3 before:rotate-45 before:border-l before:border-t before:border-border before:bg-background">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-widest text-muted">Sensei</span>
            <br />
            {senseiSays(completed.size, streakNow)}
          </p>
          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="font-bold">{xp} XP</span>
              <span className="text-muted">
                prossimo livello a {lvl.to}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Esperienza verso il prossimo livello"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={lvl.pct}
              className="relative h-3 overflow-hidden rounded-full bg-surface-muted"
            >
              <div className="shimmer relative h-full overflow-hidden rounded-full bg-primary transition-[width]" style={{ width: `${Math.max(lvl.pct, 3)}%` }} />
            </div>
          </div>
        </Panel>

        <Panel className="grid content-center gap-3 p-5">
          <Eyebrow>La tua cintura</Eyebrow>
          <BeltArt color={belt.color} name={belt.name} className="h-auto w-full max-w-64 justify-self-center" />
          <p className="text-center font-display text-xl font-bold">Cintura {belt.name.toLowerCase()}</p>
          <div className="grid gap-1.5">
            <div className="flex justify-between font-mono text-xs text-muted">
              <span>{belt.next ? `Verso la ${belt.next.toLowerCase()}` : "Cintura più alta raggiunta"}</span>
              <span>
                {lvl.into}/{lvl.span} XP
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Avanzamento verso la prossima cintura"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={lvl.pct}
              className="h-2 overflow-hidden rounded-full bg-surface-muted"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${lvl.pct}%` }} />
            </div>
          </div>
        </Panel>
      </div>

      {/* Colonna 2: serie e medaglie */}
      <div className="grid content-start gap-4 lg:gap-5 xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)]">
        <Panel className="grid gap-4 p-5">
          <div className="flex items-center gap-4">
            <span className={`grid size-20 shrink-0 place-items-center rounded-lg ${streakNow > 0 ? "bg-accent/15 text-accent" : "bg-surface-muted text-muted"}`}>
              <FlameIcon width={48} height={48} className={streakNow > 0 ? "flicker" : ""} />
            </span>
            <div>
              <Eyebrow>Serie</Eyebrow>
              <p className="font-mono text-4xl font-bold leading-none">
                {streakNow} <span className="font-sans text-base font-semibold text-muted">{streakNow === 1 ? "giorno" : "giorni"}</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                Record {streak.best}
                {streak.freezes > 0 && ` · ${streak.freezes} ${streak.freezes === 1 ? "congelamento" : "congelamenti"} di scorta`}
              </p>
            </div>
          </div>
          <StreakCalendar today={today} doneDays={doneDays} />
        </Panel>

        <Panel className="flex min-h-0 flex-col gap-4 p-5">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Medaglie</Eyebrow>
            <p className="font-mono text-xs text-muted">
              {unlocked}/{medals.length} sbloccate
            </p>
          </div>
          <ul className="grid min-h-0 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 xl:overflow-y-auto">
            {medals.map((m) => (
              <li key={m.id} className="grid justify-items-center gap-1 text-center">
                <MedalArt icon={m.icon} unlocked={m.unlocked} size={56} id={m.id} />
                <p className="text-sm font-semibold leading-tight">{m.label}</p>
                <p className="text-xs text-muted">{m.unlocked ? "Sbloccata" : m.hint}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Colonna 3: impostazioni a schede */}
      <Panel className="flex flex-col overflow-hidden lg:col-span-2 xl:col-span-1 xl:min-h-0">
        <div className="border-b border-border px-4 py-3">
          <Eyebrow>Impostazioni</Eyebrow>
        </div>
        <ProfileTabs tabs={tabs} />
        <div className="border-t border-border p-4 lg:hidden">
          <SignOutButton />
        </div>
      </Panel>
    </div>
  );
}
