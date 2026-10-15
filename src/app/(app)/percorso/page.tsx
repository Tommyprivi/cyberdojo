import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BeltIcon, BoltIcon, CheckIcon, FlameIcon, LockIcon, PlayIcon, TargetIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { COURSES } from "@/lib/content/courses";
import { loadCatalog, type LessonInfo } from "@/lib/content/catalog";
import { firstName as firstNameOf } from "@/lib/display-name";
import { effectiveStreak, localDay } from "@/lib/progress/streak";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Percorso" };

export default function Percorso() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PercorsoContent />
    </Suspense>
  );
}

/** Segnaposto mentre si legge la sessione: stessa struttura, nessun movimento. */
function Skeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]" aria-busy="true" aria-label="Carico il tuo percorso">
      <div className="h-96 rounded-xl bg-surface-muted" />
      <div className="h-72 rounded-xl bg-surface-muted" />
    </div>
  );
}

async function PercorsoContent() {
  const { user, profile, completed, completedAt, xp, streak } = await requireMember("/percorso");
  const lessons = loadCatalog();

  const stateOf = (l: LessonInfo): "done" | "open" | "locked" =>
    completed.has(l.id) ? "done" : l.prerequisites.every((p) => completed.has(p)) ? "open" : "locked";

  const next = lessons.find((l) => stateOf(l) === "open");
  const sameModule = next ? lessons.filter((l) => l.course === next.course && l.module === next.module) : [];
  const moduleDone = sameModule.filter((l) => completed.has(l.id)).length;
  const modulePct = sameModule.length ? Math.round((moduleDone / sameModule.length) * 100) : 0;

  const tz = profile.timezone;
  const today = localDay(new Date(), tz);
  const doneToday = [...completedAt.values()].filter((d) => localDay(d, tz) === today).length;
  const goalReached = doneToday >= profile.dailyGoal;
  const streakNow = effectiveStreak(streak, today);
  const firstName = firstNameOf(user);

  const stats = [
    { Icon: FlameIcon, label: "Serie", value: String(streakNow), unit: streakNow === 1 ? "giorno" : "giorni", tone: "text-accent", motion: streakNow > 0 ? "flicker" : "" },
    { Icon: BoltIcon, label: "XP", value: String(xp), unit: "totali", tone: "text-primary", motion: xp > 0 ? "zap" : "" },
    { Icon: BeltIcon, label: "Cintura", value: "Bianca", unit: "in corso", tone: "text-foreground", motion: "" },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-12">
      {/* OGGI: sopra su telefono, a destra e fisso su PC */}
      <aside aria-label="Oggi" className="grid gap-5 lg:sticky lg:top-8 lg:order-2">
        <section className="rise flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Oggi</p>
            <h1 className="font-display text-4xl font-bold">Ciao, {firstName}.</h1>
            <p className="mt-1 text-muted">Un caso al giorno. Il Sensei controlla.</p>
          </div>
          <Mascot size={84} animate className="shrink-0" />
        </section>

        <section aria-label="I tuoi numeri" className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface">
          {stats.map(({ Icon, label, value, unit, tone, motion }, i) => (
            <div
              key={label}
              className="rise lift grid justify-items-center gap-0.5 p-3 text-center"
              style={{ "--d": `${0.12 + i * 0.1}s` } as React.CSSProperties}
            >
              <Icon className={`${tone} ${motion}`} width={24} height={24} />
              <span className="font-mono text-2xl font-bold">{value}</span>
              <span className="text-xs text-muted">{label} · {unit}</span>
            </div>
          ))}
        </section>
        {streak.best > 0 && (
          <p className="-mt-3 text-sm text-muted">
            Record: {streak.best} {streak.best === 1 ? "giorno" : "giorni"}
            {streak.freezes > 0 && ` · ${streak.freezes} ${streak.freezes === 1 ? "congelamento" : "congelamenti"} di scorta`}
          </p>
        )}

        {next ? (
          <section
            className="rise relative overflow-hidden rounded-xl bg-deep p-6 text-deep-fg"
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-80">Prossimo caso</p>
            <h2 className="mt-2 max-w-[14rem] font-display text-3xl font-bold leading-tight">{next.title}</h2>
            <p className="mt-1 text-sm opacity-80">
              {next.id} · {next.minutes} minuti · modulo {moduleDone} di {sameModule.length}
            </p>
            <div
              className="shimmer relative mt-4 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/25"
              role="progressbar"
              aria-label="Avanzamento del modulo"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={modulePct}
            >
              <div className="h-full bg-primary" style={{ width: `${modulePct}%` }} />
            </div>
            <Link href={`/lezione/${next.id}`} className="btn btn-primary pulse-ring mt-6">
              Apri il caso
            </Link>
            <div className="peek pointer-events-none absolute -bottom-3 right-3" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <Mascot size={96} mood="stern" animate />
            </div>
          </section>
        ) : (
          <section className="rise rounded-xl bg-deep p-6 text-deep-fg" style={{ "--d": "0.4s" } as React.CSSProperties}>
            <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-80">Caso chiuso</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Hai finito tutto quello che c&apos;è.</h2>
            <p className="mt-1 opacity-80">I prossimi casi sono in preparazione. Nel frattempo, vai in laboratorio.</p>
            <Link href="/pratica" className="btn btn-primary mt-5">Vai al laboratorio</Link>
          </section>
        )}

        <section aria-label="Obiettivo di oggi" className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
          <span className="grid size-10 place-items-center rounded-md bg-surface-muted text-primary">
            {goalReached ? <CheckIcon /> : <TargetIcon />}
          </span>
          <div className="flex-1">
            <p className="font-semibold">Obiettivo di oggi</p>
            <p className="text-sm text-muted">
              {Math.min(doneToday, profile.dailyGoal)} di {profile.dailyGoal} {profile.dailyGoal === 1 ? "lezione completata" : "lezioni completate"}
            </p>
          </div>
          <p className="font-mono font-bold text-primary">{goalReached ? "Fatto" : "+20 XP"}</p>
        </section>
      </aside>

      {/* PROGRAMMA */}
      <div className="grid gap-10 lg:order-1">
        {COURSES.map((course) => (
          <section key={course.id} aria-labelledby={`p-${course.id}`} className="grid gap-5">
            <h2 id={`p-${course.id}`} className="border-b-2 border-foreground pb-2 font-display text-3xl font-bold">
              {course.title}
            </h2>
            {course.modules.map((m) => {
              const inModule = lessons.filter((l) => l.course === course.folder && l.module === m.n);
              if (inModule.length === 0) return null; // i moduli vuoti stanno in un blocco solo, in fondo
              const doneInModule = inModule.filter((l) => completed.has(l.id)).length;
              return (
                <div key={m.n} className="grid gap-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold">
                      <span className="mr-2 font-mono text-base text-accent">{course.id}{m.n}</span>
                      {m.title}
                    </h3>
                    <p className="font-mono text-sm text-muted">{doneInModule}/{inModule.length}</p>
                  </div>
                  <ol className="grid gap-2 xl:grid-cols-2">
                    {inModule.map((l, i) => {
                      const st = stateOf(l);
                      const row = (
                        <>
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-md font-mono text-sm font-bold ${
                              st === "done" ? "bg-success text-success-fg" : st === "open" ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted"
                            }`}
                            aria-hidden
                          >
                            {st === "done" ? <CheckIcon width={18} height={18} /> : st === "locked" ? <LockIcon width={16} height={16} /> : String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{l.title}</span>
                            <span className="block text-xs text-muted">{l.id} · {l.minutes} min</span>
                          </span>
                          {st === "open" && <PlayIcon width={18} height={18} className="shrink-0 text-primary" />}
                        </>
                      );
                      return (
                        <li key={l.id}>
                          {st === "locked" ? (
                            <div
                              role="img"
                              aria-label={`Bloccata: ${l.title}. Completa prima le lezioni precedenti.`}
                              className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 text-muted"
                            >
                              {row}
                            </div>
                          ) : (
                            <Link
                              href={`/lezione/${l.id}`}
                              aria-label={`${st === "done" ? "Rivedi" : "Inizia"}: ${l.title}`}
                              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:border-foreground"
                            >
                              {row}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
            {(() => {
              const empty = course.modules.filter((m) => !lessons.some((l) => l.course === course.folder && l.module === m.n));
              return empty.length > 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-muted">
                  <p className="flex items-center gap-2 font-semibold">
                    <LockIcon width={16} height={16} /> In preparazione
                  </p>
                  <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    {empty.map((m) => (
                      <li key={m.n}>
                        <span className="font-mono font-bold">{course.id}{m.n}</span> {m.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}
          </section>
        ))}
      </div>
    </div>
  );
}
