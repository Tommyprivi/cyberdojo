"use client";

import { AGE_BANDS } from "@/lib/age-bands";
import { DAILY_GOALS, DAILY_MINUTES, GOALS } from "@/lib/profile-options";

export type ProfileDraft = {
  ageBand: string;
  confirmedAge14: boolean;
  goal: string;
  dailyMinutes: number;
  dailyGoal: number;
};

export const EMPTY_DRAFT: ProfileDraft = { ageBand: "", confirmedAge14: false, goal: "", dailyMinutes: 20, dailyGoal: 1 };

/** Errore da mostrare se il profilo non è completo; null se va bene. */
export function draftProblem(d: ProfileDraft): string | null {
  if (!d.confirmedAge14) return "Per registrarti devi avere almeno 14 anni: spunta la casella per confermare.";
  if (!d.ageBand) return "Scegli la tua fascia d'età.";
  if (!d.goal) return "Scegli il tuo obiettivo.";
  return null;
}

/** Fuso orario del browser, per calcolare i giorni della serie. */
export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Rome";
  } catch {
    return "Europe/Rome";
  }
}

export function ProfileFields({ value, onChange }: { value: ProfileDraft; onChange: (v: ProfileDraft) => void }) {
  const set = <K extends keyof ProfileDraft>(k: K, v: ProfileDraft[K]) => onChange({ ...value, [k]: v });
  return (
    <>
      <label className="grid gap-1.5">
        <span className="font-semibold">Fascia d&apos;età</span>
        <select className="field" value={value.ageBand} onChange={(e) => set("ageBand", e.target.value)} required>
          <option value="" disabled>Scegli…</option>
          {AGE_BANDS.map((b) => (
            <option key={b} value={b}>{b === "41+" ? "41 anni o più" : `${b} anni`}</option>
          ))}
        </select>
        <span className="text-sm text-muted">Salviamo solo la fascia, mai la data di nascita.</span>
      </label>

      <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border-2 border-border bg-surface-muted p-3">
        <input
          type="checkbox"
          className="mt-1 size-5 accent-[var(--primary)]"
          checked={value.confirmedAge14}
          onChange={(e) => set("confirmedAge14", e.target.checked)}
        />
        <span>Dichiaro di avere almeno 14 anni.</span>
      </label>

      <label className="grid gap-1.5">
        <span className="font-semibold">Cosa vuoi ottenere</span>
        <select className="field" value={value.goal} onChange={(e) => set("goal", e.target.value)} required>
          <option value="" disabled>Scegli…</option>
          {GOALS.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1 font-semibold">Quanto tempo hai al giorno</legend>
        <div className="grid grid-cols-4 gap-2">
          {DAILY_MINUTES.map((m) => (
            <label
              key={m}
              className={`grid min-h-12 cursor-pointer place-items-center rounded-xl border-2 font-bold ${
                value.dailyMinutes === m ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"
              }`}
            >
              <input type="radio" name="minutes" className="sr-only" checked={value.dailyMinutes === m} onChange={() => set("dailyMinutes", m)} />
              {m} min
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1 font-semibold">Obiettivo giornaliero</legend>
        <div className="grid grid-cols-3 gap-2">
          {DAILY_GOALS.map((g) => (
            <label
              key={g}
              className={`grid min-h-12 cursor-pointer place-items-center rounded-xl border-2 font-bold ${
                value.dailyGoal === g ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"
              }`}
            >
              <input type="radio" name="goal-daily" className="sr-only" checked={value.dailyGoal === g} onChange={() => set("dailyGoal", g)} />
              {g} {g === 1 ? "lezione" : "lezioni"}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
