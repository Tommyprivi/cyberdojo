/**
 * Fornitore di intelligenza artificiale dietro un'interfaccia: per cambiare servizio basta
 * scrivere un altro `AiProvider` e sceglierlo in `getProvider()`. Vedi docs/ai-dojo.md.
 * Qui passano SOLO messaggi e contesto di lezione: mai nome, email o altri dati dell'utente.
 */
import { FakeProvider } from "./fake";
import { DEFAULT_MODEL, GeminiProvider } from "./gemini";
import type { AiProvider } from "./types";

export * from "./types";

let override: AiProvider | null = null;

/** Solo per i test: forza un provider. */
export function setProviderForTests(p: AiProvider | null) {
  override = p;
}

export function getProvider(): AiProvider {
  if (override) return override;
  const key = process.env.GEMINI_API_KEY?.trim();
  if (key) return new GeminiProvider(key, process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL);
  return new FakeProvider({ demo: true });
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}
