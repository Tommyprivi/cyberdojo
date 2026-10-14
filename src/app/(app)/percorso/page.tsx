import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BeltIcon, BoltIcon, CheckIcon, FlameIcon, LockIcon, PlayIcon, TargetIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { COURSES } from "@/lib/content/courses";
import { readRawLessons } from "@/lib/content/load";
import { isVisible, lessonFrontmatter } from "@/lib/content/schema";
import { firstName as firstNameOf } from "@/lib/display-name";
import { effectiveStreak, localDay } from "@/lib/progress/streak";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Percorso" };

// Posizione orizzontale a zig-zag dei nodi (in rem rispetto al centro).
const OFFSETS = [0, 2.5, 4, 2.5, 0, -2.5, -4, -2.5];

type LessonInfo = { id: string; title: string; course: string; module: number; minutes: number; prerequisites: string[] };

function loadLessons(): LessonInfo[] {
  return readRawLessons()
    .flatMap((l) => {
      const fm = lessonFrontmatter.safeParse(l.data);
      return fm.success && isVisible(fm.data.status)
        ? [{ id: fm.data.id, title: fm.data.title, course: l.file.split("/")[0], module: fm.data.module, minutes: fm.data.duration_min, prerequisites: fm.data.prerequisites }]
        : [];
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

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
    <div className="grid gap-6" aria-busy="true" aria-label="Carico il tuo percorso">
      <div className="h-20 rounded-3xl bg-surface-muted" />
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-3xl bg-surface-muted" />)}
      </div>
      <div className="h-52 rounded-[2rem] bg-surface-muted" />
    </div>
  );
}

async function PercorsoContent() {
  const { user, profile, completed, completedAt, xp, streak } = await requireMember("/percorso");
  const lessons = loadLessons();

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

  return (
    <div className="grid gap-6">
      <section className="rise flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Ciao, {firstName}.</h1>
          <p className="text-muted">Un caso al giorno. Il Sensei controlla.</p>
        </div>
        <Mascot size={96} animate />
      </section>

      <section aria-label="I tuoi numeri" className="grid grid-cols-3 gap-3">
        {[
          { Icon: FlameIcon, label: "Serie", value: String(streakNow), unit: streakNow === 1 ? "giorno" : "giorni", tone: "text-accent", motion: streakNow > 0 ? "flicker" : "" },
          { Icon: BoltIcon, label: "XP", value: String(xp), unit: "totali", tone: "text-primary", motion: xp > 0 ? "zap" : "" },
          { Icon: BeltIcon, label: "Cintura", value: "Bianca", unit: "in corso", tone: "text-foreground", motion: "" },
        ].map(({ Icon, label, value, unit, tone, motion }, i) => (
          <div
            key={label}
            className="card rise lift grid justify-items-center gap-0.5 p-3 text-center"
            style={{ "--d": `${0.12 + i * 0.1}s` } as React.CSSProperties}
          >
            <Icon className={`${tone} ${motion}`} width={28} height={28} />
            <span className="text-sm text-muted">{label}</span>
            <span className="text-xl font-extrabold">{value}</span>
            <span className="text-xs text-muted">{unit}</span>
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
          className="rise relative overflow-hidden rounded-[2rem] bg-deep p-5 text-deep-fg"
          style={{ "--d": "0.4s" } as React.CSSProperties}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-90">Prossimo caso</p>
          <h2 className="mt-1 text-2xl font-extrabold">{next.title}</h2>
          <p className="text-sm opacity-90">
            {next.id} · {next.minutes} minuti · modulo {moduleDone} di {sameModule.length}
          </p>
          <div
            className="shimmer relative mt-4 h-3 w-3/4 overflow-hidden rounded-full bg-white/25"
            role="progressbar"
            aria-label="Avanzamento del modulo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={modulePct}
          >
            <div className="h-full bg-primary" style={{ width: `${modulePct}%` }} />
          </div>
          <Link href={`/lezione/${next.id}`} className="btn btn-primary pulse-ring mt-5">
            Apri il caso
          </Link>
          <div className="peek pointer-events-none absolute -bottom-3 right-2" style={{ "--d": "0.7s" } as React.CSSProperties}>
            <Mascot size={110} mood="stern" animate />
          </div>
        </section>
      ) : (
        <section className="rise rounded-[2rem] bg-deep p-5 text-deep-fg" style={{ "--d": "0.4s" } as React.CSSProperties}>
          <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-90">Caso chiuso</p>
          <h2 className="mt-1 text-2xl font-extrabold">Hai finito tutto quello che c&apos;è.</h2>
          <p className="mt-1 opacity-90">I prossimi casi sono in preparazione. Nel frattempo, allenati.</p>
          <Link href="/pratica" className="btn btn-primary mt-5">Vai ad Allenati</Link>
        </section>
      )}

      <section aria-label="Obiettivo di oggi" className="card flex items-center gap-4 p-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface-muted text-primary">
          {goalReached ? <CheckIcon /> : <TargetIcon />}
        </span>
        <div className="flex-1">
          <p className="font-bold">Obiettivo di oggi</p>
          <p className="text-sm text-muted">
            {Math.min(doneToday, profile.dailyGoal)} di {profile.dailyGoal} {profile.dailyGoal === 1 ? "lezione completata" : "lezioni completate"}
          </p>
        </div>
        <p className="font-extrabold text-primary">{goalReached ? "Fatto" : "+20 XP"}</p>
      </section>

      {COURSES.map((course) => (
        <section key={course.id} aria-labelledby={`p-${course.id}`} className="grid gap-5">
          <h2 id={`p-${course.id}`} className="font-display text-2xl font-extrabold">
            {course.title}
          </h2>
          {course.modules.map((m) => {
            const inModule = lessons.filter((l) => l.course === course.folder && l.module === m.n);
            if (inModule.length === 0) {
              return (
                <div key={m.n} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border px-4 py-3 text-muted">
                  <LockIcon width={20} height={20} />
                  <p className="flex-1">
                    <span className="font-bold">{course.id}{m.n} · {m.title}</span>
                    <span className="block text-xs">In preparazione</span>
                  </p>
                </div>
              );
            }
            return (
              <div key={m.n} className="grid gap-3">
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-deep px-4 py-3 text-deep-fg">
                  <div>
                    <p className="text-xs opacity-80">Modulo {course.id}{m.n}</p>
                    <p className="font-bold">{m.title}</p>
                  </div>
                  <p className="text-sm opacity-90">{inModule.filter((l) => completed.has(l.id)).length}/{inModule.length}</p>
                </div>
                <ol className="grid justify-items-center gap-3 py-2">
                  {inModule.map((l, i) => {
                    const st = stateOf(l);
                    const offset = { transform: `translateX(${OFFSETS[i % OFFSETS.length]}rem)` };
                    return (
                      <li key={l.id} className="grid justify-items-center gap-1" style={offset}>
                        {st === "locked" ? (
                          <span
                            role="img"
                            aria-label={`Bloccata: ${l.title}. Completa prima le lezioni precedenti.`}
                            className="grid size-[4.5rem] place-items-center rounded-full bg-surface-muted text-muted shadow-[0_5px_0_var(--border)]"
                          >
                            <LockIcon width={26} height={26} />
                          </span>
                        ) : (
                          <Link
                            href={`/lezione/${l.id}`}
                            aria-label={`${st === "done" ? "Rivedi" : "Inizia"}: ${l.title}`}
                            className={`grid size-[4.5rem] place-items-center rounded-full active:translate-y-1 ${
                              st === "done"
                                ? "border-4 border-primary bg-surface text-primary shadow-[0_5px_0_var(--border)]"
                                : "bg-primary text-primary-fg shadow-[0_6px_0_var(--primary-edge)] active:shadow-[0_2px_0_var(--primary-edge)]"
                            }`}
                          >
                            {st === "done" ? <CheckIcon width={30} height={30} /> : <PlayIcon width={28} height={28} />}
                          </Link>
                        )}
                        <span className={`chip text-sm ${st === "locked" ? "text-muted" : ""}`}>{l.title}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
