/**
 * Vibrazione leggera su azioni chiave (risposta giusta/sbagliata, lezione completata).
 * Si può spegnere dal Profilo (si ricorda nel browser) e non parte con «riduci movimento».
 * Dove il dispositivo non vibra (iPhone, PC) non succede nulla.
 */

export type HapticEvent = "tap" | "right" | "wrong" | "complete";

/** Millisecondi: vibra, pausa, vibra... */
export const HAPTIC_PATTERNS: Record<HapticEvent, number | number[]> = {
  tap: 8,
  right: 20,
  wrong: [30, 40, 30],
  complete: [20, 60, 20, 60, 50],
};

export type HapticContext = { enabled: boolean; supported: boolean; reducedMotion: boolean };

export function pickVibration(event: HapticEvent, ctx: HapticContext): number | number[] | null {
  if (!ctx.enabled || !ctx.supported || ctx.reducedMotion) return null;
  return HAPTIC_PATTERNS[event];
}

/** Acceso di default: si spegne solo se l'utente l'ha scelto («1»). */
export function parseHapticsSetting(raw: string | null): boolean {
  return raw !== "1";
}

const KEY = "haptics-off";
const listeners = new Set<() => void>();

function readOn(): boolean {
  try {
    return parseHapticsSetting(localStorage.getItem(KEY));
  } catch {
    return true;
  }
}

const canVibrate = () => typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

/** Per useSyncExternalStore: interruttore acceso/spento. */
export const hapticsStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  getSnapshot: readOn,
  getServerSnapshot: () => true,
};

/** Per useSyncExternalStore: il dispositivo sa vibrare? (sul server: no, così il tasto compare solo dove serve) */
export const hapticsSupportStore = {
  subscribe: () => () => {},
  getSnapshot: canVibrate,
  getServerSnapshot: () => false,
};

export function setHapticsOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "0" : "1");
  } catch {
    /* vale solo per questa visita */
  }
  listeners.forEach((l) => l());
}

export function haptic(event: HapticEvent) {
  if (typeof window === "undefined" || !canVibrate()) return;
  try {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = pickVibration(event, { enabled: readOn(), supported: true, reducedMotion });
    if (p !== null) navigator.vibrate(p);
  } catch {
    /* nessuna vibrazione: pazienza */
  }
}
