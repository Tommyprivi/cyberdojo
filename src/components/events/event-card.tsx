"use client";

import { useEffect, useState } from "react";
import { formatRemaining } from "@/lib/countdown-format";
import { eventStatus, STATUS_LABELS, type LiveEvent } from "@/lib/events/events";

/** Scheda di un evento con conto alla rovescia. Prima del montaggio l'ora del browser non è nota: si mostra lo stato del server. */
export function EventCard({ event, serverNow }: { event: LiveEvent; serverNow: number }) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const status = eventStatus(event, now);
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  const when = new Intl.DateTimeFormat("it-IT", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Rome" }).format(start);

  return (
    <article className="grid gap-2 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-deep px-2 py-0.5 font-mono text-xs font-bold text-deep-fg">{STATUS_LABELS[status]}</span>
        {event.example && <span className="rounded-md border border-border px-2 py-0.5 font-mono text-xs">Esempio</span>}
      </div>
      <h2 className="font-display text-xl font-bold">{event.title}</h2>
      <p className="text-sm text-muted">{event.description}</p>
      <p className="text-sm">
        {when}
        {event.where ? ` · ${event.where}` : ""}
      </p>
      {status === "presto" && (
        <p className="font-mono text-lg font-bold" aria-label="Tempo all'inizio">
          Inizia tra {formatRemaining(start - now)}
        </p>
      )}
      {status === "in-corso" && <p className="font-mono text-lg font-bold">In corso, finisce tra {formatRemaining(end - now)}</p>}
      {status === "finito" && <p className="text-sm text-muted">Questo evento è finito.</p>}
      {event.url && status !== "finito" && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg">
          Apri il collegamento
        </a>
      )}
    </article>
  );
}
