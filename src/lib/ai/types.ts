/** Tipi condivisi del fornitore di IA (file separato per evitare import circolari). */

export type ChatMessage = { role: "user" | "assistant"; content: string };

/** Informazioni sulla fase, usate solo dal provider finto (la demo dell'interrogazione). */
export type GenerateMeta = {
  mode: "chat" | "quiz";
  /** Numero di domande dell'interrogazione. */
  count?: number;
  /** Risposte già date dallo studente. */
  answered?: number;
  /** Obiettivi del contesto scelto, per le domande della demo. */
  topics?: string[];
};

export type GenerateRequest = {
  system: string;
  messages: ChatMessage[];
  maxOutputTokens: number;
  signal?: AbortSignal;
  meta: GenerateMeta;
};

export type GenerateResult = { text: string; inactive?: boolean };

export interface AiProvider {
  readonly name: string;
  generate(req: GenerateRequest): Promise<GenerateResult>;
}

/** Errore con un messaggio già pronto da mostrare allo studente, in italiano. */
export class AiError extends Error {
  constructor(
    message: string,
    readonly status: number = 502,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export const INACTIVE_MESSAGE = "L'AI Dojo non è ancora attivo: manca la chiave.";

