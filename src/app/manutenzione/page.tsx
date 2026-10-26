import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MaintenanceClock } from "@/components/maintenance-clock";
import { loadCatalog, nextLesson } from "@/lib/content/catalog";
import { readCountdown } from "@/lib/countdown";
import { COURSES } from "@/lib/content/courses";
import { startedCourses } from "@/lib/maintenance";
import { getMemberData } from "@/lib/progress/queries";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sito in manutenzione", robots: { index: false } };

/** Le novità del grande aggiornamento, per blocchi. Tenere allineato con content/announcements/2026-10-26-grande.md. */
const BLOCKS: { icon: string; title: string; items: string[] }[] = [
  {
    icon: "🧭",
    title: "Percorso e livelli",
    items: [
      "Test d'ingresso: poche domande per ogni corso, e ti dice da dove partire.",
      "Prove di padronanza: se sai già un modulo, superi la prova e ne sblocchi le lezioni. Lo sblocco è registrato, non è un salto libero.",
      "Livelli Base, Medio e Avanzato in ogni corso, con cinture e traguardi.",
      "Il Percorso diventa un sentiero, con un grande bottone «Continua».",
      "Ripasso intelligente: ti riporta le cose che stavi dimenticando.",
      "Tutorial di benvenuto di quattro schermate.",
    ],
  },
  {
    icon: "📱",
    title: "App Android e notifiche",
    items: [
      "L'app CyberDojo da installare sul telefono (file APK), con la calcolatrice integrata.",
      "Notifiche per ricordarti di studiare e per le novità, con gli orari che scegli tu e un interruttore per ogni tipo.",
      "Le chiediamo solo dopo una lezione completata, mai di colpo.",
      "Il sito si può installare anche come app dal browser.",
    ],
  },
  {
    icon: "💬",
    title: "Community più grande",
    items: [
      "Annunci scritti dallo staff, con reazioni e commenti a frasi pronte (sicuri per chi ha 14 anni).",
      "Sfide a squadre e classifiche per ogni corso.",
      "Le novità già viste ricordate sul tuo account, su ogni dispositivo.",
    ],
  },
  {
    icon: "📚",
    title: "Nuovi corsi",
    items: [
      "I cinque corsi di oggi si ampliano con nuove lezioni.",
      "Dieci corsi nuovi da 200 lezioni ciascuno, divisi in blocchi: sviluppo web, programmazione, app per telefono, intelligenza artificiale, database, cloud e DevOps, reti e internet, hacking etico, blockchain, mondo digitale.",
      "Arrivano a ondate, controllati uno per uno prima di uscire.",
    ],
  },
  {
    icon: "✨",
    title: "E tante altre cose",
    items: [
      "Serie giornaliera con promemoria e sfida del giorno.",
      "Certificati a fine corso, ricerca in tutte le lezioni, segnalibri e appunti.",
      "Il Sensei che ricorda dove sbagli e ti propone esercizi su misura.",
      "Lezioni da ascoltare, laboratori di hacking guidati (CTF), duelli e leghe settimanali.",
      "Interfaccia ancora più ordinata da telefono.",
    ],
  },
];

