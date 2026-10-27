import { BELT_IDS } from "@/lib/content/schema";

/** Logica pura del certificato di fine corso (nessun accesso ai file né al database). */

export type CourseLesson = { id: string; /** Cartella del corso, es. "fondamenta". */ course: string; belt: string };

export type CourseCompletion = { done: number; total: number; complete: boolean };

/** Un corso è completo solo quando TUTTE le sue lezioni visibili sono completate. */
export function courseCompletion(lessons: readonly CourseLesson[], completed: ReadonlySet<string>, courseFolder: string): CourseCompletion {
  const mine = lessons.filter((l) => l.course === courseFolder);
  const done = mine.filter((l) => completed.has(l.id)).length;
  return { done, total: mine.length, complete: mine.length > 0 && done === mine.length };
}

/** La cintura più alta tra quelle scritte nelle lezioni del corso. */
export function highestBelt(lessons: readonly { belt: string }[]): string {
  let best = 0;
  for (const l of lessons) best = Math.max(best, BELT_IDS.indexOf(l.belt as (typeof BELT_IDS)[number]));
  return BELT_IDS[best];
}

// Niente 0, 1, O, I, L: si legge e si copia senza errori.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Codice pubblico «CD-XXXX-XXXX-XXXX» da 12 byte casuali. Con crypto.getRandomValues non è indovinabile. */
export function makeCode(bytes: Uint8Array): string {
  if (bytes.length < 12) throw new Error("Servono 12 byte.");
  let chars = "";
  for (let i = 0; i < 12; i++) chars += ALPHABET[bytes[i] % ALPHABET.length];
  return `CD-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export function randomCode(): string {
  return makeCode(crypto.getRandomValues(new Uint8Array(12)));
}

export function isValidCode(code: string): boolean {
  return /^CD-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/.test(code);
}

/** Nella verifica pubblica compare solo il nome e l'iniziale del cognome. */
export function publicHolderName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Studente";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}
