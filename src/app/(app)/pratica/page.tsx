import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { PhoneNotice } from "@/components/practice/phone-notice";
import { Quiz } from "@/components/practice/quiz";
import { ToolPreview, type PreviewKind } from "@/components/practice/tool-preview";

export const metadata: Metadata = { title: "Pratica" };

type Tool = {
  href?: string;
  kind: PreviewKind;
  tag: string;
  title: string;
  text: string;
  level: string;
  minutes: string;
  learn: string[];
};

const READY: Tool[] = [
  {
    href: "/pratica/calcolatore",
    kind: "calc",
    tag: "Missione guidata",
    title: "Calcolatore di rete",
    text: "Scomponi un indirizzo in bit, scopri se è privato o pubblico e calcola rete, broadcast e dispositivi. Il Sensei ti guida passo passo.",
    level: "Medio",
    minutes: "15 min",
    learn: ["Indirizzi in bit e ottetti", "Maschera e prefisso CIDR", "Rete, broadcast, dispositivi"],
  },
  {
    href: "/pratica/intruso",
    kind: "intruder",
    tag: "Missione",
    title: "Caccia all'intruso",
    text: "Un registro del firewall in bit grezzi: decodifica gli indirizzi e scopri chi arriva da dentro e chi da Internet.",
    level: "Medio",
    minutes: "10 min",
    learn: ["Leggere un log del firewall", "Reti private e pubbliche", "Da binario a decimale"],
  },
  {
    href: "/pratica/binario",
    kind: "binary",
    tag: "Riflessi",
    title: "Binario → decimale",
    text: "Ottetti a raffica, tre livelli di difficoltà. Al livello severo nessuno ti aiuta.",
    level: "Facile → Severo",
    minutes: "5 min",
    learn: ["Valore dei bit (128, 64, 32…)", "Conversione veloce a mente"],
  },
];

const SOON: Tool[] = [
  {
    kind: "terminal",
    tag: "In preparazione",
    title: "Terminale Linux",
    text: "Un terminale simulato con file e comandi, per risolvere un compito.",
    level: "Medio",
    minutes: "20 min",
    learn: ["Muoversi nel filesystem", "ls, cat, grep, permessi"],
  },
  {
    kind: "packets",
    tag: "In preparazione",
    title: "Analizzatore di pacchetti",
    text: "Apri una cattura, filtra i pacchetti e leggi le quattro buste.",
    level: "Avanzato",
    minutes: "25 min",
    learn: ["Filtrare il traffico", "Incapsulamento in pratica"],
  },
  {
    kind: "logs",
    tag: "In preparazione",
    title: "Lettore di log",
    text: "Un registro del firewall con centinaia di righe da analizzare.",
    level: "Avanzato",
    minutes: "20 min",
    learn: ["Cercare anomalie", "Riconoscere una scansione"],
  },
];

function ToolCard({ t }: { t: Tool }) {
  const ready = Boolean(t.href);
  const inner = (
    <>
      <div className={`overflow-hidden border-b border-border ${ready ? "" : "opacity-60 grayscale"}`}>
        <ToolPreview kind={t.kind} className="aspect-[2/1]" />
      </div>
      <div className="grid flex-1 content-start gap-2 p-4">
        <span className={`font-mono text-xs font-bold uppercase tracking-widest ${ready ? "text-accent" : "text-muted"}`}>{t.tag}</span>
        <h3 className="font-display text-xl font-semibold">{t.title}</h3>
        <p className="text-muted">{t.text}</p>
        <ul className="mt-1 grid gap-0.5 text-sm" aria-label="Cosa impari">
          {t.learn.map((l) => (
            <li key={l} className="flex gap-2"><span aria-hidden className="text-muted">›</span>{l}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 font-mono text-xs text-muted">
        <span>Difficoltà: <strong className="text-foreground">{t.level}</strong></span>
        <span>{t.minutes}</span>
      </div>
    </>
  );
  return ready ? (
    <Link href={t.href!} className="dossier lift flex h-full flex-col overflow-hidden hover:border-foreground">{inner}</Link>
  ) : (
    <div className="dossier flex h-full flex-col overflow-hidden border-dashed" aria-label={`${t.title}: in preparazione`}>{inner}</div>
  );
}

export default function Pratica() {
  return (
    <>
      {/* TELEFONO: solo quiz */}
      <div className="grid gap-5 md:hidden">
        <header>
          <h1 className="font-display text-3xl font-semibold">Quiz</h1>
          <p className="mt-1 text-muted">Ripassa con domande veloci, quando vuoi.</p>
        </header>
        <PhoneNotice />
        <Quiz />
      </div>

      {/* PC E TABLET: hub degli strumenti */}
      <div className="hidden content-start gap-10 md:grid">
        <header className="flex items-center justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Laboratorio</p>
            <h1 className="font-display text-4xl font-semibold">Pratica</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Qui si applica quello che hai studiato. Strumenti veri in un&apos;area di lavoro a tutto schermo, con il Sensei di
              fianco che dice cosa fare, a cosa serve e cosa ricordare. Non sblocca lezioni e non dà XP: serve a imparare.
            </p>
          </div>
          <Mascot size={96} animate className="shrink-0" />
        </header>

        <section aria-labelledby="pronti" className="grid gap-4">
          <h2 id="pronti" className="font-display text-2xl font-semibold">Strumenti pronti</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
            {READY.map((t) => (
              <li key={t.title}><ToolCard t={t} /></li>
            ))}
            <li>
              <Link href="/pratica/quiz" className="dossier lift flex h-full flex-col justify-between gap-4 p-5 hover:border-foreground">
                <div className="grid gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Ripasso</span>
                  <h3 className="font-display text-xl font-semibold">Quiz veloci</h3>
                  <p className="text-muted">Dieci domande a scelta per tema, una per schermata, con il riepilogo finale. Funzionano anche da telefono.</p>
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-muted">
                  <span>Difficoltà: <strong className="text-foreground">Facile</strong></span>
                  <span>5 min</span>
                </div>
              </Link>
            </li>
          </ul>
        </section>

        <section aria-labelledby="presto" className="grid gap-4">
          <h2 id="presto" className="font-display text-2xl font-semibold">In arrivo</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
            {SOON.map((t) => (
              <li key={t.title}><ToolCard t={t} /></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
