import Image from "next/image";
import Link from "next/link";
import { Seal } from "@/components/seal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BELTS } from "@/lib/config";
import { COURSES } from "@/lib/content/courses";
import { COURSE_COVER } from "@/lib/content/covers";

const SPECIALITIES = [
  { t: "Si impara sui casi", d: "Ogni lezione parte da un problema vero: un log, un pacchetto, un accesso strano. La teoria arriva quando serve a risolverlo." },
  { t: "Pratica, non solo video", d: "Esercizi con numeri nuovi a ogni tentativo, calcolatori di rete, laboratori guidati. Copiare la risposta non serve." },
  { t: "Un tutor che spiega l'errore", d: "Non ti dice solo «sbagliato»: ti dice dove hai sbagliato («hai letto i bit al contrario») e ti fa riprovare." },
  { t: "Cinture da guadagnare", d: "Sette cinture, come in un vero dojo. Si passa alla successiva solo superando la prova pratica." },
  { t: "Video scelti uno per uno", d: "In ogni lezione un video selezionato da canali seri, in italiano o con sottotitoli, controllato prima di essere pubblicato." },
  { t: "Gratis, e i tuoi dati sono tuoi", d: "Nessun abbonamento. Salviamo solo la fascia d'età, mai la data di nascita, e puoi scaricare o cancellare tutto quando vuoi." },
];

const LESSON_STEPS = [
  { t: "Il caso", d: "Una situazione reale in due righe. Capisci subito perché ti serve quello che stai per imparare." },
  { t: "La spiegazione", d: "Testo breve, schemi e un video. Otto minuti, non un'ora." },
  { t: "La prova", d: "Un esercizio pratico con dati diversi a ogni tentativo. Se sbagli, il tutor ti spiega dove." },
  { t: "Il ripasso", d: "Le cose che sbagli tornano dopo qualche giorno, nel momento giusto per fissarle." },
];

const INCLUDED = [
  "Lezioni brevi da otto minuti, in ordine",
  "Un video selezionato per ogni lezione",
  "Verifiche pratiche con dati sempre diversi",
  "Tutor che spiega gli errori",
  "Ripasso automatico a intervalli",
  "Serie giornaliera e punti esperienza",
  "Laboratorio con calcolatore di reti e simulazioni",
  "Progetto finale e cintura per ogni corso",
  "Risorse, certificazioni e CTF per il dopo",
  "Account gratuito, dati esportabili",
];

const LAB = [
  { t: "Calcolatore di reti", d: "Indirizzo, maschera, rete, broadcast: lo risolvi passo per passo con il tutor." },
  { t: "Binario e ottetti", d: "Allenati a convertire finché diventa automatico." },
  { t: "Caso dell'intruso", d: "Leggi un log e trova chi non dovrebbe esserci." },
  { t: "Home lab", d: "Alla fine ti guidiamo a costruire il tuo laboratorio, in sicurezza." },
];

const FAQ = [
  { q: "Costa qualcosa?", a: "No. I corsi, le prove e il laboratorio sono gratuiti. Non c'è un abbonamento nascosto." },
  { q: "Devo saper già qualcosa?", a: "No. Il corso Fondamenta parte da come funziona un computer. Se sai già usare Linux e le reti puoi iniziare da Cybersecurity." },
  { q: "Quanto tempo serve al giorno?", a: "Una lezione dura circa otto minuti. In registrazione scegli quanto vuoi studiare e ti proponiamo un ritmo." },
  { q: "Posso usarlo da telefono?", a: "Sì per lezioni, video e quiz. Per gli esercizi pratici e il laboratorio serve più spazio: usa un computer o un tablet." },
  { q: "È sicuro imparare queste cose?", a: "Le tecniche di attacco si fanno solo in laboratori isolati, mai su sistemi reali, e ogni modulo ricorda legge ed etica prima di cominciare." },
  { q: "Chi può iscriversi?", a: "Serve dichiarare di avere almeno 14 anni. Dopo ti chiediamo solo la fascia d'età, per consigliarti un percorso adatto." },
  { q: "Dopo i corsi cosa faccio?", a: "L'ultimo modulo raccoglie risorse verificate, certificazioni, CTF italiane e un percorso di studio in base alla tua età." },
];

