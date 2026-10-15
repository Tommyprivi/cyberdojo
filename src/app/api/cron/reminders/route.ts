import { timingSafeEqual } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { loadCatalog, nextLesson } from "@/lib/content/catalog";
import { getDb, schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { sendMail } from "@/lib/email";
import { isReminderDue, type ReminderCandidate } from "@/lib/mail/reminders";
import { reminderEmail } from "@/lib/mail/templates";
import { makeUnsubscribeToken } from "@/lib/mail/token";
import { localDay } from "@/lib/progress/streak";
import { siteUrl } from "@/lib/site-url";

/**
 * Promemoria di studio. Va chiamato ogni ora da un servizio di pianificazione, con
 * `Authorization: Bearer <CRON_SECRET>`. Senza il segreto configurato il percorso resta chiuso.
 *
 * Ogni chiamata manda al massimo un promemoria al giorno a chi lo ha attivato (e ha l'email verificata),
 * nella finestra dopo l'orario scelto, e solo se oggi non ha già superato una verifica. Se l'invio
 * fallisce non si segna nulla, così al giro successivo si riprova.
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
  user_id: string;
  email: string;
  name: string | null;
  timezone: string;
  reminder_hour: number;
  last_reminder_day: string | null;
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
  const rows = (result.rows as Row[]).slice(0, MAX_PER_RUN);

  const catalog = loadCatalog();
  const counts = { considerati: rows.length, dovuti: 0, inviati: 0, falliti: 0 };

  for (const r of rows) {
    const candidate: ReminderCandidate = {
      userId: r.user_id,
      email: r.email,
      name: r.name,
      timezone: r.timezone,
      reminderHour: r.reminder_hour,
      lastReminderDay: r.last_reminder_day,
      streak: { current: r.streak_current, best: r.streak_best, lastDay: r.streak_last_day, freezes: r.freezes },
    };
    if (!isReminderDue(candidate, now)) continue;
    counts.dovuti++;

    try {
      // Prossimo caso dell'utente: serve a dire cosa lo aspetta, non solo «torna a studiare».
      const done = await withUser(r.user_id, (tx) =>
        tx
          .select({ id: schema.lessonProgress.lessonId })
          .from(schema.lessonProgress)
          .where(and(eq(schema.lessonProgress.userId, r.user_id), eq(schema.lessonProgress.status, "completata"))),
      );
      const next = nextLesson(catalog, new Set(done.map((d) => d.id)));

      const token = encodeURIComponent(makeUnsubscribeToken(r.user_id));
      const base = siteUrl();
      await sendMail({
        to: r.email,
        mail: reminderEmail({
          name: r.name,
          email: r.email,
          streak: candidate.streak.current,
          nextLessonTitle: next?.title ?? null,
          unsubscribeUrl: `${base}/disiscrizione?token=${token}`,
        }),
        // Disiscrizione con un clic dal programma di posta (RFC 8058).
        headers: {
          "List-Unsubscribe": `<${base}/api/email/unsubscribe?token=${token}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      // Segnato solo dopo l'invio riuscito.
      await withUser(r.user_id, (tx) =>
        tx.update(schema.profiles).set({ lastReminderDay: localDay(now, r.timezone) }).where(eq(schema.profiles.id, r.user_id)),
      );
      counts.inviati++;
    } catch (e) {
      counts.falliti++;
      console.error("Promemoria non inviato:", e instanceof Error ? e.message : e);
    }
  }

  return Response.json(counts);
}
