/**
 * Migrazioni con protezione (vedi src/lib/db/migrate-guard.ts).
 *   pnpm db:migrate                          -> solo sul database di sviluppo
 *   pnpm db:migrate:prod -- --backup <file>  -> sulla produzione, con una copia di sicurezza di oggi
 * Stampa sempre il server a cui sta per collegarsi (mai la password).
 */
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { checkMigration } from "../src/lib/db/migrate-guard";

const args = process.argv.slice(2);
const prod = args.includes("--prod");
const backupFile = args.includes("--backup") ? args[args.indexOf("--backup") + 1] : undefined;

let backupModifiedAt: number | undefined;
if (backupFile) {
  try {
    backupModifiedAt = statSync(backupFile).mtimeMs;
  } catch {
    console.error(`File di copia di sicurezza non trovato: ${backupFile}`);
    process.exit(1);
  }
}

const check = checkMigration({
  url: process.env.DATABASE_URL ?? "",
  prodHost: process.env.PRODUCTION_DB_HOST,
  prod,
  backupModifiedAt,
  now: new Date(),
});

if (!check.ok) {
  console.error(`Migrazione bloccata: ${check.reason}`);
  process.exit(1);
}

console.log(`Migrazione su: ${check.host} (${prod ? "PRODUZIONE" : "sviluppo"})`);
const result = spawnSync(process.execPath, ["node_modules/drizzle-kit/bin.cjs", "migrate"], { stdio: "inherit" });
process.exit(result.status ?? 1);
