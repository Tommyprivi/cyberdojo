import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { COURSES } from "./courses";

// La cartella content/ si legge di proposito a runtime di build: niente tracing dell'intero progetto.
export const CONTENT_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "content");

/** Separatore tra schermate nel corpo MDX. */
export const SCREEN_SEPARATOR = /^[ \t]*\{\/\* screen \*\/\}[ \t]*$/m;

export type RawLesson = {
  /** Percorso relativo a content/, con barre normali. */
  file: string;
  data: Record<string, unknown>;
  body: string;
};

export function getRawLesson(id: string): RawLesson | undefined {
  return readRawLessons().find((l) => l.data.id === id);
}

export function splitScreens(body: string): string[] {
  return body
    .split(new RegExp(SCREEN_SEPARATOR.source, "gm"))
    .map((s) => s.trim())
    .filter(Boolean);
}

export function readRawLessons(dir = CONTENT_DIR): RawLesson[] {
  if (!existsSync(dir)) return [];
  const out: RawLesson[] = [];
  for (const course of COURSES) {
    const courseDir = path.join(/*turbopackIgnore: true*/ dir, course.folder);
    if (!existsSync(courseDir)) continue;
    for (const mod of readdirSync(courseDir, { withFileTypes: true })) {
      if (!mod.isDirectory()) continue;
      for (const f of readdirSync(path.join(/*turbopackIgnore: true*/ courseDir, mod.name))) {
        if (!f.endsWith(".mdx")) continue;
        const full = path.join(/*turbopackIgnore: true*/ courseDir, mod.name, f);
        const parsed = matter(readFileSync(full, "utf8"));
        out.push({
          file: [course.folder, mod.name, f].join("/"),
          data: parsed.data,
          body: parsed.content,
        });
      }
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}