export default function Home() {
  const modules = COURSES.reduce((n, c) => n + c.modules.length, 0);

  return (
    <>
      <SiteHeader wide />
      <main className="flex-1">
        {/* Apertura */}
        <section className="grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-2">
          <div className="grid content-center gap-6 px-4 pb-12 pt-10 lg:px-14 lg:py-16 xl:px-24">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-accent">Scuola di cybersecurity · gratis · in italiano</p>
            <h1 className="font-display text-5xl font-bold leading-[1.04] lg:text-6xl">
              Impara la sicurezza informatica <span className="text-primary">risolvendo casi veri.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Dalle basi di computer e reti fino alla difesa e all&apos;attacco etico. Lezioni da otto minuti, una prova pratica a ogni passo, un tutor che ti spiega gli errori.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/registrati" className="btn btn-primary">Inizia gratis</Link>
              <Link href="/corsi" className="btn btn-ghost">Vedi i corsi</Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-muted">
              <li>✓ Nessuna carta di credito</li>
              <li>✓ Da zero, senza prerequisiti</li>
              <li>✓ Dati esportabili e cancellabili</li>
            </ul>
          </div>
          <div className="relative min-h-[320px] lg:min-h-0">
            <Image src="/img/corsi/prossimi-passi.jpg" alt="" fill priority quality={95} sizes="50vw" className="object-cover" />
            <div className="dossier absolute bottom-6 left-4 right-4 grid gap-1 p-4 sm:left-auto sm:right-8 sm:w-72 lg:bottom-10 lg:right-14">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Caso F.05.003</p>
                  <p className="font-display text-xl font-bold">Il pacchetto delle 03:12</p>
                </div>
                <Seal size={40} />
              </div>
              <p className="font-mono text-sm text-muted">11000000 10101000 00000001 01000010</p>
            </div>
          </div>
        </section>

        {/* Numeri */}
        <section aria-label="In numeri" className="border-y border-border bg-surface-muted">
          <dl className="mx-auto grid max-w-[1680px] grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4 lg:px-14">
            {[
              [String(COURSES.length), "corsi in ordine"],
              [String(modules), "moduli"],
              [String(BELTS.length), "cinture da guadagnare"],
              ["0 €", "per sempre gratis"],
            ].map(([k, v]) => (
              <div key={v} className="text-center lg:text-left">
                <dt className="font-display text-4xl font-bold text-primary">{k}</dt>
                <dd className="text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Specialità */}
        <section aria-labelledby="specialita" className="mx-auto w-full max-w-[1680px] px-4 py-16 lg:px-14 lg:py-24">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Il nostro metodo</p>
          <h2 id="specialita" className="mt-1 max-w-2xl font-display text-3xl font-bold lg:text-4xl">Cosa ci rende diversi da un corso di video</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALITIES.map((s) => (
              <li key={s.t} className="grid content-start gap-2 bg-surface p-6">
                <h3 className="font-display text-xl font-bold">{s.t}</h3>
                <p className="text-muted">{s.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Corsi */}
        <section aria-labelledby="corsi" className="border-t border-border bg-surface-muted">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-16 lg:px-14 lg:py-24">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Cosa si studia</p>
            <h2 id="corsi" className="mt-1 font-display text-3xl font-bold lg:text-4xl">Due corsi, un solo percorso</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {COURSES.map((c) => (
                <article key={c.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                  <div className="relative aspect-[16/9]">
                    <Image src={COURSE_COVER[c.id]} alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                  </div>
                  <div className="grid gap-3 p-6">
                    <h3 className="font-display text-2xl font-bold">{c.title}</h3>
                    <p className="font-mono text-sm text-muted">{c.modules.length} moduli</p>
                    <ul className="grid gap-1 text-muted">
                      {c.modules.slice(0, 5).map((m) => (
                        <li key={m.n}>· {m.title}</li>
                      ))}
                      <li className="font-semibold text-fg">… e altri {c.modules.length - 5}</li>
                    </ul>
                    <Link href="/corsi" className="w-fit font-bold text-primary underline">Vedi tutti i moduli</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Come funziona una lezione */}
        <section aria-labelledby="lezione" className="mx-auto w-full max-w-[1680px] px-4 py-16 lg:px-14 lg:py-24">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Come funziona</p>
          <h2 id="lezione" className="mt-1 font-display text-3xl font-bold lg:text-4xl">Una lezione, in quattro passi</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {LESSON_STEPS.map((s, i) => (
              <li key={s.t} className="border-t-2 border-primary pt-4">
                <p className="font-mono text-sm font-bold text-accent">0{i + 1}</p>
                <h3 className="font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-1 text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Cosa è incluso + progetti */}
        <section aria-labelledby="incluso" className="border-t border-border">
          <div className="mx-auto grid w-full max-w-[1680px] gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-24">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Tutto compreso</p>
              <h2 id="incluso" className="mt-1 font-display text-3xl font-bold lg:text-4xl">Cosa trovi nei corsi</h2>
              <ul className="mt-8 grid gap-3">
                {INCLUDED.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-fg">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Si fa, non si legge</p>
              <h2 className="mt-1 font-display text-3xl font-bold lg:text-4xl">Laboratorio e progetti</h2>
              <ul className="mt-8 grid gap-4">
                {LAB.map((l) => (
                  <li key={l.t} className="rounded-xl border border-border bg-surface p-5">
                    <h3 className="font-display text-xl font-bold">{l.t}</h3>
                    <p className="text-muted">{l.d}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Altri strumenti (terminale Linux, analizzatore di pacchetti, lettore di log) sono in preparazione.</p>
            </div>
          </div>
        </section>

        {/* Cinture */}
        <section aria-labelledby="cinture" className="border-t border-border bg-surface-muted">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-16 lg:px-14">
            <h2 id="cinture" className="font-display text-3xl font-bold lg:text-4xl">Sette cinture. Nessuna regalata.</h2>
            <p className="mt-2 max-w-2xl text-muted">Si sale solo superando la prova pratica. Il Sensei è severo, ma ti dice sempre cosa migliorare.</p>
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
          </div>
        </section>

        {/* Domande */}
        <section aria-labelledby="faq" className="mx-auto w-full max-w-3xl px-4 py-16 lg:py-24">
          <h2 id="faq" className="font-display text-3xl font-bold lg:text-4xl">Domande frequenti</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                  {f.q}
                  <span aria-hidden className="text-2xl text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Chiusura */}
        <section className="bg-deep text-deep-fg">
          <div className="mx-auto grid max-w-[1680px] gap-6 px-4 py-16 text-center lg:px-14">
            <h2 className="font-display text-3xl font-bold lg:text-4xl">Il primo caso ti aspetta.</h2>
            <p className="mx-auto max-w-xl opacity-80">Registrarti richiede un minuto. La prima lezione ne richiede otto.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/registrati" className="btn btn-primary">Crea il tuo account</Link>
              <Link href="/corsi" className="btn btn-ghost">Guarda i corsi</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}


