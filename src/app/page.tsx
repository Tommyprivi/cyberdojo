import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { Seal } from "@/components/seal";
import { SiteHeader } from "@/components/site-header";
import { BELTS } from "@/lib/config";

const RULES = [
  { n: "01", t: "Casi, non capitoli", d: "Ogni lezione parte da un problema vero: un log, un pacchetto, un accesso strano. La teoria arriva quando serve a risolverlo." },
  { n: "02", t: "Il Sensei non regala niente", d: "La cintura si guadagna con una prova pratica. Le domande cambiano a ogni tentativo: copiare non serve." },
  { n: "03", t: "Sbagli? Ti dice dove", d: "Non solo «sbagliato»: «hai letto i bit al contrario». Poi riprovi con numeri nuovi." },
];

const FACTS = [
  { k: "255", d: "è il numero più grande in un ottetto. Non 256: si parte da zero." },
  { k: "192.168", d: "non viaggia su Internet: è riservato alle reti private. Se lo vedi in un log interno, il traffico parte da dentro." },
  { k: "32 bit", d: "bastano per circa 4,3 miliardi di indirizzi IPv4. Sono finiti da anni." },
];

export default function Home() {
  return (
    <>
      <SiteHeader wide />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 lg:px-8">
        {/* Apertura */}
        <section className="grid gap-10 pb-16 pt-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="grid gap-6">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-accent">Scuola di cybersecurity · gratis · in italiano</p>
            <h1 className="font-display text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Gli attacchi non si leggono. <span className="text-primary">Si decodificano.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Impari la sicurezza informatica risolvendo casi: registri firewall, pacchetti, accessi sospetti.
              Otto minuti alla volta, una cintura alla volta.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/registrati" className="btn btn-primary">Crea il tuo account</Link>
              <Link href="/corsi" className="btn btn-ghost">Guarda i corsi</Link>
            </div>
          </div>

          <div className="dossier relative grid gap-4 p-6 lg:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Caso F.05.003</p>
                <p className="font-display text-2xl font-bold">Il pacchetto delle 03:12</p>
              </div>
              <Seal size={52} />
            </div>
            <div className="rounded-md bg-deep p-4 font-mono text-sm leading-relaxed text-deep-fg">
              <p className="opacity-70">sorgente (bit grezzi):</p>
              <p className="break-all text-base">11000000 10101000 00000001 01000010</p>
              <p className="mt-2 opacity-70">destinazione: server dei dati · porta 22</p>
            </div>
            <p className="text-muted">Da dove arriva? Da Internet o da una scrivania dell&apos;azienda? La risposta è in quei 32 bit.</p>
            <Mascot size={84} mood="stern" className="absolute -bottom-6 -right-3 hidden sm:block" />
          </div>
        </section>

        {/* Tre cose */}
        <section aria-labelledby="sapevi" className="border-t border-border py-14">
          <h2 id="sapevi" className="font-display text-3xl font-bold lg:text-4xl">Tre cose che tra otto minuti saprai spiegare</h2>
          <ul className="mt-8 grid divide-border md:grid-cols-3 md:divide-x">
            {FACTS.map((f) => (
              <li key={f.k} className="py-4 md:px-8 md:first:pl-0 md:last:pr-0">
                <p className="font-mono text-4xl font-bold text-primary">{f.k}</p>
                <p className="mt-3 text-muted">{f.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Regole */}
        <section aria-labelledby="regole" className="border-t border-border py-14">
          <h2 id="regole" className="font-display text-3xl font-bold lg:text-4xl">Le regole del dojo</h2>
          <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-12">
            {RULES.map((r) => (
              <li key={r.n}>
                <p className="font-mono text-sm font-bold text-accent">{r.n}</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{r.t}</h3>
                <p className="mt-2 text-muted">{r.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Cinture: una fascia sola */}
        <section aria-labelledby="cinture" className="border-t border-border py-14">
          <h2 id="cinture" className="font-display text-3xl font-bold lg:text-4xl">Sette cinture. Nessuna regalata.</h2>
          <ol className="mt-8 grid grid-cols-7 overflow-hidden rounded-md border border-belt-outline">
            {BELTS.map((b, i) => (
              <li
                key={b.id}
                className="grid h-20 place-items-center text-center sm:h-28"
                style={{ background: `var(--belt-${b.token})`, color: `var(--belt-${b.token}-fg)` }}
              >
                <span className="font-mono text-lg font-bold sm:text-2xl">{i + 1}</span>
                <span className="hidden self-start text-xs font-semibold sm:block sm:text-sm">{b.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="border-t border-border pt-6 text-sm text-muted">
          Le voci del Sensei e dell&apos;Assistente sono sintetiche. Le tecniche di attacco si praticano solo in
          laboratori isolati, mai su sistemi reali.
        </p>
      </main>
    </>
  );
}
