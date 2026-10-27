import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EXPLORE_GROUPS } from "@/components/explore-items";

export const metadata: Metadata = { title: "Esplora" };

/** Tutte le funzioni in un posto solo: grandi tasti, pensati per il pollice. */
export default function Esplora() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Esplora</h1>
        <p className="text-muted">Tutto quello che puoi fare su CyberDojo.</p>
      </header>
      {EXPLORE_GROUPS.map((g) => (
        <section key={g.title} aria-label={g.title} className="grid gap-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">{g.title}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {g.items.map((i) => (
              <li key={i.href}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={i.href as any}
                  className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-border bg-surface p-3 hover:border-primary"
                >
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-muted text-2xl">
                    {i.img ? <Image src={i.img} alt="" width={44} height={44} className="size-10 object-contain" /> : i.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{i.label}</span>
                    <span className="block text-sm text-muted">{i.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
