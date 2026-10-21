/** Limiti di dimensione e di frequenza dell'AI Dojo (costi e abusi). */
export const LIMITS = {
  /** Messaggi nella cronologia inviata. */
  maxMessages: 24,
  maxUserChars: 1000,
  maxAssistantChars: 4000,
  /** Caratteri di contesto di lezione passati al modello (circa 3000 token). */
  maxContextChars: 12_000,
  maxOutputTokens: 1500,
  timeoutMs: 15_000,
  perHour: 30,
  perDay: 100,
  quizMin: 5,
  quizMax: 10,
} as const;

export type Clock = () => number;

/**
 * Limitatore a finestra scorrevole, in memoria del processo. Si azzera al riavvio e non è condiviso
 * tra più istanze: basta per proteggere il piano gratuito; una tabella `ai_usage` serve solo se si scala.
 */
export function createLimiter(opts: { perHour: number; perDay: number; now?: Clock }) {
  const now = opts.now ?? Date.now;
  const HOUR = 3_600_000;
  const DAY = 24 * HOUR;
  const hits = new Map<string, number[]>();

  return {
    /** Registra una richiesta se consentita; altrimenti dice tra quanti secondi riprovare. */
    take(userId: string): { ok: true } | { ok: false; retryAfterSec: number; scope: "hour" | "day" } {
      const t = now();
      const list = (hits.get(userId) ?? []).filter((x) => t - x < DAY);
      const lastHour = list.filter((x) => t - x < HOUR);
      if (list.length >= opts.perDay) {
        hits.set(userId, list);
        return { ok: false, scope: "day", retryAfterSec: Math.max(1, Math.ceil((list[0] + DAY - t) / 1000)) };
      }
      if (lastHour.length >= opts.perHour) {
        hits.set(userId, list);
        return { ok: false, scope: "hour", retryAfterSec: Math.max(1, Math.ceil((lastHour[0] + HOUR - t) / 1000)) };
      }
      list.push(t);
      hits.set(userId, list);
      // Pulizia occasionale per non far crescere la mappa.
      if (hits.size > 5000) for (const [k, v] of hits) if (v.every((x) => t - x >= DAY)) hits.delete(k);
      return { ok: true };
    },
  };
}

export const limiter = createLimiter({ perHour: LIMITS.perHour, perDay: LIMITS.perDay });
