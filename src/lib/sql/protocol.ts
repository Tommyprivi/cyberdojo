import type { SqlErrorInfo } from "./errors";
import type { RunResult } from "./results";
import type { RawSchema } from "./schema";

/** Messaggi tra la pagina e il worker (public/sql/worker.js). */
export type ToWorker =
  | { type: "init" }
  | { type: "load"; id: number; script: string }
  | { type: "run"; id: number; sql: string; maxRows: number }
  | { type: "schema"; id: number; columnsSql: string; constraintsSql: string };

export type FromWorker =
  | { type: "progress"; label: string }
  | { type: "ready" }
  | { type: "init-error"; message: string }
  | { type: "reply"; id: number; ok: true; data: unknown }
  | { type: "reply"; id: number; ok: false; error: SqlErrorInfo };

export type ReplyData = { load: null; run: RunResult; schema: RawSchema };
