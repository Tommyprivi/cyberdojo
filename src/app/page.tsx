import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { BELTS, SITE } from "@/lib/config";

const STEPS = [
  { t: "Una lezione, otto minuti", d: "Ogni lezione finisce con una verifica pratica. Guardare non basta." },
  { t: "Nessun salto", d: "Passi alla cintura successiva solo con la prova superata." },
  { t: "Sbagliare serve", d: "Ti spieghiamo cosa hai sbagliato e perché. Poi riprovi." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <section className="grid gap-5">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Impara la cybersecurity. Sul serio.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            {SITE.name} è una scuola online gratuita, in italiano. Si parte da zero e si arriva a un livello
            professionale, una cintura alla volta.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/lezione/F.05.003" className="grid min-h-12 place-items-center rounded-lg bg-accent px-6 font-semibold text-accent-fg">
              Prova una lezione
            </Link>
            <Link href="/corsi" className="grid min-h-12 place-items-center rounded-lg border border-border px-6 font-medium hover:bg-surface-muted">
              Guarda i corsi
            </Link>
          </div>
        </section>

        <section aria-labelledby="cinture" className="mt-14">
          <h2 id="cinture" className="text-2xl font-bold">Sette cinture</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {BELTS.map((b) => (
              <li
                key={b.id}
                className="rounded-full border border-belt-outline px-4 py-2 font-medium"
                style={{ background: `var(--belt-${b.token})`, color: `var(--belt-${b.token}-fg)` }}
              >
                {b.label}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="come" className="mt-14">
          <h2 id="come" className="text-2xl font-bold">Come funziona</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.t} className="rounded-xl border border-border bg-surface p-4">
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-1 text-muted">{s.d}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="border-t border-border">
        <p className="mx-auto max-w-4xl px-4 py-6 text-sm text-muted">
          Le voci del Sensei e dell&apos;Assistente sono sintetiche. Le tecniche di attacco si imparano solo in
          laboratori isolati, mai su sistemi reali.
        </p>
      </footer>
    </>
  );
}
