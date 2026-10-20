import { z } from "zod";
import { LESSON_ID } from "./schema";

/*
  Revisioni del titolare (content/revisioni.json). Funzioni pure: niente file, niente rete.
  Chiavi del file: "<id lezione>" (es. C.08.001), "email:<id>", "ux:<percorso>".
  Il file è la fonte di verità: i frontmatter delle lezioni restano invariati e i valori si fondono in lettura.
*/

export const MAX_NOTE = 2000;

export const UX_CRITERIA = [
  { id: "clarity", label: "Chiarezza" },
  { id: "readability", label: "Leggibilità" },
  { id: "mobile", label: "Facilità sul telefono" },
  { id: "speed", label: "Velocità" },
  { id: "style", label: "Colori e font" },
] as const;
export type UxCriterion = (typeof UX_CRITERIA)[number]["id"];
const CRITERION_IDS = UX_CRITERIA.map((c) => c.id) as [UxCriterion, ...UxCriterion[]];

export const EMAIL_REVIEW_IDS = ["magic", "verify", "welcome", "remind-serie", "remind-zero"] as const;
export const EMAIL_LABELS: Record<(typeof EMAIL_REVIEW_IDS)[number], string> = {
  magic: "Link di accesso",
  verify: "Conferma email",
  welcome: "Benvenuto",
  "remind-serie": "Promemoria (serie in corso)",
  "remind-zero": "Promemoria (serie a zero)",
};

/** Schermate del sito da rivedere. `login`: serve l'accesso (senza, si vede la pagina di accesso). */
export const UX_PAGES = [
  { path: "/", label: "Home", group: "Pubbliche", login: false },
  { path: "/corsi", label: "Mappa dei corsi", group: "Pubbliche", login: false },
  { path: "/accedi", label: "Accedi", group: "Pubbliche", login: false },
  { path: "/registrati", label: "Registrati", group: "Pubbliche", login: false },
  { path: "/password-dimenticata", label: "Password dimenticata", group: "Pubbliche", login: false },
  { path: "/nuova-password", label: "Nuova password", group: "Pubbliche", login: false },
  { path: "/benvenuto", label: "Benvenuto (dopo la registrazione)", group: "Con l'accesso", login: true },
  { path: "/percorso", label: "Percorso", group: "Con l'accesso", login: true },
  { path: "/lezione/F.05.001", label: "Lezione (esempio F.05.001)", group: "Con l'accesso", login: true },
  { path: "/profilo", label: "Profilo", group: "Con l'accesso", login: true },
  { path: "/pratica", label: "Allenati", group: "Pratica", login: false },
  { path: "/pratica/quiz", label: "Quiz", group: "Pratica", login: false },
  { path: "/pratica/calcolatore", label: "Calcolatore di rete", group: "Pratica", login: false },
  { path: "/pratica/binario", label: "Laboratorio binario", group: "Pratica", login: false },
  { path: "/pratica/intruso", label: "Trova l'intruso", group: "Pratica", login: false },
] as const;

export const UX_PATHS: string[] = UX_PAGES.map((p) => p.path);

export const reviewEntry = z.object({
  approved: z.boolean().optional(),
  videoReviewed: z.boolean().optional(),
  humanReviewed: z.boolean().optional(),
  note: z.string().max(MAX_NOTE).optional(),
  data: z.string().optional(),
  verdict: z.enum(["like", "change"]).optional(),
  ratings: z.partialRecord(z.enum(CRITERION_IDS), z.number().int().min(1).max(5)).optional(),
  star: z.boolean().optional(),
  /** Voto unico da 1 a 5 (scene, grafica). */
  rating: z.number().int().min(1).max(5).optional(),
});
export type ReviewEntry = z.infer<typeof reviewEntry>;
export type Reviews = Record<string, ReviewEntry>;

/** Legge il contenuto grezzo del file: tollerante, scarta ciò che non è valido. */
export function parseReviews(raw: unknown): Reviews {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Reviews = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    const p = reviewEntry.safeParse(v);
    if (p.success) out[k] = p.data;
  }
  return out;
}

// ---- Input delle azioni (validazione) ----
const note = z.string().max(MAX_NOTE, `La nota può avere al massimo ${MAX_NOTE} caratteri`);

export const lessonReviewInput = z
  .object({
    id: z.string().regex(LESSON_ID, "ID lezione non valido"),
    approved: z.boolean().optional(),
    videoReviewed: z.boolean().optional(),
    humanReviewed: z.boolean().optional(),
    note: note.optional(),
  })
  .strict();

export const emailReviewInput = z
  .object({ id: z.enum(EMAIL_REVIEW_IDS), seen: z.boolean().optional(), note: note.optional() })
  .strict();

