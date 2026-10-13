import Link from "next/link";
import { BeltIcon, BoltIcon, FlameIcon, TargetIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { SiteHeader } from "@/components/site-header";
import { BELTS } from "@/lib/config";

const STEPS = [
  { Icon: TargetIcon, t: "Otto minuti alla volta", d: "Ogni lezione finisce con una prova vera. Non basta guardare: devi saperlo fare." },
  { Icon: BeltIcon, t: "Una cintura alla volta", d: "Sali di livello solo superando la prova. Niente scorciatoie, e per questo vale." },
  { Icon: FlameIcon, t: "Sbagliare è il metodo", d: "Se sbagli ti spieghiamo dove e perché, poi riprovi con domande nuove." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        <section className="grid items-center gap-6 pt-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5">
            <p className="chip w-fit text-sm">
              <BoltIcon width={16} height={16} className="text-primary" /> Gratis, in italiano
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Diventa <span className="text-primary">cintura nera</span> della cybersecurity.
            </h1>
            <p className="text-lg text-muted">
              Lezioni da otto minuti, prove vere e un maestro severo ma giusto. Parti da zero, sali una
              cintura alla volta.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/lezione/F.05.003" className="btn btn-primary">
                Prova una lezione
              </Link>
              <Link href="/percorso" className="btn btn-ghost">
                Vedi il percorso
              </Link>
            </div>
          </div>
          <div className="relative mx-auto grid place-items-center">
            <div className="absolute inset-4 rounded-full bg-surface/70 blur-2xl" aria-hidden />
            <Mascot size={240} className="relative drop-shadow-[0_14px_20px_rgb(22_80_40/0.25)]" />
          </div>
        </section>

        <section aria-labelledby="cinture" className="mt-14">
          <h2 id="cinture" className="text-2xl font-extrabold">Sette cinture, un solo sentiero</h2>
          <ol className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
            {BELTS.map((b, i) => (
              <li key={b.id} className="grid gap-1 text-center">
                <span
                  className="grid h-14 place-items-center rounded-2xl border-2 border-belt-outline text-lg font-extrabold"
                  style={{ background: `var(--belt-${b.token})`, color: `var(--belt-${b.token}-fg)` }}
                >
                  {i + 1}
                </span>
                <span className="text-[0.7rem] font-semibold sm:text-xs">{b.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="come" className="mt-14">
          <h2 id="come" className="text-2xl font-extrabold">Come funziona</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ Icon, t, d }) => (
              <li key={t} className="card p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-fg">
                  <Icon />
                </span>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-[2rem] bg-deep p-6 text-deep-fg">
          <div className="max-w-sm">
            <h2 className="text-2xl font-extrabold">Pronto a indossare la cintura bianca?</h2>
            <p className="mt-1 opacity-90">Bastano otto minuti per la prima lezione.</p>
          </div>
          <Link href="/lezione/F.05.003" className="btn btn-primary">
            Inizia ora
          </Link>
        </section>

        <p className="mt-10 text-sm text-muted">
          Le voci del Sensei e dell&apos;Assistente sono sintetiche. Le tecniche di attacco si imparano solo in
          laboratori isolati, mai su sistemi reali.
        </p>
      </main>
    </>
  );
}
