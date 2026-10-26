/**
 * Protezione delle migrazioni: impedisce di cambiare per sbaglio il database con i dati veri.
 * - Le migrazioni normali (`db:migrate`) partono solo sul database di sviluppo.
 * - Sul database di produzione parte solo `db:migrate:prod`, e solo con una copia di sicurezza di oggi.
 * Funzioni pure: le usa scripts/db-migrate.mts.
 */

/** Nome del server del database; il suffisso -pooler di Neon si toglie (stesso database, altra porta). */
export function dbHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/-pooler(?=\.)/, "") || null;
  } catch {
    return null;
  }
}

export type MigrationCheck = { ok: true; host: string } | { ok: false; reason: string };

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function checkMigration(input: {
  url: string;
  /** Nome del server di produzione (PRODUCTION_DB_HOST in .env.local). */
  prodHost: string | undefined;
  /** Richiesto con `db:migrate:prod`. */
  prod: boolean;
  /** Ultima modifica del file di copia di sicurezza, in millisecondi. */
  backupModifiedAt?: number;
  now: Date;
}): MigrationCheck {
  const host = dbHost(input.url);
  if (!host) return { ok: false, reason: "DATABASE_URL manca o non è un indirizzo valido." };

  const prodHost = input.prodHost ? dbHost(`postgresql://x@${input.prodHost}/`) : null;
  if (!prodHost) {
    return { ok: false, reason: "Manca PRODUCTION_DB_HOST in .env.local: scrivi il nome del server del database di produzione." };
  }

  const isProd = host === prodHost;
  if (!isProd) {
    return input.prod
      ? { ok: false, reason: "Hai chiesto la produzione, ma DATABASE_URL non punta al database di produzione." }
      : { ok: true, host };
  }

  if (!input.prod) {
    return { ok: false, reason: "DATABASE_URL punta al database di produzione: usa db:migrate:prod (con una copia di sicurezza di oggi)." };
  }
  if (input.backupModifiedAt === undefined || !sameDay(new Date(input.backupModifiedAt), input.now)) {
    return { ok: false, reason: "Serve una copia di sicurezza fatta oggi: passa il file con --backup <file>." };
  }
  return { ok: true, host };
}
