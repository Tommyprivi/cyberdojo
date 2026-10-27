import { z } from "zod";
import { sendSignal } from "@/lib/social/call-signal";
import { getSessionUser } from "@/lib/session";

/**
 * Saluto di chiusura inviato con navigator.sendBeacon quando la scheda si chiude (le azioni server non si
 * possono chiamare da lì). Stessi controlli di ogni altro messaggio: sessione, forma, e le regole nel database.
 * Accetta solo richieste dello stesso sito.
 */

const body = z.object({ friendshipId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/), sid: z.string().regex(/^[A-Za-z0-9-]{8,40}$/) });

function sameSite(request: Request): boolean {
  try {
    const origin = request.headers.get("origin");
    return Boolean(origin) && new URL(origin as string).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameSite(request)) return new Response(null, { status: 403 });
  const user = await getSessionUser();
  if (!user) return new Response(null, { status: 401 });
  let json: unknown;
  try {
    json = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const p = body.safeParse(json);
  if (!p.success) return new Response(null, { status: 400 });
  await sendSignal(user.id, p.data.friendshipId, "bye", { sid: p.data.sid });
  return new Response(null, { status: 204 });
}
