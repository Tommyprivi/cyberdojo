"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { loadCatalog } from "@/lib/content/catalog";
import { readRawLessons } from "@/lib/content/load";
import { COURSES } from "@/lib/content/courses";
import { courseCompletion, highestBelt, isValidCode, randomCode } from "@/lib/certificate/certificate-core";
import { getMemberData } from "@/lib/progress/queries";
import { getSessionUser } from "@/lib/session";

/*
  Certificato di fine corso. Si emette solo se il server verifica che TUTTE le lezioni visibili del corso
  sono completate (mai un valore mandato dal browser). Il certificato dice soltanto questo: «ha completato
  tutte le lezioni del corso». Non c'è nessun esame, quindi non si scrive altro.

  Verifica pubblica: la tabella certificates è protetta per riga (solo il proprietario la legge), quindi la
  pagina pubblica /verifica/<codice> usa la funzione SQL `verify_certificate(code)` (SECURITY DEFINER, come
  reminder_candidates). Va creata con una migrazione; finché non esiste la verifica risponde «non attiva».

    create or replace function public.verify_certificate(p_code text)
    returns table (holder text, course text, belt text, issued_at timestamp)
    language sql stable security definer set search_path = public
    as $$
      select u.name, c.course, c.belt, c.issued_at
      from public.certificates c join public."user" u on u.id = c.user_id
      where c.public_code = p_code
    $$;
    revoke all on function public.verify_certificate(text) from public;
    -- grant execute on function public.verify_certificate(text) to cyberdojo_app;
*/

/** Dati del certificato di un corso per l'utente collegato: null se il corso non è completo. */
export async function getCourseCertificate(courseId: string) {
  const user = await getSessionUser();
  if (!user) return null;
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const { completed } = await getMemberData(user.id);
  const mine = loadCatalog();
  const completion = courseCompletion(mine.map((l) => ({ id: l.id, course: l.course, belt: "bianca" })), completed, course.folder);

  const [existing] = await withUser(user.id, (tx) =>
    tx
      .select()
      .from(schema.certificates)
      .where(and(eq(schema.certificates.userId, user.id), eq(schema.certificates.course, course.id)))
      .limit(1),
  );
  return { course, completion, certificate: existing ?? null, holder: user.name || user.email.split("@")[0] };
}

/** Emette il certificato (una volta sola per corso) e porta alla sua pagina. */
export async function issueCertificate(formData: FormData): Promise<void> {
  const courseId = String(formData.get("corso") ?? "");
  const user = await getSessionUser();
  if (!user) redirect("/accedi");
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) redirect("/percorso");

  const { completed } = await getMemberData(user.id);
  const lessons = readRawLessons();
  const visible = loadCatalog().filter((l) => l.course === course.folder);
  const completion = courseCompletion(visible.map((l) => ({ id: l.id, course: l.course, belt: "bianca" })), completed, course.folder);
  if (!completion.complete) redirect(`/certificato/${course.id}`);

  const belts = lessons
    .filter((l) => visible.some((v) => v.id === l.data.id))
    .map((l) => ({ belt: String(l.data.belt ?? "bianca") }));

  await withUser(user.id, async (tx) => {
    const [existing] = await tx
      .select({ id: schema.certificates.id })
      .from(schema.certificates)
      .where(and(eq(schema.certificates.userId, user.id), eq(schema.certificates.course, course.id)))
      .limit(1);
    if (existing) return;
    await tx.insert(schema.certificates).values({
      id: crypto.randomUUID(),
      userId: user.id,
      course: course.id,
      belt: highestBelt(belts),
      publicCode: randomCode(),
    });
  });
  redirect(`/certificato/${course.id}`);
}

export type Verification =
  | { status: "ok"; holder: string; course: string; issuedAt: string }
  | { status: "not-found" }
  | { status: "unavailable" };

/** Verifica pubblica di un codice. Nessun dato oltre a nome (con iniziale del cognome), corso e data. */
export async function verifyCertificate(code: string): Promise<Verification> {
  if (!isValidCode(code)) return { status: "not-found" };
  try {
    const res = await getDb().execute(sql`select * from public.verify_certificate(${code})`);
    const row = (res.rows as { holder?: string; course?: string; issued_at?: string | Date }[])[0];
    if (!row?.course) return { status: "not-found" };
    return { status: "ok", holder: String(row.holder ?? ""), course: String(row.course), issuedAt: new Date(row.issued_at ?? Date.now()).toISOString() };
  } catch {
    // Funzione non ancora creata nel database (o database non raggiungibile).
    return { status: "unavailable" };
  }
}
