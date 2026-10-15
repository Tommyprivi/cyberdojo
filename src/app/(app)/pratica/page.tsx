import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";

export const metadata: Metadata = { title: "Allenati" };

const TOOLS = [
  {
    href: "/pratica/calcolatore",
    tag: "Missione pronta",
    title: "Calcolatore di rete",
    text: "Scomponi un indirizzo in bit, scopri se è privato o pubblico, calcola rete, broadcast e dispositivi. Il Sensei ti guida passo passo.",
  },
  { tag: "In preparazione", title: "Terminale Linux", text: "Un terminale simulato con file e comandi, per risolvere un compito." },
  { tag: "In preparazione", title: "Analizzatore di pacchetti", text: "Apri una cattura, filtra i pacchetti e leggi le quattro buste." },
  { tag: "In preparazione", title: "Lettore di log", text: "Un registro del firewall con centinaia di righe da analizzare." },
];

const DRILLS = [
  { href: "/pratica/intruso", tag: "Missione", title: "Caccia all'intruso", text: "Un registro firewall in bit grezzi: decodifica gli indirizzi e scopri chi arriva da dentro." },
  { href: "/pratica/binario", tag: "Riflessi", title: "Binario → decimale", text: "Ottetti a raffica, tre livelli. Al livello severo nessuno ti aiuta." },
];

export default function Pratica() {
  return (
    <div className="grid gap-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Laboratorio</h1>
          <p className="mt-1 max-w-xl text-muted">
            Qui si applica quello che hai studiato. Strumenti veri, e il Sensei di fianco che ti dice cosa fare, a cosa
            serve e cosa ricordare. Non sblocca lezioni: serve a imparare.
          </p>
        </div>
        <Mascot size={88} animate className="hidden shrink-0 sm:block" />
      </header>

      <section aria-labelledby="strumenti" className="grid gap-4">
        <h2 id="strumenti" className="font-display text-2xl font-semibold">Strumenti</h2>
        <ul className="grid gap-4 lg:grid-cols-2">
          {TOOLS.map((t) => {
            const body = (
              <>
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${t.href ? "text-accent" : "text-muted"}`}>{t.tag}</span>
                <span className="mt-1 block font-display text-2xl font-semibold">{t.title}</span>
                <span className="mt-1 block text-muted">{t.text}</span>
              </>
            );
            return (
              <li key={t.title}>
                {t.href ? (
                  <Link href={t.href} className="dossier block h-full p-5 transition-transform hover:-translate-y-0.5">{body}</Link>
                ) : (
                  <div className="dossier h-full border-dashed p-5 opacity-70" aria-label={`${t.title}: in preparazione`}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="esercizi" className="grid gap-4">
        <h2 id="esercizi" className="font-display text-2xl font-semibold">Esercizi veloci</h2>
        <ul className="grid gap-4 lg:grid-cols-2">
          {DRILLS.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="dossier block h-full p-5 transition-transform hover:-translate-y-0.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{e.tag}</span>
                <span className="mt-1 block font-display text-2xl font-semibold">{e.title}</span>
                <span className="mt-1 block text-muted">{e.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
