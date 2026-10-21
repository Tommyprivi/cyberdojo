/**
 * Versione di Pyodide FISSATA (controllata il 2026-10-20 su npm e su cdn.jsdelivr.net: esiste e risponde 200).
 * 0.29.5 è la linea stabile «stable-0.29». Per aggiornare vedi docs/python-nel-browser.md.
 */
export const PYODIDE_VERSION = "0.29.5";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
/** Il worker è un file statico (non passa dal bundler): vedi docs/python-nel-browser.md. */
export const PYTHON_WORKER_URL = "/python/worker.js";
/** Dimensione indicativa del primo download, mostrata allo studente. */
export const DOWNLOAD_HINT = "circa 10 MB, solo la prima volta";
