/** Logica pura del lettore «Ascolta la lezione» (nessun accesso a browser o database). */

export const RATE_MIN = 0.8;
export const RATE_MAX = 1.5;

export type QueueItem = { screen: number; text: string; audioUrl?: string };
export type SavedPoint = { index: number; rate: number };

/** Testi parlati (<Say>) di una schermata MDX, ripuliti da markdown e tag. */
export function extractSayTexts(source: string): string[] {
  const out: string[] = [];
  for (const m of source.matchAll(/<Say\b[^>]*>([\s\S]*?)<\/Say>/g)) {
    const t = m[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (t) out.push(t);
  }
  return out;
}

/** Divide in frasi (. ! ? …); le frasi più lunghe di `max` si spezzano sugli spazi. */
export function splitSentences(text: string, max = 220): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const raw = clean.split(/(?<=[.!?…]["»”)]?)\s+/);
  const out: string[] = [];
  for (const piece of raw) {
    let s = piece.trim();
    while (s.length > max) {
      let cut = s.lastIndexOf(" ", max);
      if (cut <= 0) cut = max;
      out.push(s.slice(0, cut).trim());
      s = s.slice(cut).trim();
    }
    if (s) out.push(s);
  }
  return out;
}

const isHttp = (u: string) => /^https?:\/\//i.test(u);

/**
 * Coda di lettura. Se per una schermata esiste un audio già generato (`audio[schermata]`)
 * diventa una voce sola; altrimenti una voce per frase (per la sintesi del browser).
 */
export function buildQueue(screens: string[][], audio: Record<number, string> = {}): QueueItem[] {
  const q: QueueItem[] = [];
  screens.forEach((texts, screen) => {
    if (texts.length === 0) return;
    const url = audio[screen];
    if (url && isHttp(url)) {
      q.push({ screen, text: texts.join(" "), audioUrl: url });
      return;
    }
    for (const t of texts) for (const s of splitSentences(t)) q.push({ screen, text: s });
  });
  return q;
}

/** Sposta l'indice di `delta` voci restando nei limiti della coda. */
export function stepIndex(queue: QueueItem[], index: number, delta: number): number {
  if (queue.length === 0) return 0;
  return Math.min(queue.length - 1, Math.max(0, index + delta));
}

/** Prima voce della schermata (o della prossima che ha testo); -1 se non c'è. */
export function screenStart(queue: QueueItem[], screen: number): number {
  return queue.findIndex((i) => i.screen >= screen);
}

export function clampRate(r: number): number {
  if (!Number.isFinite(r)) return 1;
  return Math.min(RATE_MAX, Math.max(RATE_MIN, Math.round(r * 100) / 100));
}

export const pointKey = (lessonId: string) => `cyberdojo:ascolta:${lessonId}`;

export function formatPoint(p: SavedPoint): string {
  return JSON.stringify({ v: 1, index: p.index, rate: p.rate });
}

export function parsePoint(raw: string | null): SavedPoint | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as { v?: unknown; index?: unknown; rate?: unknown };
    if (o.v !== 1 || typeof o.index !== "number" || !Number.isFinite(o.index)) return null;
    return { index: Math.max(0, Math.floor(o.index)), rate: clampRate(typeof o.rate === "number" ? o.rate : 1) };
  } catch {
    return null;
  }
}

/** Audio esistente se c'è, altrimenti sintesi del browser, altrimenti niente. */
export function chooseSource(item: { audioUrl?: string }, speechAvailable: boolean): "audio" | "speech" | "none" {
  if (item.audioUrl) return "audio";
  return speechAvailable ? "speech" : "none";
}
