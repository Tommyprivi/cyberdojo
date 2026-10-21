# Python nel browser

Il terminale Python di CyberDojo esegue il codice **nel browser dello studente** con [Pyodide](https://pyodide.org) (Python compilato in WebAssembly). Niente viene inviato al nostro server e non si installa nulla.

## Dove si trova
- Componente per le lezioni: `<PythonTerminal code="..." height={320} />` (registrato in `src/components/lesson/mdx-components.tsx`). `code` è il codice iniziale (opzionale), `height` l'altezza dell'editor in px (opzionale). Da 768px in su si esegue; sotto, solo lettura con l'avviso «Per eseguire Python usa un computer o un tablet».
- Strumento a tutto schermo: `/pratica/python` (gruppo `(lab)`), scheda «Python» nell'hub Pratica.
- Il codice dello studente si salva in `localStorage` (chiave `cyberdojo:python:<percorso>:<hash del codice iniziale>`), con try/catch: se il browser lo vieta non succede nulla.

## Come funziona
- `src/lib/python/config.ts`: versione e indirizzo di Pyodide. **Versione fissata: 0.29.5** (linea stabile «stable-0.29», controllata il 2026-10-20: esiste su npm e su `cdn.jsdelivr.net/pyodide/v0.29.5/full/`). Esiste anche la serie 314.x (tag `latest` su npm): non l'abbiamo adottata perché troppo recente.
- `public/python/worker.js`: il Web Worker. È un **file statico** (classico, non modulo) e non passa dal bundler: così funziona uguale con Turbopack e in produzione e può fare `importScripts` dalla CDN senza trucchi. La logica testabile (limiti, errori) sta in TypeScript.
- `src/lib/python/engine.ts`: crea il worker solo quando lo studente preme «Avvia Python» (download di circa 10 MB, mostrato con una barra; poi sta nella cache del browser).
- `src/lib/python/limits.ts`: limite di tempo (5 s) e di output (50.000 caratteri), con test.
- `src/lib/python/errors.ts`: spiegazioni in italiano di SyntaxError, IndentationError, NameError, TypeError, ZeroDivisionError, IndexError. Compaiono sotto la traceback originale, che resta in inglese.
- `src/components/python/*`: hook di stato, editor (textarea con numeri di riga, Tab = 4 spazi, Esc poi Tab per uscire, Invio mantiene il rientro, Ctrl+Invio esegue), pannello Programma/REPL.

## Limiti e comportamento
- **Tempo:** oltre 5 secondi il worker viene terminato e al prossimo avvio ne parte uno nuovo (il motore è già in cache). Messaggio gentile in italiano.
- **Output:** oltre 50.000 caratteri il programma viene fermato e l'output tagliato.
- **input():** un worker non può aspettare in modo sincrono la pagina senza le intestazioni COOP/COEP, che romperebbero i video YouTube incorporati. Si usa quindi la **riesecuzione**: all'`input()` il programma si ferma, la pagina chiede il testo, poi il programma riparte da capo con le risposte già date (l'output già mostrato non si ripete; `random` ha lo stesso seme). Va bene per programmi deterministici da lezione; un `except:` nudo o `except BaseException` nel codice dello studente può «mangiare» la richiesta di input. Nel REPL `input()` non è disponibile.
- **Rete:** dopo l'avvio il worker sostituisce `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`, `Worker` e `SharedWorker` con funzioni che rifiutano; `micropip` e `pyodide.http` sono bloccati in `sys.modules`. **Non è una sandbox a prova di attaccante**: un utente esperto potrebbe aggirarla con riferimenti interni di Pyodide. È il suo browser e il suo codice, quindi il rischio è per lui; non c'è comunque nessun dato nostro nel worker. Non c'è CSP in `next.config.ts` (il sito non ne ha una e aggiungerla romperebbe gli script inline di Next); se in futuro si aggiunge, servono `script-src` e `connect-src` verso `https://cdn.jsdelivr.net`, `worker-src 'self'` e `'wasm-unsafe-eval'`.
- **Filesystem:** virtuale, in memoria (Emscripten MEMFS); sparisce alla chiusura della pagina.
- **Niente thread né processi.** Moduli non inclusi nella libreria standard di base (per esempio `sqlite3`, `ssl`) o pacchetti esterni (numpy, ecc.) non sono disponibili: servirebbe la rete.
- Ogni terminale ha il suo worker (circa 30-40 MB di memoria): non mettere decine di terminali in una pagina.

## Come aggiornare Pyodide
1. Scegli la versione su npm (`npm view pyodide dist-tags`) e controlla che l'indirizzo risponda: `curl -I https://cdn.jsdelivr.net/pyodide/vX.Y.Z/full/pyodide.js`.
2. Cambia `PYODIDE_VERSION` in `src/lib/python/config.ts`.
3. Prova `/pratica/python`: `print("ciao")`, un errore, `while True: pass`, un `input()`, il REPL.
4. Se cambiano i messaggi di errore di Python, controlla `src/lib/python/errors.ts` e `pnpm test`.
