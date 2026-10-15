import { unsubscribeReminders } from "@/app/actions/mail";

/**
 * Disiscrizione con un clic (RFC 8058): i programmi di posta la chiamano da soli con POST quando
 * l'utente preme «annulla iscrizione». Il token firmato dice di chi si tratta.
 */
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const r = await unsubscribeReminders(token);
  return r.ok ? new Response("Promemoria disattivati.") : new Response(r.error, { status: 400 });
}
