import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Gli aggiornamenti del sito: le note che si annunciano dentro l'app.
 * Ogni file in content/announcements/ è un aggiornamento, con la data in cima.
 * Il più recente è quello che appare come "Novità" nella pagina del percorso.
 */

const DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "announcements");

export type Announcement = {
  id: string;
  date: string;
  title: string;
  summary: string;
  body: string;
};

/** Prima data in cui il servizio è stato aperto al pubblico: da qui nascono gli account fondatori. */
export const FOUNDING_CUTOFF = "2026-10-21";

export function readAnnouncements(dir = DIR): Announcement[] {
  if (!existsSync(dir)) return [];
  const out: Announcement[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const parsed = matter(readFileSync(path.join(dir, file), "utf8"));
    const { id, date, title, summary } = parsed.data as {
      id?: string;
      date?: string;
      title?: string;
      summary?: string;
    };
    if (!id || !date || !title) continue;
    out.push({ id, date, title, summary: summary ?? "", body: parsed.content });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function latestAnnouncement(): Announcement | undefined {
  return readAnnouncements()[0];
}

/** Un account è "fondatore" se è nato quando il dojo era ancora aperto a tutti, gratis. */
export function isFounder(createdAt: Date | string | null | undefined): boolean {
  if (!createdAt) return false;
  const d = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) <= FOUNDING_CUTOFF;
}
