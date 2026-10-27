import { localDay } from "../progress/streak";
import { siteUrl } from "../site-url";
import { firstName } from "../display-name";
import { renderHtml, renderText, type EmailContent } from "./layout";
import { localHour } from "./reminders";
import type { Mail } from "./templates";

/** Riepilogo settimanale: domenica sera, nel fuso del profilo, una volta a settimana. */
export const WEEKLY_HOUR = 19;

export type WeeklyCandidate = { timezone: string };

/**
 * Dovuto solo la domenica, nell'ora WEEKLY_HOUR del fuso dell'utente. La finestra è di un'ora sola:
 * il lavoro pianificato gira una volta all'ora, quindi ognuno lo riceve una sola volta a settimana
 * senza bisogno di segnare nulla nel database.
 */
export function isWeeklyDue(c: WeeklyCandidate, now: Date): boolean {
  const [y, m, d] = localDay(now, c.timezone).split("-").map(Number);
  const isSunday = new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 0;
  return isSunday && localHour(now, c.timezone) === WEEKLY_HOUR;
}

export type WeeklySummary = { lessons: number; xp: number; streak: number };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function weeklyEmail({
  name,
  email,
  summary,
  unsubscribeUrl,
}: {
  name: string | null;
  email: string;
  summary: WeeklySummary;
  unsubscribeUrl: string;
}): Mail {
  const first = firstName({ name, email });
  const { lessons, xp, streak } = summary;
  const active = lessons > 0 || xp > 0;
  const blocks: EmailContent["blocks"] = [
    {
      type: "p",
      text: active
        ? `${first}, ecco la tua settimana: ${plural(lessons, "lezione completata", "lezioni completate")} e ${xp} XP guadagnati.`
        : `${first}, questa settimana è stata tranquilla, e va benissimo. Quando vuoi, il Sensei ti aspetta.`,
    },
  ];
  if (streak > 0) blocks.push({ type: "p", text: `La tua serie è di ${plural(streak, "giorno", "giorni")}. Continua così!` });
  blocks.push({ type: "button", label: "Apri il percorso", url: `${siteUrl()}/percorso` });

  const c: EmailContent = {
    subject: active ? "La tua settimana in CyberDojo" : "Il Sensei ti aspetta",
    preheader: active ? `${plural(lessons, "lezione", "lezioni")} e ${xp} XP in sette giorni.` : "Una lezione da otto minuti per ripartire.",
    title: active ? "Bel lavoro questa settimana." : "Una nuova settimana inizia.",
    blocks,
    footer: [
      { text: "Ricevi questo riepilogo una volta a settimana perché hai attivato le email di CyberDojo." },
      { text: "Non lo vuoi più?", link: { label: "Disattiva le email", url: unsubscribeUrl } },
    ],
  };
  return { subject: c.subject, html: renderHtml(c), text: renderText(c) };
}
