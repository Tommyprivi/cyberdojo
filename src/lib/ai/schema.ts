import { z } from "zod";
import { LESSON_ID } from "@/lib/content/schema";
import { LIMITS } from "./limits";

export const scopeSchema = z
  .object({
    courseId: z.enum(["F", "C", "D", "T", "H"]),
    module: z.number().int().min(1).max(30).optional(),
    lessonId: z.string().regex(LESSON_ID).optional(),
  })
  .strict()
  .refine((s) => !s.lessonId || s.lessonId.startsWith(`${s.courseId}.`), { message: "La lezione non è del corso scelto." });

const message = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(LIMITS.maxUserChars) }).strict(),
  z.object({ role: z.literal("assistant"), content: z.string().trim().min(1).max(LIMITS.maxAssistantChars) }).strict(),
]);

export const dojoRequest = z
  .object({
    mode: z.enum(["chat", "quiz"]),
    scope: scopeSchema,
    count: z.number().int().min(LIMITS.quizMin).max(LIMITS.quizMax).optional(),
    messages: z.array(message).min(1).max(LIMITS.maxMessages),
  })
  .strict()
  .refine((r) => r.messages.at(-1)?.role === "user", { message: "L'ultimo messaggio deve essere dello studente." })
  .refine((r) => r.messages[0]?.role === "user", { message: "Si comincia con un messaggio dello studente." });

export type DojoRequest = z.infer<typeof dojoRequest>;
export type Scope = z.infer<typeof scopeSchema>;
