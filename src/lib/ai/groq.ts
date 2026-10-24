import { AiError, type AiProvider, type GenerateRequest, type GenerateResult } from "./types";

/** Modello gratuito indicato in .env.example. */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
const URL = "https://api.groq.com/openai/v1/chat/completions";

type GroqResponse = { choices?: { message?: { content?: string | null } }[] };

/** Fornitore Groq (API compatibile OpenAI). La chiave viaggia nell'intestazione, mai nei log. */
export class GroqProvider implements AiProvider {
  readonly name = "groq";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const body = {
      model: this.model,
      messages: [{ role: "system", content: req.system }, ...req.messages.map((m) => ({ role: m.role, content: m.content }))],
      max_tokens: req.maxOutputTokens,
      temperature: 0.4,
    };
    let res: Response;
    try {
      res = await this.fetchImpl(URL, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify(body),
        signal: req.signal,
      });
    } catch (e) {
      if (e instanceof Error && (e.name === "AbortError" || e.name === "TimeoutError")) {
        throw new AiError("Il Sensei ci sta mettendo troppo. Riprova tra poco.", 504);
      }
      throw new AiError("Non riesco a raggiungere il servizio. Riprova tra poco.", 502);
    }
    if (res.status === 429) throw new AiError("Il servizio gratuito è al limite per ora. Riprova tra qualche minuto.", 429);
    if (res.status === 401 || res.status === 403 || res.status === 400 || res.status === 404) {
      throw new AiError("L'AI Dojo ha un problema di configurazione. Avvisa il titolare.", 502);
    }
    if (!res.ok) throw new AiError("Il servizio ha avuto un problema. Riprova tra poco.", 502);

    const data = (await res.json().catch(() => null)) as GroqResponse | null;
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new AiError("Il Sensei non ha risposto. Riprova con una domanda più breve.", 502);
    return { text };
  }
}
