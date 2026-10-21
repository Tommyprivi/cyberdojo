/** Messaggi tra la pagina e il worker (public/python/worker.js). */

export type ToWorker =
  | { type: "init"; indexURL: string }
  | { type: "run"; id: number; code: string; answers: string[]; skip: number; seed: number }
  | { type: "repl"; id: number; line: string }
  | { type: "repl-reset" };

export type Channel = "out" | "err";

export type FromWorker =
  | { type: "progress"; fraction: number; label: string }
  | { type: "ready" }
  | { type: "init-error"; message: string }
  | { type: "out"; id: number; channel: Channel; text: string }
  | { type: "done"; id: number; status: "ok" | "error" | "need-input" | "more" };
