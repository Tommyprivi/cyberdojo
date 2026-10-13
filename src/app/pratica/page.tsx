import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Pratica" };

const EXERCISES = [
  {
    href: "/pratica/binario",
    title: "Binario → decimale",
    text: "Converti ottetti in numeri, con correzione mentre scrivi.",
  },
];

export default function Pratica() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <h1 className="font-display text-4xl font-bold">Pratica</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Esercizi liberi, senza seguire il percorso. Ti correggono subito e ti dicono perché. Non sbloccano
          lezioni.
        </p>
        <ul className="mt-8 grid gap-3">
          {EXERCISES.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="block rounded-xl border border-border bg-surface p-4 hover:bg-surface-muted">
                <span className="font-semibold">{e.title}</span>
                <span className="mt-1 block text-muted">{e.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
