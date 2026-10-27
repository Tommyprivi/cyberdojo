import { loadScopeContext, ScopeError, type ScopeContext } from "./context";
import { LIMITS, limiter as defaultLimiter } from "./limits";
import { answeredCount, buildSystemPrompt, QUIZ_START_MESSAGE } from "./prompts";
import { AiError, getProvider, type AiProvider } from "./provider";
import { dojoRequest } from "./schema";

export type DojoDeps = {
  provider?: AiProvider;
  limiter?: { take(userId: string): { ok: true } | { ok: false; retryAfterSec: number; scope: "hour" | "day" } };
  /** Punti deboli dello studente (frase breve). Assente = nessun contesto personale. */
  loadWeak?: (userId: string) => Promise<string>;
  loadContext?: (scope: Parameters<typeof loadScopeContext>[0]) => ScopeContext;
};

export type DojoOutcome = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

/**
 * Cuore della route /api/dojo, senza dipendere da Next: più facile da provare.
 * Al fornitore va solo ciò che serve (messaggi e testo di lezione). Nessun testo viene registrato.
 */
export async function handleDojo(userId: string, raw: unknown, deps: DojoDeps = {}): Promise<DojoOutcome> {
  const parsed = dojoRequest.safeParse(raw);
  if (!parsed.success) return { status: 400, body: { error: "Richiesta non valida. Controlla la lunghezza dei messaggi." } };
  const req = parsed.data;

  if (req.mode === "quiz" && req.messages[0].content !== QUIZ_START_MESSAGE) {
    return { status: 400, body: { error: "Richiesta non valida." } };
  }

  let ctx: ScopeContext;
  try {
    ctx = (deps.loadContext ?? loadScopeContext)(req.scope);
  } catch (e) {
    if (e instanceof ScopeError) return { status: 404, body: { error: "Lezione o corso non trovato." } };
    throw e;
  }

  const limit = (deps.limiter ?? defaultLimiter).take(userId);
  if (!limit.ok) {
    const when = limit.scope === "hour" ? "all'ora" : "al giorno";
    return {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSec) },
      body: { error: `Hai fatto troppe domande ${when}. Riprova tra ${Math.ceil(limit.retryAfterSec / 60)} minuti.` },
    };
  }

  const count = req.count ?? LIMITS.quizMin;
  const answered = req.mode === "quiz" ? answeredCount(req.messages) : 0;
  const weak = req.mode === "chat" && deps.loadWeak ? await deps.loadWeak(userId).catch(() => "") : "";
  const system = buildSystemPrompt({ mode: req.mode, label: ctx.label, context: ctx.text, count, answered, weak });

  try {
    const result = await (deps.provider ?? getProvider()).generate({
      system,
      messages: req.messages,
      maxOutputTokens: LIMITS.maxOutputTokens,
      signal: AbortSignal.timeout(LIMITS.timeoutMs),
      meta: { mode: req.mode, count, answered, topics: ctx.topics.slice(0, 20) },
    });
    return { status: 200, body: { reply: result.text, inactive: result.inactive === true } };
  } catch (e) {
    if (e instanceof AiError) return { status: e.status === 429 ? 429 : 502, body: { error: e.message } };
    return { status: 502, body: { error: "Il Sensei ha avuto un problema. Riprova tra poco." } };
  }
}
