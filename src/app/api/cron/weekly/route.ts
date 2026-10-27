import { timingSafeEqual } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { sendMail } from "@/lib/email";
import { makeUnsubscribeToken } from "@/lib/mail/token";
import { isWeeklyDue, weeklyEmail } from "@/lib/mail/weekly";
import { effectiveStreak, localDay } from "@/lib/progress/streak";
import { siteUrl } from "@/lib/site-url";

/**
 * Riepilogo settimanale. Va chiamato ogni ora (minuto 0) da un servizio di pianificazione, con
 * `Authorization: Bearer <CRON_SECRET>`: lo stesso segreto dei promemoria. Manda un'email solo a chi ha
 * attivato i promemoria email (e ha l'email verificata), la domenica alle 19 nel fuso del suo profilo.
 * La finestra è di un'ora: con una chiamata all'ora ognuno la riceve una sola volta a settimana.
 */

const MAX_PER_RUN = 500;
const WEEK_MS = 7 * 24 * 3_600_000;

function authorized(req: Request): boolean | "unconfigured" {
  const secret = process.env.CRON_SECRET;
  if (!secret) return "unconfigured";
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

type Row = {
  user_id: string;
  email: string;
  name: string | null;
  timezone: string;
  streak_current: number;
  streak_best: number;
  streak_last_day: string | null;
  freezes: number;
};

export async function GET(req: Request) {
  const auth = authorized(req);
  if (auth === "unconfigured") return Response.json({ error: "CRON_SECRET non configurato." }, { status: 503 });
  if (!auth) return new Response("Non autorizzato", { status: 401 });

  const now = new Date();
  const result = await getDb().execute(sql`select * from reminder_candidates()`);
  const rows = (result.rows as Row[]).filter((r) => isWeeklyDue({ timezone: r.timezone }, now)).slice(0, MAX_PER_RUN);
  const counts = { dovuti: rows.length, inviati: 0, falliti: 0 };
  const since = new Date(now.getTime() - WEEK_MS);

  for (const r of rows) {
    try {
      const summary = await withUser(r.user_id, async (tx) => {
        const [lessons] = await tx
          .select({ n: sql<number>`count(*)::int` })
          .from(schema.lessonProgress)
          .where(
            and(
              eq(schema.lessonProgress.userId, r.user_id),
              eq(schema.lessonProgress.status, "completata"),
              gte(schema.lessonProgress.completedAt, since),
            ),
          );
        const [xp] = await tx
          .select({ total: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int` })
          .from(schema.xpEvents)
          .where(and(eq(schema.xpEvents.userId, r.user_id), gte(schema.xpEvents.createdAt, since)));
        return { lessons: lessons?.n ?? 0, xp: xp?.total ?? 0 };
      });
      const streak = effectiveStreak(
        { current: r.streak_current, best: r.streak_best, lastDay: r.streak_last_day, freezes: r.freezes },
        localDay(now, r.timezone),
      );

      const token = encodeURIComponent(makeUnsubscribeToken(r.user_id));
      const base = siteUrl();
      await sendMail({
        to: r.email,
        mail: weeklyEmail({
          name: r.name,
          email: r.email,
          summary: { ...summary, streak },
          unsubscribeUrl: `${base}/disiscrizione?token=${token}`,
        }),
        headers: {
          "List-Unsubscribe": `<${base}/api/email/unsubscribe?token=${token}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      counts.inviati++;
    } catch (e) {
      counts.falliti++;
      console.error("Riepilogo non inviato:", e instanceof Error ? e.message : e);
    }
  }

  return Response.json(counts);
}
