import { and, desc, eq } from "drizzle-orm";
import { loadCatalog } from "@/lib/content/catalog";
import { COURSES } from "@/lib/content/courses";
import { schema } from "@/lib/db";
import { withUser, type Tx } from "@/lib/db/scoped";
import { moduleKey } from "@/lib/mastery/pool";
import { poolForModule } from "@/lib/mastery/server";
import { buildWeakContext, pickWeakTopics, type Resolvers } from "./weak-topics";

/** Quanti tentativi sbagliati recenti si guardano. */
const RECENT_WRONG = 100;

let resolvers: Resolvers | null = null;

/** Argomento = modulo di un corso (titoli presi dai corsi, mai dati dell'utente). */
function getResolvers(): Resolvers {
  if (resolvers) return resolvers;
  const label = new Map<string, string>();
  const byItem = new Map<string, string>();
  for (const c of COURSES) {
    for (const m of c.modules) {
      const key = moduleKey(c.id, m.n);
      label.set(key, `${c.title}, modulo ${m.n}: ${m.title}`);
      for (const it of poolForModule(c.id, m.n)) byItem.set(it.id, key);
    }
  }
  const lessonKey = new Map(loadCatalog().map((l) => [l.id, moduleKey(l.id[0], l.module)]));
  const make = (key: string | undefined) => {
    const l = key ? label.get(key) : undefined;
    return key && l ? { key, label: l } : undefined;
  };
  resolvers = { item: (id) => make(byItem.get(id)), lesson: (id) => make(lessonKey.get(id)) };
  return resolvers;
}

/** Va chiamata dentro withUser. Restituisce solo una frase breve con argomenti dei corsi. */
export async function weakContextInTx(tx: Tx, userId: string): Promise<string> {
  const reviews = await tx
    .select({ itemId: schema.reviewItems.itemId, box: schema.reviewItems.box })
    .from(schema.reviewItems)
    .where(eq(schema.reviewItems.userId, userId));
  const wrong = await tx
    .select({ lessonId: schema.attempts.lessonId })
    .from(schema.attempts)
    .where(and(eq(schema.attempts.userId, userId), eq(schema.attempts.passed, false)))
    .orderBy(desc(schema.attempts.createdAt))
    .limit(RECENT_WRONG);
  return buildWeakContext(pickWeakTopics(reviews, wrong, getResolvers()));
}

/** Per il Sensei: se qualcosa va storto non si blocca la chat, semplicemente niente contesto. */
export async function loadWeakContext(userId: string): Promise<string> {
  try {
    return await withUser(userId, (tx) => weakContextInTx(tx, userId));
  } catch {
    return "";
  }
}
