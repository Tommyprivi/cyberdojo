/** Limiti dell'ambiente SQL. Tutto gira nel browser dello studente: questi limiti proteggono la sua pagina. */
export const TIME_LIMIT_MS = 5000;
export const MAX_ROWS = 500;
export const MAX_QUERY_CHARS = 20000;
export const HISTORY_SIZE = 30;

/** Toglie commenti e testo tra apici, così le parole vietate scritte «per finta» non scattano. */
export function stripSql(sql: string): string {
  let out = "";
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1];
    if (c === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
    } else if (c === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      i = end === -1 ? sql.length : end + 2;
      out += " ";
    } else if (c === "'" || c === '"') {
      i++;
      while (i < sql.length) {
        if (sql[i] === c) {
          if (sql[i + 1] === c) i += 2;
          else break;
        } else i++;
      }
      i++;
      out += c === "'" ? "''" : '""';
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

const BLOCKED: { re: RegExp; what: string }[] = [
  { re: /\bcopy\b/i, what: "COPY (lettura e scrittura di file)" },
  { re: /\bcreate\s+extension\b/i, what: "CREATE EXTENSION (estensioni)" },
  { re: /\bload\b\s*'/i, what: "LOAD (librerie esterne)" },
  { re: /\balter\s+system\b/i, what: "ALTER SYSTEM (impostazioni del server)" },
  { re: /\bcreate\s+(server|foreign\s+data\s+wrapper|foreign\s+table)\b/i, what: "connessioni a database esterni" },
  { re: /\b(pg_read_file|pg_read_binary_file|pg_ls_dir|pg_stat_file|lo_import|lo_export|pg_file_write)\b/i, what: "funzioni che leggono o scrivono file" },
  { re: /\bdblink\b/i, what: "dblink (database esterni)" },
];

/** Restituisce una descrizione di cosa è vietato, o null se la query è consentita. */
export function findBlocked(sql: string): string | null {
  const clean = stripSql(sql);
  for (const b of BLOCKED) if (b.re.test(clean)) return b.what;
  return null;
}

export const BLOCKED_MESSAGE = (what: string) =>
  `Questa istruzione non è consentita in questo ambiente: ${what}. Il database vive solo nel tuo browser e non può usare file, estensioni o connessioni esterne.`;
