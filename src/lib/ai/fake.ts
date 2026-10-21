import { INACTIVE_MESSAGE, type AiProvider, type GenerateRequest, type GenerateResult } from "./types";

/**
 * Provider finto: nessuna rete. Si usa nei test e quando la chiave manca.
 * - Chat: risponde che l'AI Dojo non è ancora attivo (nessun errore).
 * - Interrogazione (demo): fa una domanda per ogni obiettivo del corso scelto e giudica a occhio
 *   (risposta di almeno 20 caratteri = giusta, più corta = parziale), così si prova tutto il percorso.
 */
export class FakeProvider implements AiProvider {
  readonly name = "fake";
  readonly calls: GenerateRequest[] = [];

  constructor(private readonly opts: { demo?: boolean; reply?: string } = {}) {}

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    this.calls.push(req);
    if (this.opts.reply !== undefined) return { text: this.opts.reply };
    const { meta } = req;
    if (meta.mode === "chat" || !this.opts.demo) return { text: INACTIVE_MESSAGE, inactive: true };

    const count = meta.count ?? 5;
    const answered = meta.answered ?? 0;
    const topics = meta.topics?.length ? meta.topics : ["il tema scelto"];
    const question = (i: number) => `Domanda ${i + 1} di ${count} (demo): spiega con parole tue questo punto: ${topics[i % topics.length]}`;

    if (answered === 0) return { text: `${INACTIVE_MESSAGE} Ti faccio provare una interrogazione dimostrativa.\n\n${question(0)}`, inactive: true };

    const last = req.messages[req.messages.length - 1]?.content ?? "";
    const good = last.trim().length >= 20;
    const verdict = good ? "giusta" : "parziale";
    const feedback = good ? "Risposta chiara, bene." : "Troppo breve: sviluppa di più la risposta.";
    if (answered < count) {
      return { text: `${feedback} (demo)\n\n${question(answered)}\n[[ESITO:${verdict}]]`, inactive: true };
    }
    return {
      text: `${feedback} (demo)\n\nRiepilogo: interrogazione dimostrativa finita. Ripassa le lezioni indicate nel corso.\n[[ESITO:${verdict}]]`,
      inactive: true,
    };
  }
}
