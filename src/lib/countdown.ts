import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Conto alla rovescia di un aggiornamento in arrivo, mostrato come barretta in alto nell'app.
 * Si imposta in content/countdown.json: { "endsAt": "2026-10-26T20:00:00Z", "label": "novità sui social" }.
 * Per toglierlo basta svuotare il file o cancellare la data. Non compare mai dentro le lezioni.
 */

const FILE = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "countdown.json");

/** `maintenance`: allo scadere il sito mostra «in manutenzione» (vedi src/lib/maintenance.ts). */
export type Countdown = { endsAt: number; label: string; maintenance: boolean };

export function readCountdown(file = FILE): Countdown | null {
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, "utf8")) as { endsAt?: unknown; label?: unknown; maintenance?: unknown };
    const endsAt = typeof data.endsAt === "string" ? Date.parse(data.endsAt) : NaN;
    if (!Number.isFinite(endsAt)) return null;
    return { endsAt, label: typeof data.label === "string" ? data.label : "", maintenance: data.maintenance === true };
  } catch {
    return null;
  }
}
