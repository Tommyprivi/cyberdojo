import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import raw from "../../../../content/events.json";
import { EventCard } from "@/components/events/event-card";
import { parseEvents } from "@/lib/events/events";

export const metadata: Metadata = { title: "Eventi dal vivo", robots: { index: false } };

export default function EventiPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico gli eventi" />}>
      <EventiContent />
    </Suspense>
  );
}

async function EventiContent() {
  await connection(); // l'ora corrente cambia a ogni richiesta: la pagina non si prepara in anticipo
  const now = new Date().getTime();
  const events = parseEvents(raw, now);
  return (
    <div className="grid gap-4">
      <header>
        <h1 className="font-display text-3xl font-bold">Eventi dal vivo</h1>
        <p className="mt-1 text-sm text-muted">Appuntamenti a data fissa. Nessuna iscrizione: basta esserci.</p>
      </header>
      {events.length === 0 && <p className="text-sm text-muted">Nessun evento in programma, per ora.</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((e) => (
          <EventCard key={e.id} event={e} serverNow={now} />
        ))}
      </div>
    </div>
  );
}
