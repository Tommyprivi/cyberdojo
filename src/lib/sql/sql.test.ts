import { describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { DATABASES } from "./databases";
import { layoutEr } from "./er";
import { closestName, detectWarnings, explainSqlError } from "./errors";
import { tokenizeSql } from "./highlight";
import { BLOCKED_MESSAGE, findBlocked, stripSql } from "./limits";
import { describeResult, formatCell, formatDuration, limitRows, pushHistory, statementKind, type RunResult } from "./results";
import { SCHEMA_COLUMNS_SQL, SCHEMA_CONSTRAINTS_SQL, buildSchema, previewSql, quoteIdent, type RawSchema } from "./schema";

describe("errori in italiano", () => {
  const ctx = { sql: "SELECT nmoe FROM clienti", tables: ["clienti", "ordini"], columns: ["nome", "cognome"] };
  it("colonna inesistente con suggerimento", () => {
    const h = explainSqlError({ message: 'column "nmoe" does not exist', code: "42703" }, ctx);
    expect(h).toContain("colonna");
    expect(h).toContain("«nome»");
  });
  it("tabella inesistente con suggerimento", () => {
    const h = explainSqlError({ message: 'relation "cliente" does not exist', code: "42P01" }, ctx);
    expect(h).toContain("«clienti»");
  });
  it("errore di sintassi e JOIN senza ON", () => {
    expect(explainSqlError({ message: 'syntax error at or near "FORM"', code: "42601" }, { sql: "SELECT * FORM clienti" })).toContain("«FORM»");
    expect(explainSqlError({ message: 'syntax error at or near ";"', code: "42601" }, { sql: "SELECT * FROM a JOIN b;" })).toContain("ON");
  });
  it("GROUP BY mancante", () => {
    expect(explainSqlError({ message: "column must appear in the GROUP BY clause", code: "42803" }, ctx)).toContain("GROUP BY");
  });
  it("codici sconosciuti non inventano spiegazioni", () => {
    expect(explainSqlError({ message: "boh", code: "99999" }, ctx)).toBeNull();
  });
  it("nomi simili", () => {
    expect(closestName("clienit", ["clienti", "ordini"])).toBe("clienti");
    expect(closestName("zzzzzz", ["clienti"])).toBeNull();
  });
  it("avvisi sul prodotto cartesiano", () => {
    expect(detectWarnings("SELECT * FROM a, b")).toHaveLength(1);
    expect(detectWarnings("SELECT * FROM a CROSS JOIN b")).toHaveLength(1);
    expect(detectWarnings("SELECT * FROM a, b WHERE a.id = b.a_id")).toHaveLength(0);
    expect(detectWarnings("SELECT * FROM a JOIN b ON a.id = b.a_id")).toHaveLength(0);
  });
});

describe("limiti e blocchi", () => {
  it("blocca COPY, estensioni e file", () => {
    for (const q of ["COPY t TO '/tmp/x'", "create extension file_fdw;", "SELECT pg_read_file('/etc/passwd')", "ALTER SYSTEM SET x = 1", "SELECT lo_import('/x')"]) {
      expect(findBlocked(q), q).not.toBeNull();
    }
    expect(BLOCKED_MESSAGE("x")).toContain("non è consentita");
  });
  it("lascia passare le query normali, anche con parole vietate dentro testi e commenti", () => {
    expect(findBlocked("SELECT * FROM clienti")).toBeNull();
    expect(findBlocked("SELECT 'copy' AS parola -- copy\n")).toBeNull();
    expect(stripSql("a 'x''y' /* c */ b")).toBe("a ''   b");
  });
  it("taglia le righe oltre il limite", () => {
    expect(limitRows([1, 2, 3], 2)).toEqual({ rows: [1, 2], truncated: true });
    expect(limitRows([1], 2)).toEqual({ rows: [1], truncated: false });
  });
});

describe("formattazione dei risultati", () => {
  const base: RunResult = { columns: [{ name: "a", type: 25 }], rows: [["x"]], totalRows: 1, truncated: false, affectedRows: null, statements: 1, durationMs: 3 };
  it("celle", () => {
    expect(formatCell(null)).toEqual({ text: "NULL", kind: "null" });
    expect(formatCell(5).kind).toBe("number");
    expect(formatCell(true).text).toBe("true");
  });
  it("durata", () => {
    expect(formatDuration(0.2)).toBe("meno di 1 ms");
    expect(formatDuration(12.4)).toBe("12 ms");
    expect(formatDuration(1340)).toBe("1,3 s");
  });
  it("riepilogo", () => {
    expect(describeResult(base)).toBe("1 riga");
    expect(describeResult({ ...base, totalRows: 3, rows: [["a"], ["b"], ["c"]] })).toBe("3 righe");
    expect(describeResult({ ...base, totalRows: 12000, truncated: true })).toContain("di 12.000 righe");
    expect(describeResult({ ...base, columns: [], rows: [], affectedRows: 2 })).toBe("2 righe modificate");
  });
  it("tipo di istruzione e cronologia", () => {
    expect(statementKind("  -- ciao\n select 1")).toBe("SELECT");
    expect(pushHistory(["a", "b"], "b", 3)).toEqual(["b", "a"]);
    expect(pushHistory(["a"], "  ", 3)).toEqual(["a"]);
    expect(pushHistory(["a", "b", "c"], "d", 3)).toEqual(["d", "a", "b"]);
  });
});

describe("evidenziazione", () => {
  it("non perde nemmeno un carattere", () => {
    const sql = "SELECT 'it''s', 42 /* c */ FROM t -- fine\nWHERE x >= 1.5;";
    const toks = tokenizeSql(sql);
    expect(toks.map((t) => t.text).join("")).toBe(sql);
    expect(toks.find((t) => t.text === "SELECT")?.type).toBe("keyword");
    expect(toks.find((t) => t.text === "'it''s'")?.type).toBe("string");
    expect(toks.find((t) => t.text === "42")?.type).toBe("number");
    expect(toks.find((t) => t.text.startsWith("-- fine"))?.type).toBe("comment");
  });
});

describe("schema e diagramma ER", () => {
  const raw: RawSchema = {
    columns: [
      { table_name: "a", column_name: "id", data_type: "integer", is_nullable: "NO" },
      { table_name: "b", column_name: "id", data_type: "integer", is_nullable: "NO" },
      { table_name: "b", column_name: "a_id", data_type: "integer", is_nullable: "NO" },
    ],
    constraints: [
      { tbl: "a", contype: "p", cols: ["id"], ref_tbl: null, ref_cols: null },
      { tbl: "b", contype: "p", cols: ["id"], ref_tbl: null, ref_cols: null },
      { tbl: "b", contype: "f", cols: ["a_id"], ref_tbl: "a", ref_cols: ["id"] },
    ],
    counts: { a: 3, b: 5 },
  };
  it("costruisce chiavi e relazioni", () => {
    const s = buildSchema(raw);
    expect(s.tables[1].columns[1].ref).toEqual({ table: "a", column: "id" });
    expect(s.tables[0].columns[0].pk).toBe(true);
    expect(s.relations).toEqual([{ from: "b", fromColumns: ["a_id"], to: "a", toColumns: ["id"] }]);
    expect(layoutEr(s).links).toHaveLength(1);
  });
  it("anteprima e nomi", () => {
    expect(previewSql("clienti")).toBe("SELECT * FROM clienti LIMIT 20;");
    expect(quoteIdent("Mia Tabella")).toBe('"Mia Tabella"');
  });
});

describe("database di esempio (eseguiti con PGlite)", () => {
  for (const d of DATABASES) {
    it(`${d.id}: lo script gira, schema coerente, esempi validi`, async () => {
      const db = new PGlite();
      await db.exec(d.script);
      const raw: RawSchema = {
        columns: (await db.query<RawSchema["columns"][number]>(SCHEMA_COLUMNS_SQL)).rows,
        constraints: (await db.query<RawSchema["constraints"][number]>(SCHEMA_CONSTRAINTS_SQL)).rows,
        counts: {},
      };
      const schema = buildSchema(raw);
      expect(schema.tables.length).toBeGreaterThanOrEqual(3);
      // il registro degli accessi non ha chiavi esterne: gli account falsi del log non esistono in utenti
      expect(schema.relations.length).toBeGreaterThanOrEqual(d.id === "log" ? 0 : 2);
      for (const t of schema.tables) {
        const n = Number((await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${quoteIdent(t.name)}`)).rows[0].n);
        expect(n, t.name).toBeGreaterThanOrEqual(4);
        expect(t.columns.some((c) => c.pk), `${t.name} senza chiave primaria`).toBe(true);
      }
      expect(d.examples.length).toBeGreaterThanOrEqual(4);
      for (const e of d.examples) {
        const r = await db.query(e.sql);
        expect(r.rows.length, e.title).toBeGreaterThan(0);
      }
      layoutEr(schema);
      await db.close();
    }, 60000);
  }

  it("negozio: i totali delle righe sono coerenti con i prezzi di listino", async () => {
    const db = new PGlite();
    await db.exec(DATABASES.find((d) => d.id === "negozio")!.script);
    const r = await db.query<{ n: number }>("SELECT count(*)::int AS n FROM righe_ordine r JOIN prodotti p ON p.id = r.prodotto_id WHERE p.prezzo <> r.prezzo_unitario");
    expect(r.rows[0].n).toBe(0);
    await db.close();
  }, 60000);

  it("errori reali di Postgres hanno i codici attesi", async () => {
    const db = new PGlite();
    await db.exec(DATABASES[0].script);
    const code = async (q: string) => {
      try {
        await db.exec(q);
      } catch (e) {
        return (e as { code?: string }).code;
      }
    };
    expect(await code("SELECT nmoe FROM clienti")).toBe("42703");
    expect(await code("SELECT * FROM cliente")).toBe("42P01");
    expect(await code("SELECT * FORM clienti")).toBe("42601");
    expect(await code("SELECT citta, nome FROM clienti GROUP BY citta")).toBe("42803");
    expect(await code("SELECT id FROM clienti c JOIN ordini o ON c.id = o.cliente_id")).toBe("42702");
    await db.close();
  }, 60000);
});
