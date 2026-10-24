import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { BeltIcon, BoltIcon, CheckIcon, FlameIcon, LockIcon, PlayIcon, TargetIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { ChevronDownIcon } from "@/components/nav-icons";
import { CourseMap, type MapCourse } from "@/components/percorso/course-map";
import { COURSES } from "@/lib/content/courses";
import { moduleCover } from "@/lib/content/covers";
import { loadCatalog, type LessonInfo } from "@/lib/content/catalog";
import { firstName as firstNameOf } from "@/lib/display-name";
import { beltOf, levelOf } from "@/lib/progress/profile-stats";
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
      <div className="h-80 rounded-lg bg-surface-muted" />
      <div className="h-72 rounded-lg bg-surface-muted" />
    </div>
  );
}

/** Barra sottile di avanzamento: filetto grigio con riempimento indaco. */
function Bar({ pct, label, className = "" }: { pct: number; label: string; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={`h-1.5 overflow-hidden rounded-full bg-surface-muted ${className}`}
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${className}`}>{children}</p>
);

async function PercorsoContent() {
  const { user, profile, completed, completedAt, xp, streak } = await requireMember("/percorso");
  const lessons = loadCatalog();

  const stateOf = (l: LessonInfo): "done" | "open" | "locked" =>
    completed.has(l.id) ? "done" : l.prerequisites.every((p) => completed.has(p)) ? "open" : "locked";

  const next = lessons.find((l) => stateOf(l) === "open");
  const nextCourse = next ? COURSES.find((c) => c.folder === next.course) : undefined;
  const nextModule = nextCourse?.modules.find((m) => m.n === next?.module);
  const sameModule = next ? lessons.filter((l) => l.course === next.course && l.module === next.module) : [];
  const moduleDone = sameModule.filter((l) => completed.has(l.id)).length;
  const modulePct = sameModule.length ? Math.round((moduleDone / sameModule.length) * 100) : 0;

  const tz = profile.timezone;
  const today = localDay(new Date(), tz);
  const doneToday = [...completedAt.values()].filter((d) => localDay(d, tz) === today).length;
  const goalReached = doneToday >= profile.dailyGoal;
  const goalPct = Math.min(100, Math.round((doneToday / Math.max(1, profile.dailyGoal)) * 100));
  const streakNow = effectiveStreak(streak, today);
  const firstName = firstNameOf(user);

  const stats = [
    { Icon: FlameIcon, label: "Serie", value: String(streakNow), unit: streakNow === 1 ? "giorno" : "giorni", tone: "text-accent", motion: streakNow > 0 ? "flicker" : "" },
    { Icon: BoltIcon, label: "XP", value: String(xp), unit: "totali", tone: "text-primary", motion: xp > 0 ? "zap" : "" },
    { Icon: BeltIcon, label: "Cintura", value: beltOf(levelOf(xp).level).name, unit: "cintura", tone: "text-foreground", motion: "" },
  ];

  const mapCourses: MapCourse[] = COURSES.map((c) => {
    const all = lessons.filter((l) => l.course === c.folder);
    return {
      id: c.id,
      title: c.title,
      done: all.filter((l) => completed.has(l.id)).length,
      total: all.length,
      modules: c.modules.map((m) => ({
        n: m.n,
        title: m.title,
        summary: m.summary,
        ...(({ src, own }) => ({ cover: src, own }))(moduleCover(c.id, m.n)),
        lessons: all.filter((l) => l.module === m.n).map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, state: stateOf(l) })),
      })),
    };
  });

  const nextCover = nextCourse && next ? moduleCover(nextCourse.id, next.module) : null;

  return (
    <div className="grid gap-x-8 gap-y-6 lg:h-full lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:gap-y-5 xl:grid-cols-[minmax(0,1fr)_23rem] xl:gap-x-10">
      {/* Saluto */}
      <header className="rise flex items-end justify-between gap-4 lg:col-start-1">
        <div className="grid gap-1">
          <Eyebrow className="text-accent">Il tuo percorso</Eyebrow>
          <h1 className="font-display text-4xl font-bold lg:text-4xl">Ciao, {firstName}.</h1>
          <p className="text-muted">Un caso al giorno. Il Sensei controlla.</p>
        </div>
        <Mascot size={64} animate className="shrink-0 lg:hidden" />
      </header>

      {/* Prossimo caso, in evidenza */}
      {next ? (
        <section
          aria-label="Prossimo caso"
          className="rise grid overflow-hidden rounded-lg border border-border bg-deep text-deep-fg lg:col-start-1 lg:grid-cols-[minmax(0,1fr)_20rem]"
          style={{ "--d": "0.1s" } as CSSProperties}
        >
          <div className="order-2 grid content-start gap-4 p-5 sm:p-6 lg:order-1 lg:p-6">
            <Eyebrow className="text-deep-fg/80">
              Prossimo caso · {nextCourse?.id}
              {next.module}
            </Eyebrow>
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight 2xl:text-4xl">{next.title}</h2>
              <p className="mt-1.5 font-mono text-sm text-deep-fg/80">
                {next.id} · {next.minutes} minuti
              </p>
            </div>
            <div className="grid gap-1.5">
              <div className="flex justify-between font-mono text-xs text-deep-fg/80">
                <span>{nextModule?.title}</span>
                <span>
                  {moduleDone}/{sameModule.length}
                </span>
              </div>
              <div
                className="shimmer relative h-1.5 overflow-hidden rounded-full bg-white/25"
                role="progressbar"
                aria-label="Avanzamento del modulo"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={modulePct}
              >
                <div className="h-full bg-primary" style={{ width: `${Math.max(modulePct, 3)}%` }} />
              </div>
            </div>
            <Link href={`/lezione/${next.id}`} className="btn btn-primary pulse-ring mt-1 min-h-14 w-full text-base lg:w-fit lg:min-w-52">
              {moduleDone > 0 ? "Continua il caso" : "Apri il caso"}
            </Link>
          </div>
          {nextCover && (
            <div className="relative order-1 h-36 sm:h-48 lg:order-2 lg:h-auto">
              <Image src={nextCover.src} alt="" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" priority />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-deep/70 to-transparent lg:bg-gradient-to-r lg:from-deep/60" />
              <div className="peek pointer-events-none absolute -bottom-2 right-3 hidden lg:block" style={{ "--d": "0.7s" } as CSSProperties}>
                <Mascot size={88} mood="stern" animate />
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="rise rounded-lg bg-deep p-6 text-deep-fg lg:col-start-1 lg:p-8" style={{ "--d": "0.1s" } as CSSProperties}>
          <Eyebrow className="text-deep-fg/80">Caso chiuso</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold">Hai finito tutto quello che c&apos;è.</h2>
          <p className="mt-1 text-deep-fg/80">I prossimi casi sono in preparazione. Nel frattempo, vai in laboratorio.</p>
          <Link href="/pratica" className="btn btn-primary mt-5 min-h-12">
            Vai al laboratorio
          </Link>
        </section>
      )}

      {/* Oggi: sotto il caso su telefono, colonna fissa a destra su PC */}
      <aside aria-label="Oggi" className="grid content-start gap-4 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:min-h-0 lg:content-start">
        <section aria-label="I tuoi numeri" className="rounded-lg border border-border bg-surface">
          <div className="hidden items-center justify-between border-b border-border px-4 py-3 lg:flex">
            <Eyebrow className="text-muted">Oggi</Eyebrow>
            <Mascot size={44} animate />
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            {stats.map(({ Icon, label, value, unit, tone, motion }, i) => (
              <div
                key={label}
                className="rise grid justify-items-center gap-0.5 px-2 py-4 text-center"
                style={{ "--d": `${0.15 + i * 0.1}s` } as CSSProperties}
              >
                <Icon className={`${tone} ${motion}`} width={24} height={24} />
                <span className="font-mono text-2xl font-bold">{value}</span>
                <span className="text-xs text-muted">
                  {label} · {unit}
                </span>
              </div>
            ))}
          </div>
          {streak.best > 0 && (
            <p className="border-t border-border px-4 py-2.5 text-sm text-muted">
              Record: {streak.best} {streak.best === 1 ? "giorno" : "giorni"}
              {streak.freezes > 0 && ` · ${streak.freezes} ${streak.freezes === 1 ? "congelamento" : "congelamenti"} di scorta`}
            </p>
          )}
        </section>

        <Link href="/piano" className="flex items-center justify-between gap-3 rounded-2xl border-2 border-primary bg-surface p-4 hover:bg-surface-muted">
          <span>
            <span className="block font-semibold">Il tuo piano di studio</span>
            <span className="block text-sm text-muted">Tappe consigliate e consigli su come seguire i corsi</span>
          </span>
          <span aria-hidden className="font-bold text-primary">→</span>
        </Link>

        <section aria-label="Obiettivo di oggi" className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-muted text-primary">
              {goalReached ? <CheckIcon /> : <TargetIcon />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">Obiettivo di oggi</p>
              <p className="text-sm text-muted">
                {Math.min(doneToday, profile.dailyGoal)} di {profile.dailyGoal} {profile.dailyGoal === 1 ? "lezione completata" : "lezioni completate"}
              </p>
            </div>
            <p className="font-mono font-bold text-primary">{goalReached ? "Fatto" : "+20 XP"}</p>
          </div>
          <Bar pct={goalPct} label="Obiettivo giornaliero" />
        </section>

        <section aria-label="Avanzamento dei corsi" className="hidden gap-4 rounded-lg border border-border bg-surface p-4 lg:grid">
          <Eyebrow className="text-muted">Avanzamento</Eyebrow>
          {COURSES.map((c) => {
            const all = lessons.filter((l) => l.course === c.folder);
            const done = all.filter((l) => completed.has(l.id)).length;
            const pct = all.length ? Math.round((done / all.length) * 100) : 0;
            return (
              <div key={c.id} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold leading-tight">{c.title}</p>
                  <p className="shrink-0 font-mono text-xs text-muted">
                    {done}/{all.length}
                  </p>
                </div>
                <Bar pct={pct} label={`Avanzamento: ${c.title}`} />
              </div>
            );
          })}
        </section>
      </aside>

      {/* Mappa dei corsi: PC, un modulo per volta */}
      <div className="hidden min-h-0 lg:col-start-1 lg:flex lg:flex-col">
        <CourseMap courses={mapCourses} initialCourse={nextCourse?.id ?? "F"} initialModule={next?.module ?? 1} />
      </div>

      {/* Mappa dei corsi: telefono, moduli a fisarmonica */}
      <div className="grid gap-12 pt-4 lg:hidden">
        {COURSES.map((course) => {
          const all = lessons.filter((l) => l.course === course.folder);
          const doneAll = all.filter((l) => completed.has(l.id)).length;
          const empty = course.modules.filter((m) => !all.some((l) => l.module === m.n));
          return (
            <section key={course.id} aria-labelledby={`p-${course.id}`} className="grid gap-4">
              <div className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-3">
                <div>
                  <Eyebrow className="text-muted">Corso {COURSES.indexOf(course) + 1}</Eyebrow>
                  <h2 id={`p-${course.id}`} className="font-display text-2xl font-bold lg:text-3xl">
                    {course.title}
                  </h2>
                </div>
                <p className="shrink-0 pb-1 font-mono text-sm text-muted">
                  {doneAll}/{all.length} lezioni
                </p>
              </div>

              <div className="grid gap-3">
                {course.modules.map((m) => {
                  const inModule = all.filter((l) => l.module === m.n);
                  if (inModule.length === 0) return null; // i moduli vuoti stanno in un blocco solo, in fondo
                  const doneInModule = inModule.filter((l) => completed.has(l.id)).length;
                  const pct = Math.round((doneInModule / inModule.length) * 100);
                  const hasOpen = inModule.some((l) => stateOf(l) === "open");
                  const cover = moduleCover(course.id, m.n);
                  return (
                    <details key={m.n} open={hasOpen} className="group overflow-hidden rounded-lg border border-border bg-surface">
                      <summary className="flex cursor-pointer list-none items-center gap-3 p-3 hover:bg-surface-muted/60 sm:gap-4 sm:p-4 [&::-webkit-details-marker]:hidden">
                        <span className="relative block size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-20 lg:h-20 lg:w-32">
                          <Image src={cover.src} alt="" fill sizes="128px" className={`object-cover ${cover.own ? "" : "opacity-60 saturate-50"}`} />
                          <span className="absolute left-1 top-1 rounded bg-deep px-1.5 py-0.5 font-mono text-[0.6875rem] font-bold text-deep-fg">
                            {course.id}
                            {m.n}
                          </span>
                        </span>
                        <span className="grid min-w-0 flex-1 gap-1">
                          <span className="font-display text-lg font-bold leading-tight sm:text-xl">{m.title}</span>
                          <span className="line-clamp-1 hidden text-sm text-muted sm:block">{m.summary}</span>
                          <span className="flex items-center gap-3">
                            <Bar pct={pct} label={`Avanzamento: ${m.title}`} className="max-w-48 flex-1" />
                            <span className="font-mono text-xs text-muted">
                              {doneInModule}/{inModule.length}
                            </span>
                          </span>
                        </span>
                        <ChevronDownIcon width={22} height={22} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="grid gap-2 border-t border-border p-3 sm:p-4 xl:grid-cols-2 2xl:grid-cols-3">
                        {inModule.map((l, i) => {
                          const st = stateOf(l);
                          const row = (
                            <>
                              <span
                                className={`grid size-10 shrink-0 place-items-center rounded-md font-mono text-sm font-bold ${
                                  st === "done" ? "bg-success text-success-fg" : st === "open" ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted"
                                }`}
                                aria-hidden
                              >
                                {st === "done" ? <CheckIcon width={18} height={18} /> : st === "locked" ? <LockIcon width={16} height={16} /> : String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold">{l.title}</span>
                                <span className="block font-mono text-xs text-muted">
                                  {l.id} · {l.minutes} min · {st === "done" ? "fatta" : st === "open" ? "da fare" : "bloccata"}
                                </span>
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
                                  className="flex min-h-14 items-center gap-3 rounded-md border border-dashed border-border p-2.5 text-muted"
                                >
                                  {row}
                                </div>
                              ) : (
                                <Link
                                  href={`/lezione/${l.id}`}
                                  aria-label={`${st === "done" ? "Rivedi" : "Inizia"}: ${l.title}`}
                                  className={`flex min-h-14 items-center gap-3 rounded-md border p-2.5 hover:border-foreground ${
                                    st === "open" ? "border-primary" : "border-border"
                                  }`}
                                >
                                  {row}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </details>
                  );
                })}
              </div>

              {empty.length > 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 text-muted">
                  <p className="flex items-center gap-2 font-semibold">
                    <LockIcon width={16} height={16} /> In preparazione
                  </p>
                  <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    {empty.map((m) => (
                      <li key={m.n}>
                        <span className="font-mono font-bold">
                          {course.id}
                          {m.n}
                        </span>{" "}
                        {m.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