export default function Manutenzione() {
  const reopensAt = readCountdown()?.endsAt ?? null;
  return (
    <main className="w-full">
      {/* Qui niente banner dei cookie: non ci sono video e coprirebbe il conto alla rovescia. Torna a sito aperto. */}
      <style>{`[aria-labelledby="cookie-banner-title"]{display:none}`}</style>
      {/* Prima schermata: tutto schermo, con i colori della grafica (fissi, anche col tema scuro). */}
      <header className="grid min-h-dvh content-center justify-items-center gap-5 bg-[#f7eedc] px-4 py-8 text-center text-[#1c3d6e]">
        <Image
          src="/img/manutenzione.jpg"
          alt="Un orologio, ingranaggi, attrezzi e una rete: il sito è in lavorazione"
          width={1376}
          height={768}
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="max-h-[32dvh] w-auto max-w-full object-contain sm:max-h-[42dvh]"
        />
        <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[#a02a1a] sm:text-xs sm:tracking-[0.2em]">Il più grande aggiornamento di sempre</p>
        <h1 className="font-display text-3xl font-bold sm:text-6xl">Sito in manutenzione</h1>
        <p className="max-w-xl text-lg">Stiamo costruendo CyberDojo 2.0. Riapriamo sabato 31 ottobre alle 15:00.</p>
        <p className="max-w-xl rounded-2xl border-2 border-[#1c3d6e]/25 bg-white/60 px-4 py-3 font-semibold">
          Vuoi continuare? Puoi proseguire il corso che avevi iniziato: i tuoi progressi si salvano e restano anche nella versione 2.0, così non perdi la serie.
        </p>
        {reopensAt !== null ? (
          <div className="w-full max-w-3xl">
            <MaintenanceClock endsAt={reopensAt} />
          </div>
        ) : null}
        <a href="#novita" className="font-semibold underline underline-offset-4">
          Guarda tutte le novità ↓
        </a>
      </header>

      <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 pb-16 pt-10">
      <Suspense fallback={null}>
        <ContinueCard />
      </Suspense>

      <section id="novita" aria-label="Le novità in arrivo" className="grid scroll-mt-6 gap-4">
        {BLOCKS.map((b) => (
          <article key={b.title} className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-5">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold">
              <span aria-hidden className="text-3xl">
                {b.icon}
              </span>
              {b.title}
            </h2>
            <ul className="grid gap-2 pl-1">
              {b.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="mt-1 text-primary">
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <p className="text-center text-sm text-muted">
        Hai una domanda? Scrivici dalla pagina{" "}
        <Link href="/contatti" className="font-semibold underline">
          Contatti
        </Link>
        .
      </p>
      </div>
    </main>
  );
}

/** Chi ha già iniziato un corso può continuarlo anche in manutenzione, per non perdere la serie. */
async function ContinueCard() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <section className="grid gap-3 rounded-2xl border-2 border-primary bg-surface p-5">
        <h2 className="font-display text-2xl font-bold">Hai già iniziato un corso?</h2>
        <p>Durante la manutenzione puoi continuare solo i corsi che hai già iniziato. I progressi si salvano e restano nella versione 2.0, così non perdi la serie. Accedi per riprendere.</p>
        <Link href="/accedi" className="btn btn-primary min-h-12 w-full sm:w-fit">
          Accedi
        </Link>
      </section>
    );
  }

  const { completed, profile } = await getMemberData(user.id);
  const catalog = loadCatalog();
  const started = startedCourses(completed, catalog);
  if (!profile || started.size === 0) {
    return (
      <section className="grid gap-2 rounded-2xl border-2 border-border bg-surface p-5">
        <h2 className="font-display text-2xl font-bold">Non hai ancora iniziato un corso</h2>
        <p>Durante la manutenzione restano aperti solo i corsi già iniziati. Ti aspettiamo appena riapriamo.</p>
      </section>
    );
  }

  const options = COURSES.filter((c) => started.has(c.folder)).flatMap((c) => {
    const next = nextLesson(
      catalog.filter((l) => l.course === c.folder),
      completed,
    );
    return next ? [{ course: c, next }] : [];
  });

  return (
    <section className="grid gap-3 rounded-2xl border-2 border-primary bg-surface p-5">
      <h2 className="font-display text-2xl font-bold">Continua il tuo corso</h2>
      <p>Puoi proseguire solo i corsi che hai già iniziato. I progressi si salvano e restano nella versione 2.0, così non perdi la serie.</p>
      {options.length === 0 ? (
        <p className="font-semibold">Hai finito tutte le lezioni dei corsi che avevi iniziato. Bravo!</p>
      ) : (
        <ul className="grid gap-2">
          {options.map(({ course, next }) => (
            <li key={course.id}>
              <Link href={`/lezione/${next.id}`} className="btn btn-primary min-h-14 w-full justify-between px-5 text-left">
                <span className="grid">
                  <span className="text-sm font-normal opacity-90">{course.title}</span>
                  <span className="font-bold">{next.title}</span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
