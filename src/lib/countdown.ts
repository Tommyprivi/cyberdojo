import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Conto alla rovescia di un aggiornamento in arrivo, mostrato come barretta in alto nell'app.
 * Si imposta in content/countdown.json: { "endsAt": "2026-10-26T20:00:00Z", "label": "novità sui social" }.
 * Per toglierlo basta svuotare il file o cancellare la data. Non compare mai dentro le lezioni.
 */

const FILE = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "countdown.json");

export type Countdown = { endsAt: number; label: string };

export function readCountdown(file = FILE): Countdown | null {
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, "utf8")) as { endsAt?: unknown; label?: unknown };
    const endsAt = typeof data.endsAt === "string" ? Date.parse(data.endsAt) : NaN;
    if (!Number.isFinite(endsAt)) return null;
    return { endsAt, label: typeof data.label === "string" ? data.label : "" };
  } catch {
    return null;
  }
}

/** m:ss sotto l'ora, h:mm:ss da un'ora in su. */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** running: conto alla rovescia; done: l'ora è passata (invito a ricaricare); hidden: da due ore in poi sparisce. */
export function countdownState(endsAt: number, now: number): "running" | "done" | "hidden" {
  if (now < endsAt) return "running";
  return now - endsAt > 2 * 60 * 60_000 ? "hidden" : "done";
}
