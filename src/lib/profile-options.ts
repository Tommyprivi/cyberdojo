import { z } from "zod";
import { AGE_BANDS } from "./age-bands";

/** Opzioni del profilo, condivise tra i moduli di registrazione e i controlli sul server. */
export const GOALS = [
  { id: "lavoro-soc", label: "Lavorare in un SOC" },
  { id: "pentester", label: "Fare il pentester" },
  { id: "curiosita", label: "Curiosità" },
  { id: "sicurezza-personale", label: "Proteggere me stesso" },
  { id: "scuola", label: "Scuola o università" },
] as const;

export const DAILY_MINUTES = [10, 20, 30, 60] as const;
export const DAILY_GOALS = [1, 2, 3] as const;

function validTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("it", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const profileInput = z.object({
  ageBand: z.enum(AGE_BANDS),
  /** Dichiarazione di avere almeno 14 anni: senza, non ci si registra (decisione del titolare). */
  confirmedAge14: z.literal(true, { error: "Per registrarti devi avere almeno 14 anni." }),
  goal: z.enum(GOALS.map((g) => g.id) as [string, ...string[]]),
  dailyMinutes: z.union(DAILY_MINUTES.map((m) => z.literal(m)) as [z.ZodLiteral<number>, ...z.ZodLiteral<number>[]]),
  dailyGoal: z.union(DAILY_GOALS.map((g) => z.literal(g)) as [z.ZodLiteral<number>, ...z.ZodLiteral<number>[]]),
  timezone: z.string().min(1).max(64).refine(validTimeZone, "Fuso orario non valido."),
});

export type ProfileInput = z.infer<typeof profileInput>;
