/**
 * Copia di sicurezza del database (tutte le tabelle di `public`, in JSON), senza bisogno di pg_dump.
 *   pnpm db:backup  ->  backups/<ora>.json
 * Legge DATABASE_URL (il proprietario, che vede tutte le righe). Solo lettura: non modifica niente.
 * Il file contiene dati personali: sta in backups/, che non va mai su git. Tienilo in un posto privato.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { Pool } from "@neondatabase/serverless";
import { dbHost } from "../src/lib/db/migrate-guard";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL non impostata (.env.local).");
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const tables = await pool.query<{ table_name: string }>(
  `select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name`,
);

const dump: Record<string, unknown[]> = {};
for (const { table_name } of tables.rows) {
  // Il nome viene dal catalogo del database, non da input esterno; si cita comunque.
  const rows = await pool.query(`select * from "${table_name.replace(/"/g, '""')}"`);
  dump[table_name] = rows.rows;
}
await pool.end();

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
mkdirSync("backups", { recursive: true });
const file = `backups/${stamp}.json`;
writeFileSync(file, JSON.stringify({ host: dbHost(url), createdAt: new Date().toISOString(), tables: dump }));

console.log(`Copia salvata in ${file} (server: ${dbHost(url)})`);
for (const [name, rows] of Object.entries(dump)) console.log(`  ${name}: ${rows.length} righe`);
