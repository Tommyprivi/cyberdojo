import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Creato alla prima richiesta, non all'import: così il build funziona anche senza database.
let instance: ReturnType<typeof create> | undefined;

function create() {
  // L'app usa un ruolo NON proprietario (DATABASE_URL_APP): solo così le policy RLS valgono.
  // DATABASE_URL (proprietario) serve alle migrazioni; in produzione non va usato dall'app.
  const url = process.env.DATABASE_URL_APP ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_APP non impostata (vedi .env.example).");
  if (!process.env.DATABASE_URL_APP && process.env.NODE_ENV === "production") {
    throw new Error("In produzione serve DATABASE_URL_APP: con il ruolo proprietario la RLS non protegge.");
  }
  return drizzle(new Pool({ connectionString: url }), { schema });
}

export function getDb() {
  return (instance ??= create());
}

export type Db = ReturnType<typeof getDb>;
export { schema };
