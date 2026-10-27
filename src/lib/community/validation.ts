import { z } from "zod";

/** Regole degli annunci scritti dallo staff. Testo semplice o Markdown limitato: mai MDX né HTML. */

export const ANNOUNCEMENT_TAGS = ["novità", "corsi", "community", "importante"] as const;
export const TITLE_MAX = 120;
export const SUMMARY_MAX = 200;
export const BODY_MAX = 6000;

/** Segnali di HTML/MDX: tag, import/export, espressioni tra graffe. Meglio rifiutare che renderizzare. */
export function looksLikeCode(text: string): boolean {
  return /<\/?[a-zA-Z!][^>]*>/.test(text) || /^\s*(import|export)\s/m.test(text) || /\{[^}]*\}/.test(text);
}

const noCode = (s: string) => !looksLikeCode(s);

export const announcementInput = z.object({
  title: z.string().trim().min(3, "Il titolo è troppo corto.").max(TITLE_MAX, "Titolo troppo lungo.").refine(noCode, "Niente HTML o codice nel titolo."),
  summary: z.string().trim().max(SUMMARY_MAX, "Riassunto troppo lungo.").refine(noCode, "Niente HTML o codice nel riassunto."),
  body: z
    .string()
    .trim()
    .min(1, "Scrivi il testo.")
    .max(BODY_MAX, "Testo troppo lungo.")
    .refine(noCode, "Niente HTML, MDX o parentesi graffe: solo testo e Markdown semplice."),
  tags: z.array(z.enum(ANNOUNCEMENT_TAGS)).max(4),
  pinned: z.boolean(),
});

export type AnnouncementInput = z.infer<typeof announcementInput>;

const strip = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Id sempre con prefisso «db-»: gli id dei file non lo usano, quindi non possono collidere. */
export function makeAnnouncementId(title: string, now: Date, suffix: string): string {
  const day = now.toISOString().slice(0, 10);
  const head = `db-${day}-`;
  const tail = `-${strip(suffix) || "x"}`;
  const slug =
    strip(title)
      .slice(0, 60 - head.length - tail.length)
      .replace(/-+$/g, "") || "annuncio";
  return `${head}${slug}${tail}`;
}

export const ANNOUNCEMENT_ID = /^db-[a-z0-9-]{1,60}$/;
