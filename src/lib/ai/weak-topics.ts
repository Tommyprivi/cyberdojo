/**
 * «Sensei che ti segue»: dai ripassi (scatole Leitner) e dai tentativi sbagliati ricava i punti deboli.
 * Funzioni pure. Al modello va solo un elenco breve di argomenti dei corsi: niente nome, email o ID.
 */

export type ReviewRow = { itemId: string; box: number };
export type WrongAttempt = { lessonId: string | null };
export type Topic = { key: string; label: string; score: number };

export const MAX_TOPICS = 5;
export const MAX_LABEL_CHARS = 80;

/** Pesi: una domanda ancora in scatola 1 pesa di più di una già quasi imparata. */
const BOX_WEIGHT: Record<number, number> = { 1: 3, 2: 2 };
const boxWeight = (box: number) => BOX_WEIGHT[box] ?? 1;

/** Etichetta sicura per il prompt: una riga, senza marcatori, accorciata. */
export function cleanLabel(label: string): string {
  return label
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[<>[\]{}`]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_LABEL_CHARS);
}

export type Resolvers = {
  /** ID domanda di ripasso -> argomento (chiave + etichetta), se noto. */
  item: (itemId: string) => { key: string; label: string } | undefined;
  /** ID lezione -> argomento, se noto. */
  lesson: (lessonId: string) => { key: string; label: string } | undefined;
};

/** I 3-5 argomenti più deboli, dal più debole. Con pochi dati ne restituisce meno (anche zero). */
export function pickWeakTopics(reviews: readonly ReviewRow[], wrong: readonly WrongAttempt[], r: Resolvers, limit = MAX_TOPICS): Topic[] {
  const acc = new Map<string, Topic>();
  const add = (t: { key: string; label: string } | undefined, w: number) => {
    if (!t) return;
    const label = cleanLabel(t.label);
    if (!label) return;
    const cur = acc.get(t.key);
    if (cur) cur.score += w;
    else acc.set(t.key, { key: t.key, label, score: w });
  };
  for (const rv of reviews) add(r.item(rv.itemId), boxWeight(rv.box));
  for (const a of wrong) if (a.lessonId) add(r.lesson(a.lessonId), 1);
  return [...acc.values()].sort((a, b) => b.score - a.score || a.label.localeCompare(b.label)).slice(0, Math.max(0, Math.min(limit, MAX_TOPICS)));
}

/** Contesto breve per il modello. Stringa vuota se non ci sono punti deboli. */
export function buildWeakContext(topics: readonly Topic[]): string {
  const labels = topics.slice(0, MAX_TOPICS).map((t) => cleanLabel(t.label)).filter(Boolean);
  if (labels.length === 0) return "";
  return `Lo studente sbaglia spesso: ${labels.join("; ")}.`;
}
