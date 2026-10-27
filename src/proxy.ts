import { NextResponse, type NextRequest } from "next/server";
import countdown from "../content/countdown.json";
import { decideMaintenance, MAINTENANCE_COOKIE, MAINTENANCE_HEADER } from "@/lib/maintenance";

/**
 * Manutenzione: vedi src/lib/maintenance.ts. L'accesso riservato del titolare si apre una volta
 * con /?accesso=<MAINTENANCE_KEY> e resta in un cookie. Senza MAINTENANCE_KEY nessuno lo ha.
 */
export function proxy(request: NextRequest) {
  const key = process.env.MAINTENANCE_KEY;
  const given = request.nextUrl.searchParams.get("accesso");
  const hasKey = Boolean(key) && (given === key || request.cookies.get(MAINTENANCE_COOKIE)?.value === key);

  const decision = decideMaintenance(request.nextUrl.pathname, countdown, Date.now(), hasKey);

  if (decision === "page") return NextResponse.rewrite(new URL("/manutenzione", request.url), { status: 503 });
  if (decision === "api") {
    return NextResponse.json({ error: "Sito in manutenzione" }, { status: 503, headers: { "Retry-After": "3600" } });
  }

  let response: NextResponse;
  if (decision === "lessons") {
    const headers = new Headers(request.headers);
    headers.set(MAINTENANCE_HEADER, "1");
    response = NextResponse.next({ request: { headers } });
  } else {
    response = NextResponse.next();
  }
  if (hasKey && given === key && key) {
    response.cookies.set(MAINTENANCE_COOKIE, key, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  }
  return response;
}

export const config = {
  // Niente file statici, immagini, icone, manifest e service worker: il proxy gira solo su pagine e API.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|xml|html|js|css|json|webmanifest|mp3|mp4|woff2?)$).*)"],
};
