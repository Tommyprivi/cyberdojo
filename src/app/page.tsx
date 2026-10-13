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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        <section className="grid items-center gap-8 pt-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-5">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-accent">Scuola di cybersecurity · gratis · in italiano</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] sm:text-6xl">
              Gli attacchi non si leggono. <span className="text-primary">Si decodificano.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Impari la sicurezza informatica risolvendo casi: registri firewall, pacchetti, accessi sospetti.
              Otto minuti alla volta, una cintura alla volta.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/lezione/F.05.003" className="btn btn-primary">
                Apri il primo caso
              </Link>
              <Link href="/pratica/intruso" className="btn btn-ghost">
                Caccia all&apos;intruso
              </Link>
            </div>
          </div>

          {/* Anteprima del primo caso, come un fascicolo */}
          <div className="dossier relative grid gap-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Caso F.05.003</p>
                <p className="font-display text-2xl font-semibold">Il pacchetto delle 03:12</p>
              </div>
              <Seal size={52} />
            </div>
            <div className="rounded-2xl bg-deep p-4 font-mono text-sm leading-relaxed text-deep-fg">
              <p className="opacity-80">sorgente (bit grezzi):</p>
              <p className="break-all text-base">11000000 10101000 00000001 01000010</p>
              <p className="mt-2 opacity-80">destinazione: server dei dati · porta 22</p>
            </div>
            <p className="text-muted">
              Da dove arriva? Da Internet o da una scrivania dell&apos;azienda? La risposta è in quei 32 bit.
            </p>
            <Mascot size={90} mood="stern" className="absolute -bottom-6 -right-3 hidden sm:block" />
          </div>
        </section>

        <section aria-labelledby="sapevi" className="mt-16">
          <h2 id="sapevi" className="font-display text-3xl font-semibold">Tre cose che tra otto minuti saprai spiegare</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {FACTS.map((f) => (
              <li key={f.k} className="card p-5">
                <p className="font-mono text-3xl font-bold text-primary">{f.k}</p>
                <p className="mt-2">{f.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="regole" className="mt-16">
          <h2 id="regole" className="font-display text-3xl font-semibold">Le regole del dojo</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {RULES.map((r) => (
              <li key={r.n} className="card p-5">
                <p className="font-mono text-sm font-bold text-accent">{r.n}</p>
                <h3 className="mt-1 text-xl font-semibold">{r.t}</h3>
                <p className="mt-1 text-muted">{r.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cinture" className="mt-16">
          <h2 id="cinture" className="font-display text-3xl font-semibold">Sette cinture. Nessuna regalata.</h2>
          <ol className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3">
            {BELTS.map((b, i) => (
              <li key={b.id} className="grid gap-1 text-center">
                <span
                  className="grid h-14 place-items-center rounded-2xl border-2 border-belt-outline font-mono text-lg font-bold sm:h-16"
                  style={{ background: `var(--belt-${b.token})`, color: `var(--belt-${b.token}-fg)` }}
                >
                  {i + 1}
                </span>
                <span className="text-[0.7rem] font-bold sm:text-sm">{b.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-14 text-sm text-muted">
          Le voci del Sensei e dell&apos;Assistente sono sintetiche. Le tecniche di attacco si praticano solo in
          laboratori isolati, mai su sistemi reali.
        </p>
      </main>
    </>
  );
}
