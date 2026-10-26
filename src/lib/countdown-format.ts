/** Funzioni pure del conto alla rovescia: sicure per il browser (nessun accesso ai file). */

/** m:ss sotto l'ora, h:mm:ss da un'ora in su, «Ng hh:mm:ss» da un giorno in su. */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  if (d > 0) return `${d}g ${String(h).padStart(2, "0")}:${mm}:${ss}`;
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

/** running: conto alla rovescia; done: l'ora è passata (invito a ricaricare); hidden: da due ore in poi sparisce. */
export function countdownState(endsAt: number, now: number): "running" | "done" | "hidden" {
  if (now < endsAt) return "running";
  return now - endsAt > 2 * 60 * 60_000 ? "hidden" : "done";
}
