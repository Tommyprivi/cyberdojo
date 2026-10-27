import { COURSES } from "@/lib/content/courses";
import { readRawLessons } from "@/lib/content/load";
import { isVisible, lessonFrontmatter } from "@/lib/content/schema";
import { GLOSSARY, glossarySlug } from "@/lib/glossary/terms";
import { cleanMdx, type SearchEntry } from "./search-core";

/**
 * Indice di ricerca costruito dal contenuto (lezioni visibili + glossario). Legge i file: usarlo SOLO
 * lato server (pagine e azioni del server). Il client non lo importa mai; la logica comune sta in search-core.ts.
 */

let cache: SearchEntry[] | undefined;

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const l of readRawLessons()) {
    const fm = lessonFrontmatter.safeParse(l.data);
    if (!fm.success || !isVisible(fm.data.status)) continue;
    const course = COURSES.find((c) => c.folder === l.file.split("/")[0]);
    const mod = course?.modules.find((m) => m.n === fm.data.module);
    entries.push({
      id: fm.data.id,
      kind: "lezione",
      title: fm.data.title,
      course: course?.id ?? fm.data.id[0],
      module: fm.data.module,
      prerequisites: fm.data.prerequisites,
      text: [fm.data.objectives.join(". "), mod?.title ?? "", cleanMdx(l.body)].join("\n"),
    });
  }
  for (const g of GLOSSARY) {
    entries.push({ id: glossarySlug(g.term), kind: "glossario", title: g.term, text: g.def, course: g.course, prerequisites: [] });
  }
  return entries;
}

/** Indice in memoria (si ricostruisce a ogni avvio del server). */
export function getSearchIndex(): SearchEntry[] {
  return (cache ??= buildSearchIndex());
}
