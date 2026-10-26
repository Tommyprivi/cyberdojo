import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/practice/calculator";

export const metadata: Metadata = { title: "Calcolatrice" };

export default function CalcolatricePage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <header>
        <Link href="/pratica" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> Pratica
        </Link>
        <h1 className="font-display text-3xl font-semibold">Calcolatrice</h1>
        <p className="text-muted">Per i conti delle lezioni: percentuali, potenze e parentesi. Funziona anche senza collegamento.</p>
      </header>
      <Calculator />
    </div>
  );
}
