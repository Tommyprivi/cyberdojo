/**
 * PGlite (PostgreSQL compilato in WebAssembly), versione FISSATA in package.json.
 * Licenza Apache-2.0. Verificata il 2026-10-20 su npm: 0.5.10.
 * Il worker e i file di PGlite sono statici in /public/sql (vedi docs/sql-nel-browser.md per aggiornare).
 */
export const PGLITE_VERSION = "0.5.10";
export const SQL_WORKER_URL = "/sql/worker.js";
/** Dimensione indicativa del primo download, mostrata allo studente. */
export const SQL_DOWNLOAD_HINT = "circa 8 MB, solo la prima volta";
