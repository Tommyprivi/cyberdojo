import { z } from "zod";

/** Feedback dalla community: idee, problemi e complimenti. Solo regole e tipi: l'invio sta in app/actions/feedback.ts. */

export const FEEDBACK_TYPES = [
  { id: "idea", label: "Un'idea", hint: "Una cosa che vorresti trovare" },
  { id: "problema", label: "Un problema", hint: "Qualcosa che non funziona o non si capisce" },
  { id: "complimento", label: "Un complimento", hint: "Una cosa che ti è piaciuta" },
] as const;

export const feedbackInput = z.object({
  type: z.enum(["idea", "problema", "complimento"]),
  message: z.string().trim().min(10, "Scrivi almeno una frase.").max(2000, "Massimo 2000 caratteri."),
  /** Se vero, l'indirizzo email dell'account viene incluso così si può rispondere. Altrimenti il feedback resta anonimo. */
  wantReply: z.boolean(),
});

export type FeedbackInput = z.infer<typeof feedbackInput>;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

/** Limitatore in memoria: tre feedback ogni dieci minuti per utente. `true` = troppi. */
export function createFeedbackLimiter() {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
  };
}
