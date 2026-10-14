import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./auth";
import { getMemberData } from "./progress/queries";

/**
 * Sessione lato server. Legge i cookie della richiesta: chiamare solo dentro un componente
 * avvolto da <Suspense> (regola di Cache Components), mai nel layout statico.
 */
export async function getSessionUser() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Solo percorsi interni: evita che `?next=` porti l'utente su un altro sito. */
export function safeNext(next: string | null | undefined, fallback = "/percorso"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

/** Utente registrato con profilo completo; altrimenti rimanda ad accedere o a completare il profilo. */
export async function requireMember(returnTo: string) {
  const user = await getSessionUser();
  if (!user) redirect(`/accedi?next=${encodeURIComponent(returnTo)}`);
  const data = await getMemberData(user.id);
  if (!data.profile) redirect(`/benvenuto?next=${encodeURIComponent(returnTo)}`);
  return { user, ...data, profile: data.profile };
}
