import { AiError, type AiProvider, type GenerateRequest, type GenerateResult } from "./types";

/** Modello Flash-Lite con piano gratuito, indicato dalla documentazione ufficiale (ottobre 2026). */
export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

/** Fornitore Gemini via REST. La chiave viaggia nell'intestazione, mai nell'indirizzo e mai nei log. */
export class GeminiProvider implements AiProvider {
  readonly name = "gemini";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const body = {
      systemInstruction: { parts: [{ text: req.system }] },
      contents: req.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: req.maxOutputTokens, temperature: 0.4 },
    };
    let res: Response;
    try {
      res = await this.fetchImpl(`${BASE}/${encodeURIComponent(this.model)}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": this.apiKey },
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
    if (res.status === 401 || res.status === 403 || res.status === 400) {
      throw new AiError("L'AI Dojo ha un problema di configurazione. Avvisa il titolare.", 502);
    }
    if (!res.ok) throw new AiError("Il servizio ha avuto un problema. Riprova tra poco.", 502);

    const data = (await res.json().catch(() => null)) as GeminiResponse | null;
    if (data?.promptFeedback?.blockReason) {
      return { text: "Questa domanda non posso trattarla. Chiedimi qualcosa sulle lezioni dei corsi." };
    }
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) throw new AiError("Il Sensei non ha risposto. Riprova con una domanda più breve.", 502);
    return { text };
  }
}
