/**
 * Suoni dell'app, generati nel browser con Web Audio (nessun file da scaricare).
 * Sono brevi e a basso volume. Si possono spegnere con l'interruttore «Suoni» (si ricorda nel browser).
 * I browser fanno partire l'audio solo dopo un tocco o un clic: se non è permesso, il suono semplicemente non parte.
 */

export type SoundName = "tap" | "open" | "success" | "celebrate";

export type Note = { f: number; at: number; dur: number; gain?: number; type?: "sine" | "triangle" };

const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const E6 = 1318.5;

export const SOUNDS: Record<SoundName, Note[]> = {
  tap: [{ f: 660, at: 0, dur: 0.07, gain: 0.04, type: "triangle" }],
  open: [
    { f: C5, at: 0, dur: 0.12, gain: 0.05 },
    { f: G5, at: 0.09, dur: 0.16, gain: 0.05 },
  ],
  success: [
    { f: C5, at: 0, dur: 0.14 },
    { f: E5, at: 0.1, dur: 0.14 },
    { f: G5, at: 0.2, dur: 0.3 },
  ],
  celebrate: [
    { f: C5, at: 0, dur: 0.18 },
    { f: E5, at: 0.12, dur: 0.18 },
    { f: G5, at: 0.24, dur: 0.18 },
    { f: C6, at: 0.36, dur: 0.5 },
    { f: E6, at: 0.52, dur: 0.6, gain: 0.04 },
    { f: G5, at: 0.52, dur: 0.6, gain: 0.04, type: "triangle" },
  ],
};

const KEY = "sound-off";
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;

function readOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

/** Per useSyncExternalStore: lo stato dell'interruttore «Suoni». */
export const soundStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  getSnapshot: readOn,
  getServerSnapshot: () => true,
};

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "0" : "1");
  } catch {
    /* il browser non permette di salvare: vale solo per questa visita */
  }
  listeners.forEach((l) => l());
}

export function playSound(name: SoundName) {
  if (typeof window === "undefined" || !readOn()) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const t0 = ctx.currentTime;
    for (const n of SOUNDS[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.value = n.f;
      gain.gain.setValueAtTime(0.0001, t0 + n.at);
      gain.gain.exponentialRampToValueAtTime(n.gain ?? 0.07, t0 + n.at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.at + n.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0 + n.at);
      osc.stop(t0 + n.at + n.dur + 0.05);
    }
  } catch {
    /* nessun audio disponibile: pazienza */
  }
}
