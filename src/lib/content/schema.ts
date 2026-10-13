import { z } from "zod";

export const BELT_IDS = ["bianca", "gialla", "arancione", "verde", "blu", "marrone", "nera"] as const;

/** Stati editoriali. `published` richiede approvazione esplicita del titolare (vedi lint). */
export const STATUSES = ["draft", "ai-reviewed", "tested", "published"] as const;

export const LESSON_ID = /^([FC])\.(\d{2})\.(\d{3})$/;

const verification = z.object({
  type: z.enum(["generated-numeric", "sql", "python", "sim-terminal", "flag-lab", "report"]),
  generator: z.string().optional(),
  pass: z.string().regex(/^\d+\/\d+$/, 'formato "5/5"'),
  retries: z.number().int().min(1).max(10),
});

const video = z.object({
  provider: z.literal("youtube"),
  id: z.string().regex(/^[\w-]{11}$/, "id YouTube di 11 caratteri"),
  start: z.number().int().min(0),
  end: z.number().int().min(1),
  channel: z.string().min(1, "serve il nome del canale per la citazione"),
  title: z.string().optional(),
});

/** Durata massima di uno spezzone incorporato, in secondi. */
export const MAX_VIDEO_SECONDS = 600;

export const lessonFrontmatter = z
  .object({
    id: z.string().regex(LESSON_ID, "formato F.05.017"),
    course: z.string(),
    module: z.number().int().min(1).max(11),
    title: z.string().min(3),
    belt: z.enum(BELT_IDS),
    duration_min: z.number().int().min(3).max(15),
    prerequisites: z.array(z.string().regex(LESSON_ID)),
    objectives: z.array(z.string().min(5)).min(1),
    verification,
    audio: z.boolean(),
    video: video.optional(),
    status: z.enum(STATUSES),
    /** Obbligatorio per pubblicare: approvazione esplicita del titolare. */
    approved: z.boolean().default(false),
    /** Obbligatorio per i moduli di attacco (C8). */
    human_reviewed: z.boolean().default(false),
    known_pitfalls: z.array(z.string()).default([]),
    commands: z.array(z.string()).default([]),
  })
  .strict();

export type LessonFrontmatter = z.infer<typeof lessonFrontmatter>;