export const uxReviewInput = z
  .object({
    path: z.string().refine((p) => UX_PATHS.includes(p), "Schermata sconosciuta"),
    verdict: z.enum(["like", "change"]).nullable().optional(),
    ratings: z.partialRecord(z.enum(CRITERION_IDS), z.number().int().min(1).max(5)).optional(),
    star: z.boolean().optional(),
    note: note.optional(),
  })
  .strict();

/** Scena (schermata) di una lezione: n parte da 1. */
export const sceneReviewInput = z
  .object({
    id: z.string().regex(LESSON_ID, "ID lezione non valido"),
    n: z.number().int().min(1).max(30),
    verdict: z.enum(["like", "change"]).nullable().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    note: note.optional(),
  })
  .strict();

/** Elemento grafico (colore, font, componente, immagine). L'esistenza dell'id si controlla nell'azione. */
export const GFX_ID = /^[\w:./ -]{1,120}$/;
export const gfxReviewInput = z
  .object({
    id: z.string().regex(GFX_ID, "Elemento sconosciuto"),
    verdict: z.enum(["like", "change"]).nullable().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    note: note.optional(),
  })
  .strict();

export type LessonReviewInput = z.infer<typeof lessonReviewInput>;
export type EmailReviewInput = z.infer<typeof emailReviewInput>;
export type UxReviewInput = z.infer<typeof uxReviewInput>;

export const lessonKey = (id: string) => id;
export const emailKey = (id: string) => `email:${id}`;
export const sceneKey = (id: string, n: number) => `scene:${id}:${n}`;
export const gfxKey = (id: string) => `gfx:${id}`;
export const uxKey = (path: string) => `ux:${path}`;

/** Applica una modifica parziale a una voce, aggiornando la data. Una nota vuota la cancella. */
export function applyPatch(
  prev: ReviewEntry | undefined,
  patch: { [K in keyof ReviewEntry]?: ReviewEntry[K] | null },
  now: Date,
): ReviewEntry {
  const next: Record<string, unknown> = { ...prev };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    if (v === null) delete next[k];
    else next[k] = v;
  }
  if (patch.ratings) next.ratings = { ...prev?.ratings, ...patch.ratings };
  if (typeof next.note === "string" && next.note.trim() === "") delete next.note;
  next.data = now.toISOString();
  return next as ReviewEntry;
}

/** Fonde le revisioni nei dati letti dal frontmatter (approved, video.reviewed, human_reviewed). */
export function mergeReviewIntoData(data: Record<string, unknown>, review: ReviewEntry | undefined): Record<string, unknown> {
  if (!review) return data;
  const out: Record<string, unknown> = { ...data };
  if (review.approved !== undefined) out.approved = review.approved;
  if (review.humanReviewed !== undefined) out.human_reviewed = review.humanReviewed;
  if (review.videoReviewed !== undefined && data.video && typeof data.video === "object") {
    out.video = { ...(data.video as object), reviewed: review.videoReviewed };
  }
  return out;
}

export type ReviewFacts = {
  approved: boolean;
  hasVideo: boolean;
  videoReviewed: boolean;
  isAttack: boolean; // modulo C8
  humanReviewed: boolean;
};

/** Pronta per la pubblicazione: approvata, video guardato e, per C8, riletta da una persona. */
export function isReadyToPublish(f: ReviewFacts): boolean {
  return f.approved && f.hasVideo && f.videoReviewed && (!f.isAttack || f.humanReviewed);
}

export type LessonRow = ReviewFacts & { id: string; title: string; module: number; course: string; note?: string };

export type Summary = {
  lessons: number;
  approved: number;
  videoReviewed: number;
  videoToWatch: number;
  noVideo: number;
  attackToReview: number;
  ready: number;
  emailsSeen: number;
  emailsTotal: number;
  uxSeen: number;
  uxApproved: number;
  uxTotal: number;
  done: number;
  total: number;
  percent: number;
};

