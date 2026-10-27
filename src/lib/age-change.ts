import { AGE_BANDS } from "./age-bands";
import { ageGroupOf } from "./social/rules";

/**
 * Cambio della fascia d'età dalle impostazioni. La fascia è dichiarata dalla persona (non la verifichiamo):
 * si può correggere, ma cambiando da ragazzi ad adulti (o il contrario) il social si azzera, così non si
 * portano amici e gruppi da una fascia all'altra. Funzioni pure: la scrittura sta in src/app/actions/profile.ts.
 */
export type AgeChangeCheck =
  | { ok: true; changed: boolean; changesGroup: boolean }
  | { ok: false; error: string };

export function checkAgeChange(current: string | null | undefined, next: string, confirmed: boolean): AgeChangeCheck {
  if (!(AGE_BANDS as readonly string[]).includes(next)) return { ok: false, error: "Scegli una fascia d'età dall'elenco." };
  if (!confirmed) return { ok: false, error: "Spunta la conferma: serve a ricordarti che la fascia deve essere quella vera." };
  if (current === next) return { ok: true, changed: false, changesGroup: false };
  return { ok: true, changed: true, changesGroup: ageGroupOf(current) !== ageGroupOf(next) };
}

/** Limite semplice in memoria: pochi cambi all'ora per persona (evita il «provo e riprovo»). */
export function createAgeChangeLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    allow(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}
