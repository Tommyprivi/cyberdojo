/** Reazioni e commenti «a frasi»: elenchi chiusi, nessun testo libero (utenti dai 14 anni). Logica pura. */

export const EMOJIS = ["👍", "🔥", "🎉", "❤️", "🤯", "👏"] as const;
export type Emoji = (typeof EMOJIS)[number];

/** Le chiavi sono le stesse del vincolo CHECK nel database (migrazione 0006). */
export const PHRASES = [
  { key: "grazie", text: "Grazie!" },
  { key: "bellissimo", text: "Bellissimo!" },
  { key: "non-vedo-lora", text: "Non vedo l'ora di provarlo" },
  { key: "ottimo-lavoro", text: "Ottimo lavoro" },
  { key: "ho-una-domanda", text: "Ho una domanda" },
  { key: "funziona-bene", text: "Per me funziona bene" },
  { key: "ho-unidea", text: "Ho un'idea" },
] as const;
export type PhraseKey = (typeof PHRASES)[number]["key"];

export const isEmoji = (v: unknown): v is Emoji => typeof v === "string" && (EMOJIS as readonly string[]).includes(v);
export const isPhraseKey = (v: unknown): v is PhraseKey => typeof v === "string" && PHRASES.some((p) => p.key === v);
/** Id di annuncio (file o database): solo caratteri sicuri e lunghezza limitata. */
export const isAnnouncementRef = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(v);

export type ReactionCountRow = { announcement_id: string; emoji: string; n: number };
export type PhraseCountRow = { announcement_id: string; phrase_key: string; n: number };
export type MyEngagement = { emoji: string | null; phrases: string[] };

export type EngagementSummary = {
  reactions: { emoji: Emoji; n: number; mine: boolean }[];
  phrases: { key: PhraseKey; text: string; n: number; mine: boolean }[];
};

export function summarize(id: string, reactionRows: ReactionCountRow[], phraseRows: PhraseCountRow[], mine: MyEngagement): EngagementSummary {
  return {
    reactions: EMOJIS.map((emoji) => ({
      emoji,
      n: reactionRows.find((r) => r.announcement_id === id && r.emoji === emoji)?.n ?? 0,
      mine: mine.emoji === emoji,
    })),
    phrases: PHRASES.map((p) => ({
      key: p.key,
      text: p.text,
      n: phraseRows.find((r) => r.announcement_id === id && r.phrase_key === p.key)?.n ?? 0,
      mine: mine.phrases.includes(p.key),
    })),
  };
}

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 20;

/** Limitatore in memoria, come quello del feedback: 20 azioni al minuto per persona. `true` = troppe. */
export function createReactionLimiter() {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
  };
}
