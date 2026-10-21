// Copia i file di PGlite da node_modules a public/sql/pglite (il worker li carica da lì).
// Uso: node src/lib/sql/sync-pglite.mjs   (da rifare ogni volta che si aggiorna @electric-sql/pglite)
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const from = join("node_modules", "@electric-sql", "pglite", "dist");
const to = join("public", "sql", "pglite");
rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
const wanted = (f) => f === "index.js" || /^chunk-.*\.js$/.test(f) || f === "pglite.wasm" || f === "pglite.data" || f === "initdb.wasm";
for (const f of readdirSync(from).filter(wanted)) cpSync(join(from, f), join(to, f));
console.log("PGlite copiato in", to);
