import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Allenati" };

const EXERCISES = [
  {
    href: "/pratica/intruso",
    tag: "Missione",
    title: "Caccia all'intruso",
    text: "Un registro firewall in bit grezzi. Decodifica gli indirizzi e scopri chi arriva da dentro.",
  },
  {
    href: "/pratica/binario",
    tag: "Riflessi",
    title: "Binario → decimale",
    text: "Ottetti a raffica, tre livelli. Al livello severo nessuno ti aiuta.",
  },
];

export default function Pratica() {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">Allenati</h1>
        <p className="mt-1 text-muted">Fuori dal percorso. Ti correggono mentre scrivi e non sbloccano lezioni.</p>
      </header>
      <ul className="grid gap-4 lg:grid-cols-2">
        {EXERCISES.map((e) => (
          <li key={e.href}>
            <Link href={e.href} className="dossier block h-full p-5 hover:-translate-y-0.5 transition-transform">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{e.tag}</span>
              <span className="mt-1 block font-display text-2xl font-semibold">{e.title}</span>
              <span className="mt-1 block text-muted">{e.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
