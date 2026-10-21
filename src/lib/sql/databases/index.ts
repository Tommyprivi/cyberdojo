import { log } from "./log";
import { negozio } from "./negozio";
import { scuola } from "./scuola";
import type { SampleDatabase } from "./types";
import { vendite } from "./vendite";

export type { SampleDatabase, SqlExample } from "./types";

/** Database di esempio disponibili. Per aggiungerne uno vedi docs/sql-nel-browser.md. */
export const DATABASES: readonly SampleDatabase[] = [negozio, scuola, log, vendite];

export const DEFAULT_DB_ID = "negozio";

export function getDatabase(id: string): SampleDatabase | undefined {
  return DATABASES.find((d) => d.id === id);
}
