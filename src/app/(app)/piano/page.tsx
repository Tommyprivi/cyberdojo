import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckIcon, LockIcon, PlayIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { COURSES } from "@/lib/content/courses";
import { loadCatalog } from "@/lib/content/catalog";
import { buildPlan, studyTips } from "@/lib/plan/recommend";
import { GOALS } from "@/lib/profile-options";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Il tuo piano di studio" };

export default function Piano() {
  return (
    <Suspense fallback={<div className="h-80 rounded-2xl bg-surface-muted" aria-busy="true" />}>
      <PianoContent />
    </Suspense>
  );
}

const when = (days: number) => (days <= 0 ? "fatto" : days === 1 ? "1 giorno" : days < 14 ? `${days} giorni` : `${Math.ceil(days / 7)} settimane`);

async function PianoContent() {
  const { profile, completed } = await requireMember("/piano");
  const lessons = loadCatalog();
  const plan = buildPlan({ goal: profile.goal, dailyMinutes: profile.dailyMinutes }, lessons, completed);
  const tips = studyTips({ goal: profile.goal, dailyMinutes: profile.dailyMinutes, ageBand: profile.ageBand });
  const goal = GOALS.find((g) => g.id === profile.goal)?.label;
  const nextStage = plan.stages[plan.next];

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <header className="rise flex items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Il tuo piano</p>
          <h1 className="font-display text-3xl font-bold lg:text-4xl">Come studiare, tappa per tappa</h1>
          <p className="text-muted">
            {goal ? `Obiettivo: ${goal}. ` : ""}Con {plan.minutesPerDay} minuti al giorno{" "}
            {plan.totalMinutesLeft > 0 ? (
              <>
                finisci in circa <strong>{when(plan.totalDaysLeft)}</strong>.
              </>
            ) : (
              "hai finito tutto il piano."
            )}
          </p>
        </div>
        <Mascot size={72} animate className="shrink-0" />
      </header>

      <ol className="grid gap-3" aria-label="Tappe del piano">
        {plan.stages.map((s, i) => {
          const course = COURSES.find((c) => c.id === s.course)!;
          const pct = Math.round((s.done / s.total) * 100);
          const finished = s.done === s.total;
          const current = i === plan.next;
          return (
            <li
              key={i}
              className={`grid gap-2 rounded-2xl border-2 p-4 ${current ? "border-primary bg-surface" : "border-border bg-surface"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`grid size-10 shrink-0 place-items-center rounded-xl font-mono font-bold ${
                    finished ? "bg-success text-success-fg" : current ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted"
                  }`}
                >
                  {finished ? <CheckIcon width={20} height={20} /> : current ? <PlayIcon width={18} height={18} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold leading-tight">
                    {course.title} · {s.modules.map((n) => `${s.course}${n}`).join(", ")}
                  </p>
                  <p className="text-sm text-muted">{s.why}</p>
                </div>
                <p className="shrink-0 text-right font-mono text-xs text-muted">
                  {s.done}/{s.total}
                  <br />
                  {finished ? "fatto" : when(s.daysLeft)}
                </p>
              </div>
              <div role="progressbar" aria-label={`Avanzamento tappa ${i + 1}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              {current ? (
                <Link href="/percorso" className="btn btn-primary mt-1 min-h-12 w-full sm:w-fit">
                  Continua da qui
                </Link>
              ) : null}
            </li>
          );
        })}
      </ol>
      {nextStage ? null : (
        <p className="flex items-center gap-2 rounded-2xl border-2 border-primary bg-surface p-4 font-semibold">
          <LockIcon width={18} height={18} className="hidden" /> Piano completato: scegli un altro corso dal Percorso.
        </p>
      )}

      <section aria-labelledby="consigli" className="grid gap-3">
        <h2 id="consigli" className="font-display text-2xl font-bold">
          Come seguire i corsi
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {tips.map((t) => (
            <li key={t.title} className="rounded-2xl border-2 border-border bg-surface p-4">
              <p className="font-display text-lg font-bold">{t.title}</p>
              <p className="mt-1 text-muted">{t.text}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Obiettivo o minuti al giorno non vanno più bene? Li cambi dal <Link href="/profilo" className="font-semibold text-primary underline">Profilo</Link>.
        </p>
      </section>
    </div>
  );
}
