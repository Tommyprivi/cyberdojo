import type { Metadata } from "next";
import Link from "next/link";
import { DumbbellIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Allenati" };

const EXERCISES = [
  {
    href: "/pratica/binario",
    title: "Binario → decimale",
    text: "Converti ottetti in numeri, con correzione mentre scrivi.",
  },
];

export default function Pratica() {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold">Allenati</h1>
        <p className="mt-1 text-muted">
          Esercizi liberi, senza seguire il percorso. Ti correggono subito e ti dicono perché. Non sbloccano
          lezioni.
        </p>
      </header>
      <ul className="grid gap-3">
        {EXERCISES.map((e) => (
          <li key={e.href}>
            <Link href={e.href} className="card flex items-center gap-4 p-4 hover:bg-surface-muted">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-fg">
                <DumbbellIcon width={28} height={28} />
              </span>
              <span>
                <span className="block font-bold">{e.title}</span>
                <span className="block text-sm text-muted">{e.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
