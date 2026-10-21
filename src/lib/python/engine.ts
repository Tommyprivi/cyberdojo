import { PYODIDE_INDEX_URL, PYTHON_WORKER_URL } from "./config";
import { OutputLimiter, createWatchdog, TIME_LIMIT_MS } from "./limits";
import type { Channel, FromWorker, ToWorker } from "./protocol";

export type KillReason = "timeout" | "output-limit" | "user";

export type EngineCallbacks = {
  onProgress: (fraction: number, label: string) => void;
  /** Testo da mostrare: "in" è la risposta scritta dallo studente a un input(). */
  onOutput: (channel: Channel | "in", text: string) => void;
  onNeedInput: () => void;
  onFinish: (status: "ok" | "error" | "more") => void;
  onKilled: (reason: KillReason) => void;
  onFatal: (message: string) => void;
};

type Job =
  | { id: number; kind: "program"; code: string; answers: string[]; seed: number; limiter: OutputLimiter }
  | { id: number; kind: "repl"; line: string; limiter: OutputLimiter };

/**
 * Gestisce il worker Python: avvio, esecuzione, input() per riesecuzione, limiti di tempo e di output.
 * Se il programma sfora un limite o lo studente preme Ferma, il worker viene terminato e al prossimo
 * avvio ne parte uno nuovo (il motore è già nella cache del browser, quindi è rapido).
 */
export class PythonEngine {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private nextId = 1;
  private job: Job | null = null;
  private disposed = false;
  private readonly watchdog = createWatchdog(() => this.kill("timeout"), TIME_LIMIT_MS);

  constructor(private readonly cb: EngineCallbacks) {}

  /** Carica Pyodide (se serve). Risolve quando il motore è pronto. */
  start(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      let worker: Worker;
      try {
        worker = new Worker(PYTHON_WORKER_URL);
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
        return;
      }
      this.worker = worker;
      worker.onmessage = (ev: MessageEvent<FromWorker>) => {
        const m = ev.data;
        if (m.type === "ready") resolve();
        else if (m.type === "init-error") {
          this.dropWorker();
          reject(new Error(m.message));
        } else this.handle(m);
      };
      worker.onerror = (ev) => {
        this.dropWorker();
        reject(new Error(ev.message || "Il motore Python non si è avviato"));
      };
      this.post({ type: "init", indexURL: PYODIDE_INDEX_URL });
    });
    this.ready.catch(() => {
      this.ready = null;
    });
    return this.ready;
  }

  get isBusy(): boolean {
    return this.job !== null;
  }

  async runProgram(code: string): Promise<void> {
    if (this.job) return;
    const seed = Math.floor(Math.random() * 2 ** 31);
    const job: Job = { id: this.nextId++, kind: "program", code, answers: [], seed, limiter: new OutputLimiter() };
    this.job = job;
    await this.dispatch(job);
  }

  /** Risposta dello studente a un input(): si rilancia il programma da capo con la risposta in più. */
  async submitInput(text: string): Promise<void> {
    const prev = this.job;
    if (!prev || prev.kind !== "program" || !this.waitingInput) return;
    this.waitingInput = false;
    const echo = text + "\n";
    prev.limiter.add(echo.length);
    this.cb.onOutput("in", echo);
    const job: Job = { ...prev, id: this.nextId++, answers: [...prev.answers, text] };
    this.job = job;
    await this.dispatch(job);
  }

  async replLine(line: string): Promise<void> {
    if (this.job) return;
    const job: Job = { id: this.nextId++, kind: "repl", line, limiter: new OutputLimiter() };
    this.job = job;
    await this.dispatch(job);
  }

  /** Ferma il programma: termina il worker. */
  stop(): void {
    if (this.job) this.kill("user");
  }

  dispose(): void {
    this.disposed = true;
    this.watchdog.stop();
    this.dropWorker();
  }

  private waitingInput = false;

  private async dispatch(job: Job): Promise<void> {
    try {
      await this.start();
    } catch (e) {
      if (this.job === job) this.job = null;
      if (!this.disposed) this.cb.onFatal(e instanceof Error ? e.message : String(e));
      return;
    }
    if (this.disposed || this.job !== job) return;
    this.watchdog.start();
    if (job.kind === "program") {
      this.post({ type: "run", id: job.id, code: job.code, answers: job.answers, skip: job.limiter.total, seed: job.seed });
    } else {
      this.post({ type: "repl", id: job.id, line: job.line });
    }
  }

  private handle(m: FromWorker): void {
    const job = this.job;
    if (m.type === "progress") {
      this.cb.onProgress(m.fraction, m.label);
      return;
    }
    if (!job || ("id" in m && m.id !== job.id)) return;
    if (m.type === "out") {
      const { text, truncated } = job.limiter.push(m.text);
      if (text) this.cb.onOutput(m.channel, text);
      if (truncated) this.kill("output-limit");
    } else if (m.type === "done") {
      this.watchdog.stop();
      if (m.status === "need-input" && job.kind === "program") {
        this.waitingInput = true;
        this.cb.onNeedInput();
        return;
      }
      this.job = null;
      this.cb.onFinish(m.status === "need-input" ? "ok" : m.status);
    }
  }

  private kill(reason: KillReason): void {
    this.watchdog.stop();
    this.job = null;
    this.waitingInput = false;
    this.dropWorker();
    this.cb.onKilled(reason);
  }

  private dropWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }

  private post(msg: ToWorker): void {
    this.worker?.postMessage(msg);
  }
}
