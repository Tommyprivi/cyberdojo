import { createHmac } from "node:crypto";
import { loadCatalog, type LessonInfo } from "@/lib/content/catalog";
import { COURSES, type CourseDef } from "@/lib/content/courses";
import { readRawLessons } from "@/lib/content/load";
import { isVisible, lessonFrontmatter } from "@/lib/content/schema";
import { ARP_BANK, ENCAPSULATION_BANK, OSI_BANK, PACKET_BASICS } from "@/lib/practice/banks";
import { ALL_BANK_ITEMS } from "@/lib/practice/banks-all";
import { PER_MODULE, sampleModules } from "./placement";
import { buildPools, moduleKey, pickQuestions, type FullQuestion, type PoolItem, type PoolLesson } from "./pool";

/*
  Parte solo-server delle prove: legge le banche e le lezioni, e ricava il seme di un tentativo.
  Le risposte giuste non escono mai da qui verso il browser prima dell'invio.
*/

/** Domande per una prova di padronanza (circa 8) e minimo perché la prova esista. */
export const MASTERY_QUESTIONS = 8;
export const MIN_POOL = 6;

/** Dopo `MAX_FAILS` prove fallite negli ultimi 10 minuti si aspetta (stessa finestra delle verifiche). */
export const MAX_FAILS = 3;
export const WINDOW_MS = 10 * 60 * 1000;
export const OPEN_ATTEMPT_MS = 60 * 60 * 1000;

/** Il tentativo ancora aperto (non valutato) ha punteggio -1 in mastery_attempts: non c'è una colonna di stato. */
export const OPEN_SCORE = -1;

const LEGACY_BANKS = { "packet-basics": PACKET_BASICS, "arp-concepts": ARP_BANK, "osi-layers": OSI_BANK, encapsulation: ENCAPSULATION_BANK };

let catalogCache: LessonInfo[] | null = null;
/** Il catalogo si legge una volta sola: leggere tutte le lezioni a ogni richiesta sarebbe lento. */
const catalog = () => (catalogCache ??= loadCatalog());

let cache: { pools: Map<string, PoolItem[]>; byId: Map<string, PoolItem> } | null = null;

function load() {
  if (cache) return cache;
  const lessons: PoolLesson[] = readRawLessons().flatMap((l) => {
    const fm = lessonFrontmatter.safeParse(l.data);
    if (!fm.success || !isVisible(fm.data.status)) return [];
    return [{ id: fm.data.id, course: fm.data.id[0], module: fm.data.module, generator: fm.data.verification.generator, body: l.body }];
  });
  const pools = buildPools({ ...LEGACY_BANKS, ...ALL_BANK_ITEMS }, lessons);
  const byId = new Map<string, PoolItem>();
  for (const items of pools.values()) for (const it of items) byId.set(it.id, it);
  cache = { pools, byId };
  return cache;
}

export const poolForModule = (course: string, module: number): PoolItem[] => load().pools.get(moduleKey(course, module)) ?? [];
export const itemById = (id: string): PoolItem | undefined => load().byId.get(id);

export function courseByLetter(letter: string): CourseDef | undefined {
  return COURSES.find((c) => c.id === letter);
}

/** Moduli del corso che hanno almeno una lezione visibile. */
export function modulesWithLessons(course: CourseDef): number[] {
  const mods = new Set(catalog().filter((l) => l.course === course.folder).map((l) => l.module));
  return course.modules.map((m) => m.n).filter((n) => mods.has(n));
}

export function lessonIdsOfModule(course: CourseDef, module: number): string[] {
  return catalog().filter((l) => l.course === course.folder && l.module === module).map((l) => l.id);
}

/** Una prova di padronanza esiste solo se il modulo ha lezioni e abbastanza domande. */
export const masteryAvailable = (course: CourseDef, module: number) =>
  lessonIdsOfModule(course, module).length > 0 && poolForModule(course.id, module).length >= MIN_POOL;

/** «F.05» per i moduli, «F» per i corsi: così sono scritti nella colonna `scope`. */
export const moduleScope = (course: string, module: number) => `modulo:${course}.${String(module).padStart(2, "0")}`;
export const placementScope = (course: string) => `ingresso:${course}`;

/**
 * Il seme di un tentativo dipende da un segreto del server: l'identificativo che il browser conosce
 * non basta per ricostruire le domande e le risposte.
 */
export function attemptSeed(userId: string, attemptId: string, scope: string): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") throw new Error("Manca BETTER_AUTH_SECRET");
  }
  return createHmac("sha256", secret ?? "solo-sviluppo").update(`${userId}|${scope}|${attemptId}`).digest("hex");
}

/** Le domande del test d'ingresso: PER_MODULE per ognuno dei moduli campionati (sparsi lungo il corso). */
export function placementSet(course: CourseDef, seed: string): { module: number; question: FullQuestion }[] {
  const usable = modulesWithLessons(course).filter((m) => poolForModule(course.id, m).length >= PER_MODULE);
  const out: { module: number; question: FullQuestion }[] = [];
  for (const mod of sampleModules(usable)) {
    const picked = pickQuestions(poolForModule(course.id, mod), `${seed}:${mod}`, PER_MODULE);
    if (picked.length === PER_MODULE) for (const question of picked) out.push({ module: mod, question });
  }
  return out;
}
