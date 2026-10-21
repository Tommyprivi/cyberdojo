export type ColumnInfo = { name: string; type: string; nullable: boolean; pk: boolean; unique: boolean; ref?: { table: string; column: string } };
export type TableInfo = { name: string; columns: ColumnInfo[]; rows: number };
export type Relation = { from: string; fromColumns: string[]; to: string; toColumns: string[] };
export type SchemaInfo = { tables: TableInfo[]; relations: Relation[] };

/** Righe grezze restituite dal worker (vedi SCHEMA_SQL). */
export type RawSchema = {
  columns: { table_name: string; column_name: string; data_type: string; is_nullable: string }[];
  constraints: { tbl: string; contype: string; cols: string[]; ref_tbl: string | null; ref_cols: string[] | null }[];
  counts: Record<string, number>;
};

export const SCHEMA_COLUMNS_SQL = `SELECT c.table_name, c.column_name, c.data_type, c.is_nullable
FROM information_schema.columns c
JOIN information_schema.tables t ON t.table_schema = c.table_schema AND t.table_name = c.table_name AND t.table_type = 'BASE TABLE'
WHERE c.table_schema = 'public'
ORDER BY c.table_name, c.ordinal_position`;

export const SCHEMA_CONSTRAINTS_SQL = `SELECT c.conrelid::regclass::text AS tbl, c.contype::text AS contype,
  (SELECT array_agg(a.attname::text ORDER BY k.ord) FROM unnest(c.conkey) WITH ORDINALITY k(attnum, ord)
     JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = k.attnum) AS cols,
  CASE WHEN c.confrelid <> 0 THEN c.confrelid::regclass::text END AS ref_tbl,
  CASE WHEN c.confrelid <> 0 THEN (SELECT array_agg(a.attname::text ORDER BY k.ord) FROM unnest(c.confkey) WITH ORDINALITY k(attnum, ord)
     JOIN pg_attribute a ON a.attrelid = c.confrelid AND a.attnum = k.attnum) END AS ref_cols
FROM pg_constraint c
WHERE c.connamespace = 'public'::regnamespace AND c.contype IN ('p', 'f', 'u')`;

const clean = (n: string) => n.replace(/^"|"$/g, "");

const TYPE_NAMES: Record<string, string> = {
  "character varying": "varchar",
  "timestamp without time zone": "timestamp",
  "timestamp with time zone": "timestamptz",
  "double precision": "float8",
  integer: "integer",
};

export function buildSchema(raw: RawSchema): SchemaInfo {
  const tables = new Map<string, TableInfo>();
  for (const c of raw.columns) {
    const t = tables.get(c.table_name) ?? { name: c.table_name, columns: [], rows: raw.counts[c.table_name] ?? 0 };
    t.columns.push({
      name: c.column_name,
      type: TYPE_NAMES[c.data_type] ?? c.data_type,
      nullable: c.is_nullable === "YES",
      pk: false,
      unique: false,
    });
    tables.set(c.table_name, t);
  }
  const relations: Relation[] = [];
  for (const k of raw.constraints) {
    const t = tables.get(clean(k.tbl));
    if (!t) continue;
    const cols = k.cols ?? [];
    if (k.contype === "p") for (const col of t.columns) if (cols.includes(col.name)) col.pk = true;
    if (k.contype === "u" && cols.length === 1) for (const col of t.columns) if (col.name === cols[0]) col.unique = true;
    if (k.contype === "f" && k.ref_tbl && k.ref_cols) {
      const to = clean(k.ref_tbl);
      relations.push({ from: t.name, fromColumns: cols, to, toColumns: k.ref_cols });
      cols.forEach((name, i) => {
        const col = t.columns.find((c) => c.name === name);
        if (col) col.ref = { table: to, column: k.ref_cols![i] };
      });
    }
  }
  return { tables: [...tables.values()], relations };
}

export function quoteIdent(name: string): string {
  return /^[a-z_][a-z0-9_]*$/.test(name) ? name : `"${name.replaceAll('"', '""')}"`;
}

export const previewSql = (table: string) => `SELECT * FROM ${quoteIdent(table)} LIMIT 20;`;
