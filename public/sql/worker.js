// Worker dell'ambiente SQL: PGlite (PostgreSQL in WebAssembly) in memoria. Nessun accesso alla rete oltre al
// download dei file statici di PGlite dallo stesso sito. Protocollo: src/lib/sql/protocol.ts.
/* eslint-disable */
let db = null;

const post = (m) => self.postMessage(m);

function errInfo(e) {
  return {
    message: String((e && e.message) || e),
    code: e && e.code,
    position: e && e.position ? Number(e.position) : undefined,
    detail: e && e.detail,
    hint: e && e.hint,
  };
}

function cell(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "bigint") return v.toString();
  if (typeof v === "number") return Number.isFinite(v) ? v : String(v);
  if (typeof v === "boolean" || typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if (v instanceof Uint8Array) return "\\x" + Array.from(v, (b) => b.toString(16).padStart(2, "0")).join("");
  try {
    return JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x));
  } catch {
    return String(v);
  }
}

async function init() {
  post({ type: "progress", label: "Scarico il motore PostgreSQL…" });
  const { PGlite } = await import("./pglite/index.js");
  // date e numeri restano testo: si vedono come li scrive Postgres (2026-03-14, 12.50).
  const raw = (v) => v;
  db = new PGlite({ parsers: { 1082: raw, 1114: raw, 1184: raw, 1700: raw } });
  post({ type: "progress", label: "Avvio il database…" });
  await db.waitReady;
  await db.exec("SET TIME ZONE 'UTC'");
}

async function load(script) {
  await db.exec("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; RESET ALL; SET TIME ZONE 'UTC';");
  if (script) await db.exec(script);
}

async function run(sql, maxRows) {
  const t0 = performance.now();
  const results = await db.exec(sql, { rowMode: "array" });
  const durationMs = performance.now() - t0;
  const withFields = results.filter((r) => r.fields && r.fields.length > 0);
  const last = withFields.length ? withFields[withFields.length - 1] : results[results.length - 1];
  const rows = last ? last.rows : [];
  const shown = rows.length > maxRows ? rows.slice(0, maxRows) : rows;
  return {
    columns: last ? last.fields.map((f) => ({ name: f.name, type: f.dataTypeID })) : [],
    rows: shown.map((r) => r.map(cell)),
    totalRows: rows.length,
    truncated: rows.length > maxRows,
    affectedRows: last && typeof last.affectedRows === "number" ? last.affectedRows : null,
    statements: results.length,
    durationMs,
  };
}

async function schema(columnsSql, constraintsSql) {
  const columns = (await db.query(columnsSql)).rows;
  const constraints = (await db.query(constraintsSql)).rows;
  const counts = {};
  for (const name of new Set(columns.map((c) => c.table_name))) {
    const q = '"' + String(name).replaceAll('"', '""') + '"';
    counts[name] = Number((await db.query("SELECT count(*) AS n FROM public." + q)).rows[0].n);
  }
  return { columns, constraints, counts };
}

self.onmessage = async (ev) => {
  const m = ev.data;
  if (m.type === "init") {
    try {
      await init();
      post({ type: "ready" });
    } catch (e) {
      post({ type: "init-error", message: String((e && e.message) || e) });
    }
    return;
  }
  try {
    let data = null;
    if (m.type === "load") await load(m.script);
    else if (m.type === "run") data = await run(m.sql, m.maxRows);
    else if (m.type === "schema") data = await schema(m.columnsSql, m.constraintsSql);
    post({ type: "reply", id: m.id, ok: true, data });
  } catch (e) {
    post({ type: "reply", id: m.id, ok: false, error: errInfo(e) });
  }
};
