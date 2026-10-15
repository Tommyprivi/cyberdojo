import type { Metadata } from "next";
import Link from "next/link";
import { Lab } from "@/components/lab/lab";

export const metadata: Metadata = { title: "Laboratorio: calcolatore di rete" };

export default function CalcolatorePage() {
  return (
    <div className="grid gap-6">
      <header>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
          <Link href="/pratica" className="underline">Laboratorio</Link> · Calcolatore di rete
        </p>
        <h1 className="font-display text-3xl font-semibold">La .66, sul campo</h1>
      </header>
      <Lab scenarioId="calcolatore-66" />
    </div>
  );
}
