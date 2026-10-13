import type { Metadata } from "next";
import Link from "next/link";
import { BeltIcon, BoltIcon, FlameIcon, LockIcon, PlayIcon, TargetIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { COURSES } from "@/lib/content/courses";
import { readRawLessons } from "@/lib/content/load";

export const metadata: Metadata = { title: "Percorso" };

// Posizione orizzontale a zig-zag dei nodi (in rem rispetto al centro).
const OFFSETS = [0, 2.5, 4, 2.5, 0, -2.5, -4, -2.5];

export default function Percorso() {
  const lessons = readRawLessons();
  const next = lessons[0]; // finché non c'è l'account, la prossima lezione è la prima disponibile

  return (
    <div className="grid gap-6">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Ciao!</h1>
          <p className="text-muted">Una lezione al giorno e la cintura arriva.</p>
        </div>
        <Mascot size={96} />
      </section>

      <section aria-label="I tuoi numeri" className="grid grid-cols-3 gap-3">
        {[
          { Icon: FlameIcon, label: "Serie", value: "0", unit: "giorni", tone: "text-accent" },
          { Icon: BoltIcon, label: "XP", value: "0", unit: "totali", tone: "text-primary" },
          { Icon: BeltIcon, label: "Cintura", value: "Bianca", unit: "in corso", tone: "text-foreground" },
        ].map(({ Icon, label, value, unit, tone }) => (
          <div key={label} className="card grid justify-items-center gap-0.5 p-3 text-center">
            <Icon className={tone} width={28} height={28} />
            <span className="text-sm text-muted">{label}</span>
            <span className="text-xl font-extrabold">{value}</span>
            <span className="text-xs text-muted">{unit}</span>
          </div>
        ))}
      </section>
      <p className="-mt-3 text-sm text-muted">
        I progressi non sono ancora salvati: arriveranno con l&apos;account.
      </p>

      {next && (
        <section className="relative overflow-hidden rounded-[2rem] bg-deep p-5 text-deep-fg">
          <p className="text-sm opacity-90">Continua da qui</p>
          <h2 className="mt-1 text-2xl font-extrabold">{String(next.data.title)}</h2>
          <p className="text-sm opacity-90">
            {String(next.data.id)} · {String(next.data.duration_min)} minuti
          </p>
          <div className="mt-4 h-3 w-3/4 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-label="Avanzamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <div className="h-full w-0 bg-primary" />
          </div>
          <Link href={`/lezione/${next.data.id}`} className="btn btn-primary mt-5">
            Inizia
          </Link>
          <Mascot size={110} mood="stern" className="pointer-events-none absolute -bottom-3 right-2 opacity-95" />
        </section>
      )}

      <section aria-label="Obiettivo di oggi" className="card flex items-center gap-4 p-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface-muted text-primary">
          <TargetIcon />
        </span>
        <div className="flex-1">
          <p className="font-bold">Obiettivo di oggi</p>
          <p className="text-sm text-muted">0 di 1 lezione completata</p>
        </div>
        <p className="font-extrabold text-primary">+20 XP</p>
      </section>

      {COURSES.map((course) => (
        <section key={course.id} aria-labelledby={`p-${course.id}`} className="grid gap-5">
          <h2 id={`p-${course.id}`} className="font-display text-2xl font-extrabold">
            {course.title}
          </h2>
          {course.modules.map((m) => {
            const inModule = lessons.filter((l) => l.file.startsWith(`${course.folder}/`) && l.data.module === m.n);
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
                </div>
                <ol className="grid justify-items-center gap-3 py-2">
                  {inModule.map((l, i) => (
                    <li key={String(l.data.id)} className="grid justify-items-center gap-1" style={{ transform: `translateX(${OFFSETS[i % OFFSETS.length]}rem)` }}>
                      <Link
                        href={`/lezione/${l.data.id}`}
                        aria-label={`Inizia: ${l.data.title}`}
                        className="grid size-[4.5rem] place-items-center rounded-full bg-primary text-primary-fg shadow-[0_6px_0_var(--primary-edge)] active:translate-y-1 active:shadow-[0_2px_0_var(--primary-edge)]"
                      >
                        <PlayIcon width={28} height={28} />
                      </Link>
                      <span className="chip text-sm">{String(l.data.title)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
