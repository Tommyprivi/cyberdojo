/** Limiti di sicurezza del terminale Python: parti pure, senza browser, così si possono testare. */

/** Tempo massimo di un programma (o di una riga del REPL), in millisecondi. */
export const TIME_LIMIT_MS = 5000;
/** Output massimo mostrato, in caratteri (circa 50 KB di testo). */
export const OUTPUT_LIMIT_CHARS = 50_000;

export const TIMEOUT_MESSAGE =
  "Il programma gira da più di 5 secondi, quindi l'ho fermato. Di solito succede con un ciclo che non finisce mai " +
  "(per esempio «while True» senza un «break»). Controlla la condizione del ciclo e riprova.";
export const OUTPUT_LIMIT_MESSAGE =
  "Il programma ha scritto troppo testo (più di 50 KB), quindi l'ho fermato. Controlla di non avere un ciclo che stampa all'infinito.";
export const STOPPED_MESSAGE = "Programma fermato.";

/** Tiene il conto dell'output e lo taglia al limite. */
export class OutputLimiter {
  private used = 0;
  private cut = false;

  constructor(private readonly limit: number = OUTPUT_LIMIT_CHARS) {}

  /** Caratteri accettati finora. */
  get total(): number {
    return this.used;
  }

  get truncated(): boolean {
    return this.cut;
  }

  /** Conta caratteri che non passano da `push` (per esempio la risposta scritta dallo studente). */
  add(count: number): void {
    this.used += count;
  }

  /** Restituisce la parte di testo che si può ancora mostrare. Dopo il taglio restituisce sempre "". */
  push(text: string): { text: string; truncated: boolean } {
    if (this.cut) return { text: "", truncated: true };
    const room = this.limit - this.used;
    if (text.length <= room) {
      this.used += text.length;
      return { text, truncated: false };
    }
    this.cut = true;
    const accepted = room > 0 ? text.slice(0, room) : "";
    this.used += accepted.length;
    return { text: accepted, truncated: true };
  }
}

export type Scheduler = {
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (handle: unknown) => void;
};

const realScheduler: Scheduler = {
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (h) => globalThis.clearTimeout(h as ReturnType<typeof globalThis.setTimeout>),
};

/** Cane da guardia: se `stop` non arriva entro `ms`, chiama `onTimeout` una volta sola. */
export function createWatchdog(onTimeout: () => void, ms: number = TIME_LIMIT_MS, scheduler: Scheduler = realScheduler) {
  let handle: unknown = null;
  const stop = () => {
    if (handle !== null) scheduler.clearTimeout(handle);
    handle = null;
  };
  return {
    start() {
      stop();
      handle = scheduler.setTimeout(() => {
        handle = null;
        onTimeout();
      }, ms);
    },
    stop,
    get running() {
      return handle !== null;
    },
  };
}
