import { z } from "zod";
import { buildCodeReviewMessage, CODE_REVIEW_SYSTEM, MAX_CODE_CHARS, MAX_ERROR_CHARS } from "./code-review";
import { LIMITS, limiter as defaultLimiter } from "./limits";
import { AiError, getProvider, type AiProvider } from "./provider";

export const codeReviewRequest = z
  .object({
    code: z.string().min(1).max(MAX_CODE_CHARS),
    error: z.string().max(MAX_ERROR_CHARS * 4).optional(),
  })
  .strict();

export type CodeReviewDeps = {
  provider?: AiProvider;
  limiter?: { take(userId: string): { ok: true } | { ok: false; retryAfterSec: number; scope: "hour" | "day" } };
};

/** Stessa protezione di /api/dojo (sessione, limiti, validazione). Codice ed errore non si registrano. */
export async function handleCodeReview(userId: string, raw: unknown, deps: CodeReviewDeps = {}) {
  const parsed = codeReviewRequest.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { error: `Codice non valido: al massimo ${MAX_CODE_CHARS} caratteri.` } as Record<string, unknown> };
  }
  const limit = (deps.limiter ?? defaultLimiter).take(userId);
  if (!limit.ok) {
    const when = limit.scope === "hour" ? "all'ora" : "al giorno";
    return {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSec) },
      body: { error: `Hai fatto troppe richieste ${when}. Riprova tra ${Math.ceil(limit.retryAfterSec / 60)} minuti.` } as Record<string, unknown>,
    };
  }
  try {
    const result = await (deps.provider ?? getProvider()).generate({
      system: CODE_REVIEW_SYSTEM,
      messages: [{ role: "user", content: buildCodeReviewMessage(parsed.data.code, parsed.data.error) }],
      maxOutputTokens: LIMITS.maxOutputTokens,
      signal: AbortSignal.timeout(LIMITS.timeoutMs),
      meta: { mode: "chat" },
    });
    return { status: 200, body: { reply: result.text, inactive: result.inactive === true } as Record<string, unknown> };
  } catch (e) {
    if (e instanceof AiError) return { status: e.status === 429 ? 429 : 502, body: { error: e.message } as Record<string, unknown> };
    return { status: 502, body: { error: "Il Sensei ha avuto un problema. Riprova tra poco." } as Record<string, unknown> };
  }
}