export function summarize(rows: LessonRow[], reviews: Reviews): Summary {
  const emailsSeen = EMAIL_REVIEW_IDS.filter((id) => reviews[emailKey(id)]?.approved).length;
  const uxSeen = UX_PATHS.filter((p) => reviews[uxKey(p)]?.verdict).length;
  const uxApproved = UX_PATHS.filter((p) => reviews[uxKey(p)]?.verdict === "like").length;
  let done = 0;
  let total = 0;
  for (const r of rows) {
    total += 1;
    if (r.approved) done += 1;
    if (r.hasVideo) {
      total += 1;
      if (r.videoReviewed) done += 1;
    }
    if (r.isAttack) {
      total += 1;
      if (r.humanReviewed) done += 1;
    }
  }
  total += EMAIL_REVIEW_IDS.length + UX_PATHS.length;
  done += emailsSeen + uxSeen;
  return {
    lessons: rows.length,
    approved: rows.filter((r) => r.approved).length,
    videoReviewed: rows.filter((r) => r.hasVideo && r.videoReviewed).length,
    videoToWatch: rows.filter((r) => r.hasVideo && !r.videoReviewed).length,
    noVideo: rows.filter((r) => !r.hasVideo).length,
    attackToReview: rows.filter((r) => r.isAttack && !r.humanReviewed).length,
    ready: rows.filter(isReadyToPublish).length,
    emailsSeen,
    emailsTotal: EMAIL_REVIEW_IDS.length,
    uxSeen,
    uxApproved,
    uxTotal: UX_PATHS.length,
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** Prossimo passo consigliato, in ordine: lezioni da approvare, video, modulo C8, email, schermate. */
export function nextStep(rows: LessonRow[], reviews: Reviews): { text: string; href: string } {
  const sorted = [...rows].sort((a, b) => a.id.localeCompare(b.id));
  const lesson = sorted.find((r) => !r.approved);
  if (lesson) return { text: `Leggi e approva la lezione ${lesson.id}: ${lesson.title}`, href: `/revisione/lezioni/${lesson.id}` };
  const video = sorted.find((r) => r.hasVideo && !r.videoReviewed);
  if (video) return { text: `Guarda il video della lezione ${video.id}`, href: `/revisione/lezioni/${video.id}#video` };
  const attack = sorted.find((r) => r.isAttack && !r.humanReviewed);
  if (attack) return { text: `Rileggi il modulo di attacco etico: ${attack.id}`, href: `/revisione/lezioni/${attack.id}` };
  if (EMAIL_REVIEW_IDS.some((id) => !reviews[emailKey(id)]?.approved)) {
    return { text: "Guarda le email del sito e segna quelle che ti piacciono", href: "/revisione/email" };
  }
  const ux = UX_PAGES.find((p) => !reviews[uxKey(p.path)]?.verdict);
  if (ux) return { text: `Guarda la schermata «${ux.label}»`, href: "/revisione/ux" };
  return { text: "Hai rivisto tutto. Esporta le tue note e mandale a Claude.", href: "#note" };
}

// ---- Domande (file separato: content/revisioni-domande.json) ----
export const QUESTION_ID = /^[\w-]{1,60}#\d{1,4}$/;
export const QUESTION_VERDICTS = [
  { id: "ok", label: "Giusta e chiara" },
  { id: "fix", label: "Da correggere" },
  { id: "remove", label: "Da togliere" },
] as const;
export type QuestionVerdict = (typeof QUESTION_VERDICTS)[number]["id"];

export const questionEntry = z.object({
  verdict: z.enum(["ok", "fix", "remove"]).optional(),
  note: z.string().max(MAX_NOTE).optional(),
  data: z.string().optional(),
});
export type QuestionEntry = z.infer<typeof questionEntry>;
export type QuestionReviews = Record<string, QuestionEntry>;

export function parseQuestionReviews(raw: unknown): QuestionReviews {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: QuestionReviews = {};
  for (const [k, v] of Object.entries(raw)) {
    const p = questionEntry.safeParse(v);
    if (p.success && QUESTION_ID.test(k)) out[k] = p.data;
  }
  return out;
}

export const questionReviewInput = z
  .object({
    id: z.string().regex(QUESTION_ID, "Domanda sconosciuta"),
    verdict: z.enum(["ok", "fix", "remove"]).nullable().optional(),
    note: note.optional(),
  })
  .strict();

export function applyQuestionPatch(
  prev: QuestionEntry | undefined,
  patch: { verdict?: QuestionVerdict | null; note?: string },
  now: Date,
): QuestionEntry {
  const next: Record<string, unknown> = { ...prev };
  if (patch.verdict === null) delete next.verdict;
  else if (patch.verdict) next.verdict = patch.verdict;
  if (patch.note !== undefined) next.note = patch.note;
  if (typeof next.note === "string" && next.note.trim() === "") delete next.note;
  next.data = now.toISOString();
  return next as QuestionEntry;
}

export function summarizeQuestions(total: number, r: QuestionReviews) {
  const v = Object.values(r);
  const count = (x: QuestionVerdict) => v.filter((e) => e.verdict === x).length;
  const seen = v.filter((e) => e.verdict).length;
  return { total, seen, ok: count("ok"), fix: count("fix"), remove: count("remove"), toSee: Math.max(0, total - seen) };
}

export function summarizeGfx(total: number, reviews: Reviews) {
  const e = Object.entries(reviews).filter(([k]) => k.startsWith("gfx:")).map(([, v]) => v);
  return { total, seen: e.filter((x) => x.verdict).length, approved: e.filter((x) => x.verdict === "like").length, toChange: e.filter((x) => x.verdict === "change").length };
}

export function summarizeScenes(reviews: Reviews) {
  const e = Object.entries(reviews).filter(([k]) => k.startsWith("scene:")).map(([, v]) => v);
  return { seen: e.filter((x) => x.verdict).length, approved: e.filter((x) => x.verdict === "like").length, toChange: e.filter((x) => x.verdict === "change").length };
}

type ExportExtra = {
  questions?: QuestionReviews;
  /** Testo breve di una domanda, dal suo id. */
  questionText?: (id: string) => string;
  /** Nome leggibile di un elemento grafico, dal suo id. */
  gfxLabel?: (id: string) => string;
};

const oneLine = (t: string) => t.replace(/\s*\n\s*/g, " / ");
const mark = (e: { verdict?: string; star?: boolean; rating?: number }) =>
  [
    e.verdict === "like" && "[mi piace]",
    e.verdict === "change" && "[da cambiare]",
    e.verdict === "ok" && "[giusta e chiara]",
    e.verdict === "fix" && "[da correggere]",
    e.verdict === "remove" && "[da togliere]",
    e.star && "[stella]",
    e.rating && `voto ${e.rating}/5`,
  ]
    .filter(Boolean)
    .join(" ");

/** Testo con tutte le note, ordinato per tipo (lezioni, scene, domande, grafica, UX, email), da incollare in chat. */
export function exportNotes(rows: LessonRow[], reviews: Reviews, extra: ExportExtra = {}): string {
  const out: string[] = [];
  const titles = new Map(rows.map((r) => [r.id, r.title]));
  const section = (head: string, lines: string[]) => {
    if (lines.length) out.push(`## ${head}`, ...lines, "");
  };
  const line = (label: string, e: { note?: string; verdict?: string; star?: boolean; rating?: number }, extraBits = "") =>
    `- ${label} ${[mark(e), extraBits].filter(Boolean).join(" ")}${e.note ? `: ${oneLine(e.note)}` : ""}`.replace(/\s+:/, ":");
  const sortedKeys = (prefix: (k: string) => boolean) =>
    Object.entries(reviews).filter(([k]) => prefix(k)).sort(([a], [b]) => a.localeCompare(b, "it", { numeric: true }));

  section(
    "Lezioni",
    sortedKeys((k) => LESSON_ID.test(k))
      .filter(([, e]) => e.note)
      .map(([k, e]) => `- ${k} ${titles.get(k) ?? ""}: ${oneLine(e.note!)}`),
  );
  section(
    "Scene delle lezioni",
    sortedKeys((k) => k.startsWith("scene:"))
      .filter(([, e]) => e.note || e.verdict || e.rating)
      .map(([k, e]) => {
        const [, id, n] = k.split(":");
        return line(`${id} ${titles.get(id) ?? ""}, schermata ${n}`, e);
      }),
  );
  section(
    "Domande",
    Object.entries(extra.questions ?? {})
      .filter(([, e]) => e.note || e.verdict === "fix" || e.verdict === "remove")
      .sort(([a], [b]) => a.localeCompare(b, "it", { numeric: true }))
      .map(([id, e]) => line(`${id}${extra.questionText ? ` «${extra.questionText(id)}»` : ""}`, e)),
  );
  section(
    "Grafica",
    sortedKeys((k) => k.startsWith("gfx:"))
      .filter(([, e]) => e.note || e.verdict || e.rating)
      .map(([k, e]) => line(extra.gfxLabel?.(k.slice(4)) ?? k.slice(4), e)),
  );
  section(
    "Schermate e UX",
    UX_PAGES.flatMap((p) => {
      const e = reviews[uxKey(p.path)];
      if (!e || !(e.note || e.verdict || e.star || e.ratings)) return [];
      const r = UX_CRITERIA.filter((c) => e.ratings?.[c.id]).map((c) => `${c.label} ${e.ratings![c.id]}/5`);
      return [line(`${p.label} (${p.path})`, e, r.length ? `(${r.join(", ")})` : "")];
    }),
  );
  section(
    "Email",
    EMAIL_REVIEW_IDS.flatMap((id) => {
      const e = reviews[emailKey(id)];
      return e && (e.note || e.approved !== undefined) ? [line(`${EMAIL_LABELS[id]}${e.approved ? " [vista]" : ""}`, { note: e.note })] : [];
    }),
  );
  return out.length ? out.join("\n").trim() : "Nessuna nota scritta finora.";
}
