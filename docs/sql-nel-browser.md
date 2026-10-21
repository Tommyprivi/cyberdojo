# SQL nel browser

Ambiente SQL integrato, «tipo pgAdmin»: PostgreSQL vero che gira dentro il browser dello studente. Niente da installare, nessuna query al server, nessuna connessione a database esterni, nessun segreto.

## Dove si trova
- Pagina a tutto schermo: `/pratica/sql` (layout `(lab)`, solo da 768px in su; sotto compare l'avviso generico del laboratorio).
- Nelle lezioni (MDX): `<SqlPlayground db="negozio" query="SELECT * FROM clienti;" height={420} />`. `db` = negozio, scuola, log, vendite; `query` = query iniziale; `height` (px) facoltativo, 420 di base. Da telefono la query si legge e basta.
- Scheda «SQL» nell'hub `/pratica`.

## Come funziona
- Libreria: `@electric-sql/pglite` **0.5.10**, licenza Apache-2.0 (versione fissata esatta in `package.json`, verificata su npm il 2026-10-20). Database in memoria.
- Caricamento pigro: nulla si scarica finché lo studente non preme «Avvia il database» (circa 8-10 MB, poi in cache del browser).
- Il motore gira in un Web Worker statico: `public/sql/worker.js` (modulo) con i file di PGlite in `public/sql/pglite/` (copiati da node_modules). Non passa dal bundler: stessa scelta del terminale Python, perché PGlite carica `.wasm` e `.data` con `import.meta.url`.
- Un solo worker per pagina, condiviso da tutti i terminali SQL (`src/lib/sql/engine.ts`). Se due terminali della stessa pagina usano database diversi, il database viene ricaricato quando si passa dall'uno all'altro (le modifiche dell'altro terminale si perdono).
- Il codice: `src/lib/sql/` (logica pura e testata: errori, limiti, risultati, schema, ER, evidenziazione, database di esempio) e `src/components/sql/` (interfaccia).
- Salvataggio: query corrente e cronologia (30 voci) restano in `localStorage` del browser (con try/catch). Il database NON viene salvato: «Ripristina database» lo riporta all'inizio. (IndexedDB non usato: scelta di semplicità.)

## Limiti e sicurezza
- Tempo massimo di una query: 5 secondi (`TIME_LIMIT_MS`). Oltre, il worker viene terminato, il database si ricarica da zero e compare un avviso.
- Righe mostrate: 500 (`MAX_ROWS`); il conteggio totale resta visibile. Query lunghe al massimo 20.000 caratteri.
- Bloccati (`findBlocked` in `limits.ts`): COPY, CREATE EXTENSION, LOAD, ALTER SYSTEM, server e tabelle esterne, `pg_read_file`, `lo_import` e simili, dblink. Il controllo ignora commenti e testi tra apici.
- Intestazioni CSP: **non servite**. Il sito non ne ha oggi e il worker è sullo stesso dominio. Se un giorno si aggiunge una CSP servono `worker-src 'self'` e `script-src ... 'wasm-unsafe-eval'` per PGlite.
- Gli errori sono mostrati col messaggio originale di Postgres e, sotto, una spiegazione in italiano (`src/lib/sql/errors.ts`) per: colonna o tabella inesistente (con «forse intendevi…»), errore di sintassi, JOIN senza ON, GROUP BY mancante, colonna ambigua, violazioni di vincoli, formato errato, divisione per zero. Avviso (non errore) per prodotto cartesiano.

## Database di esempio
Dati interamente inventati (email `@example.com`, IP riservati alla documentazione).
- `negozio`: clienti, prodotti, ordini, righe_ordine.
- `scuola`: studenti, corsi, iscrizioni, voti.
- `log`: accessi, utenti, ip_sospetti (con un attacco a forza bruta da trovare).
- `vendite`: schema a stella (fatti_vendite + dim_data, dim_prodotto, dim_negozio, dim_cliente).

### Aggiungere un database
1. Crea `src/lib/sql/databases/nuovo.ts` che esporta un `SampleDatabase` (`id`, `title`, `description`, `script`, `examples`). Nello script usa solo `CREATE TABLE`/`INSERT`, con chiavi primarie e, dove serve, chiavi esterne.
2. Aggiungilo a `DATABASES` in `src/lib/sql/databases/index.ts`.
3. Il test `src/lib/sql/sql.test.ts` lo esegue da solo con PGlite (script, schema, almeno 4 righe per tabella, esempi con risultati). Poi `pnpm test`.
4. Aggiorna l'elenco dei nomi nel messaggio di `SqlPlayground`.

## Aggiornare PGlite
1. `pnpm add --save-exact @electric-sql/pglite@NUOVA` (controlla la licenza su npm).
2. `node src/lib/sql/sync-pglite.mjs` (ricopia i file in `public/sql/pglite/`).
3. Aggiorna `PGLITE_VERSION` in `src/lib/sql/config.ts`, esegui `pnpm test` e prova `/pratica/sql` nel browser.

## Piano B
Se PGlite non dovesse funzionare, si può ripiegare su sql.js (SQLite in WebAssembly): cambierebbero il worker e le query di schema, non l'interfaccia.
