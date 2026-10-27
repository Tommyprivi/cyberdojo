import { z } from "zod";

/** Eventi dal vivo a data fissa (content/events.json). Nessuna iscrizione obbligatoria. */

export const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(120),
  description: z.string().max(600),
  /** Istanti ISO con fuso (es. 2026-11-20T18:00:00+01:00). */
  startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }),
  where: z.string().max(120).optional(),
  /** Link https facoltativo (collegamento all'evento). */
  url: z.url().refine((u) => u.startsWith("https://")).optional(),
  /** true = evento di prova, mostrato con l'etichetta «Esempio». */
  example: z.boolean().optional(),
});

export const eventsFileSchema = z.object({ events: z.array(eventSchema) });

export type LiveEvent = z.infer<typeof eventSchema>;
export type EventStatus = "presto" | "in-corso" | "finito";

export const STATUS_LABELS: Record<EventStatus, string> = { presto: "Presto", "in-corso": "In corso", finito: "Finito" };

export function eventStatus(e: Pick<LiveEvent, "startsAt" | "endsAt">, now: number): EventStatus {
  if (now < Date.parse(e.startsAt)) return "presto";
  if (now < Date.parse(e.endsAt)) return "in-corso";
  return "finito";
}

/** Valida il file; eventi con fine prima dell'inizio sono scartati. Ordine: in corso, presto (il più vicino prima), finiti. */
export function parseEvents(raw: unknown, now: number): LiveEvent[] {
  const parsed = eventsFileSchema.parse(raw);
  const valid = parsed.events.filter((e) => Date.parse(e.endsAt) > Date.parse(e.startsAt));
  const rank = { "in-corso": 0, presto: 1, finito: 2 } as const;
  return valid.sort((a, b) => {
    const ra = rank[eventStatus(a, now)];
    const rb = rank[eventStatus(b, now)];
    if (ra !== rb) return ra - rb;
    const da = Date.parse(a.startsAt);
    const db = Date.parse(b.startsAt);
    return ra === 2 ? db - da : da - db;
  });
}
