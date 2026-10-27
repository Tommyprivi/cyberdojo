import { timingSafeEqual } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { latestAnnouncement } from "@/lib/announcements";
import { loadCatalog, nextLesson } from "@/lib/content/catalog";
import { getDb, schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { localDay } from "@/lib/progress/streak";
import { pushClient } from "@/lib/push/config";
import { buildMessage, isNewsPushDue, isStudyPushDue, isSubscriptionGone, type PushCandidate } from "@/lib/push/rules";

/**
 * Notifiche push. Va chiamato ogni ora dallo stesso servizio di pianificazione dei promemoria, con
 * `Authorization: Bearer <CRON_SECRET>`. Senza segreto o senza chiavi VAPID il percorso resta chiuso.
 * Mai due notifiche di studio nello stesso giorno; le iscrizioni scadute (404/410) vengono cancellate.
 * Se l'invio fallisce per un altro motivo non si segna nulla: al giro successivo si riprova.
 */

const MAX_PER_RUN = 500;

function authorized(req: Request): boolean | "unconfigured" {
  const secret = process.env.CRON_SECRET;
  if (!secret) return "unconfigured";
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

type Row = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  kinds: unknown;
  hour: number;
  last_study_day: string | null;
  last_news_id: string | null;
  timezone: string;
  streak_current: number;
  streak_last_day: string | null;
};

export async function GET(req: Request) {
  const auth = authorized(req);
  if (auth === "unconfigured") return Response.json({ error: "CRON_SECRET non configurato." }, { status: 503 });
  if (!auth) return new Response("Non autorizzato", { status: 401 });

  const client = pushClient();
  if (!client) return Response.json({ error: "Notifiche non configurate (chiavi VAPID)." }, { status: 503 });

  const now = new Date();
  const result = await getDb().execute(sql`select * from push_candidates()`);
  const rows = (result.rows as Row[]).slice(0, MAX_PER_RUN);

  const catalog = loadCatalog();
  const news = latestAnnouncement();
  const nextByUser = new Map<string, string | null>();
  const counts = { considerati: rows.length, inviati: 0, scadute: 0, falliti: 0 };

  for (const r of rows) {
    const kinds = Array.isArray(r.kinds) ? r.kinds.filter((k): k is string => typeof k === "string") : [];
    const c: PushCandidate = {
      kinds,
      hour: r.hour,
      timezone: r.timezone,
      lastStudyDay: r.last_study_day,
      lastNewsId: r.last_news_id,
      streakLastDay: r.streak_last_day,
    };
    const studyDue = isStudyPushDue(c, now);
    const newsDue = isNewsPushDue(c, news?.id ?? null);
    if (!studyDue && !newsDue) continue;

    const sub = { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } };
    const send = (kind: "studio" | "novita", ctx: Parameters<typeof buildMessage>[1]) =>
      client.sendNotification(sub, JSON.stringify(buildMessage(kind, ctx)), { TTL: 6 * 3600, urgency: "low" });

    try {
      if (studyDue) {
        if (!nextByUser.has(r.user_id)) {
          const done = await withUser(r.user_id, (tx) =>
            tx
              .select({ id: schema.lessonProgress.lessonId })
              .from(schema.lessonProgress)
              .where(and(eq(schema.lessonProgress.userId, r.user_id), eq(schema.lessonProgress.status, "completata"))),
          );
          nextByUser.set(r.user_id, nextLesson(catalog, new Set(done.map((d) => d.id)))?.title ?? null);
        }
        await send("studio", { streak: r.streak_current, nextLessonTitle: nextByUser.get(r.user_id) ?? null });
        await withUser(r.user_id, (tx) =>
          tx.update(schema.pushSubscriptions).set({ lastStudyDay: localDay(now, r.timezone) }).where(eq(schema.pushSubscriptions.id, r.id)),
        );
        counts.inviati++;
      } else if (news) {
        await send("novita", { title: news.title });
        await withUser(r.user_id, (tx) => tx.update(schema.pushSubscriptions).set({ lastNewsId: news.id }).where(eq(schema.pushSubscriptions.id, r.id)));
        counts.inviati++;
      }
    } catch (e) {
      if (isSubscriptionGone(e)) {
        counts.scadute++;
        await withUser(r.user_id, (tx) => tx.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.id, r.id))).catch(() => {});
      } else {
        counts.falliti++;
        // Nessun indirizzo né chiavi nei log: solo il codice di stato.
        console.error("Notifica non inviata:", (e as { statusCode?: number } | null)?.statusCode ?? "errore");
      }
    }
  }

  return Response.json(counts);
}
