export type Cell = string | number | boolean | null;

export type RunResult = {
  columns: { name: string; type: number }[];
  rows: Cell[][];
  /** Righe totali prodotte dalla query (può essere maggiore di rows.length). */
  totalRows: number;
  truncated: boolean;
  affectedRows: number | null;
  /** Quante istruzioni conteneva il testo eseguito. */
  statements: number;
  durationMs: number;
};

/** Tipi numerici di Postgres (oid): servono per allineare a destra. */
const NUMERIC_OIDS = new Set([20, 21, 23, 700, 701, 1700]);
export const isNumericType = (oid: number) => NUMERIC_OIDS.has(oid);

export function formatCell(v: Cell): { text: string; kind: "null" | "number" | "text" | "bool" } {
  if (v === null) return { text: "NULL", kind: "null" };
  if (typeof v === "number") return { text: String(v), kind: "number" };
  if (typeof v === "boolean") return { text: v ? "true" : "false", kind: "bool" };
  return { text: v, kind: "text" };
}

export function formatDuration(ms: number): string {
  if (ms < 1) return "meno di 1 ms";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
}

const plural = (n: number, one: string, many: string) => `${n.toLocaleString("it-IT")} ${n === 1 ? one : many}`;

/** Frase breve sul risultato: «12 righe», «Mostrate 500 di 12.000 righe», «3 righe modificate». */
export function describeResult(r: RunResult): string {
  if (r.columns.length === 0) {
    if (r.affectedRows !== null) return plural(r.affectedRows, "riga modificata", "righe modificate");
    return "Comando eseguito";
  }
  if (r.truncated) return `Mostrate ${r.rows.length.toLocaleString("it-IT")} di ${r.totalRows.toLocaleString("it-IT")} righe`;
  return plural(r.totalRows, "riga", "righe");
}

/** Prima parola dell'istruzione, in maiuscolo (SELECT, INSERT...), ignorando i commenti iniziali. */
export function statementKind(sql: string): string {
  const m = /^\s*(?:(?:--[^\n]*\n|\/\*[\s\S]*?\*\/)\s*)*([a-zA-Z]+)/.exec(sql);
  return m ? m[1].toUpperCase() : "";
}

/** Taglia le righe oltre il limite. */
export function limitRows<T>(rows: T[], max: number): { rows: T[]; truncated: boolean } {
  return rows.length > max ? { rows: rows.slice(0, max), truncated: true } : { rows, truncated: false };
}

/** Aggiunge la query alla cronologia: senza duplicati consecutivi o vuoti, più recente in cima, massimo `size` voci. */
export function pushHistory(history: string[], sql: string, size: number): string[] {
  const q = sql.trim();
  if (!q) return history;
  return [q, ...history.filter((h) => h !== q)].slice(0, size);
}
