import { handleCodeReview } from "@/lib/ai/code-review-handler";
import { getSessionUser } from "@/lib/session";

export const maxDuration = 30;

/** POST /api/dojo/codice: il Sensei spiega l'errore e dà un indizio. Il codice non si registra. */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Accedi per chiedere al Sensei." }, { status: 401 });

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 32_000) return Response.json({ error: "Richiesta troppo grande." }, { status: 413 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const out = await handleCodeReview(user.id, body);
  return Response.json(out.body, { status: out.status, headers: { "Cache-Control": "no-store", ...("headers" in out ? out.headers : {}) } });
}
