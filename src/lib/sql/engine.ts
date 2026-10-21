import { SQL_WORKER_URL } from "./config";
import { getDatabase } from "./databases";
import type { SqlErrorInfo } from "./errors";
import { BLOCKED_MESSAGE, MAX_QUERY_CHARS, MAX_ROWS, TIME_LIMIT_MS, findBlocked } from "./limits";
import type { FromWorker, ToWorker } from "./protocol";
import type { RunResult } from "./results";
import { SCHEMA_COLUMNS_SQL, SCHEMA_CONSTRAINTS_SQL, buildSchema, type RawSchema, type SchemaInfo } from "./schema";

export class SqlError extends Error {
  constructor(readonly info: SqlErrorInfo) {
    super(info.message);
  }
}
/** La query ha superato il limite di tempo: il worker è stato terminato e il database verrà ricaricato. */
export class SqlTimeoutError extends Error {
  constructor() {
    super(`La query ha superato il limite di ${TIME_LIMIT_MS / 1000} secondi ed è stata interrotta.`);
  }
}

type Pending = { resolve: (v: unknown) => void; reject: (e: unknown) => void };

/**
 * Gestisce il worker di PGlite: avvio pigro, richieste in coda (il worker fa una cosa alla volta),
 * limite di tempo (se la query dura troppo il worker viene terminato) e blocco delle istruzioni vietate.
 * Un solo worker per pagina, condiviso da tutti i terminali SQL: «owner» dice chi ha caricato il database.
 */
export class SqlEngine {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private tail: Promise<unknown> = Promise.resolve();
  private owner: string | null = null;
  private listeners = new Set<(label: string) => void>();

  onProgress(fn: (label: string) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  start(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      let worker: Worker;
      try {
        worker = new Worker(SQL_WORKER_URL, { type: "module" });
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
        return;
      }
      this.worker = worker;
      worker.onmessage = (ev: MessageEvent<FromWorker>) => {
        const m = ev.data;
        if (m.type === "progress") this.listeners.forEach((l) => l(m.label));
        else if (m.type === "ready") resolve();
        else if (m.type === "init-error") {
          this.drop();
          reject(new Error(m.message));
        } else {
          const p = this.pending.get(m.id);
          if (!p) return;
          this.pending.delete(m.id);
          if (m.ok) p.resolve(m.data);
          else p.reject(new SqlError(m.error));
        }
      };
      worker.onerror = (ev) => {
        this.drop();
        reject(new Error(ev.message || "Il motore SQL non si è avviato"));
      };
      worker.postMessage({ type: "init" } satisfies ToWorker);
    });
    this.ready.catch(() => {
      this.ready = null;
    });
    return this.ready;
  }

  private drop(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
    this.owner = null;
  }

  private enqueue<T>(job: () => Promise<T>): Promise<T> {
    const next = this.tail.then(job, job);
    this.tail = next.catch(() => undefined);
    return next;
  }

  private send<T>(build: (id: number) => ToWorker, timeoutMs?: number): Promise<T> {
    const worker = this.worker;
    if (!worker) return Promise.reject(new Error("Il motore SQL non è avviato"));
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const done = <V,>(fn: (v: V) => void) => (v: V) => {
        if (timer) clearTimeout(timer);
        fn(v);
      };
      this.pending.set(id, { resolve: done(resolve as (v: unknown) => void), reject: done(reject) });
      if (timeoutMs) {
        timer = setTimeout(() => {
          const rejects = [...this.pending.values()];
          this.pending.clear();
          this.drop();
          for (const p of rejects) p.reject(new SqlTimeoutError());
        }, timeoutMs);
      }
      worker.postMessage(build(id));
    });
  }

  /** Assicura che il database `dbId` sia caricato per `owner` (lo ricarica se prima c'era altro). */
  use(owner: string, dbId: string, force = false): Promise<void> {
    return this.enqueue(async () => {
      await this.start();
      if (!force && this.owner === `${owner}:${dbId}`) return;
      const db = getDatabase(dbId);
      if (!db) throw new Error(`Database «${dbId}» non trovato`);
      await this.send((id) => ({ type: "load", id, script: db.script }));
      this.owner = `${owner}:${dbId}`;
    });
  }

  run(sql: string): Promise<RunResult> {
    if (sql.length > MAX_QUERY_CHARS) return Promise.reject(new SqlError({ message: "Query troppo lunga." }));
    const blocked = findBlocked(sql);
    if (blocked) return Promise.reject(new SqlError({ message: BLOCKED_MESSAGE(blocked), code: "blocked" }));
    return this.enqueue(() => this.send<RunResult>((id) => ({ type: "run", id, sql, maxRows: MAX_ROWS }), TIME_LIMIT_MS));
  }

  schema(): Promise<SchemaInfo> {
    return this.enqueue(async () => {
      const raw = await this.send<RawSchema>((id) => ({ type: "schema", id, columnsSql: SCHEMA_COLUMNS_SQL, constraintsSql: SCHEMA_CONSTRAINTS_SQL }), TIME_LIMIT_MS);
      return buildSchema(raw);
    });
  }
}

let shared: SqlEngine | null = null;
/** Il motore condiviso della pagina (creato al primo uso, cioè quando lo studente preme «Avvia il database»). */
export function getSqlEngine(): SqlEngine {
  return (shared ??= new SqlEngine());
}
