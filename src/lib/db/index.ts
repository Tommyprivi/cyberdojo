import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Creato alla prima richiesta, non all'import: così il build funziona anche senza DATABASE_URL.
let instance: ReturnType<typeof create> | undefined;

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL non impostata (vedi .env.example).");
  return drizzle(new Pool({ connectionString: url }), { schema });
}

export function getDb() {
  return (instance ??= create());
}

export type Db = ReturnType<typeof getDb>;
export { schema };
