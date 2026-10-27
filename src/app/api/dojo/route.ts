import { handleDojo } from "@/lib/ai/handler";
import { loadWeakContext } from "@/lib/ai/weak-server";
import { getSessionUser } from "@/lib/session";

export const maxDuration = 30;

/** POST /api/dojo: serve una sessione valida. I testi delle conversazioni non si registrano. */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Accedi per parlare con il Sensei." }, { status: 401 });

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 64_000) return Response.json({ error: "Richiesta troppo grande." }, { status: 413 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const out = await handleDojo(user.id, body, { loadWeak: loadWeakContext });
  return Response.json(out.body, { status: out.status, headers: { "Cache-Control": "no-store", ...out.headers } });
}
