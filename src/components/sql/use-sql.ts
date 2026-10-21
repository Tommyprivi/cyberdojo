"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SqlError, SqlTimeoutError, getSqlEngine } from "@/lib/sql/engine";
import { detectWarnings, explainSqlError, type SqlErrorInfo } from "@/lib/sql/errors";
import { statementKind, type RunResult } from "@/lib/sql/results";
import type { SchemaInfo } from "@/lib/sql/schema";

export type SqlStatus = "idle" | "loading" | "ready" | "error";

export type Outcome =
  | { kind: "ok"; sql: string; result: RunResult; warnings: string[]; title?: string }
  | { kind: "error"; sql: string; error: SqlErrorInfo; hint: string | null }
  | { kind: "timeout"; sql: string };

/** Stato di un terminale SQL: avvio pigro del motore, esecuzione, schema, errori spiegati. */
export function useSql(dbId: string) {
  const owner = useId();
  const [status, setStatus] = useState<SqlStatus>("idle");
  const [progress, setProgress] = useState("");
  const [fatal, setFatal] = useState("");
  const [schema, setSchema] = useState<SchemaInfo | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const schemaRef = useRef<SchemaInfo | null>(null);
  const started = useRef(false);
  const currentDb = useRef(dbId);
  useEffect(() => {
    currentDb.current = dbId;
  }, [dbId]);

  const refreshSchema = useCallback(async () => {
    try {
      const s = await getSqlEngine().schema();
      schemaRef.current = s;
      setSchema(s);
    } catch {
      /* lo schema è solo un aiuto: se manca non blocchiamo nulla */
    }
  }, []);

  const load = useCallback(
    async (force: boolean) => {
      const engine = getSqlEngine();
      setStatus("loading");
      setFatal("");
      const off = engine.onProgress(setProgress);
      try {
        await engine.use(owner, currentDb.current, force);
        await refreshSchema();
        setStatus("ready");
      } catch (e) {
        started.current = false;
        setFatal(e instanceof Error ? e.message : String(e));
        setStatus("error");
      } finally {
        off();
      }
    },
    [owner, refreshSchema],
  );

  const start = useCallback(async () => {
    if (started.current) return;
    started.current = true;
    await load(false);
  }, [load]);

  // cambio di database: si ricarica quello nuovo (solo se il motore è già stato avviato)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (started.current) {
      setOutcome(null);
      setNotice("");
      void load(true);
    }
  }, [dbId, load]);

  const reset = useCallback(async () => {
    if (!started.current) return;
    setOutcome(null);
    setNotice("Database ripristinato: i dati sono tornati come all'inizio.");
    await load(true);
  }, [load]);

  const execute = useCallback(
    async (sql: string, title?: string): Promise<Outcome | null> => {
      if (!sql.trim() || running) return null;
      const engine = getSqlEngine();
      setRunning(true);
      setNotice("");
      let out: Outcome;
      try {
        await engine.use(owner, currentDb.current);
        const result = await engine.run(sql);
        out = { kind: "ok", sql, result, warnings: detectWarnings(sql), title };
        if (statementKind(sql) !== "SELECT" || result.statements > 1) await refreshSchema();
      } catch (e) {
        if (e instanceof SqlTimeoutError) {
          out = { kind: "timeout", sql };
          setNotice("La query è stata interrotta e il database è stato ripristinato.");
          try {
            await engine.use(owner, currentDb.current);
            await refreshSchema();
          } catch {
            /* si riproverà alla prossima esecuzione */
          }
        } else if (e instanceof SqlError) {
          const s = schemaRef.current;
          out = {
            kind: "error",
            sql,
            error: e.info,
            hint: explainSqlError(e.info, {
              sql,
              tables: s?.tables.map((t) => t.name),
              columns: s?.tables.flatMap((t) => t.columns.map((c) => c.name)),
            }),
          };
        } else {
          out = { kind: "error", sql, error: { message: e instanceof Error ? e.message : String(e) }, hint: null };
        }
      }
      setOutcome(out);
      setRunning(false);
      return out;
    },
    [owner, refreshSchema, running],
  );

  return { status, progress, fatal, schema, outcome, running, notice, start, reset, execute };
}
