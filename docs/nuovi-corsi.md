# I 10 nuovi corsi: indice e briefing per chi scrive le lezioni

File generato da `scripts/genera-nuovi-corsi.ts` a partire da `scripts/piano-corsi/*.ts`: **per cambiare titoli o moduli si modifica il piano e si rilancia lo script**, non questo file.
Come si scrive una lezione: `docs/guida-scrivere-lezioni.md`. Il modulo pilota già scritto è **W1 (Come funziona il web)**: leggilo (content/sviluppo-web/w1/ e src/lib/practice/banks-nuovi/w01.ts) prima di scrivere.

## Regole comuni

- Ogni corso ha **200 lezioni** = 5 blocchi x 4 moduli x 10 lezioni. Un blocco va dal facile al difficile e dura circa 40 lezioni. **Un agente = un modulo** (10 lezioni + il file delle domande).
- ID lezione `X.MM.NNN` (X = lettera del corso, MM = numero del modulo da 01 a 20, NNN = numero nel modulo da 001 a 010). File: `content/<cartella>/<x><modulo>/X.MM.NNN.mdx` (esempio `content/sviluppo-web/w2/W.02.003.mdx`).
- **Nessun salto, prerequisiti nel frontmatter:** ogni lezione ha come prerequisito la precedente dello stesso modulo; la prima lezione di un modulo ha come prerequisito l'ultima del modulo precedente (`W.02.001` -> `[W.01.010]`); la prima del corso (`X.01.001`) ha `prerequisites: []`. I corsi si aprono tutti da subito: i prerequisiti sono solo dentro lo stesso corso. Le dipendenze da altri corsi sono consigli (campo «Consigliato») e si scrivono nel testo, non nei prerequisiti.
- Cinture: moduli 1-4 `bianca`, 5-8 `gialla`, 9-12 `arancione`, 13-16 `verde`, 17-20 `blu`.
- Dove un argomento è già in un corso esistente non si ripete: si scrive la lezione solo al livello nuovo e si **rimanda** con una frase («Lo hai visto in Fondamenta F7, qui lo usiamo per...»). Il campo «Rimando» di ogni modulo dice dove.
- Contenuti: niente consigli finanziari o legali, niente link di affiliazione, fatti verificabili, strumenti gratuiti. Offensiva solo concettuale o in laboratorio proprio (vedi la guida). Utenti dai 14 anni.
- Finché un modulo non ha lezioni il sito lo mostra «In preparazione»: si può pubblicare un modulo alla volta.

## Indice dei corsi

| Lettera | Cartella | Corso | Lezioni |
|---|---|---|---|
| W | `content/sviluppo-web/` | Sviluppo web | 200 |
| P | `content/programmazione/` | Programmazione generale | 200 |
| A | `content/app-telefono/` | App per telefono | 200 |
| I | `content/intelligenza-artificiale/` | Intelligenza artificiale | 200 |
| B | `content/database-grandi-dati/` | Database e dati a grande scala | 200 |
| L | `content/cloud-devops/` | Cloud e DevOps | 200 |
| R | `content/reti-internet/` | Reti e internet | 200 |
| E | `content/hacking-etico/` | Hacking etico e CTF | 200 |
| X | `content/blockchain/` | Blockchain e crypto (tecnica) | 200 |
| M | `content/mondo-digitale/` | Mondo digitale per tutti | 200 |

## W · Sviluppo web

Dalla prima pagina HTML a un sito vero con React e un server tuo: HTML, CSS, JavaScript, React, backend e API. Si impara costruendo, una pagina e un pezzo di sito alla volta.

- **Per chi:** Per chi vuole creare siti e applicazioni web, anche partendo da zero.
- **Consigliato:** Nessun prerequisito. Per la parte di rete e di sicurezza web rimandano Fondamenta (F7) e Cybersecurity (C4).
- **Cartella e `course:`:** `sviluppo-web` · **Domande:** `src/lib/practice/banks-nuovi/wNN.ts`

### Blocco 1 · Una pagina web da zero (W1-W4, lezioni 1-40)

Come funziona il web e come si scrive una pagina con HTML e CSS.

#### W1 · Come funziona il web

Browser, indirizzi, richieste e risposte, strumenti per sviluppare e la prima pagina. Cintura: bianca.
**Rimando:** DNS, HTTP e HTTPS a fondo sono in Fondamenta F7: qui solo l'essenziale per chi sviluppa.

1. `W.01.001` Che cosa succede quando apri un sito
2. `W.01.002` Browser, server e indirizzi (URL)
3. `W.01.003` Richieste e risposte in parole semplici
4. `W.01.004` I tre linguaggi del web: HTML, CSS, JavaScript
5. `W.01.005` Gli strumenti dello sviluppatore del browser
6. `W.01.006` Un editor di testo e la cartella del progetto
7. `W.01.007` La prima pagina web, salvata sul tuo computer
8. `W.01.008` Aprire un file in locale e ricaricare la pagina
9. `W.01.009` Leggere il codice di un sito vero senza paura
10. `W.01.010` Come si impara a programmare: errori, pazienza e ricerca

#### W2 · HTML: la struttura

Documento, titoli, paragrafi, elenchi, link e immagini, con i tag spiegati uno alla volta. Cintura: bianca.

1. `W.02.001` Un documento HTML: doctype, head e body
2. `W.02.002` Tag, attributi ed elementi
3. `W.02.003` Titoli e paragrafi
4. `W.02.004` Grassetto, corsivo e altri tag di testo
5. `W.02.005` Elenchi puntati e numerati
6. `W.02.006` I link: collegare pagine e siti
7. `W.02.007` Percorsi dei file: relativi e assoluti
8. `W.02.008` Le immagini e il testo alternativo
9. `W.02.009` Commenti, spazi e caratteri speciali
10. `W.02.010` Validare l'HTML e leggere gli errori

#### W3 · HTML: pagine ben fatte

Tag semantici, tabelle, form, audio e video, accessibilità di base. Cintura: bianca.

1. `W.03.001` Header, nav, main, section, article, footer
2. `W.03.002` Perché la semantica conta (e per chi)
3. `W.03.003` Le tabelle: righe, celle e intestazioni
4. `W.03.004` Un modulo: form, input e pulsanti
5. `W.03.005` Etichette, campi di testo, scelte e menu
6. `W.03.006` Validazione di base dei campi nel browser
7. `W.03.007` Audio, video e incorporamenti
8. `W.03.008` Titoli e struttura della pagina: l'indice del documento
9. `W.03.009` Accessibilità: lettori di schermo e tastiera
10. `W.03.010` Progetto: la pagina di presentazione di un'associazione

#### W4 · CSS: dare stile

Selettori, colori, testo, box model, specificità e ordine delle regole. Cintura: bianca.

1. `W.04.001` Che cos'è il CSS e come si collega a una pagina
2. `W.04.002` Selettori di elemento, di classe e di id
3. `W.04.003` Colori: nomi, esadecimale e rgb
4. `W.04.004` Caratteri, dimensioni e interlinea
5. `W.04.005` Il box model: contenuto, padding, bordo e margine
6. `W.04.006` Unità di misura: px, em, rem e percentuali
7. `W.04.007` Sfondi, bordi e ombre
8. `W.04.008` Pseudo-classi: hover, focus e le altre
9. `W.04.009` Specificità e cascata: chi vince quando le regole si scontrano
10. `W.04.010` Progetto: dare stile alla pagina dell'associazione

### Blocco 2 · Layout e JavaScript di base (W5-W8, lezioni 41-80)

Pagine che si adattano a ogni schermo e primi programmi in JavaScript.

#### W5 · CSS: il layout

Flusso della pagina, flexbox, posizionamento e centrare le cose senza trucchi. Cintura: gialla.

1. `W.05.001` Il flusso normale: elementi block e inline
2. `W.05.002` Display, larghezze e altezze
3. `W.05.003` Flexbox: l'idea di asse principale
4. `W.05.004` Flexbox: allineare e distribuire
5. `W.05.005` Flexbox: andare a capo e dimensioni flessibili
6. `W.05.006` Posizionamento: relative, absolute, fixed e sticky
7. `W.05.007` Sovrapporre elementi con z-index
8. `W.05.008` Overflow, scorrimento e testo troppo lungo
9. `W.05.009` Centrare un elemento: i casi che servono davvero
10. `W.05.010` Progetto: la barra di navigazione di un sito

#### W6 · CSS: grid e responsive

Griglie, media query, immagini fluide, mobile first, variabili e animazioni semplici. Cintura: gialla.

1. `W.06.001` CSS Grid: righe, colonne e gap
2. `W.06.002` Grid: aree con nome e posizionamento
3. `W.06.003` Grid o flexbox: come scegliere
4. `W.06.004` Media query e punti di rottura
5. `W.06.005` Mobile first: partire dal telefono
6. `W.06.006` Immagini e video che si adattano
7. `W.06.007` Variabili CSS e temi chiari e scuri
8. `W.06.008` Transizioni e animazioni semplici
9. `W.06.009` Un po' di ordine: nomi di classi e file CSS
10. `W.06.010` Progetto: un sito che funziona da telefono e da PC

#### W7 · JavaScript: i primi passi

Variabili, tipi, operatori, condizioni e cicli: ragionare in codice. Cintura: gialla.
**Rimando:** La logica della programmazione è anche nel corso Programmazione generale (P): qui si applica a JavaScript.

1. `W.07.001` Che cos'è JavaScript e dove si esegue
2. `W.07.002` La console e il primo console.log
3. `W.07.003` Variabili con let e const
4. `W.07.004` Numeri, testo e booleani
5. `W.07.005` Operatori e conversioni di tipo
6. `W.07.006` Il confronto: == e ===
7. `W.07.007` Condizioni: if, else e switch
8. `W.07.008` I cicli: for e while
9. `W.07.009` Leggere e correggere un messaggio di errore
10. `W.07.010` Esercizi guidati: indovina il numero

#### W8 · JavaScript: funzioni e dati

Funzioni, array, oggetti, metodi utili e un modo ordinato di scrivere il codice. Cintura: gialla.

1. `W.08.001` Funzioni: parametri e valore restituito
2. `W.08.002` Funzioni freccia
3. `W.08.003` Lo scope: dove vive una variabile
4. `W.08.004` Gli array: creare e leggere
5. `W.08.005` Cicli su array: for...of e forEach
6. `W.08.006` Map, filter e reduce
7. `W.08.007` Gli oggetti: proprietà e metodi
8. `W.08.008` Array di oggetti: i dati veri sono fatti così
9. `W.08.009` Destrutturazione, spread e template string
10. `W.08.010` Progetto: la lista della spesa in codice

### Blocco 3 · JavaScript nel browser (W9-W12, lezioni 81-120)

Far muovere la pagina: DOM, eventi, dati dal web e strumenti professionali.

#### W9 · Il DOM e gli eventi

Leggere e cambiare la pagina da JavaScript, rispondere ai clic e alla tastiera. Cintura: arancione.

1. `W.09.001` Il DOM: la pagina come albero
2. `W.09.002` Trovare elementi: querySelector
3. `W.09.003` Cambiare testo e attributi
4. `W.09.004` Cambiare classi e stili
5. `W.09.005` Creare e togliere elementi
6. `W.09.006` Eventi: click, input e tastiera
7. `W.09.007` Il listener di eventi e l'oggetto evento
8. `W.09.008` La propagazione degli eventi
9. `W.09.009` Delegare gli eventi a un contenitore
10. `W.09.010` Progetto: una lista di cose da fare

#### W10 · Form e dati nel browser

Leggere i form, validare, salvare nel browser e proteggere da input pericolosi. Cintura: arancione.
**Rimando:** XSS e altri attacchi web in profondità: Cybersecurity C4.

1. `W.10.001` Leggere i valori di un form
2. `W.10.002` L'evento submit e preventDefault
3. `W.10.003` Validare i dati: regole e messaggi chiari
4. `W.10.004` Espressioni regolari essenziali
5. `W.10.005` localStorage e sessionStorage
6. `W.10.006` I cookie: cosa sono e a cosa servono
7. `W.10.007` Mai fidarsi dell'input: perché innerHTML è rischioso
8. `W.10.008` textContent e la scrittura sicura nella pagina
9. `W.10.009` Drag and drop e file scelti dall'utente
10. `W.10.010` Progetto: un modulo di iscrizione che salva i dati

#### W11 · JavaScript moderno e asincrono

Moduli, tempo, promesse, fetch e JSON: parlare con altri server dal browser. Cintura: arancione.

1. `W.11.001` Moduli ES: import ed export
2. `W.11.002` Timer: setTimeout e setInterval
3. `W.11.003` Perché serve la programmazione asincrona
4. `W.11.004` Le promesse
5. `W.11.005` Async e await
6. `W.11.006` Gestire gli errori con try e catch
7. `W.11.007` JSON: il formato dei dati sul web
8. `W.11.008` fetch: chiedere dati a un'API
9. `W.11.009` Stati di caricamento ed errore nell'interfaccia
10. `W.11.010` Progetto: la pagina del meteo con dati da un'API pubblica

#### W12 · Strumenti dello sviluppatore

Debug, npm, Vite, controlli automatici e primo contatto con TypeScript. Cintura: arancione.
**Rimando:** Git e il lavoro in squadra sono nel corso Programmazione generale (P), blocco Git.

1. `W.12.001` Il debugger del browser: punti di interruzione
2. `W.12.002` La scheda Rete: vedere le richieste
3. `W.12.003` Node.js e npm: cos'è un pacchetto
4. `W.12.004` package.json e le dipendenze
5. `W.12.005` Vite: un progetto che si ricarica da solo
6. `W.12.006` Lint e formattazione automatica
7. `W.12.007` Scrivere un primo test con Vitest
8. `W.12.008` TypeScript: perché esiste
9. `W.12.009` Tipi base in TypeScript
10. `W.12.010` Progetto: il tuo modello di partenza per i prossimi progetti

### Blocco 4 · React e il frontend moderno (W13-W16, lezioni 121-160)

Costruire interfacce con componenti, stato e dati, come si fa nei progetti veri.

#### W13 · React: i componenti

JSX, componenti, props, liste e rendering condizionale. Cintura: verde.

1. `W.13.001` Perché React e che problema risolve
2. `W.13.002` Il primo componente
3. `W.13.003` JSX: HTML dentro JavaScript
4. `W.13.004` Props: passare dati a un componente
5. `W.13.005` Comporre componenti: l'albero dell'interfaccia
6. `W.13.006` Liste e la proprietà key
7. `W.13.007` Mostrare o nascondere: rendering condizionale
8. `W.13.008` Stili in React: classi e CSS
9. `W.13.009` Componenti puri e dati che scorrono dall'alto
10. `W.13.010` Progetto: una scheda prodotto riutilizzabile

#### W14 · React: stato ed effetti

useState, eventi, useEffect, dati dal server e come evitare i bug tipici. Cintura: verde.

1. `W.14.001` Lo stato: la memoria di un componente
2. `W.14.002` useState passo per passo
3. `W.14.003` Gestire gli eventi in React
4. `W.14.004` Stato di oggetti e array: non si modifica, si sostituisce
5. `W.14.005` Alzare lo stato: condividerlo tra componenti
6. `W.14.006` Form controllati
7. `W.14.007` useEffect: fare cose dopo il disegno
8. `W.14.008` Caricare dati da un'API in un componente
9. `W.14.009` Gli errori classici: cicli infiniti e dati vecchi
10. `W.14.010` Progetto: un elenco filtrabile con dati dal web

#### W15 · React: un'applicazione intera

Più pagine, stato condiviso, hook personalizzati e Next.js in sintesi. Cintura: verde.

1. `W.15.001` Più pagine in una app: il routing
2. `W.15.002` Parametri nell'indirizzo e pagine dinamiche
3. `W.15.003` Il contesto: dati condivisi senza passarli a mano
4. `W.15.004` useReducer: stato complicato con ordine
5. `W.15.005` Hook personalizzati
6. `W.15.006` Gestire caricamento, errore e dati vuoti
7. `W.15.007` Cache dei dati e librerie come TanStack Query
8. `W.15.008` Next.js: pagine, layout e componenti server
9. `W.15.009` Quando conviene un framework e quando no
10. `W.15.010` Progetto: una piccola applicazione a più pagine

#### W16 · Frontend di qualità

TypeScript in React, accessibilità, prestazioni, test e design system. Cintura: verde.

1. `W.16.001` TypeScript con React: props e stato tipizzati
2. `W.16.002` Tipi utili: union, interfacce e generici
3. `W.16.003` Accessibilità: tastiera, ruoli e contrasto
4. `W.16.004` Prestazioni: cosa rallenta una pagina
5. `W.16.005` Immagini, font e caricamento pigro
6. `W.16.006` Misurare con Lighthouse e i Core Web Vitals
7. `W.16.007` Testare i componenti
8. `W.16.008` Test del comportamento dell'utente
9. `W.16.009` Organizzare cartelle, nomi e componenti condivisi
10. `W.16.010` Progetto: migliora e misura un'app esistente

### Blocco 5 · Backend, API e messa online (W17-W20, lezioni 161-200)

Il lato server: costruire un'API, salvare dati, proteggere gli accessi e pubblicare.

#### W17 · Node.js e il server

Node.js, moduli, file, un server HTTP e il framework Express. Cintura: blu.

1. `W.17.001` Che cos'è Node.js e come si usa
2. `W.17.002` Moduli, file e percorsi in Node
3. `W.17.003` Leggere e scrivere file
4. `W.17.004` Variabili d'ambiente e configurazione
5. `W.17.005` Un server HTTP minimo
6. `W.17.006` Richieste, risposte, codici di stato e intestazioni
7. `W.17.007` Express: rotte e gestori
8. `W.17.008` Middleware: i passaggi di una richiesta
9. `W.17.009` Servire file statici e pagine
10. `W.17.010` Progetto: un piccolo server che risponde in JSON

#### W18 · API REST e database

Progettare un'API, collegarla a un database, validare i dati e documentarla. Cintura: blu.
**Rimando:** SQL a fondo è nel corso Analista di dati (D) e nel corso Database e dati a grande scala (B).

1. `W.18.001` Che cos'è un'API e cosa significa REST
2. `W.18.002` Risorse, indirizzi e verbi: GET, POST, PUT, DELETE
3. `W.18.003` Codici di stato: scegliere quello giusto
4. `W.18.004` Un'API con CRUD completo in memoria
5. `W.18.005` Collegare un database SQL
6. `W.18.006` Query sicure con parametri
7. `W.18.007` Validare i dati in ingresso con uno schema
8. `W.18.008` Errori, log e messaggi per chi usa l'API
9. `W.18.009` Documentare l'API: OpenAPI in sintesi
10. `W.18.010` Progetto: l'API di un'agenda di appuntamenti

#### W19 · Accessi e sicurezza

Registrazione e accesso, sessioni, token, permessi e le difese essenziali del backend. Cintura: blu.
**Rimando:** Le vulnerabilità web e il loro sfruttamento in laboratorio sono in Cybersecurity C4: qui si impara a costruire in modo sicuro.

1. `W.19.001` Autenticazione e autorizzazione: due cose diverse
2. `W.19.002` Salvare le password: hash, sale e algoritmi adatti
3. `W.19.003` Registrazione e accesso passo per passo
4. `W.19.004` Sessioni e cookie sicuri
5. `W.19.005` Token e JWT: quando servono e quali rischi hanno
6. `W.19.006` Accesso con provider esterni (OAuth) in sintesi
7. `W.19.007` Permessi e ruoli: chi può fare cosa
8. `W.19.008` CORS, CSRF e intestazioni di sicurezza
9. `W.19.009` Segreti e chiavi: mai nel codice
10. `W.19.010` Lista di controllo di sicurezza di un'API

#### W20 · Pubblicare e progetto finale

Test del backend, hosting, dominio, monitoraggio e un progetto completo front e back. Cintura: blu.
**Rimando:** Container, CI/CD e cloud a fondo: corso Cloud e DevOps (L).

1. `W.20.001` Testare un'API
2. `W.20.002` Variabili d'ambiente in produzione
3. `W.20.003` Dove si pubblica un sito: hosting statico e server
4. `W.20.004` Pubblicare il frontend
5. `W.20.005` Pubblicare il backend
6. `W.20.006` Dominio, DNS e HTTPS
7. `W.20.007` Log, errori e monitoraggio di base
8. `W.20.008` Costi, limiti e come non avere sorprese
9. `W.20.009` Progetto finale: progettazione e dati
10. `W.20.010` Progetto finale: realizzazione, messa online e relazione

## P · Programmazione generale

Il mestiere di programmare, a prescindere dal linguaggio: logica, algoritmi, strutture dati, Git e lavoro in squadra, progettazione del software. Gli esempi sono in Python, ma le idee valgono ovunque.

- **Per chi:** Per chi vuole imparare a pensare come un programmatore, dal primo ciclo ai grandi progetti.
- **Consigliato:** Nessun prerequisito. Il modulo Python di Fondamenta (F9) è un buon ripasso, ma non serve per partire.
- **Cartella e `course:`:** `programmazione` · **Domande:** `src/lib/practice/banks-nuovi/pNN.ts`

### Blocco 1 · Pensare come un programmatore (P1-P4, lezioni 1-40)

Logica, scomposizione dei problemi e primi programmi in Python.

#### P1 · Pensiero logico

Problemi, algoritmi, pseudocodice, diagrammi di flusso e logica booleana. Cintura: bianca.

1. `P.01.001` Che cos'è un programma e che cos'è un algoritmo
2. `P.01.002` Scomporre un problema in pezzi piccoli
3. `P.01.003` Istruzioni in sequenza: la ricetta e l'ordine
4. `P.01.004` Pseudocodice: scrivere un algoritmo a parole
5. `P.01.005` Diagrammi di flusso
6. `P.01.006` Vero e falso: la logica booleana
7. `P.01.007` AND, OR e NOT con le tabelle di verità
8. `P.01.008` Condizioni a più strade
9. `P.01.009` Ripetere: l'idea di ciclo
10. `P.01.010` Mettere alla prova un algoritmo a mano (traccia di esecuzione)

#### P2 · Primi programmi in Python

Variabili, tipi, input e output, condizioni e cicli, con Python come linguaggio di esempio. Cintura: bianca.
**Rimando:** Il corso Fondamenta ha un modulo Python (F9): chi l'ha fatto può scorrere veloce questo modulo.

1. `P.02.001` Installare Python e scrivere print
2. `P.02.002` Variabili e nomi che si capiscono
3. `P.02.003` Numeri, testo e booleani
4. `P.02.004` Chiedere un dato all'utente: input
5. `P.02.005` Operazioni e precedenza
6. `P.02.006` Condizioni con if, elif ed else
7. `P.02.007` Il ciclo while
8. `P.02.008` Il ciclo for e range
9. `P.02.009` Cicli dentro cicli
10. `P.02.010` Esercizi guidati: tabelline e indovina il numero

#### P3 · Funzioni e organizzazione

Funzioni, parametri, scope, moduli e un codice leggibile. Cintura: bianca.

1. `P.03.001` Perché esistono le funzioni
2. `P.03.002` Definire e chiamare una funzione
3. `P.03.003` Parametri e valore restituito
4. `P.03.004` Valori predefiniti e parametri con nome
5. `P.03.005` Variabili locali e globali
6. `P.03.006` Funzioni che ne chiamano altre
7. `P.03.007` Spezzare un programma in funzioni
8. `P.03.008` Moduli: importare codice altrui
9. `P.03.009` Nomi, commenti e docstring
10. `P.03.010` Esercizi: un convertitore di unità fatto bene

#### P4 · Errori, file e dati semplici

Leggere gli errori, il debug, le eccezioni, leggere e scrivere file, CSV e JSON. Cintura: bianca.

1. `P.04.001` Tipi di errore: di sintassi, a runtime e di logica
2. `P.04.002` Leggere un traceback
3. `P.04.003` Il debug con le stampe e con il debugger
4. `P.04.004` Le eccezioni: try ed except
5. `P.04.005` Sollevare errori: raise
6. `P.04.006` Leggere e scrivere file di testo
7. `P.04.007` Il formato CSV
8. `P.04.008` Il formato JSON
9. `P.04.009` Percorsi di file e cartelle
10. `P.04.010` Progetto: un registro delle spese su file

### Blocco 2 · Algoritmi (P5-P8, lezioni 41-80)

Come si risolvono i problemi in modo efficiente: cercare, ordinare, misurare e ricorrere.

#### P5 · Cercare e ordinare

Ricerca lineare e binaria, ordinamenti semplici e veloci, stabilità. Cintura: gialla.

1. `P.05.001` Cercare in un elenco: la ricerca lineare
2. `P.05.002` La ricerca binaria
3. `P.05.003` Perché serve l'ordine
4. `P.05.004` Ordinare con il bubble sort
5. `P.05.005` Ordinare con il selection sort
6. `P.05.006` Ordinare con l'insertion sort
7. `P.05.007` Merge sort: dividere e fondere
8. `P.05.008` Quick sort: il perno
9. `P.05.009` Ordinamento stabile e ordinare per più criteri
10. `P.05.010` Gli ordinamenti dei linguaggi veri: sorted e sort

#### P6 · Complessità

Misurare l'efficienza di un algoritmo: tempo, memoria e notazione O grande. Cintura: gialla.

1. `P.06.001` Perché un programma può essere lento
2. `P.06.002` Contare i passi di un algoritmo
3. `P.06.003` La notazione O grande
4. `P.06.004` Tempo costante e lineare
5. `P.06.005` Tempo logaritmico: dimezzare ogni volta
6. `P.06.006` Tempo quadratico: i cicli annidati
7. `P.06.007` Esponenziale e fattoriale: quando esplode
8. `P.06.008` Complessità in memoria
9. `P.06.009` Misurare il tempo con il cronometro del codice
10. `P.06.010` Confrontare due soluzioni allo stesso problema

#### P7 · Ricorsione

Funzioni che richiamano sé stesse, caso base, pila delle chiamate e quando evitarla. Cintura: gialla.

1. `P.07.001` Un problema che contiene un problema più piccolo
2. `P.07.002` Il caso base e il passo ricorsivo
3. `P.07.003` Il fattoriale
4. `P.07.004` La sequenza di Fibonacci
5. `P.07.005` La pila delle chiamate
6. `P.07.006` Ricorsione infinita e limite di profondità
7. `P.07.007` Ricorsione su liste e testo
8. `P.07.008` Torri di Hanoi
9. `P.07.009` Ricorsione contro iterazione
10. `P.07.010` Esercizi: potenze, somma delle cifre e palindromi

#### P8 · Tecniche di progettazione

Forza bruta, avido, dividi e conquista, backtracking e programmazione dinamica. Cintura: gialla.

1. `P.08.001` La forza bruta: provare tutto
2. `P.08.002` Gli algoritmi avidi: il resto con le monete
3. `P.08.003` Dividi e conquista
4. `P.08.004` Il backtracking: tornare indietro
5. `P.08.005` Le otto regine
6. `P.08.006` Il problema dello zaino
7. `P.08.007` Programmazione dinamica: ricordare i risultati
8. `P.08.008` Memoizzazione
9. `P.08.009` La sottosequenza comune più lunga
10. `P.08.010` Scegliere la tecnica giusta

### Blocco 3 · Strutture dati (P9-P12, lezioni 81-120)

Come si organizzano i dati in memoria: liste, hash, alberi e grafi.

#### P9 · Liste, pile e code

Array, liste concatenate, pile, code e quando usare quale. Cintura: arancione.

1. `P.09.001` Che cos'è una struttura dati
2. `P.09.002` L'array e la memoria
3. `P.09.003` Le liste di Python da vicino
4. `P.09.004` Le liste concatenate
5. `P.09.005` Inserire e togliere: i costi a confronto
6. `P.09.006` La pila (stack)
7. `P.09.007` La coda (queue)
8. `P.09.008` La coda a doppia entrata
9. `P.09.009` Code con priorità
10. `P.09.010` Esercizi: parentesi bilanciate e coda di stampa

#### P10 · Hash, dizionari e insiemi

Tabelle hash, dizionari, insiemi, collisioni e conteggi. Cintura: arancione.

1. `P.10.001` Cercare in un attimo: l'idea della tabella hash
2. `P.10.002` Funzioni hash e indici
3. `P.10.003` Le collisioni e come si gestiscono
4. `P.10.004` I dizionari in Python
5. `P.10.005` Contare le frequenze con un dizionario
6. `P.10.006` Gli insiemi (set)
7. `P.10.007` Unione, intersezione e differenza
8. `P.10.008` Che cosa può fare da chiave e cosa no
9. `P.10.009` Hash e sicurezza: stessa parola, scopi diversi
10. `P.10.010` Esercizi: anagrammi e duplicati

#### P11 · Alberi

Alberi, alberi binari di ricerca, visite, heap e alberi di decisione. Cintura: arancione.

1. `P.11.001` Dati con una gerarchia: gli alberi
2. `P.11.002` Radice, nodi, foglie e altezza
3. `P.11.003` Alberi binari
4. `P.11.004` Le visite: in ordine, prima e dopo
5. `P.11.005` L'albero binario di ricerca
6. `P.11.006` Inserire e cercare in un albero di ricerca
7. `P.11.007` Alberi sbilanciati e alberi bilanciati
8. `P.11.008` L'heap e la coda con priorità
9. `P.11.009` Alberi nella vita reale: cartelle, DOM e decisioni
10. `P.11.010` Esercizi: profondità e somma dei nodi

#### P12 · Grafi

Grafi, rappresentazione, visite in ampiezza e profondità, cammini minimi. Cintura: arancione.

1. `P.12.001` Reti di cose collegate: i grafi
2. `P.12.002` Nodi, archi, pesi e direzione
3. `P.12.003` Matrice e liste di adiacenza
4. `P.12.004` La visita in ampiezza
5. `P.12.005` La visita in profondità
6. `P.12.006` Trovare il percorso più corto (senza pesi)
7. `P.12.007` Percorsi con pesi: Dijkstra
8. `P.12.008` Cicli e componenti connesse
9. `P.12.009` Ordine topologico: dipendenze tra compiti
10. `P.12.010` Esercizi: labirinti e mappe

### Blocco 4 · Git, strumenti e qualità (P13-P16, lezioni 121-160)

Gli strumenti del mestiere: versioni, lavoro in squadra, test e codice pulito.

#### P13 · Git: le basi

Repository, commit, storia, annullare e ignorare file. Cintura: verde.

1. `P.13.001` Perché serve il controllo di versione
2. `P.13.002` Installare Git e configurarlo
3. `P.13.003` Il primo repository
4. `P.13.004` Preparare e salvare: add e commit
5. `P.13.005` Vedere la storia: log e diff
6. `P.13.006` Messaggi di commit che aiutano
7. `P.13.007` Annullare: restore, reset e revert
8. `P.13.008` Il file .gitignore
9. `P.13.009` Segreti nel repository: cosa non va mai salvato
10. `P.13.010` Esercizi: il tuo progetto sotto Git

#### P14 · Git in squadra

Rami, fusioni, conflitti, repository remoti, GitHub e pull request. Cintura: verde.

1. `P.14.001` I rami (branch): lavorare senza rompere tutto
2. `P.14.002` Unire i rami: il merge
3. `P.14.003` Risolvere un conflitto
4. `P.14.004` Repository remoti: clone, push e pull
5. `P.14.005` GitHub: un account e il primo repository remoto
6. `P.14.006` Le pull request
7. `P.14.007` Fare una revisione del codice (code review)
8. `P.14.008` Fork e contributi a progetti altrui
9. `P.14.009` Rebase in sintesi e quando usarlo
10. `P.14.010` Flussi di lavoro di squadra: come ci si organizza

#### P15 · Test e qualità del codice

Test automatici, TDD, refactoring, analisi statica e codice leggibile. Cintura: verde.

1. `P.15.001` Perché testare il codice
2. `P.15.002` Il primo test automatico
3. `P.15.003` Cosa testare: casi normali, limite ed errori
4. `P.15.004` Sviluppo guidato dai test (TDD)
5. `P.15.005` Test e dati finti: i mock in sintesi
6. `P.15.006` Copertura dei test: cosa dice e cosa no
7. `P.15.007` Il refactoring: cambiare il codice senza cambiare il risultato
8. `P.15.008` Odori del codice e codice duplicato
9. `P.15.009` Analisi statica e formattazione automatica
10. `P.15.010` Esercizi: ripulire un programma disordinato

#### P16 · Ambiente di lavoro

Terminale, ambienti virtuali, pacchetti, documentazione e lettura del codice altrui. Cintura: verde.
**Rimando:** Il terminale Linux si impara in Fondamenta (F2-F4): qui si usa per lavorare.

1. `P.16.001` Il terminale come strumento di lavoro
2. `P.16.002` Un editor serio: scorciatoie e estensioni
3. `P.16.003` Ambienti virtuali e dipendenze
4. `P.16.004` Installare e aggiornare pacchetti
5. `P.16.005` Versioni e compatibilità: il versionamento semantico
6. `P.16.006` Leggere la documentazione ufficiale
7. `P.16.007` Cercare l'errore: come si chiede aiuto bene
8. `P.16.008` Leggere il codice scritto da altri
9. `P.16.009` Documentare un progetto: README e commenti
10. `P.16.010` Esercizi: preparare un progetto che un altro possa avviare

### Blocco 5 · Progettare il software (P17-P20, lezioni 161-200)

Oggetti, paradigmi, pattern e architettura, fino a un progetto completo.

#### P17 · Programmazione a oggetti

Classi, oggetti, ereditarietà, incapsulamento e polimorfismo. Cintura: blu.

1. `P.17.001` Perché servono gli oggetti
2. `P.17.002` Classi e oggetti
3. `P.17.003` Attributi e metodi
4. `P.17.004` Il costruttore e lo stato dell'oggetto
5. `P.17.005` Incapsulamento: nascondere i dettagli
6. `P.17.006` Ereditarietà
7. `P.17.007` Polimorfismo
8. `P.17.008` Composizione contro ereditarietà
9. `P.17.009` Metodi speciali: stampare, confrontare, sommare
10. `P.17.010` Esercizi: un piccolo gioco a oggetti

#### P18 · Paradigmi e linguaggi

Imperativo, a oggetti, funzionale, tipi statici e dinamici, confronto tra linguaggi. Cintura: blu.

1. `P.18.001` Che cos'è un paradigma di programmazione
2. `P.18.002` Imperativo e dichiarativo
3. `P.18.003` Programmazione funzionale: funzioni pure
4. `P.18.004` Funzioni come valori: map, filter e reduce
5. `P.18.005` Immutabilità e dati che non cambiano
6. `P.18.006` Tipi statici e tipi dinamici
7. `P.18.007` Linguaggi compilati e interpretati
8. `P.18.008` Come è fatto un programma in C, Java, Rust e Go
9. `P.18.009` Gestione della memoria: pila, heap e garbage collector
10. `P.18.010` Come scegliere un linguaggio per un progetto

#### P19 · Progettazione e architettura

Principi SOLID, design pattern, moduli, interfacce e concorrenza di base. Cintura: blu.

1. `P.19.001` Che cos'è un buon progetto
2. `P.19.002` Un compito, una responsabilità
3. `P.19.003` I principi SOLID in parole semplici
4. `P.19.004` Interfacce e dipendenze
5. `P.19.005` I design pattern: a cosa servono
6. `P.19.006` Pattern Factory, Strategy e Observer
7. `P.19.007` Architettura a livelli
8. `P.19.008` Separare dati, logica e interfaccia
9. `P.19.009` Concorrenza: fare più cose insieme
10. `P.19.010` Race condition e blocchi: i guai della concorrenza

#### P20 · Progetto finale e mestiere

Un progetto completo dall'idea alla consegna e come si lavora e si cresce nel mestiere. Cintura: blu.

1. `P.20.001` Dall'idea ai requisiti
2. `P.20.002` Stimare il lavoro e dividerlo
3. `P.20.003` Progettare i dati e le funzioni
4. `P.20.004` Costruire la prima versione
5. `P.20.005` Testare e correggere
6. `P.20.006` Rifinire e documentare
7. `P.20.007` Consegnare e presentare il progetto
8. `P.20.008` Metodi di lavoro: Agile e Scrum in sintesi
9. `P.20.009` Il mestiere: ruoli, portfolio e colloqui
10. `P.20.010` Come continuare a imparare

## A · App per telefono

Come nasce un'app: idea, schermate, codice, dati, sensori del telefono, sicurezza e pubblicazione. Si costruisce con strumenti gratuiti (app installabili dal web e React Native con Expo) e si guardano anche le strade native e Flutter.

- **Per chi:** Per chi vuole creare app per Android e iPhone, anche senza esperienza.
- **Consigliato:** Aiuta aver fatto i blocchi 1-2 di Sviluppo web (W) o il blocco 1 di Programmazione generale (P): le app usano JavaScript.
- **Cartella e `course:`:** `app-telefono` · **Domande:** `src/lib/practice/banks-nuovi/aNN.ts`

### Blocco 1 · Il mondo delle app (A1-A4, lezioni 1-40)

Come funziona un'app, come si progetta e le prime app installabili.

#### A1 · Come funziona un'app

Sistemi operativi mobili, store, permessi, tipi di app e come si costruiscono. Cintura: bianca.

1. `A.01.001` Che cos'è un'app e che cosa c'è dentro
2. `A.01.002` Android e iOS: due mondi
3. `A.01.003` Gli store: come arrivano le app sul telefono
4. `A.01.004` I permessi: cosa può fare un'app e chi decide
5. `A.01.005` App native, web app e app ibride
6. `A.01.006` Come funziona il ciclo di vita di un'app
7. `A.01.007` Gli strumenti: telefono vero ed emulatore
8. `A.01.008` Che cosa costa fare un'app (tempo, strumenti, store)
9. `A.01.009` Un'app che conosci, smontata in pezzi
10. `A.01.010` Scegliere la strada giusta per il tuo progetto

#### A2 · Progettare un'app

Idea, utenti, schermate, flussi, bozze su carta e regole di design per il telefono. Cintura: bianca.

1. `A.02.001` Da un problema a un'idea di app
2. `A.02.002` A chi serve: gli utenti e i loro bisogni
3. `A.02.003` Le funzioni minime: la prima versione
4. `A.02.004` Disegnare le schermate su carta
5. `A.02.005` Il percorso dell'utente da una schermata all'altra
6. `A.02.006` Pollice e schermo piccolo: progettare per il tocco
7. `A.02.007` Regole di design: spazi, testi e colori leggibili
8. `A.02.008` Pulsanti, liste e menu che tutti capiscono
9. `A.02.009` Prototipo cliccabile con uno strumento gratuito
10. `A.02.010` Provare la bozza con una persona vera

#### A3 · App installabili dal web

Web app progressive: manifest, service worker, icone, offline e installazione. Cintura: bianca.
**Rimando:** HTML, CSS e JavaScript di base sono in Sviluppo web (W1-W8).

1. `A.03.001` Che cos'è una web app progressiva (PWA)
2. `A.03.002` Il manifest: nome, icone e colori
3. `A.03.003` Le icone nelle varie dimensioni
4. `A.03.004` Il service worker: un aiutante che sta dietro
5. `A.03.005` Salvare i file per usarla offline
6. `A.03.006` Una pagina di cortesia quando manca internet
7. `A.03.007` Il pulsante «Installa»
8. `A.03.008` Notifiche push in sintesi
9. `A.03.009` Cosa può e cosa non può fare una PWA
10. `A.03.010` Progetto: trasforma una pagina web in un'app installabile

#### A4 · Primi passi con Expo

React Native, Expo, un'app che gira sul telefono e il ciclo di lavoro. Cintura: bianca.

1. `A.04.001` React Native: scrivere app con JavaScript
2. `A.04.002` Che cos'è Expo e perché semplifica
3. `A.04.003` Creare il primo progetto
4. `A.04.004` Provare l'app sul telefono con Expo Go
5. `A.04.005` Come è fatta la cartella del progetto
6. `A.04.006` Il primo schermo: Text e View
7. `A.04.007` Il ricaricamento istantaneo e gli errori sullo schermo
8. `A.04.008` Leggere i messaggi del terminale
9. `A.04.009` Pubblicare il codice su Git
10. `A.04.010` Progetto: «Ciao» personalizzato con il tuo nome

### Blocco 2 · Costruire le schermate (A5-A8, lezioni 41-80)

Componenti, stile, navigazione e moduli di inserimento.

#### A5 · I componenti base

View, Text, Image, ScrollView, FlatList, Pressable e come si combinano. Cintura: gialla.

1. `A.05.001` I componenti: i mattoni dell'app
2. `A.05.002` View e Text
3. `A.05.003` Immagini locali e dal web
4. `A.05.004` I pulsanti: Pressable e Button
5. `A.05.005` Le props: personalizzare un componente
6. `A.05.006` ScrollView: far scorrere lo schermo
7. `A.05.007` FlatList: le liste lunghe fatte bene
8. `A.05.008` Componenti scritti da te e riutilizzati
9. `A.05.009` Gestire il tocco e il feedback
10. `A.05.010` Progetto: un elenco di contatti

#### A6 · Stile e layout

StyleSheet, flexbox, dimensioni, schermi diversi, temi chiaro e scuro. Cintura: gialla.
**Rimando:** Il flexbox è spiegato anche in Sviluppo web (W5): qui la versione per React Native.

1. `A.06.001` StyleSheet: come si dà stile in React Native
2. `A.06.002` Flexbox sul telefono: l'asse principale
3. `A.06.003` Allineare e distribuire
4. `A.06.004` Dimensioni, margini e spazi
5. `A.06.005` Schermi piccoli e grandi: adattarsi
6. `A.06.006` Orientamento verticale e orizzontale
7. `A.06.007` Aree sicure: tacca e barre di sistema
8. `A.06.008` Colori, caratteri e coerenza grafica
9. `A.06.009` Tema chiaro e tema scuro
10. `A.06.010` Progetto: la schermata di profilo curata

#### A7 · Navigazione

Più schermate, pila, schede, parametri e struttura di navigazione di un'app. Cintura: gialla.

1. `A.07.001` Un'app ha più schermate: come si passa dall'una all'altra
2. `A.07.002` Expo Router e le pagine come file
3. `A.07.003` La navigazione a pila
4. `A.07.004` Le schede in basso (tab)
5. `A.07.005` Passare parametri tra schermate
6. `A.07.006` Il pulsante indietro e i gesti
7. `A.07.007` Menu laterale e finestre modali
8. `A.07.008` Collegamenti diretti (deep link)
9. `A.07.009` Schermate protette: chi può entrare
10. `A.07.010` Progetto: un'app a tre schermate

#### A8 · Input e moduli

Campi di testo, tastiera, validazione, selettori e invio dei dati. Cintura: gialla.

1. `A.08.001` TextInput: ricevere testo
2. `A.08.002` La tastiera giusta per ogni campo
3. `A.08.003` Quando la tastiera copre il campo
4. `A.08.004` Validare i dati e mostrare errori chiari
5. `A.08.005` Interruttori, selettori e date
6. `A.08.006` Form con più campi
7. `A.08.007` Disabilitare il pulsante finché i dati non sono validi
8. `A.08.008` Messaggi di conferma e di errore
9. `A.08.009` Gestire il tocco doppio e gli invii ripetuti
10. `A.08.010` Progetto: il modulo di registrazione di un'app

### Blocco 3 · Dati e funzioni del telefono (A9-A12, lezioni 81-120)

Stato, memoria del telefono, dati dal web e sensori.

#### A9 · Stato e dati

useState, effetti, dati che cambiano nel tempo e liste dinamiche. Cintura: arancione.
**Rimando:** Gli hook di React (useState, useEffect) sono spiegati in Sviluppo web (W14).

1. `A.09.001` Lo stato di un'app
2. `A.09.002` useState nelle app
3. `A.09.003` Aggiungere e togliere elementi da una lista
4. `A.09.004` Modificare un elemento in una lista
5. `A.09.005` useEffect: azioni al caricamento
6. `A.09.006` Pulire dopo di sé: timer e ascoltatori
7. `A.09.007` Lo stato condiviso tra schermate
8. `A.09.008` Il contesto per i dati comuni
9. `A.09.009` Un piccolo archivio di stato (Zustand)
10. `A.09.010` Progetto: un'app di cose da fare

#### A10 · Salvare i dati sul telefono

Archiviazione locale, file, database sul dispositivo e archivio sicuro per i segreti. Cintura: arancione.

1. `A.10.001` Dove finiscono i dati quando chiudi l'app
2. `A.10.002` AsyncStorage per piccole preferenze
3. `A.10.003` Salvare e rileggere un elenco
4. `A.10.004` Il database SQLite sul telefono
5. `A.10.005` Creare tabelle e inserire righe
6. `A.10.006` Leggere e filtrare i dati
7. `A.10.007` File e cartelle dell'app
8. `A.10.008` L'archivio sicuro per chiavi e token
9. `A.10.009` Cosa succede se l'utente cancella l'app
10. `A.10.010` Progetto: un diario che resta sul telefono

#### A11 · Dati dal web e dal server

fetch, API, JSON, caricamento, errori, aggiornare per trascinamento e connessione assente. Cintura: arancione.

1. `A.11.001` Un'app che parla con un server
2. `A.11.002` fetch e JSON
3. `A.11.003` Mostrare un elenco preso da un'API
4. `A.11.004` Stati di caricamento, errore e vuoto
5. `A.11.005` Aggiornare trascinando verso il basso
6. `A.11.006` Caricare altre voci scorrendo
7. `A.11.007` Inviare dati con POST
8. `A.11.008` Intestazioni e chiavi di accesso
9. `A.11.009` Che fare quando non c'è internet
10. `A.11.010` Progetto: un'app di notizie o di meteo

#### A12 · Sensori e funzioni del dispositivo

Fotocamera, posizione, notifiche, permessi, vibrazione e movimento. Cintura: arancione.

1. `A.12.001` I sensori del telefono: cosa c'è dentro
2. `A.12.002` Chiedere un permesso nel modo giusto
3. `A.12.003` La fotocamera: scattare una foto
4. `A.12.004` La galleria: scegliere una foto
5. `A.12.005` La posizione e la mappa
6. `A.12.006` Notifiche locali
7. `A.12.007` Notifiche push: come funzionano
8. `A.12.008` Vibrazione, suoni e feedback tattile
9. `A.12.009` Accelerometro e giroscopio
10. `A.12.010` Progetto: un'app che usa la fotocamera e la posizione

### Blocco 4 · App fatte bene (A13-A16, lezioni 121-160)

Un'app vera ha utenti, un server, buone prestazioni e rispetta la privacy.

#### A13 · Struttura di un'app che cresce

Organizzare cartelle e codice, TypeScript, gestione degli errori e stato globale ordinato. Cintura: verde.

1. `A.13.001` Quando un'app diventa grande: i problemi
2. `A.13.002` Organizzare cartelle e componenti
3. `A.13.003` TypeScript nelle app
4. `A.13.004` Tipi per i dati del server
5. `A.13.005` Stato globale ordinato
6. `A.13.006` Separare chiamate di rete e interfaccia
7. `A.13.007` Gestire gli errori in un posto solo
8. `A.13.008` Configurazioni e variabili per ambiente
9. `A.13.009` Strumenti di controllo del codice
10. `A.13.010` Progetto: riordinare un'app disordinata

#### A14 · Account e dati nel cloud

Registrazione, accesso, database nel cloud, sincronizzazione e notifiche dal server. Cintura: verde.
**Rimando:** Autenticazione e sicurezza lato server sono in Sviluppo web (W19).

1. `A.14.001` Perché servono gli account
2. `A.14.002` Registrazione e accesso dall'app
3. `A.14.003` Tenere l'accesso tra un avvio e l'altro
4. `A.14.004` Un database nel cloud per l'app
5. `A.14.005` Leggere e scrivere dati dell'utente
6. `A.14.006` Dati che si aggiornano in tempo reale
7. `A.14.007` Immagini e file nel cloud
8. `A.14.008` Sincronizzare dati tra telefono e server
9. `A.14.009` Notifiche push inviate dal server
10. `A.14.010` Progetto: un'app con account e dati personali

#### A15 · Qualità: prestazioni, test, accessibilità

App veloci, testate, accessibili e che funzionano anche senza rete. Cintura: verde.

1. `A.15.001` Cosa rende un'app lenta
2. `A.15.002` Liste e immagini ottimizzate
3. `A.15.003` Misurare le prestazioni
4. `A.15.004` Consumo di batteria e di dati
5. `A.15.005` Funzionare offline: la regola dei dati locali
6. `A.15.006` Testare i componenti
7. `A.15.007` Testare l'app davanti a un utente vero
8. `A.15.008` Accessibilità: lettori di schermo e testo grande
9. `A.15.009` Lingue e formati: tradurre l'app
10. `A.15.010` Progetto: miglioramenti misurati su un'app tua

#### A16 · Sicurezza e privacy nelle app

Permessi minimi, dati personali, protezione delle chiavi, minori e regole degli store. Cintura: verde.
**Rimando:** Il lato attacco delle app mobili è in Hacking etico (E): qui si impara a costruire in modo sicuro.

1. `A.16.001` Le app e i dati personali
2. `A.16.002` Il principio del minimo indispensabile
3. `A.16.003` Permessi: chiedere solo ciò che serve
4. `A.16.004` Chiavi e segreti: mai dentro l'app
5. `A.16.005` Cosa si può leggere da un'app installata
6. `A.16.006` Comunicazioni sicure con HTTPS
7. `A.16.007` Salvare in modo sicuro i dati sensibili
8. `A.16.008` App per ragazzi: regole e cautele
9. `A.16.009` Informativa sulla privacy e GDPR in sintesi
10. `A.16.010` Lista di controllo di sicurezza prima di pubblicare

### Blocco 5 · Pubblicare e andare oltre (A17-A20, lezioni 161-200)

Dalla prova al negozio, le altre strade per fare app e un progetto finale.

#### A17 · Dalla prova al negozio

Build, firma, versioni, test con altri, regole e costi degli store. Cintura: blu.

1. `A.17.001` Che cosa significa pubblicare un'app
2. `A.17.002` Nome, identificativo e versione
3. `A.17.003` Icona e schermata di avvio
4. `A.17.004` Costruire l'app con EAS Build
5. `A.17.005` Firma digitale: perché serve
6. `A.17.006` Distribuire a pochi tester prima del pubblico
7. `A.17.007` Le schede dello store: testi e immagini
8. `A.17.008` Le regole degli store e i motivi di rifiuto
9. `A.17.009` I costi degli account sviluppatore: chi paga cosa
10. `A.17.010` Il primo invio e cosa aspettarsi

#### A18 · Altre strade: nativo e Flutter

Kotlin per Android, Swift per iPhone, Flutter e come scegliere tra le tecnologie. Cintura: blu.

1. `A.18.001` Sviluppo nativo: pro e contro
2. `A.18.002` Kotlin e Android Studio
3. `A.18.003` Un primo sguardo a Jetpack Compose
4. `A.18.004` Swift e Xcode
5. `A.18.005` Un primo sguardo a SwiftUI
6. `A.18.006` Flutter e il linguaggio Dart
7. `A.18.007` Un'app semplice in Flutter
8. `A.18.008` Confronto tra React Native, Flutter e nativo
9. `A.18.009` Strumenti senza codice: cosa fanno e i loro limiti
10. `A.18.010` Come scegliere la tecnologia per un progetto

#### A19 · Dopo la pubblicazione

Aggiornamenti, errori in produzione, statistiche, recensioni e manutenzione. Cintura: blu.

1. `A.19.001` Un'app non è mai finita
2. `A.19.002` Aggiornamenti e compatibilità con i nuovi sistemi
3. `A.19.003` Segnalazione automatica degli errori
4. `A.19.004` Statistiche d'uso e privacy
5. `A.19.005` Capire cosa fanno davvero gli utenti
6. `A.19.006` Leggere e rispondere alle recensioni
7. `A.19.007` Correggere un errore urgente
8. `A.19.008` Funzioni nuove: come scegliere cosa fare
9. `A.19.009` Tenere in ordine il codice nel tempo
10. `A.19.010` Quando e come spegnere un'app

#### A20 · Progetto finale

Un'app completa dall'idea alla consegna, con relazione e prova con utenti reali. Cintura: blu.

1. `A.20.001` Scegliere l'idea e i confini del progetto
2. `A.20.002` Progettare schermate e dati
3. `A.20.003` Costruire la prima schermata
4. `A.20.004` Costruire la navigazione
5. `A.20.005` Salvare e leggere i dati
6. `A.20.006` Aggiungere una funzione del telefono
7. `A.20.007` Rifinire l'aspetto e l'accessibilità
8. `A.20.008` Provare con utenti veri e correggere
9. `A.20.009` Preparare la pubblicazione
10. `A.20.010` Presentare il progetto e la relazione finale

## I · Intelligenza artificiale

Che cos'è davvero l'intelligenza artificiale: come si usa bene, come impara una macchina, reti neurali, modelli di linguaggio e IA generativa, fino a costruire applicazioni e metterle in produzione. Con onestà sui limiti, sui rischi e sulle regole.

- **Per chi:** Per chi vuole capire l'IA e saperla usare e costruire, dai curiosi ai futuri sviluppatori.
- **Consigliato:** Il blocco 1 si segue da zero. Dal blocco 2 serve un po' di Python (Programmazione generale P, blocco 1, o Fondamenta F9).
- **Cartella e `course:`:** `intelligenza-artificiale` · **Domande:** `src/lib/practice/banks-nuovi/iNN.ts`

### Blocco 1 · Capire l'intelligenza artificiale (I1-I4, lezioni 1-40)

Che cosa è, che cosa non è, come usarla bene e quali regole valgono.

#### I1 · Che cos'è l'IA

Storia, parole giuste, tipi di IA, cosa sa fare e cosa no, esempi di ogni giorno. Cintura: bianca.

1. `I.01.001` Intelligenza artificiale: di cosa stiamo parlando
2. `I.01.002` Una breve storia dell'IA
3. `I.01.003` Programmi con regole e programmi che imparano
4. `I.01.004` Apprendimento automatico, reti neurali, IA generativa: le parole giuste
5. `I.01.005` IA stretta e IA generale: cosa esiste davvero
6. `I.01.006` L'IA nelle cose di ogni giorno
7. `I.01.007` Cosa sa fare bene l'IA
8. `I.01.008` Cosa non sa fare (e perché sembra di sì)
9. `I.01.009` Miti e paure: separare i fatti dalle storie
10. `I.01.010` Un'IA in un esperimento: addestra un riconoscitore di immagini senza codice

#### I2 · Usare bene gli assistenti di IA

Come scrivere richieste efficaci, verificare le risposte, errori inventati e uso responsabile. Cintura: bianca.

1. `I.02.001` Che cos'è un assistente di IA e come risponde
2. `I.02.002` Scrivere una buona richiesta (prompt)
3. `I.02.003` Dare un contesto, un ruolo e un formato
4. `I.02.004` Fare domande a più passaggi
5. `I.02.005` Le risposte inventate (allucinazioni)
6. `I.02.006` Come verificare una risposta
7. `I.02.007` Chiedere fonti: cosa funziona e cosa no
8. `I.02.008` IA per studiare senza barare
9. `I.02.009` IA per scrivere, riassumere e tradurre
10. `I.02.010` Regole d'uso: cosa non incollare mai in una chat

#### I3 · I dati: il carburante dell'IA

Da dove vengono i dati, esempi ed etichette, qualità, quantità e pregiudizi. Cintura: bianca.
**Rimando:** Tabelle, pulizia e qualità dei dati sono in Analista di dati (D1, D8).

1. `I.03.001` Perché per l'IA i dati contano più del codice
2. `I.03.002` Dati strutturati e non strutturati
3. `I.03.003` Esempi ed etichette
4. `I.03.004` Dati di addestramento, di validazione e di prova
5. `I.03.005` Quanti dati servono
6. `I.03.006` Dati sporchi, mancanti e sbilanciati
7. `I.03.007` Da dove vengono i dati: raccolti, acquistati, generati
8. `I.03.008` I dati personali e il consenso
9. `I.03.009` Il pregiudizio nei dati (bias): come entra e come si vede
10. `I.03.010` Esercizio: guardare un piccolo insieme di dati e trovare i problemi

#### I4 · IA, società e regole

Lavoro, scuola, informazione, diritto d'autore, AI Act europeo in sintesi, uso responsabile. Cintura: bianca.

1. `I.04.001` IA e lavoro: cosa cambia e cosa no
2. `I.04.002` IA e scuola
3. `I.04.003` Informazione e falsi: immagini, voci e video creati dall'IA
4. `I.04.004` Riconoscere un contenuto creato dall'IA
5. `I.04.005` Diritto d'autore e IA: le questioni aperte
6. `I.04.006` Privacy e IA
7. `I.04.007` Il regolamento europeo sull'IA (AI Act) in sintesi
8. `I.04.008` Rischi alti e usi vietati secondo l'AI Act
9. `I.04.009` Impatto ambientale dell'IA
10. `I.04.010` Le tue regole personali per usare l'IA

### Blocco 2 · Machine learning (I5-I8, lezioni 41-80)

Far imparare una macchina dagli esempi: modelli semplici, valutazione e scelta.

#### I5 · Python e dati per l'IA

Notebook, NumPy, pandas, grafici e un insieme di dati pronto per un modello. Cintura: gialla.
**Rimando:** NumPy, pandas e notebook sono trattati in Analista di dati (D4); qui si usano per preparare un modello.

1. `I.05.001` L'ambiente di lavoro: notebook e librerie
2. `I.05.002` Array con NumPy
3. `I.05.003` Tabelle con pandas
4. `I.05.004` Leggere un insieme di dati
5. `I.05.005` Capire i dati con statistiche semplici
6. `I.05.006` Grafici per esplorare i dati
7. `I.05.007` Pulire valori mancanti e valori strani
8. `I.05.008` Trasformare le colonne in numeri
9. `I.05.009` Dividere i dati: addestramento e prova
10. `I.05.010` Progetto: preparare un insieme di dati su un caso reale

#### I6 · Regressione e classificazione

Prevedere un numero e prevedere una categoria con scikit-learn. Cintura: gialla.
**Rimando:** Un'introduzione al machine learning c'è già in Analista di dati (D11): qui si va più a fondo.

1. `I.06.001` Che cos'è un modello
2. `I.06.002` Prevedere un numero: la regressione lineare
3. `I.06.003` Come si misura l'errore
4. `I.06.004` Il primo modello con scikit-learn
5. `I.06.005` Prevedere una categoria: la classificazione
6. `I.06.006` La regressione logistica
7. `I.06.007` I k vicini più prossimi
8. `I.06.008` Alberi decisionali
9. `I.06.009` Il rischio di imparare a memoria: overfitting
10. `I.06.010` Progetto: prevedere il prezzo di una casa o la sopravvivenza di un passeggero

#### I7 · Valutare i modelli

Accuratezza, matrice di confusione, precisione e richiamo, validazione incrociata, scelta dei parametri. Cintura: gialla.

1. `I.07.001` Quanto è bravo un modello: come si misura
2. `I.07.002` L'accuratezza e perché inganna
3. `I.07.003` La matrice di confusione
4. `I.07.004` Precisione e richiamo
5. `I.07.005` Il compromesso tra falsi allarmi e casi mancati
6. `I.07.006` Curva ROC e area sotto la curva
7. `I.07.007` Validazione incrociata
8. `I.07.008` Scegliere i parametri del modello
9. `I.07.009` Confrontare modelli in modo onesto
10. `I.07.010` Quando un modello è abbastanza buono

#### I8 · Altri modelli di apprendimento

Foreste casuali, boosting, raggruppamenti, riduzione delle dimensioni e rilevare anomalie. Cintura: gialla.

1. `I.08.001` Unire tanti modelli: l'idea degli ensemble
2. `I.08.002` Foreste casuali
3. `I.08.003` Boosting in sintesi
4. `I.08.004` Apprendimento non supervisionato: niente etichette
5. `I.08.005` Raggruppare con k-means
6. `I.08.006` Quanti gruppi scegliere
7. `I.08.007` Ridurre le dimensioni: l'analisi delle componenti principali
8. `I.08.008` Trovare le anomalie
9. `I.08.009` Cenni sull'apprendimento per rinforzo
10. `I.08.010` Progetto: segmentare i clienti di un negozio fittizio

### Blocco 3 · Reti neurali e deep learning (I9-I12, lezioni 81-120)

Come funziona un neurone artificiale e come si costruiscono reti profonde.

#### I9 · Dal neurone alla rete

Il neurone artificiale, pesi, funzioni di attivazione, strati e prima rete a mano. Cintura: arancione.

1. `I.09.001` Il neurone biologico e il neurone artificiale
2. `I.09.002` Pesi, somma e soglia
3. `I.09.003` Funzioni di attivazione
4. `I.09.004` Mettere i neuroni in strati
5. `I.09.005` Perché servono gli strati nascosti
6. `I.09.006` Una rete piccola calcolata a mano
7. `I.09.007` Una rete che impara le porte logiche
8. `I.09.008` Rappresentare i dati come numeri
9. `I.09.009` Una rete in poche righe con Keras o PyTorch
10. `I.09.010` Progetto: riconoscere le cifre scritte a mano

#### I10 · Come impara una rete

Funzione di errore, discesa del gradiente, retropropagazione, ottimizzatori e regole contro l'overfitting. Cintura: arancione.

1. `I.10.001` La funzione di errore (loss)
2. `I.10.002` Scendere lungo la collina: la discesa del gradiente
3. `I.10.003` Il passo di apprendimento
4. `I.10.004` Retropropagazione in parole semplici
5. `I.10.005` Cicli di addestramento: batch ed epoche
6. `I.10.006` Ottimizzatori: SGD e Adam
7. `I.10.007` Guardare le curve di addestramento
8. `I.10.008` Regolarizzazione e dropout
9. `I.10.009` Inizializzazione e normalizzazione
10. `I.10.010` Progetto: migliorare una rete che va male

#### I11 · Immagini e reti convoluzionali

Pixel, filtri, convoluzioni, pooling, trasferimento dell'apprendimento e limiti. Cintura: arancione.

1. `I.11.001` Come vede un computer: i pixel
2. `I.11.002` I filtri che cercano bordi e forme
3. `I.11.003` La convoluzione
4. `I.11.004` Pooling e mappe delle caratteristiche
5. `I.11.005` Mettere insieme una rete convoluzionale
6. `I.11.006` Aumentare le immagini: i dati si moltiplicano
7. `I.11.007` Usare un modello già addestrato
8. `I.11.008` Trasferimento dell'apprendimento (fine-tuning)
9. `I.11.009` Rilevare e segmentare oggetti in sintesi
10. `I.11.010` Dove sbagliano i modelli di visione: esempi avversari

#### I12 · Sequenze e attenzione

Testo e serie temporali, reti ricorrenti, il meccanismo di attenzione e la strada verso i transformer. Cintura: arancione.

1. `I.12.001` Dati che hanno un ordine: testo, suoni, serie nel tempo
2. `I.12.002` Le reti ricorrenti
3. `I.12.003` Il problema della memoria corta
4. `I.12.004` LSTM e GRU in sintesi
5. `I.12.005` Dal testo ai numeri: parole e vettori
6. `I.12.006` L'attenzione: guardare le parti che contano
7. `I.12.007` Auto-attenzione
8. `I.12.008` Perché l'attenzione ha battuto le reti ricorrenti
9. `I.12.009` Tradurre con una rete a sequenze
10. `I.12.010` Progetto: classificare il tono di frasi brevi

### Blocco 4 · Linguaggio e IA generativa (I13-I16, lezioni 121-160)

Come funzionano i modelli di linguaggio e di immagini e come si costruiscono applicazioni con loro.

#### I13 · Il linguaggio per le macchine

Token, embedding, somiglianza tra significati, modelli di linguaggio semplici e ricerca per significato. Cintura: verde.

1. `I.13.001` Elaborazione del linguaggio naturale: i problemi
2. `I.13.002` Dividere il testo in token
3. `I.13.003` Contare le parole: il sacco di parole
4. `I.13.004` Gli embedding: parole come punti in uno spazio
5. `I.13.005` Somiglianza tra significati: distanza e coseno
6. `I.13.006` Un modello di linguaggio semplice: indovinare la parola dopo
7. `I.13.007` Ricerca per significato
8. `I.13.008` Classificare testi
9. `I.13.009` Lingue diverse e l'italiano
10. `I.13.010` Progetto: un motore di ricerca per significato su poche frasi

#### I14 · Transformer e modelli di linguaggio

Come funziona un modello grande: transformer, addestramento, messa a punto, limiti e valutazione. Cintura: verde.

1. `I.14.001` L'architettura transformer
2. `I.14.002` Attenzione a più teste
3. `I.14.003` Posizione e contesto
4. `I.14.004` Addestrare un modello di linguaggio: prevedere il token successivo
5. `I.14.005` Dati, calcolo e costi dell'addestramento
6. `I.14.006` Dal modello di base all'assistente: messa a punto e istruzioni
7. `I.14.007` Imparare dal giudizio umano
8. `I.14.008` Come il modello genera il testo: probabilità e temperatura
9. `I.14.009` Finestra di contesto e memoria
10. `I.14.010` Perché sbaglia: limiti, allucinazioni e come si valutano

#### I15 · Immagini, audio e video generativi

Modelli di diffusione, immagini da testo, voce e musica, diritti e riconoscimento dei contenuti falsi. Cintura: verde.

1. `I.15.001` Generare invece di riconoscere
2. `I.15.002` Reti generative avversarie in sintesi
3. `I.15.003` La diffusione: dal rumore all'immagine
4. `I.15.004` Immagini da testo: come si guidano
5. `I.15.005` Richieste per le immagini: stile, composizione, limiti
6. `I.15.006` Modificare immagini: riempire e variare
7. `I.15.007` Voce: sintesi vocale e clonazione
8. `I.15.008` Musica e suoni generati
9. `I.15.009` Video generati: stato e limiti
10. `I.15.010` Falsi, marchi invisibili e provenienza dei contenuti

#### I16 · Costruire con i modelli di linguaggio

API, richieste strutturate, ricerca nei propri documenti (RAG), strumenti e agenti, valutazione. Cintura: verde.
**Rimando:** Il lato sicurezza (prompt injection e simili) è in Cybersecurity C25.

1. `I.16.001` Usare un modello da programma: le API
2. `I.16.002` Messaggi, ruoli e costi in token
3. `I.16.003` Risposte in formato strutturato
4. `I.16.004` Dare istruzioni stabili: il messaggio di sistema
5. `I.16.005` Dare conoscenza al modello: il contesto
6. `I.16.006` RAG: cercare nei propri documenti e poi rispondere
7. `I.16.007` Dividere i documenti e conservare gli embedding
8. `I.16.008` Far usare strumenti al modello
9. `I.16.009` Agenti: pianificare e ripetere passi
10. `I.16.010` Progetto: un assistente che risponde sui documenti di un'associazione

### Blocco 5 · IA in produzione e responsabile (I17-I20, lezioni 161-200)

Dal quaderno al servizio vero: qualità, sicurezza, equità e un progetto completo.

#### I17 · Progetti di IA ben fatti

Impostare il problema, dati e baseline, esperimenti ordinati, riproducibilità e collaborazione. Cintura: blu.

1. `I.17.001` Un problema di IA o un problema che non lo è
2. `I.17.002` Definire il successo prima di cominciare
3. `I.17.003` La soluzione più semplice come punto di confronto
4. `I.17.004` Raccogliere e descrivere i dati del progetto
5. `I.17.005` Esperimenti ordinati: cosa cambiare e cosa tenere
6. `I.17.006` Registrare risultati e versioni
7. `I.17.007` Riproducibilità: stesso codice, stessi risultati
8. `I.17.008` Errori classici: la perdita di dati dal test
9. `I.17.009` Lavorare in squadra su un progetto di IA
10. `I.17.010` Relazione onesta su un esperimento

#### I18 · Portare un modello in produzione

Salvare e servire un modello, API, prestazioni, monitoraggio e cambiamento dei dati nel tempo. Cintura: blu.
**Rimando:** Container e cloud: corso Cloud e DevOps (L).

1. `I.18.001` Dal quaderno al servizio
2. `I.18.002` Salvare e caricare un modello
3. `I.18.003` Un'API che risponde con le previsioni
4. `I.18.004` Prestazioni: tempo di risposta e costi
5. `I.18.005` Modelli più piccoli e più veloci
6. `I.18.006` Eseguire un modello sul proprio computer
7. `I.18.007` Monitorare un modello in produzione
8. `I.18.008` I dati cambiano: la deriva del modello
9. `I.18.009` Aggiornare un modello senza rompere tutto
10. `I.18.010` Progetto: un servizio di previsione che gira su un server

#### I19 · Sicurezza, equità e IA responsabile

Esempi avversari, avvelenamento dei dati, equità, spiegabilità, valutazione dell'impatto. Cintura: blu.
**Rimando:** Prompt injection e rischi dei modelli lato attacco: Cybersecurity C25.

1. `I.19.001` Quando un modello è dannoso: esempi di fallimenti
2. `I.19.002` Equità: cosa significa e come si misura
3. `I.19.003` Le fonti di pregiudizio lungo tutto il progetto
4. `I.19.004` Spiegare le decisioni di un modello
5. `I.19.005` Esempi avversari: ingannare un modello
6. `I.19.006` Avvelenare i dati e rubare i modelli (concetti)
7. `I.19.007` Privacy nei modelli: cosa possono rivelare
8. `I.19.008` Valutare l'impatto prima di costruire
9. `I.19.009` Documentare un modello: la scheda del modello
10. `I.19.010` Lista di controllo per un'IA responsabile

#### I20 · Progetto finale e carriera

Un progetto di IA completo, il portafoglio dei lavori, i mestieri dell'IA e come continuare. Cintura: blu.

1. `I.20.001` Scegliere un progetto che vale la pena
2. `I.20.002` Dati e problema ben posti
3. `I.20.003` Un primo modello semplice
4. `I.20.004` Migliorare con metodo
5. `I.20.005` Valutare con onestà
6. `I.20.006` Costruire una piccola applicazione attorno al modello
7. `I.20.007` Spiegare il risultato a chi non è tecnico
8. `I.20.008` Presentare il progetto
9. `I.20.009` I mestieri dell'IA: analista, ingegnere di apprendimento automatico, ricercatore
10. `I.20.010` Come continuare a imparare: corsi, gare e comunità

## B · Database e dati a grande scala

Come si conservano e si interrogano i dati quando diventano tanti: database relazionali e NoSQL, transazioni, indici, replicazione e sharding, sistemi distribuiti, data warehouse e big data.

- **Per chi:** Per chi vuole progettare e gestire database e archivi di dati, dal piccolo progetto alla grande applicazione.
- **Consigliato:** Conviene aver fatto SQL in Analista di dati (D3) e le basi di programmazione (P1-P4). Dove i corsi esistenti coprono già un argomento, qui si rimanda.
- **Cartella e `course:`:** `database-grandi-dati` · **Domande:** `src/lib/practice/banks-nuovi/bNN.ts`

### Blocco 1 · Le basi dei database (B1-B4, lezioni 1-40)

Che cos'è un database, come si progetta e come si usa da un programma.

#### B1 · Che cos'è un database

File e database, DBMS, modelli di dati, cosa garantisce un database e cosa lo rende utile. Cintura: bianca.

1. `B.01.001` Perché non basta un file
2. `B.01.002` Che cos'è un database e che cos'è un DBMS
3. `B.01.003` I modelli di dati: relazionale, a documenti, chiave-valore, a grafo
4. `B.01.004` Come è fatto un DBMS dentro
5. `B.01.005` Client e server: come ci si collega
6. `B.01.006` Il linguaggio SQL e dove si usa
7. `B.01.007` Che cosa garantisce un database: le proprietà ACID
8. `B.01.008` Cosa non fa un database da solo
9. `B.01.009` Un database dei film, esplorato a mano
10. `B.01.010` Come scegliere un database per un progetto

#### B2 · Progettare un database

Modello a entità e relazioni, chiavi, relazioni uno-a-molti e molti-a-molti, normalizzazione. Cintura: bianca.
**Rimando:** Tabelle, chiavi primarie ed esterne sono introdotte in Analista di dati (D3): qui si progetta da zero.

1. `B.02.001` Dal problema ai dati: le domande da fare
2. `B.02.002` Entità, attributi e relazioni
3. `B.02.003` Il diagramma entità-relazione
4. `B.02.004` Chiavi primarie: naturali e artificiali
5. `B.02.005` Chiavi esterne e integrità referenziale
6. `B.02.006` Relazioni uno-a-molti
7. `B.02.007` Relazioni molti-a-molti e tabelle ponte
8. `B.02.008` La normalizzazione: perché si fa
9. `B.02.009` Prima, seconda e terza forma normale
10. `B.02.010` Progetto: il database di una biblioteca scolastica

#### B3 · SQL essenziale

Ripasso veloce di creazione, inserimento, modifica, selezione, JOIN e raggruppamenti. Cintura: bianca.
**Rimando:** SQL spiegato con calma: Analista di dati (D3). Qui un ripasso mirato, per chi parte da qui.

1. `B.03.001` Creare tabelle: CREATE TABLE e i tipi di dato
2. `B.03.002` Vincoli: NOT NULL, UNIQUE, CHECK, DEFAULT
3. `B.03.003` Inserire, modificare e togliere righe
4. `B.03.004` SELECT, WHERE e ORDER BY
5. `B.03.005` Raggruppare: GROUP BY e funzioni di aggregazione
6. `B.03.006` JOIN: unire le tabelle
7. `B.03.007` Sottoquery e CTE in sintesi
8. `B.03.008` Viste
9. `B.03.009` Cambiare la struttura: ALTER TABLE
10. `B.03.010` Esercizi: le query della biblioteca

#### B4 · Usare il database da un programma

Driver, connessioni, query con parametri, ORM, migrazioni e gestione degli errori. Cintura: bianca.
**Rimando:** Il lato sviluppo web è anche in Sviluppo web (W18).

1. `B.04.001` Un programma che parla con il database
2. `B.04.002` Connessioni e pool di connessioni
3. `B.04.003` Eseguire una query dal codice
4. `B.04.004` Parametri: mai costruire query incollando testo
5. `B.04.005` Leggere i risultati in strutture del linguaggio
6. `B.04.006` Gli ORM: vantaggi e insidie
7. `B.04.007` Il problema delle N+1 query
8. `B.04.008` Migrazioni: cambiare il database con ordine
9. `B.04.009` Gestire gli errori e i tentativi ripetuti
10. `B.04.010` Progetto: un'applicazione che legge e scrive su PostgreSQL

### Blocco 2 · Il database relazionale a fondo (B5-B8, lezioni 41-80)

Transazioni, indici, funzioni avanzate di PostgreSQL e amministrazione.

#### B5 · Transazioni e concorrenza

ACID in pratica, livelli di isolamento, blocchi, deadlock e anomalie. Cintura: gialla.
**Rimando:** Una prima introduzione alle transazioni è in Analista di dati (D18): qui si studia cosa succede con molti utenti insieme.

1. `B.05.001` Che cos'è una transazione
2. `B.05.002` BEGIN, COMMIT e ROLLBACK
3. `B.05.003` Atomicità e coerenza
4. `B.05.004` Isolamento: più utenti nello stesso momento
5. `B.05.005` Le anomalie: lettura sporca, non ripetibile e fantasma
6. `B.05.006` I livelli di isolamento
7. `B.05.007` Blocchi di riga e di tabella
8. `B.05.008` Deadlock: quando due transazioni si aspettano
9. `B.05.009` Controllo ottimistico e versioni delle righe (MVCC)
10. `B.05.010` Esercizi: il conto corrente e le prenotazioni dei posti

#### B6 · Indici e prestazioni

Come si cerca in una tabella grande, B-tree, piani di esecuzione, statistiche e query lente. Cintura: gialla.

1. `B.06.001` Perché una query è lenta
2. `B.06.002` Scansione completa e uso di un indice
3. `B.06.003` L'indice B-tree
4. `B.06.004` Indici su più colonne e ordine delle colonne
5. `B.06.005` Indici unici e parziali
6. `B.06.006` Leggere un piano di esecuzione (EXPLAIN)
7. `B.06.007` Le statistiche e il pianificatore
8. `B.06.008` Il costo degli indici: scritture più lente
9. `B.06.009` Riscrivere una query lenta
10. `B.06.010` Progetto: da 8 secondi a 80 millisecondi

#### B7 · PostgreSQL in pratica

Tipi avanzati, JSON, funzioni finestra, viste materializzate, funzioni e estensioni. Cintura: gialla.

1. `B.07.001` Perché PostgreSQL
2. `B.07.002` Installare PostgreSQL e usare psql
3. `B.07.003` Tipi di dato: date, intervalli, array, enumerazioni
4. `B.07.004` JSON e JSONB
5. `B.07.005` Funzioni finestra
6. `B.07.006` Viste materializzate
7. `B.07.007` Funzioni e procedure
8. `B.07.008` Trigger: reagire ai cambiamenti
9. `B.07.009` Ricerca nel testo
10. `B.07.010` Estensioni: PostGIS e altre

#### B8 · Amministrare un database

Utenti e permessi, copie di sicurezza, ripristino, aggiornamenti e protezione dei dati. Cintura: gialla.
**Rimando:** SQL injection e sicurezza dei dati in Cybersecurity (C6).

1. `B.08.001` Il mestiere dell'amministratore
2. `B.08.002` Utenti, ruoli e privilegi
3. `B.08.003` Il principio del minimo privilegio
4. `B.08.004` Copie di sicurezza logiche e fisiche
5. `B.08.005` Ripristinare: la copia non provata non esiste
6. `B.08.006` Ripristino a un istante preciso
7. `B.08.007` Aggiornare PostgreSQL senza perdere dati
8. `B.08.008` Monitorare spazio, connessioni e query lente
9. `B.08.009` Cifrare le connessioni e i dati
10. `B.08.010` Piano di emergenza: cosa fare se il database si rompe

### Blocco 3 · Oltre il relazionale: NoSQL (B9-B12, lezioni 81-120)

Documenti, chiave-valore, serie temporali, grafi e ricerca: ogni dato ha il suo posto.

#### B9 · Database a documenti

Documenti JSON, MongoDB, modellare per le letture, aggregazioni e quando conviene. Cintura: arancione.

1. `B.09.001` Che cosa significa NoSQL
2. `B.09.002` Il documento: JSON come riga
3. `B.09.003` Primi passi con MongoDB
4. `B.09.004` Inserire, leggere, aggiornare e cancellare
5. `B.09.005` Filtri e operatori
6. `B.09.006` Incorporare o riferire: come modellare
7. `B.09.007` Indici nei documenti
8. `B.09.008` Le pipeline di aggregazione
9. `B.09.009` Schema flessibile: libertà e rischi
10. `B.09.010` Documenti o tabelle: come decidere

#### B10 · Chiave-valore e cache

Redis, tipi di dato, scadenze, cache, sessioni, contatori e code semplici. Cintura: arancione.

1. `B.10.001` Il database più semplice: chiave e valore
2. `B.10.002` Installare Redis e il primo comando
3. `B.10.003` Stringhe, liste, insiemi e hash
4. `B.10.004` Scadenza dei dati (TTL)
5. `B.10.005` Una cache davanti al database
6. `B.10.006` Invalidare la cache: il problema difficile
7. `B.10.007` Sessioni e contatori
8. `B.10.008` Classifiche con gli insiemi ordinati
9. `B.10.009` Code e pubblicazione di messaggi
10. `B.10.010` Persistenza: cosa resta se si spegne

#### B11 · Serie temporali e colonne larghe

Dati che arrivano nel tempo, database a colonne larghe, finestre temporali e conservazione. Cintura: arancione.

1. `B.11.001` Dati con il tempo: sensori, log e metriche
2. `B.11.002` Come si conservano le serie temporali
3. `B.11.003` TimescaleDB e InfluxDB: primi passi
4. `B.11.004` Scrivere e interrogare per intervalli di tempo
5. `B.11.005` Aggregare per finestre
6. `B.11.006` Retention: quanto tempo conservare i dati
7. `B.11.007` Database a colonne larghe: Cassandra
8. `B.11.008` La chiave di partizione e il modello per le query
9. `B.11.009` Compromessi: cosa si perde con questo modello
10. `B.11.010` Progetto: le temperature di cento sensori

#### B12 · Grafi, ricerca e vettori

Database a grafo, motori di ricerca, ricerca per testo e per significato. Cintura: arancione.
**Rimando:** I grafi come strutture dati sono in Programmazione generale (P12).

1. `B.12.001` Quando le relazioni sono il dato
2. `B.12.002` Nodi e relazioni: il modello a grafo
3. `B.12.003` Neo4j e il linguaggio Cypher
4. `B.12.004` Percorsi e raccomandazioni
5. `B.12.005` Motori di ricerca: Elasticsearch e OpenSearch
6. `B.12.006` L'indice invertito
7. `B.12.007` Cercare nel testo: pesi e rilevanza
8. `B.12.008` Ricerca con filtri e aggregazioni
9. `B.12.009` Database vettoriali e ricerca per significato
10. `B.12.010` Scegliere tra più database nello stesso progetto

### Blocco 4 · Dati su più macchine (B13-B16, lezioni 121-160)

Quando una macchina non basta: replicazione, sharding e sistemi distribuiti.

#### B13 · Replicazione e alta disponibilità

Copie dei dati, principale e repliche, passaggio automatico, ritardo e lettura dalle repliche. Cintura: verde.

1. `B.13.001` Perché avere più copie
2. `B.13.002` Principale e repliche
3. `B.13.003` Replicazione sincrona e asincrona
4. `B.13.004` Il ritardo di replicazione e le letture vecchie
5. `B.13.005` Passare a una replica quando il principale si rompe
6. `B.13.006` Il rischio del doppio principale (split brain)
7. `B.13.007` Leggere dalle repliche: quando si può
8. `B.13.008` Replicazione in più luoghi
9. `B.13.009` Alta disponibilità: cosa promette e cosa no
10. `B.13.010` Esercizio: simulare un guasto e il ritorno in servizio

#### B14 · Partizionamento e sharding

Dividere i dati, chiavi di divisione, ribilanciare, query su più parti e i costi della complessità. Cintura: verde.

1. `B.14.001` Quando una macchina non basta più
2. `B.14.002` Scalare in verticale e in orizzontale
3. `B.14.003` Partizionare una tabella
4. `B.14.004` Dividere per intervallo, per elenco e per hash
5. `B.14.005` Lo sharding: dati su più server
6. `B.14.006` Scegliere la chiave giusta
7. `B.14.007` Hotspot: quando un pezzo lavora più degli altri
8. `B.14.008` Query che attraversano più pezzi
9. `B.14.009` Ribilanciare: aggiungere e togliere nodi
10. `B.14.010` Quando NON conviene fare sharding

#### B15 · Sistemi distribuiti

Guasti, tempo, teorema CAP, consistenza, consenso e transazioni distribuite. Cintura: verde.

1. `B.15.001` Che cos'è un sistema distribuito
2. `B.15.002` I guasti sono la regola: nodi, rete e messaggi persi
3. `B.15.003` Il tempo non è lo stesso su ogni macchina
4. `B.15.004` Il teorema CAP
5. `B.15.005` Consistenza forte e consistenza finale
6. `B.15.006` I quorum: leggere e scrivere con la maggioranza
7. `B.15.007` Il consenso: Raft in parole semplici
8. `B.15.008` Transazioni su più sistemi: il commit a due fasi
9. `B.15.009` Idempotenza: ripetere senza fare danni
10. `B.15.010` Esempi reali: come si comportano alcuni database famosi

#### B16 · Messaggi, code e flussi

Code di messaggi, Kafka, eventi, elaborazione in tempo reale e coerenza tra servizi. Cintura: verde.

1. `B.16.001` Perché separare chi produce da chi consuma
2. `B.16.002` Le code di messaggi
3. `B.16.003` Argomenti e abbonamenti
4. `B.16.004` Kafka: il registro degli eventi
5. `B.16.005` Partizioni e gruppi di consumatori
6. `B.16.006` Consegna: almeno una volta, al massimo una volta, esattamente una volta
7. `B.16.007` Gli eventi come fonte della verità
8. `B.16.008` Il modello outbox: scrivere e pubblicare senza perdite
9. `B.16.009` Elaborare i flussi in tempo reale
10. `B.16.010` Progetto: un flusso di ordini tra tre servizi

### Blocco 5 · Big data e analisi (B17-B20, lezioni 161-200)

Magazzini di dati, elaborazione distribuita, formati e governance.

#### B17 · Data warehouse e OLAP

Analisi contro operazioni, schema a stella, database a colonne e modellare per l'analisi. Cintura: blu.
**Rimando:** ETL e pipeline sono in Analista di dati (D9, D14): qui si guarda la parte database.

1. `B.17.001` Operazioni e analisi: due lavori diversi
2. `B.17.002` OLTP e OLAP
3. `B.17.003` Che cos'è un data warehouse
4. `B.17.004` Fatti e dimensioni
5. `B.17.005` Lo schema a stella
6. `B.17.006` Dimensioni che cambiano nel tempo
7. `B.17.007` Database a colonne
8. `B.17.008` Compressione e scansioni veloci
9. `B.17.009` Cubi e aggregazioni
10. `B.17.010` Progetto: un magazzino dati per un negozio

#### B18 · Elaborazione distribuita

Dividere il lavoro su molte macchine: MapReduce, Spark, DataFrame e costi. Cintura: blu.

1. `B.18.001` Quando i dati non stanno in memoria
2. `B.18.002` Dividi il lavoro: l'idea di MapReduce
3. `B.18.003` Il sistema di file distribuito e Hadoop in breve
4. `B.18.004` Spark: cos'è e perché ha vinto
5. `B.18.005` I DataFrame in Spark
6. `B.18.006` Trasformazioni e azioni: l'esecuzione pigra
7. `B.18.007` Raggruppamenti e unioni su dati grandi
8. `B.18.008` Il mescolamento dei dati (shuffle) e perché costa
9. `B.18.009` Partizioni e prestazioni
10. `B.18.010` Progetto: contare le parole di un grande archivio di testi

#### B19 · Data lake, formati e streaming

File di dati, Parquet, data lake e lakehouse, tabelle versionate e flussi continui. Cintura: blu.

1. `B.19.001` Il data lake: tutti i dati in un posto
2. `B.19.002` Formati: CSV, JSON, Avro e Parquet
3. `B.19.003` Perché Parquet è così efficiente
4. `B.19.004` Cartelle e partizioni per data
5. `B.19.005` Lakehouse: ordine sopra il lake
6. `B.19.006` Tabelle con versioni e viaggi nel tempo
7. `B.19.007` Qualità dei dati: controlli automatici
8. `B.19.008` Dati in arrivo continuo: batch e streaming
9. `B.19.009` Finestre e ritardi nell'elaborazione dei flussi
10. `B.19.010` Progetto: un piccolo lakehouse con strumenti gratuiti

#### B20 · Governance, costi e progetto finale

Catalogo dei dati, linee guida, privacy, costi nel cloud e un progetto completo. Cintura: blu.
**Rimando:** Privacy e GDPR in sintesi: Analista di dati (D12) e Cybersecurity (C10).

1. `B.20.001` Chi è responsabile dei dati
2. `B.20.002` Catalogo, descrizioni e proprietari
3. `B.20.003` Qualità e fiducia nei dati
4. `B.20.004` Ciclo di vita: conservare e cancellare
5. `B.20.005` Diritto alla cancellazione nei sistemi grandi
6. `B.20.006` Costi dei dati nel cloud
7. `B.20.007` Scegliere la tecnologia giusta per la dimensione giusta
8. `B.20.008` Progetto finale: requisiti e scelta del modello di dati
9. `B.20.009` Progetto finale: realizzazione e prove di carico
10. `B.20.010` Progetto finale: relazione su compromessi e limiti

## L · Cloud e DevOps

Come si pubblica e si fa funzionare un servizio vero: server e rete, container, cloud, automazione e rilasci continui, infrastruttura come codice, Kubernetes, monitoraggio e affidabilità. Gli esercizi usano strumenti gratuiti e il proprio computer.

- **Per chi:** Per chi vuole lavorare con server, cloud e rilasci automatici, o semplicemente capire come gira un servizio online.
- **Consigliato:** Conviene aver fatto Fondamenta (F1-F4: Linux) e le basi di programmazione (P1-P4). Per le reti basta F5-F7.
- **Cartella e `course:`:** `cloud-devops` · **Domande:** `src/lib/practice/banks-nuovi/lNN.ts`

### Blocco 1 · Le basi per mettere online (L1-L4, lezioni 1-40)

Cos'è DevOps, e il minimo su Linux, rete e Git per far funzionare un servizio.

#### L1 · Che cos'è DevOps e che cos'è il cloud

Dal codice al servizio, cultura DevOps, cloud in parole semplici e il ciclo di vita di un'applicazione. Cintura: bianca.

1. `L.01.001` Dal codice al servizio: cosa succede in mezzo
2. `L.01.002` Chi sviluppa e chi gestisce: il muro da abbattere
3. `L.01.003` Che cos'è DevOps (e cosa non è)
4. `L.01.004` Il ciclo: pianificare, costruire, provare, rilasciare, osservare
5. `L.01.005` Che cos'è il cloud in parole semplici
6. `L.01.006` Server fisici, macchine virtuali e container
7. `L.01.007` I mestieri: sviluppatore, sistemista, DevOps, SRE
8. `L.01.008` I problemi che DevOps risolve: rilasci rari e rischiosi
9. `L.01.009` Un servizio di esempio che useremo in tutto il corso
10. `L.01.010` Cosa imparerai e come è organizzato il corso

#### L2 · Linux per chi gestisce servizi

Accesso remoto con SSH, servizi, log, script di automazione, processi e risorse. Cintura: bianca.
**Rimando:** Terminale, permessi e bash sono in Fondamenta (F2-F4): qui si usano per gestire un servizio.

1. `L.02.001` Un server Linux: cosa c'è e cosa manca
2. `L.02.002` Collegarsi con SSH e le chiavi
3. `L.02.003` Copiare file con scp e rsync
4. `L.02.004` I servizi con systemd
5. `L.02.005` Leggere i log: journalctl e /var/log
6. `L.02.006` Processi, memoria e disco: i comandi per capire cosa succede
7. `L.02.007` Utenti e permessi sul server
8. `L.02.008` Aggiornare il sistema e i pacchetti
9. `L.02.009` Script che fanno le cose al posto tuo
10. `L.02.010` Esercizi: preparare un server di prova in una macchina virtuale

#### L3 · Rete e web per chi pubblica

DNS, porte, firewall, proxy inverso, HTTPS e certificati, bilanciare le richieste. Cintura: bianca.
**Rimando:** IP, DNS, HTTP e NAT sono spiegati in Fondamenta (F5-F8): qui servono per pubblicare un sito.

1. `L.03.001` Come arriva una richiesta al tuo server
2. `L.03.002` DNS: record A, CNAME e MX
3. `L.03.003` Porte e firewall sul server
4. `L.03.004` Un server web: Nginx in pratica
5. `L.03.005` Il proxy inverso
6. `L.03.006` HTTPS e certificati gratuiti con Let's Encrypt
7. `L.03.007` Rinnovare i certificati in automatico
8. `L.03.008` Il bilanciatore di carico
9. `L.03.009` Controlli di salute dei servizi
10. `L.03.010` Esercizi: pubblicare un sito statico in una macchina virtuale

#### L4 · Git e flussi di lavoro

Rami, rilasci, versioni e tag, convenzioni di squadra e revisione del codice. Cintura: bianca.
**Rimando:** Git base e pull request: Programmazione generale (P13, P14).

1. `L.04.001` Perché il codice di un servizio sta sotto Git
2. `L.04.002` Flussi di lavoro: un solo ramo o tanti
3. `L.04.003` Trunk-based e rami di funzione
4. `L.04.004` Messaggi e convenzioni di commit
5. `L.04.005` Versioni e tag: numerare i rilasci
6. `L.04.006` Il changelog
7. `L.04.007` Proteggere il ramo principale
8. `L.04.008` Revisione del codice che trova errori
9. `L.04.009` Cosa non va mai nel repository: segreti e file grandi
10. `L.04.010` Esercizi: il repository di un servizio ben ordinato

### Blocco 2 · Container (L5-L8, lezioni 41-80)

Pacchettizzare un'applicazione perché giri uguale ovunque.

#### L5 · Docker: i primi passi

Container e macchine virtuali, immagini, comandi base, avviare, fermare e guardare dentro. Cintura: gialla.

1. `L.05.001` Il problema «da me funziona»
2. `L.05.002` Container o macchina virtuale
3. `L.05.003` Installare Docker
4. `L.05.004` Immagini e container: la differenza
5. `L.05.005` Avviare il primo container
6. `L.05.006` Elencare, fermare e cancellare
7. `L.05.007` Entrare in un container e guardare
8. `L.05.008` Porte e accesso dal browser
9. `L.05.009` Variabili d'ambiente
10. `L.05.010` Esercizi: un server web in un container

#### L6 · Costruire immagini

Dockerfile, strati, cache, immagini piccole, build a più fasi e buone abitudini. Cintura: gialla.

1. `L.06.001` Che cos'è un Dockerfile
2. `L.06.002` FROM, COPY e RUN
3. `L.06.003` CMD ed ENTRYPOINT
4. `L.06.004` Gli strati e la cache di build
5. `L.06.005` Il file .dockerignore
6. `L.06.006` Immagini piccole: scegliere la base giusta
7. `L.06.007` Build a più fasi
8. `L.06.008` Utente non root nel container
9. `L.06.009` Etichette e versioni delle immagini
10. `L.06.010` Progetto: containerizzare l'applicazione del corso

#### L7 · Più container insieme

Docker Compose, reti, volumi, database in container e configurazione. Cintura: gialla.

1. `L.07.001` Un'app è fatta di tanti pezzi
2. `L.07.002` Il file di Docker Compose
3. `L.07.003` Avviare e fermare un insieme di servizi
4. `L.07.004` Reti tra container: i nomi dei servizi
5. `L.07.005` I volumi: dati che sopravvivono
6. `L.07.006` Un database in container
7. `L.07.007` Configurazione e file .env
8. `L.07.008` Ordine di avvio e controlli di salute
9. `L.07.009` Registri dei container: leggerli tutti
10. `L.07.010` Progetto: l'app con database e proxy in un solo comando

#### L8 · Registri e sicurezza dei container

Pubblicare le immagini, scansione, aggiornamenti, privilegi e segreti. Cintura: gialla.
**Rimando:** La sicurezza dei container come pratica DevSecOps: Cybersecurity (C24).

1. `L.08.001` Dove si conservano le immagini: i registri
2. `L.08.002` Pubblicare un'immagine
3. `L.08.003` Immagini ufficiali e immagini di cui diffidare
4. `L.08.004` Vulnerabilità nelle immagini e come scansionarle
5. `L.08.005` Aggiornare le basi senza rompere
6. `L.08.006` Privilegi dei container: cosa limitare
7. `L.08.007` Segreti: mai dentro l'immagine
8. `L.08.008` Limiti di memoria e di processore
9. `L.08.009` Cosa condividono davvero i container con il computer
10. `L.08.010` Lista di controllo per un'immagine sicura

### Blocco 3 · Il cloud (L9-L12, lezioni 81-120)

Capire i servizi dei grandi fornitori senza farsi spaventare dalle sigle.

#### L9 · I concetti del cloud

Modelli di servizio, regioni, elasticità, responsabilità condivisa e come si ragiona sul cloud. Cintura: arancione.
**Rimando:** La responsabilità condivisa e la sicurezza del cloud: Cybersecurity (C17).

1. `L.09.001` Cloud pubblico, privato e ibrido
2. `L.09.002` IaaS, PaaS e SaaS
3. `L.09.003` Regioni e zone di disponibilità
4. `L.09.004` Elasticità: crescere e calare in fretta
5. `L.09.005` Pagare a consumo: cosa significa
6. `L.09.006` La responsabilità condivisa
7. `L.09.007` I grandi fornitori e cosa offrono in sintesi
8. `L.09.008` Il livello gratuito: possibilità e trappole
9. `L.09.009` Aprire un account senza sorprese sui costi
10. `L.09.010` Esercizi: il vocabolario del cloud su un caso reale

#### L10 · Calcolo, archiviazione e serverless

Macchine virtuali, archiviazione a oggetti, funzioni serverless, database gestiti e code. Cintura: arancione.

1. `L.10.001` Le macchine virtuali nel cloud
2. `L.10.002` Scegliere il tipo di macchina
3. `L.10.003` Dischi e archiviazione a blocchi
4. `L.10.004` L'archiviazione a oggetti
5. `L.10.005` Un sito statico dentro un contenitore di oggetti
6. `L.10.006` Funzioni serverless
7. `L.10.007` Quando il serverless conviene e quando no
8. `L.10.008` Database gestiti
9. `L.10.009` Code e messaggi gestiti
10. `L.10.010` Progetto: un'applicazione piccola costruita con pezzi gestiti

#### L11 · Rete e identità nel cloud

Reti virtuali, sottoreti, gruppi di sicurezza, gestione di utenti e permessi. Cintura: arancione.

1. `L.11.001` La rete virtuale privata del cloud
2. `L.11.002` Sottoreti pubbliche e private
3. `L.11.003` Tabelle di instradamento e uscita verso internet
4. `L.11.004` Gruppi di sicurezza e regole di accesso
5. `L.11.005` Collegare reti diverse
6. `L.11.006` Identità e permessi: chi può fare cosa
7. `L.11.007` Politiche e ruoli
8. `L.11.008` Il minimo privilegio nel cloud
9. `L.11.009` Autenticazione a più fattori e account di emergenza
10. `L.11.010` Esercizi: leggere una politica di permessi e trovare l'errore

#### L12 · Costi e scelta del fornitore

Come si legge una fattura, controllare la spesa, evitare sorprese e non restare vincolati. Cintura: arancione.

1. `L.12.001` Da cosa dipende la spesa nel cloud
2. `L.12.002` Leggere una fattura e il calcolatore di prezzi
3. `L.12.003` Allarmi e limiti di spesa
4. `L.12.004` Gli errori che costano: risorse dimenticate
5. `L.12.005` Risparmiare: dimensioni giuste e spegnimenti
6. `L.12.006` Prenotare capacità in anticipo
7. `L.12.007` Costi del traffico dati
8. `L.12.008` Il vincolo con un fornitore (lock-in)
9. `L.12.009` Confrontare fornitori in modo onesto
10. `L.12.010` Esercizi: stimare il costo mensile di un servizio

### Blocco 4 · Automazione e orchestrazione (L13-L16, lezioni 121-160)

Rilasciare in automatico, descrivere l'infrastruttura con il codice e far girare molti container.

#### L13 · Integrazione e rilascio continui (CI/CD)

Pipeline, test automatici, build, rilascio, ambienti e strategie di rilascio. Cintura: verde.

1. `L.13.001` Rilasci rari contro rilasci continui
2. `L.13.002` Che cos'è una pipeline
3. `L.13.003` La prima pipeline con GitHub Actions
4. `L.13.004` Test automatici in pipeline
5. `L.13.005` Costruire e pubblicare l'immagine
6. `L.13.006` Gli ambienti: sviluppo, prova e produzione
7. `L.13.007` Rilascio automatico verso la prova
8. `L.13.008` Rilasciare in produzione con calma: approvazioni
9. `L.13.009` Strategie: blu-verde e rilascio graduale
10. `L.13.010` Tornare indietro in fretta quando qualcosa va male

#### L14 · Infrastruttura come codice

Descrivere server e reti in file, Terraform, Ansible, stato e revisione dei cambiamenti. Cintura: verde.

1. `L.14.001` Il problema dei server fatti a mano
2. `L.14.002` Descrivere l'infrastruttura in un file
3. `L.14.003` Terraform: risorse e fornitori
4. `L.14.004` Pianificare e applicare i cambiamenti
5. `L.14.005` Lo stato e perché va protetto
6. `L.14.006` Variabili, moduli e riuso
7. `L.14.007` Ansible: configurare le macchine
8. `L.14.008` Idempotenza: lanciare due volte non rompe
9. `L.14.009` Revisione dei cambiamenti di infrastruttura
10. `L.14.010` Progetto: un ambiente intero costruito da un file

#### L15 · Kubernetes

Pod, deployment, servizi, configurazioni, scalare e aggiornare senza interruzioni. Cintura: verde.

1. `L.15.001` Perché serve un orchestratore
2. `L.15.002` L'architettura di Kubernetes in sintesi
3. `L.15.003` Un cluster di prova sul proprio computer
4. `L.15.004` I pod
5. `L.15.005` I deployment e le repliche
6. `L.15.006` I servizi e la rete tra pod
7. `L.15.007` ConfigMap e segreti
8. `L.15.008` Aggiornare senza interruzioni
9. `L.15.009` Scalare in automatico
10. `L.15.010` Progetto: l'app del corso su Kubernetes

#### L16 · Configurazioni, segreti e rilasci sicuri

Gestire configurazioni e segreti, firmare e controllare le dipendenze, sicurezza della catena di produzione. Cintura: verde.
**Rimando:** Sicurezza nel ciclo di sviluppo a fondo: Cybersecurity (C24).

1. `L.16.001` Configurazione per ambiente
2. `L.16.002` Segreti: dove si tengono e chi li legge
3. `L.16.003` Cambiare un segreto senza fermare il servizio
4. `L.16.004` Le dipendenze: cosa c'è dentro il tuo software
5. `L.16.005` Aggiornare le dipendenze con criterio
6. `L.16.006` La catena di fornitura del software
7. `L.16.007` Firmare e verificare gli artefatti
8. `L.16.008` Controlli di sicurezza in pipeline
9. `L.16.009` Accessi della pipeline: il minimo necessario
10. `L.16.010` Lista di controllo di una pipeline sicura

### Blocco 5 · Operare e mantenere (L17-L20, lezioni 161-200)

Osservare, misurare l'affidabilità, rispondere agli incidenti e prepararsi ai guasti.

#### L17 · Monitoraggio e osservabilità

Metriche, log, tracce, cruscotti, allarmi utili e Prometheus e Grafana. Cintura: blu.

1. `L.17.001` Sapere cosa succede nel servizio
2. `L.17.002` Metriche, log e tracce
3. `L.17.003` Prometheus: raccogliere metriche
4. `L.17.004` Grafana: costruire un cruscotto
5. `L.17.005` Quattro segnali d'oro: tempo, traffico, errori, saturazione
6. `L.17.006` Log strutturati e centralizzati
7. `L.17.007` Tracce distribuite in sintesi
8. `L.17.008` Allarmi che servono e allarmi che stancano
9. `L.17.009` Controlli dall'esterno: il servizio risponde?
10. `L.17.010` Progetto: il cruscotto dell'applicazione del corso

#### L18 · Affidabilità e incidenti

Obiettivi di servizio, budget di errore, risposta agli incidenti, analisi senza colpe. Cintura: blu.

1. `L.18.001` Che cos'è l'affidabilità
2. `L.18.002` SLI, SLO e SLA
3. `L.18.003` Il budget di errore
4. `L.18.004` Reperibilità e turni
5. `L.18.005` Cosa fare quando scatta un allarme
6. `L.18.006` Gestire un incidente: ruoli e comunicazione
7. `L.18.007` Rimediare prima, capire dopo
8. `L.18.008` Analisi dopo l'incidente senza cercare colpevoli
9. `L.18.009` Imparare dagli incidenti: azioni che restano
10. `L.18.010` Esercizi: un incidente simulato dall'inizio alla fine

#### L19 · Backup, ripristino e continuità

Copie di sicurezza, obiettivi di ripristino, piani di emergenza, prove di guasto e scalabilità. Cintura: blu.

1. `L.19.001` Cosa può andare storto: dal disco al fornitore
2. `L.19.002` La regola 3-2-1
3. `L.19.003` RPO e RTO: quanto si può perdere e per quanto
4. `L.19.004` Ripristinare davvero: provare i backup
5. `L.19.005` Piano di emergenza (disaster recovery)
6. `L.19.006` Più regioni e più zone
7. `L.19.007` Test di carico: quanto regge il servizio
8. `L.19.008` Prove di guasto controllate (chaos engineering in sintesi)
9. `L.19.009` Pianificare la capacità
10. `L.19.010` Esercizi: ripristinare un servizio da zero

#### L20 · Progetto finale e carriera

Un servizio completo dall'idea al monitoraggio, con relazione, e come si cresce nel mestiere. Cintura: blu.

1. `L.20.001` Progetto: dall'idea ai requisiti
2. `L.20.002` Progetto: il codice e le sue prove
3. `L.20.003` Progetto: containerizzare e orchestrare
4. `L.20.004` Progetto: la pipeline di rilascio
5. `L.20.005` Progetto: l'infrastruttura descritta nel codice
6. `L.20.006` Progetto: monitoraggio e allarmi
7. `L.20.007` Progetto: sicurezza e costi
8. `L.20.008` Progetto: il piano di emergenza
9. `L.20.009` Presentare il progetto e la relazione
10. `L.20.010` Percorsi e certificazioni: come continuare

## R · Reti e internet

Come funziona davvero internet, dal cavo in casa alla rete che tiene insieme il mondo: Wi-Fi, switch e router, protocolli, strumenti di diagnosi, progettazione, prestazioni, sicurezza di rete, automazione e reti moderne.

- **Per chi:** Per chi vuole capire internet e le reti, o lavorare come tecnico di rete, anche partendo da zero.
- **Consigliato:** Il blocco 1 si segue da zero. Chi ha già fatto Fondamenta (F5-F8: IP, subnet, TCP/UDP, DNS, HTTP, VPN) trova qui gli stessi argomenti solo richiamati e poi approfonditi.
- **Cartella e `course:`:** `reti-internet` · **Domande:** `src/lib/practice/banks-nuovi/rNN.ts`

### Blocco 1 · Internet e la rete di casa (R1-R4, lezioni 1-40)

Cos'è internet, come arriva a casa e come si fa funzionare bene la propria rete.

#### R1 · Che cos'è internet

Cavi, provider, dorsali, data center, indirizzi e storia di una rete di reti. Cintura: bianca.

1. `R.01.001` Internet non è il web
2. `R.01.002` Una breve storia di internet
3. `R.01.003` Una rete di reti: come si collegano tra loro
4. `R.01.004` Il provider e il collegamento da casa
5. `R.01.005` Cavi in fibra, cavi sottomarini e dorsali
6. `R.01.006` I data center: dove stanno i siti
7. `R.01.007` Indirizzi e nomi: come ti trovano
8. `R.01.008` Che cosa succede quando guardi un video
9. `R.01.009` Chi governa internet (e chi no)
10. `R.01.010` Esercizi: tracciare il percorso di un pacchetto sulla mappa

#### R2 · La rete di casa

Router, modem, cavi, prese, indirizzi locali, collegare i dispositivi e capire cosa non va. Cintura: bianca.
**Rimando:** Gli indirizzi IP privati e il NAT sono spiegati in Fondamenta (F5, F7).

1. `R.02.001` Cosa c'è nella scatola del provider: modem e router
2. `R.02.002` I cavi Ethernet e le prese
3. `R.02.003` I dispositivi di casa e il loro indirizzo
4. `R.02.004` L'interfaccia del router: cosa si trova e cosa non toccare
5. `R.02.005` Nome della rete e password: scelte sensate
6. `R.02.006` Ospiti e dispositivi della casa intelligente
7. `R.02.007` Il controllo dei genitori e i limiti di cosa può fare
8. `R.02.008` Aggiornare il router
9. `R.02.009` Cosa vedere quando «internet non va»: gli step
10. `R.02.010` Esercizi: disegnare e documentare la rete di casa

#### R3 · Il Wi-Fi

Onde radio, bande e canali, standard, sicurezza WPA, copertura e velocità vera. Cintura: bianca.

1. `R.03.001` Come passano i dati nell'aria
2. `R.03.002` Le bande 2,4 e 5 GHz (e 6 GHz)
3. `R.03.003` I canali e le interferenze
4. `R.03.004` Gli standard Wi-Fi: 4, 5, 6, 6E, 7
5. `R.03.005` Perché la velocità reale è meno di quella scritta
6. `R.03.006` Copertura: muri, distanza e posizione del router
7. `R.03.007` Ripetitori, sistemi mesh e cavi
8. `R.03.008` La sicurezza: WEP, WPA, WPA2, WPA3
9. `R.03.009` Reti aperte e pubbliche: i rischi
10. `R.03.010` Esercizi: analizzare e migliorare il Wi-Fi di un appartamento

#### R4 · I servizi che usi ogni giorno

Posta, messaggi, streaming, chiamate video, giochi online e come funzionano in rete. Cintura: bianca.

1. `R.04.001` Come arriva un'email
2. `R.04.002` Messaggi istantanei: cosa viaggia e cosa si vede
3. `R.04.003` Lo streaming video e la qualità adattiva
4. `R.04.004` Chiamate e videochiamate: il ritardo e le interruzioni
5. `R.04.005` Giochi online: ping e latenza
6. `R.04.006` I CDN: perché un sito si apre veloce
7. `R.04.007` Cloud e sincronizzazione dei file
8. `R.04.008` Cosa vede il tuo provider e cosa no
9. `R.04.009` Test di velocità: cosa misurano
10. `R.04.010` Esercizi: capire perché la videochiamata si blocca

### Blocco 2 · Dentro la rete locale (R5-R8, lezioni 41-80)

Cavi, switch, strumenti di diagnosi e il progetto di una rete piccola.

#### R5 · Ethernet e cablaggio

Standard Ethernet, cavi in rame e fibra, connettori, prese, prove e cablaggio ordinato. Cintura: gialla.

1. `R.05.001` Ethernet: la lingua delle reti cablate
2. `R.05.002` Velocità e standard: 100 Mb, 1 Gb, 10 Gb
3. `R.05.003` Il cavo a coppie intrecciate e le categorie
4. `R.05.004` Connettori e prese RJ45
5. `R.05.005` Cavi diritti e cavi incrociati: com'era e com'è
6. `R.05.006` La fibra ottica: monomodale e multimodale
7. `R.05.007` Lunghezze massime e perdite
8. `R.05.008` Alimentare i dispositivi dal cavo (PoE)
9. `R.05.009` Provare un cavo: cosa dice il tester
10. `R.05.010` Esercizi: pianificare il cablaggio di un ufficio

#### R6 · Switch e rete locale

Come lavora uno switch, tabella degli indirizzi, broadcast, anelli e collegamenti multipli. Cintura: gialla.
**Rimando:** MAC, ARP e le VLAN introdotte sono in Fondamenta (F5, F8).

1. `R.06.001` Hub e switch: la differenza
2. `R.06.002` La tabella degli indirizzi MAC dello switch
3. `R.06.003` Domini di collisione e di broadcast
4. `R.06.004` Il guaio degli anelli nella rete
5. `R.06.005` Spanning tree in parole semplici
6. `R.06.006` Collegamenti multipli tra switch (aggregazione)
7. `R.06.007` Switch gestibili e non gestibili
8. `R.06.008` VLAN: ripasso e uso pratico
9. `R.06.009` Collegare VLAN diverse
10. `R.06.010` Esercizi: una rete a due switch nel simulatore

#### R7 · Strumenti di diagnosi

ping, traceroute, nslookup, ss, mtr, iperf, tcpdump: cercare un problema con metodo. Cintura: gialla.
**Rimando:** Wireshark e Packet Tracer sono in Fondamenta (F8).

1. `R.07.001` Un metodo: dal cavo all'applicazione
2. `R.07.002` ping: il cuore del controllo
3. `R.07.003` traceroute e mtr: il percorso e dove si perde
4. `R.07.004` nslookup e dig: interrogare il DNS
5. `R.07.005` ip e ss: indirizzi e connessioni sul computer
6. `R.07.006` curl: parlare con un sito dalla riga di comando
7. `R.07.007` iperf: misurare la velocità tra due punti
8. `R.07.008` tcpdump: guardare i pacchetti dal terminale
9. `R.07.009` Leggere i risultati senza farsi ingannare
10. `R.07.010` Esercizi: tre guasti da risolvere con il metodo

#### R8 · Progettare una rete piccola

Requisiti, piano degli indirizzi, DHCP, DNS locale, server e documentazione. Cintura: gialla.
**Rimando:** La suddivisione in sottoreti e il CIDR sono in Fondamenta (F6).

1. `R.08.001` Dai bisogni alla rete: le domande da fare
2. `R.08.002` Quanti dispositivi e quanta banda
3. `R.08.003` Il piano degli indirizzi con spazio per crescere
4. `R.08.004` Segmentare: ospiti, uffici e server
5. `R.08.005` Un server DHCP: configurazione e prenotazioni
6. `R.08.006` DNS locale: nomi per le macchine di casa
7. `R.08.007` Un NAS e i file condivisi
8. `R.08.008` Stampanti e dispositivi di rete
9. `R.08.009` Documentare la rete: schema e tabella
10. `R.08.010` Progetto: la rete di un piccolo studio professionale

### Blocco 3 · Instradamento e reti geografiche (R9-R12, lezioni 81-120)

Come i pacchetti trovano la strada: routing, BGP, IPv6 e collegamenti su lunga distanza.

#### R9 · Routing

Tabelle di routing, rotte statiche e dinamiche, RIP e OSPF in modo intuitivo. Cintura: arancione.
**Rimando:** Il routing introduttivo è in Fondamenta (F6): qui si va oltre le rotte semplici.

1. `R.09.001` Che cos'è un router e che cosa decide
2. `R.09.002` Leggere una tabella di routing
3. `R.09.003` La rotta più specifica vince
4. `R.09.004` Rotte statiche
5. `R.09.005` La rotta predefinita
6. `R.09.006` Perché servono rotte dinamiche
7. `R.09.007` Vettore di distanza e RIP
8. `R.09.008` Stato dei collegamenti e OSPF
9. `R.09.009` Il costo delle strade e la scelta del percorso
10. `R.09.010` Esercizi: tre router nel simulatore

#### R10 · BGP e come si tiene insieme internet

Sistemi autonomi, peering e transito, BGP in sintesi, guasti famosi e sicurezza dell'instradamento. Cintura: arancione.

1. `R.10.001` Internet è fatta di sistemi autonomi
2. `R.10.002` Il numero AS
3. `R.10.003` Transito e peering
4. `R.10.004` I punti di scambio (IXP)
5. `R.10.005` BGP: il protocollo che si fida
6. `R.10.006` Come BGP sceglie la strada
7. `R.10.007` Quando un errore di rotta mette fuori servizio un sito
8. `R.10.008` Il dirottamento delle rotte
9. `R.10.009` Proteggere l'instradamento: RPKI in sintesi
10. `R.10.010` Esercizi: leggere un percorso AS di un sito vero

#### R11 · IPv6 e il futuro degli indirizzi

Perché IPv4 finisce, indirizzi IPv6, configurazione automatica e coesistenza. Cintura: arancione.
**Rimando:** Una prima introduzione a IPv6 è in Fondamenta (F8).

1. `R.11.001` Gli indirizzi IPv4 sono finiti: cosa è successo
2. `R.11.002` Come è fatto un indirizzo IPv6
3. `R.11.003` Abbreviare gli indirizzi IPv6
4. `R.11.004` Tipi di indirizzi: globali, link-local e unique local
5. `R.11.005` Il prefisso e le sottoreti in IPv6
6. `R.11.006` Configurazione automatica (SLAAC) e DHCPv6
7. `R.11.007` Neighbor Discovery al posto di ARP
8. `R.11.008` IPv4 e IPv6 insieme: doppia pila e traduzione
9. `R.11.009` Sicurezza e privacy in IPv6
10. `R.11.010` Esercizi: leggere e scrivere indirizzi IPv6

#### R12 · Collegamenti geografici

Fibra, ADSL, mobile, satellite, collegamenti aziendali, SD-WAN e scelta del collegamento. Cintura: arancione.

1. `R.12.001` Dalla casa alla centrale: tecnologie di accesso
2. `R.12.002` ADSL e VDSL: come funzionano
3. `R.12.003` Fibra: FTTH, FTTC e FTTB
4. `R.12.004` Reti mobili e collegamenti radio
5. `R.12.005` Satellite: pro, contro e il ritardo
6. `R.12.006` Collegamenti dedicati per le aziende
7. `R.12.007` Collegare più sedi: VPN e linee private
8. `R.12.008` MPLS e SD-WAN in sintesi
9. `R.12.009` Ridondanza: due collegamenti sono meglio di uno
10. `R.12.010` Esercizi: scegliere il collegamento per tre sedi diverse

### Blocco 4 · Prestazioni, sicurezza e automazione (R13-R16, lezioni 121-160)

Far andare bene la rete, proteggerla e smettere di configurarla a mano.

#### R13 · Prestazioni e TCP a fondo

Banda, latenza, perdita, TCP in dettaglio, congestione, code e qualità del servizio. Cintura: verde.
**Rimando:** TCP e UDP di base sono in Fondamenta (F7).

1. `R.13.001` Banda, latenza e perdita: tre cose diverse
2. `R.13.002` Il prodotto banda per ritardo
3. `R.13.003` Come TCP sa quanto dati mandare: finestre
4. `R.13.004` La congestione e come TCP reagisce
5. `R.13.005` Perché la velocità cala quando c'è perdita
6. `R.13.006` Le code nei router e il bufferbloat
7. `R.13.007` Qualità del servizio: dare la precedenza
8. `R.13.008` UDP e le applicazioni in tempo reale
9. `R.13.009` Misurare le prestazioni con metodo
10. `R.13.010` Esercizi: perché il trasferimento è lento

#### R14 · Affidabilità e monitoraggio

Ridondanza, gateway ridondanti, SNMP, registri, grafici e allarmi della rete. Cintura: verde.

1. `R.14.001` Un guasto non deve fermare tutto
2. `R.14.002` Punti singoli di guasto
3. `R.14.003` Gateway ridondanti
4. `R.14.004` Collegamenti e alimentazione doppi
5. `R.14.005` SNMP: chiedere ai dispositivi come stanno
6. `R.14.006` Raccogliere e conservare i log di rete
7. `R.14.007` Grafici di traffico e di utilizzo
8. `R.14.008` Allarmi: cosa vale la pena sapere subito
9. `R.14.009` Aggiornare i dispositivi senza fermare la rete
10. `R.14.010` Esercizi: un piccolo monitoraggio con strumenti gratuiti

#### R15 · Sicurezza della rete per chi la progetta

Regole di accesso, protezione delle porte, autenticazione 802.1X, VPN, zero trust e buone prassi. Cintura: verde.
**Rimando:** Firewall, IDS e segmentazione sono in Cybersecurity (C4): qui la prospettiva di chi costruisce la rete.

1. `R.15.001` La rete come castello e come città
2. `R.15.002` Segmentare per limitare i danni
3. `R.15.003` Liste di controllo degli accessi (ACL)
4. `R.15.004` Proteggere le porte dello switch
5. `R.15.005` Autenticare chi si collega: 802.1X
6. `R.15.006` Wi-Fi aziendale con accesso individuale
7. `R.15.007` Accesso remoto sicuro con VPN
8. `R.15.008` Zero trust: non fidarsi della sola posizione
9. `R.15.009` Aggiornamenti e configurazioni sicure di base
10. `R.15.010` Lista di controllo per una rete aziendale

#### R16 · Automazione delle reti

Script, configurazioni come codice, API dei dispositivi, modelli e controllo delle modifiche. Cintura: verde.
**Rimando:** Python base: Fondamenta (F9) e Programmazione generale (P).

1. `R.16.001` Perché automatizzare la rete
2. `R.16.002` Copie delle configurazioni
3. `R.16.003` Python per parlare con i dispositivi
4. `R.16.004` Modelli di configurazione
5. `R.16.005` Leggere e scrivere dati strutturati: JSON e YAML
6. `R.16.006` API dei dispositivi e dei servizi di rete
7. `R.16.007` Controllare che la rete sia come dovrebbe
8. `R.16.008` Le modifiche in squadra con Git
9. `R.16.009` Ansible per le reti in sintesi
10. `R.16.010` Progetto: uno script che controlla una rete di prova

### Blocco 5 · Reti moderne (R17-R20, lezioni 161-200)

Data center, reti mobili e dell'internet delle cose, protocolli nuovi e un progetto completo.

#### R17 · Reti nel cloud e nei data center

Architetture dei data center, reti virtuali, bilanciamento, traffico nord-sud ed est-ovest. Cintura: blu.

1. `R.17.001` Dentro un data center
2. `R.17.002` Rack, switch e cavi
3. `R.17.003` Le architetture a due livelli: spine e leaf
4. `R.17.004` Traffico nord-sud ed est-ovest
5. `R.17.005` Reti virtuali e sovrapposte (overlay)
6. `R.17.006` Reti definite dal software
7. `R.17.007` Bilanciatori di carico a fondo
8. `R.17.008` Le reti dei container
9. `R.17.009` Interconnessione tra data center
10. `R.17.010` Esercizi: progettare la rete di una piccola sala server

#### R18 · Reti mobili e internet delle cose

Rete cellulare 4G e 5G, Bluetooth, Zigbee, LoRa, protocolli per dispositivi piccoli. Cintura: blu.

1. `R.18.001` Come funziona la rete cellulare
2. `R.18.002` Celle, antenne e passaggio tra celle
3. `R.18.003` Dal 3G al 5G: cosa cambia davvero
4. `R.18.004` Bluetooth e Bluetooth a basso consumo
5. `R.18.005` Zigbee, Thread e la casa intelligente
6. `R.18.006` LoRa e le reti a lungo raggio
7. `R.18.007` Protocolli leggeri: MQTT
8. `R.18.008` Quanta energia e quanta banda servono ai dispositivi piccoli
9. `R.18.009` Sicurezza e aggiornamenti dei dispositivi connessi
10. `R.18.010` Esercizi: scegliere la tecnologia per un sensore in un campo

#### R19 · Protocolli del web moderno

HTTP/2 e HTTP/3, QUIC, TLS 1.3, DNS sicuro, WebSocket e WebRTC. Cintura: blu.

1. `R.19.001` Com'è cambiato il web dagli anni Novanta
2. `R.19.002` HTTP/1.1 e i suoi limiti
3. `R.19.003` HTTP/2: molte richieste su una connessione
4. `R.19.004` QUIC e HTTP/3
5. `R.19.005` TLS 1.3: più veloce e più sicuro
6. `R.19.006` DNS cifrato: DoH e DoT
7. `R.19.007` WebSocket: la connessione che resta aperta
8. `R.19.008` WebRTC: audio e video tra browser
9. `R.19.009` Cache, compressione e prestazioni
10. `R.19.010` Esercizi: osservare le versioni di HTTP usate da un sito

#### R20 · Progetto finale e mestiere

Progettare, documentare e provare una rete completa; i mestieri e le certificazioni. Cintura: blu.

1. `R.20.001` Progetto: i requisiti di una scuola o di uno studio
2. `R.20.002` Progetto: il piano degli indirizzi
3. `R.20.003` Progetto: lo schema fisico
4. `R.20.004` Progetto: la configurazione di switch e router
5. `R.20.005` Progetto: Wi-Fi e ospiti
6. `R.20.006` Progetto: sicurezza e accessi
7. `R.20.007` Progetto: monitoraggio e documentazione
8. `R.20.008` Progetto: prove di funzionamento e di guasto
9. `R.20.009` I mestieri di rete: tecnico, amministratore, ingegnere
10. `R.20.010` Certificazioni e come continuare a imparare

## E · Hacking etico e CTF

Imparare a pensare come un attaccante per difendere meglio, solo in modo legale: etica e legge, laboratorio isolato, gare CTF, crittografia, forensics, web, sistemi, reti, analisi dei programmi e metodo di un test di sicurezza. Solo su bersagli propri o autorizzati.

- **Per chi:** Per chi vuole imparare la sicurezza offensiva in modo etico e legale, e partecipare alle gare CTF.
- **Consigliato:** Serve sapere usare il terminale Linux e le basi di rete (Fondamenta F1-F7). Il corso Cybersecurity (C1-C5) è la base teorica consigliata.
- **Cartella e `course:`:** `hacking-etico` · **Domande:** `src/lib/practice/banks-nuovi/eNN.ts`

### Blocco 1 · Regole, laboratorio e CTF (E1-E4, lezioni 1-40)

Prima di tutto la legge e il laboratorio isolato; poi che cos'è una gara CTF.

#### E1 · Etica e legge

Cosa è lecito, cosa è reato, autorizzazione scritta, divulgazione responsabile e codice di comportamento. Cintura: bianca.
**Rimando:** Principi, etica e legge sono introdotti in Cybersecurity (C1): qui si applicano al mestiere di chi attacca per difendere.

1. `E.01.001` Hacker, cracker e le parole giuste
2. `E.01.002` Perché si attacca per difendere
3. `E.01.003` L'accesso abusivo in Italia: cosa dice la legge
4. `E.01.004` Le tre regole: tuo, autorizzato, in un ambiente isolato
5. `E.01.005` L'autorizzazione scritta e l'ambito di un test
6. `E.01.006` Le regole d'ingaggio
7. `E.01.007` Divulgazione responsabile delle vulnerabilità
8. `E.01.008` I programmi di ricompensa (bug bounty): regole e limiti
9. `E.01.009` Un codice di comportamento personale
10. `E.01.010` Esercizi: lecito o no? casi da valutare

#### E2 · Il laboratorio sicuro

Macchine virtuali, rete isolata, sistemi volutamente vulnerabili, istantanee e regole di igiene. Cintura: bianca.
**Rimando:** Macchine virtuali e Kali: Fondamenta (F1). Home lab: Cybersecurity (C11).

1. `E.02.001` Perché serve un laboratorio
2. `E.02.002` Cosa serve: computer, memoria e disco
3. `E.02.003` Una macchina virtuale per attaccare e una per difendersi
4. `E.02.004` Rete isolata solo-host: niente contatto con internet
5. `E.02.005` Sistemi volutamente vulnerabili per esercitarsi
6. `E.02.006` Istantanee: tornare indietro in un clic
7. `E.02.007` Ordine e igiene: cartelle, note e prove
8. `E.02.008` Come non esporre il laboratorio per errore
9. `E.02.009` Aggiornare e mantenere gli strumenti
10. `E.02.010` Esercizi: il laboratorio pronto e provato

#### E3 · Che cos'è una CTF

Formati delle gare, categorie, flag, punteggi, piattaforme legali e gratuite, giocare in squadra. Cintura: bianca.

1. `E.03.001` Che cos'è una gara CTF
2. `E.03.002` Le flag: cosa sono e come si consegnano
3. `E.03.003` Jeopardy e attacco-difesa
4. `E.03.004` Le categorie: crittografia, web, forensics, binari, miscellanea
5. `E.03.005` Le piattaforme legali per allenarsi
6. `E.03.006` Le CTF italiane e per ragazzi
7. `E.03.007` Come si legge il testo di una sfida
8. `E.03.008` Come si gioca in squadra
9. `E.03.009` I write-up: raccontare come si è risolto
10. `E.03.010` Esercizi: la prima sfida guidata

#### E4 · Strumenti e abitudini del mestiere

Terminale, appunti, strumenti di conversione, Python per le sfide, ricerca e metodo. Cintura: bianca.

1. `E.04.001` Il metodo prima degli strumenti
2. `E.04.002` Prendere appunti mentre si lavora
3. `E.04.003` Il terminale di chi risolve sfide
4. `E.04.004` Convertire e decodificare: CyberChef
5. `E.04.005` Python come coltellino svizzero
6. `E.04.006` Leggere la documentazione e cercare bene
7. `E.04.007` Quando ci si blocca: cosa provare
8. `E.04.008` Gestire il tempo in una gara
9. `E.04.009` Imparare dai write-up degli altri
10. `E.04.010` Esercizi: tre sfide di riscaldamento

### Blocco 2 · Le prime categorie di sfide (E5-E8, lezioni 41-80)

Crittografia semplice, forensics, ricerca da fonti aperte e piccoli programmi.

#### E5 · Codifiche e crittografia semplice

Base64, esadecimale, cifrari classici, XOR, hash e come si riconoscono. Cintura: gialla.
**Rimando:** La crittografia moderna a fondo è in Cybersecurity (C2).

1. `E.05.001` Codificare non è cifrare
2. `E.05.002` Base64, esadecimale e binario
3. `E.05.003` Riconoscere una codifica a colpo d'occhio
4. `E.05.004` Il cifrario di Cesare
5. `E.05.005` Cifrari a sostituzione e analisi delle frequenze
6. `E.05.006` Il cifrario di Vigenère
7. `E.05.007` Lo XOR e le sue proprietà
8. `E.05.008` Hash: cosa sono e come si riconoscono
9. `E.05.009` Le tabelle arcobaleno e perché il sale le ferma
10. `E.05.010` Esercizi: sette messaggi da decifrare

#### E6 · Forensics e steganografia

Analisi di file, metadati, immagini nascoste, archivi e tracce di rete, in modo legale. Cintura: gialla.
**Rimando:** Forensics e incident response: Cybersecurity (C9).

1. `E.06.001` Che cos'è l'analisi forense nelle CTF
2. `E.06.002` Il tipo di un file e i numeri magici
3. `E.06.003` I metadati di una foto
4. `E.06.004` Estrarre il testo dai file: strings
5. `E.06.005` Dentro gli archivi e i documenti
6. `E.06.006` Steganografia: nascondere dati nelle immagini
7. `E.06.007` Immagini e canali di colore
8. `E.06.008` Suoni e spettrogrammi
9. `E.06.009` Leggere una cattura di rete
10. `E.06.010` Esercizi: un'indagine su un file sospetto

#### E7 · OSINT: informazioni da fonti aperte

Cercare in modo etico: motori di ricerca, immagini, mappe, registri pubblici, rischi e limiti. Cintura: gialla.
**Rimando:** Privacy e anonimato: Cybersecurity (C10).

1. `E.07.001` Che cos'è l'OSINT e a cosa serve
2. `E.07.002` Le regole: solo dati pubblici e solo per scopi legittimi
3. `E.07.003` Cercare con precisione
4. `E.07.004` Le immagini: ricerca inversa e luoghi
5. `E.07.005` Le mappe e le foto satellitari
6. `E.07.006` Domini e siti: chi c'è dietro
7. `E.07.007` Account e nomi utente: cosa si trova e cosa non si deve cercare
8. `E.07.008` Verificare le notizie e i falsi
9. `E.07.009` Proteggere la propria impronta digitale
10. `E.07.010` Esercizi: ritrovare un luogo da una foto

#### E8 · Programmare per le sfide

Piccoli programmi in Python: file, testo, rete, espressioni regolari e automatizzare il lavoro ripetitivo. Cintura: gialla.
**Rimando:** Python base: Fondamenta (F9).

1. `E.08.001` Quando conviene scrivere uno script
2. `E.08.002` Leggere e trasformare file
3. `E.08.003` Le espressioni regolari per cercare
4. `E.08.004` Numeri, byte e conversioni
5. `E.08.005` Parlare con un servizio di prova via rete
6. `E.08.006` Chiedere pagine web da uno script
7. `E.08.007` Provare molte combinazioni nel proprio laboratorio
8. `E.08.008` Calcoli con numeri grandi
9. `E.08.009` Librerie utili per le CTF
10. `E.08.010` Esercizi: automatizzare una sfida lunga

### Blocco 3 · Il web (E9-E12, lezioni 81-120)

Come si ragiona su un sito, le vulnerabilità più comuni e come si correggono.

#### E9 · Il web con gli occhi di un tester

Richieste e risposte, strumenti del browser, proxy di intercettazione e mappa di un'applicazione. Cintura: arancione.
**Rimando:** OWASP Top 10 e difese: Cybersecurity (C5).

1. `E.09.001` Richieste, risposte e codici di stato
2. `E.09.002` Intestazioni e cookie
3. `E.09.003` Gli strumenti dello sviluppatore del browser
4. `E.09.004` Un proxy che intercetta: cosa fa e perché serve
5. `E.09.005` Mappare un'applicazione
6. `E.09.006` Parametri, form e API
7. `E.09.007` Cosa dice il codice della pagina
8. `E.09.008` File e cartelle nascoste: robots.txt e simili
9. `E.09.009` Perché non si ferma al lato del browser
10. `E.09.010` Esercizi: esplorare un sito di prova

#### E10 · Vulnerabilità web: iniezione e script

SQL injection, XSS e comandi: come nascono, come si riconoscono nel laboratorio e come si correggono. Cintura: arancione.
**Rimando:** Query sicure e SQL injection: Cybersecurity (C6).

1. `E.10.001` Quando l'input diventa codice
2. `E.10.002` SQL injection: l'idea in un esempio
3. `E.10.003` Riconoscere una SQL injection nel laboratorio
4. `E.10.004` Come si corregge una SQL injection
5. `E.10.005` XSS: script iniettati nella pagina
6. `E.10.006` Tipi di XSS
7. `E.10.007` Come si corregge un XSS
8. `E.10.008` Iniezione di comandi: l'idea
9. `E.10.009` Validare, filtrare, escapare: tre cose diverse
10. `E.10.010` Esercizi: trovare e correggere tre falle in un'app di prova

#### E11 · Vulnerabilità web: accessi e logica

Autenticazione debole, accesso a oggetti altrui, upload, SSRF e errori di progettazione. Cintura: arancione.

1. `E.11.001` Autenticazione fragile: cosa si guarda
2. `E.11.002` Gestione delle sessioni
3. `E.11.003` Accesso agli oggetti altrui (IDOR)
4. `E.11.004` Controllo dei permessi mancante
5. `E.11.005` Caricare file: i rischi
6. `E.11.006` Richieste dal server verso l'interno: SSRF
7. `E.11.007` Errori di logica: sconti, quantità e passaggi saltati
8. `E.11.008` File inclusi e percorsi: cosa si può sbagliare
9. `E.11.009` Configurazioni errate e informazioni di troppo
10. `E.11.010` Esercizi: un'app di prova con cinque difetti

#### E12 · Sfide web e write-up

Risolvere sfide web con metodo, API, JWT e scrivere un buon resoconto. Cintura: arancione.

1. `E.12.001` Una sfida web dall'inizio alla fine
2. `E.12.002` Come si cerca il punto debole con metodo
3. `E.12.003` Le API e i loro difetti tipici
4. `E.12.004` JWT e token: cosa si controlla
5. `E.12.005` Sessioni e cookie nelle sfide
6. `E.12.006` Evitare i vicoli ciechi
7. `E.12.007` Strumenti automatici: aiuto, non pensiero
8. `E.12.008` Scrivere un write-up chiaro
9. `E.12.009` Segnalare un problema vero: come si scrive
10. `E.12.010` Esercizi: tre sfide web e il resoconto

### Blocco 4 · Sistemi e reti (E13-E16, lezioni 121-160)

Ricognizione, privilegi, password e traffico di rete, sempre in laboratorio.

#### E13 · Ricognizione e scansione

Scoprire host e servizi nel laboratorio, leggere i risultati e distinguere il segnale dal rumore. Cintura: verde.
**Rimando:** Ricognizione e scansioni nel laboratorio sono introdotte in Cybersecurity (C8).

1. `E.13.001` Ricognizione passiva e attiva
2. `E.13.002` Scoprire gli host di una rete di prova
3. `E.13.003` Le porte e cosa nascondono
4. `E.13.004` Scansionare con nmap nel laboratorio
5. `E.13.005` Riconoscere servizi e versioni
6. `E.13.006` Leggere il risultato di una scansione
7. `E.13.007` Quanto rumore fa una scansione
8. `E.13.008` Cosa vede chi difende
9. `E.13.009` Scansioni non permesse: dove finisce il lecito
10. `E.13.010` Esercizi: la mappa di una rete di prova

#### E14 · Privilegi su Linux

Permessi, programmi con privilegi, sudo, attività pianificate e come si fa hardening. Cintura: verde.
**Rimando:** Permessi e hardening: Fondamenta (F3) e Cybersecurity (C12).

1. `E.14.001` Che cos'è l'escalation dei privilegi
2. `E.14.002` Utenti, gruppi e permessi: ripasso
3. `E.14.003` I file con permessi speciali
4. `E.14.004` sudo e le sue configurazioni
5. `E.14.005` Attività pianificate e script modificabili
6. `E.14.006` Servizi e percorsi sbagliati
7. `E.14.007` Segreti dimenticati nei file
8. `E.14.008` Strumenti che cercano errori di configurazione
9. `E.14.009` Come si corregge ogni caso
10. `E.14.010` Esercizi: una macchina di prova da mettere in sicurezza

#### E15 · Password, hash e accessi

Come si conservano le password, attacchi a dizionario nel laboratorio, politiche e autenticazione forte. Cintura: verde.
**Rimando:** Password e 2FA: Cybersecurity (C3).

1. `E.15.001` Come i sistemi conservano le password
2. `E.15.002` Funzioni hash lente e sale
3. `E.15.003` Password deboli e quelle che si indovinano
4. `E.15.004` L'attacco a dizionario in un laboratorio
5. `E.15.005` Le liste di parole e le regole
6. `E.15.006` I tentativi bloccati e i limiti di velocità
7. `E.15.007` Il riuso delle password
8. `E.15.008` Autenticazione a più fattori: cosa ferma
9. `E.15.009` Gestori di password
10. `E.15.010` Esercizi: misurare la forza di password in un test controllato

#### E16 · Traffico di rete e attacchi locali

Catture di pacchetti, protocolli in chiaro, attacchi sulla rete locale spiegati e difesi. Cintura: verde.
**Rimando:** Analisi del traffico: Cybersecurity (C13); Wireshark: Fondamenta (F8).

1. `E.16.001` Leggere il traffico in una cattura
2. `E.16.002` I protocolli in chiaro e cosa rivelano
3. `E.16.003` Credenziali nel traffico di una rete di prova
4. `E.16.004` ARP e l'attacco al centro (MITM) spiegato
5. `E.16.005` Come si difende una rete locale
6. `E.16.006` DNS: risposte false e difese
7. `E.16.007` Il Wi-Fi e le sue debolezze note
8. `E.16.008` Proteggere la propria rete: lista di controllo
9. `E.16.009` Strumenti di difesa che rilevano questi attacchi
10. `E.16.010` Esercizi: un'indagine su una cattura di prova

### Blocco 5 · Programmi, metodo e carriera (E17-E20, lezioni 161-200)

Capire come funziona un programma, il test di sicurezza completo e come si continua.

#### E17 · Reverse engineering: le basi

Come è fatto un programma, assembly in parole semplici, strumenti di analisi, in sfide legali. Cintura: blu.

1. `E.17.001` Che cos'è il reverse engineering e a cosa serve
2. `E.17.002` Dal codice al programma eseguibile
3. `E.17.003` Come è fatto un file eseguibile
4. `E.17.004` Registri, memoria e istruzioni: la prima occhiata
5. `E.17.005` Leggere un piccolo assembly
6. `E.17.006` Strumenti: disassemblatori e decompilatori
7. `E.17.007` Analisi statica e dinamica
8. `E.17.008` Un programma che chiede una password: come si ragiona
9. `E.17.009` Programmi protetti e ostacoli comuni
10. `E.17.010` Esercizi: tre programmi di prova

#### E18 · Memoria e vulnerabilità dei programmi

Pila e heap, errori di memoria, protezioni moderne e come si scrive codice più sicuro. Cintura: blu.
**Rimando:** Sicurezza nel ciclo di sviluppo: Cybersecurity (C24).

1. `E.18.001` Come usa la memoria un programma
2. `E.18.002` La pila e le chiamate
3. `E.18.003` Quando un dato va oltre lo spazio assegnato
4. `E.18.004` Il buffer overflow: l'idea
5. `E.18.005` Errori nelle stringhe di formato e negli interi
6. `E.18.006` L'heap e i suoi errori
7. `E.18.007` Le protezioni: canarino, pila non eseguibile, ASLR
8. `E.18.008` Perché le protezioni non bastano da sole
9. `E.18.009` Linguaggi sicuri e pratiche difensive
10. `E.18.010` Esercizi: leggere il codice di un programma debole in laboratorio

#### E19 · Un test di sicurezza completo

Metodologia dalla preparazione al rapporto, priorità dei rischi, rapporto per chi decide. Cintura: blu.
**Rimando:** Metodologia del penetration test: Cybersecurity (C21).

1. `E.19.001` Le fasi di un test di sicurezza
2. `E.19.002` Preparare: obiettivi, ambito e permessi
3. `E.19.003` Raccogliere le informazioni
4. `E.19.004` Trovare i punti deboli
5. `E.19.005` Verificare in sicurezza ciò che si è trovato
6. `E.19.006` Non fare danni: le regole d'oro
7. `E.19.007` Valutare la gravità: i punteggi
8. `E.19.008` Scrivere il rapporto: chi lo legge e cosa gli serve
9. `E.19.009` Consigliare le correzioni
10. `E.19.010` Esercizi: un test completo in laboratorio, con rapporto

#### E20 · CTF in squadra, bug bounty e carriera

Giocare in squadra, programmi di ricompensa, certificazioni e un progetto finale. Cintura: blu.

1. `E.20.001` Organizzare una squadra: ruoli e strumenti
2. `E.20.002` Condividere appunti e risultati
3. `E.20.003` Gestire una gara di molte ore
4. `E.20.004` Dopo la gara: analisi e crescita
5. `E.20.005` Bug bounty: come funzionano davvero
6. `E.20.006` Il primo rapporto di vulnerabilità
7. `E.20.007` I mestieri della sicurezza offensiva
8. `E.20.008` Certificazioni: cosa servono e cosa costano
9. `E.20.009` Progetto finale: il tuo laboratorio e il tuo portfolio
10. `E.20.010` Come continuare: gare, comunità e studio

## X · Blockchain e crypto (tecnica)

Come funzionano davvero blockchain e criptovalute dal punto di vista tecnico: crittografia, Bitcoin, Ethereum e contratti intelligenti, consenso, reti di secondo livello, sicurezza e truffe. Un corso di tecnica, non di investimenti: nessun consiglio finanziario.

- **Per chi:** Per chi vuole capire la tecnologia dietro le criptovalute, o imparare a scrivere contratti intelligenti.
- **Consigliato:** Il blocco 1 si segue da zero. Dal blocco 3 serve un po' di programmazione (Programmazione generale P1-P4 o Sviluppo web W7-W8).
- **Cartella e `course:`:** `blockchain` · **Domande:** `src/lib/practice/banks-nuovi/xNN.ts`

### Blocco 1 · Perché esiste la blockchain (X1-X4, lezioni 1-40)

Il problema della fiducia, gli ingredienti crittografici e Bitcoin spiegato dal principio.

#### X1 · Il problema che risolve

Registri, fiducia, denaro digitale, doppia spesa e che cosa promette (e non promette) una blockchain. Cintura: bianca.

1. `X.01.001` Chi tiene il registro: banche, notai e fiducia
2. `X.01.002` Il denaro digitale e il problema della doppia spesa
3. `X.01.003` Un registro condiviso: l'idea
4. `X.01.004` Una breve storia: dal 1991 a Bitcoin
5. `X.01.005` Che cos'è davvero una blockchain
6. `X.01.006` Cosa promette e cosa non promette
7. `X.01.007` Pubblica, privata, con permessi
8. `X.01.008` Blockchain e database: quando serve davvero
9. `X.01.009` Parole giuste e parole gonfiate: token, coin, crypto
10. `X.01.010` Esercizi: valutare tre idee di «blockchain per tutto»

#### X2 · Gli ingredienti crittografici

Hash, alberi di Merkle, chiavi pubbliche e private, firme digitali e numeri casuali. Cintura: bianca.
**Rimando:** Hash, cifratura e firme sono in Cybersecurity (C2): qui si usano per costruire la blockchain.

1. `X.02.001` Hash: l'impronta digitale dei dati
2. `X.02.002` Proprietà di un buon hash: SHA-256
3. `X.02.003` Provare un hash a mano e con il codice
4. `X.02.004` Concatenare i blocchi con gli hash
5. `X.02.005` L'albero di Merkle
6. `X.02.006` Chiave privata e chiave pubblica
7. `X.02.007` La firma digitale: provare che sei tu
8. `X.02.008` Indirizzi: come si ricavano dalla chiave pubblica
9. `X.02.009` Numeri casuali: perché sono importanti
10. `X.02.010` Esercizi: costruire una mini catena di blocchi in Python

#### X3 · Bitcoin: come funziona

Transazioni, blocchi, minatori, ricompense, commissioni e il percorso di un pagamento. Cintura: bianca.

1. `X.03.001` Il documento di Satoshi Nakamoto
2. `X.03.002` Una transazione: ingressi e uscite
3. `X.03.003` Gli UTXO: monete e resto
4. `X.03.004` Dal pagamento al blocco
5. `X.03.005` Il lavoro dei minatori
6. `X.03.006` La prova di lavoro in parole semplici
7. `X.03.007` La ricompensa e il dimezzamento
8. `X.03.008` Le commissioni
9. `X.03.009` Quante conferme servono
10. `X.03.010` Esercizi: seguire una transazione vera su un esploratore di blocchi

#### X4 · Portafogli e chiavi

Cos'è un portafoglio, frase di recupero, tipi di portafoglio, copie di sicurezza e errori da evitare. Cintura: bianca.

1. `X.04.001` Un portafoglio non contiene monete
2. `X.04.002` Chiavi, indirizzi e saldo
3. `X.04.003` La frase di recupero (seed)
4. `X.04.004` Portafogli software, hardware e su carta
5. `X.04.005` Chi custodisce le chiavi: te o un servizio
6. `X.04.006` Come si fa una copia di sicurezza
7. `X.04.007` Phishing e finti portafogli
8. `X.04.008` Cosa succede se perdi le chiavi
9. `X.04.009` Usare una rete di prova senza rischi
10. `X.04.010` Esercizi: creare un portafoglio di prova e firmare un messaggio

### Blocco 2 · Dentro Bitcoin (X5-X8, lezioni 41-80)

Script, rete, consenso, limiti e miglioramenti.

#### X5 · Transazioni e script

Formato delle transazioni, linguaggio Script, tipi di indirizzi, multifirma e blocchi temporali. Cintura: gialla.

1. `X.05.001` Com'è fatta una transazione dentro
2. `X.05.002` Lo script che blocca una moneta
3. `X.05.003` Pagare a un indirizzo: il caso più comune
4. `X.05.004` Pagare a più firme (multifirma)
5. `X.05.005` Blocchi temporali
6. `X.05.006` I tipi di indirizzi: da quelli vecchi ai nuovi
7. `X.05.007` Segregated Witness: cosa ha cambiato
8. `X.05.008` Taproot in sintesi
9. `X.05.009` Leggere una transazione con gli strumenti
10. `X.05.010` Esercizi: costruire e verificare una transazione di prova

#### X6 · Rete e consenso

Nodi, propagazione, catena più lunga, biforcazioni, attacco del 51% e finalità probabilistica. Cintura: gialla.

1. `X.06.001` I nodi: chi fa funzionare la rete
2. `X.06.002` Come si propaga una transazione
3. `X.06.003` La memoria delle transazioni in attesa (mempool)
4. `X.06.004` La catena più lunga (più lavoro) vince
5. `X.06.005` Biforcazioni temporanee
6. `X.06.006` Quando una transazione è sicura
7. `X.06.007` L'attacco del 51%
8. `X.06.008` Difficoltà e regolazione dei blocchi
9. `X.06.009` Fork duri e fork morbidi
10. `X.06.010` Esercizi: simulare una biforcazione

#### X7 · Il mining

Cos'è davvero il mining, hardware, mining pool, energia, centralizzazione e incentivi. Cintura: gialla.

1. `X.07.001` Cos'è il mining e cosa non è
2. `X.07.002` La gara per il nonce
3. `X.07.003` Dalle CPU agli ASIC
4. `X.07.004` Le mining pool
5. `X.07.005` Quanta energia usa e le discussioni intorno
6. `X.07.006` I costi e la ricompensa: gli incentivi
7. `X.07.007` Centralizzazione: chi controlla la rete
8. `X.07.008` Come si ripartisce il potere tra minatori, nodi e utenti
9. `X.07.009` Cosa succede quando le ricompense finiscono
10. `X.07.010` Esercizi: calcolare la probabilità di trovare un blocco in un caso di esempio

#### X8 · Limiti e miglioramenti

Velocità, costi, rete Lightning, privacy, ordini di grandezza e proposte di cambiamento. Cintura: gialla.

1. `X.08.001` Quante transazioni al secondo
2. `X.08.002` Perché i blocchi non sono più grandi
3. `X.08.003` Canali di pagamento e la rete Lightning
4. `X.08.004` Come funziona un pagamento Lightning
5. `X.08.005` Privacy: cosa si vede sulla catena
6. `X.08.006` Tecniche per migliorare la riservatezza e i loro limiti
7. `X.08.007` Come si cambiano le regole: le proposte
8. `X.08.008` Altre criptovalute nate da Bitcoin
9. `X.08.009` Confronto tra approcci: sicurezza, velocità, apertura
10. `X.08.010` Esercizi: leggere e commentare una proposta di miglioramento

### Blocco 3 · Ethereum e contratti intelligenti (X9-X12, lezioni 81-120)

Programmi che vivono sulla blockchain e come si scrivono, si provano e si usano.

#### X9 · Ethereum

Conti, saldi, gas, macchina virtuale, stato e transazioni. Cintura: arancione.

1. `X.09.001` Da una moneta a un computer condiviso
2. `X.09.002` Conti con saldo e conti con codice
3. `X.09.003` Il gas: pagare il calcolo
4. `X.09.004` La macchina virtuale di Ethereum
5. `X.09.005` Lo stato della rete
6. `X.09.006` Una transazione su Ethereum
7. `X.09.007` Blocchi e commissioni
8. `X.09.008` Le reti di prova e i rubinetti gratuiti
9. `X.09.009` Esplorare un contratto sul sito di un esploratore di blocchi
10. `X.09.010` Esercizi: inviare una transazione su una rete di prova

#### X10 · Scrivere contratti con Solidity

Variabili, funzioni, visibilità, eventi, errori e un primo contratto completo. Cintura: arancione.
**Rimando:** Le basi di programmazione sono in Programmazione generale (P1-P3).

1. `X.10.001` Un contratto intelligente è un programma
2. `X.10.002` Solidity: struttura di un contratto
3. `X.10.003` Tipi di dati e variabili di stato
4. `X.10.004` Funzioni e visibilità
5. `X.10.005` Chi chiama il contratto: msg.sender
6. `X.10.006` Mappature e strutture
7. `X.10.007` Eventi: il diario del contratto
8. `X.10.008` Errori e controlli: require e revert
9. `X.10.009` Ricevere e inviare valore
10. `X.10.010` Esercizi: il contratto di un salvadanaio

#### X11 · Provare e pubblicare un contratto

Ambienti di sviluppo, test automatici, rete di prova, verifica del codice e costi di pubblicazione. Cintura: arancione.

1. `X.11.001` L'ambiente di sviluppo: Hardhat o Foundry
2. `X.11.002` Una rete locale di prova
3. `X.11.003` Scrivere test per un contratto
4. `X.11.004` Casi limite da provare
5. `X.11.005` Pubblicare su una rete di prova
6. `X.11.006` Interagire con il contratto dalla console
7. `X.11.007` Costi del gas e come ridurli
8. `X.11.008` Verificare il codice pubblicato
9. `X.11.009` I contratti non si cambiano: come si aggiornano
10. `X.11.010` Progetto: un contratto di raccolta fondi per una classe

#### X12 · Token e applicazioni

Token fungibili e collezionabili, standard, interfacce web e collegamento ai portafogli. Cintura: arancione.

1. `X.12.001` Cos'è un token
2. `X.12.002` Lo standard dei token fungibili (ERC-20)
3. `X.12.003` Creare un token di prova
4. `X.12.004` Lo standard per oggetti unici (ERC-721)
5. `X.12.005` Dove stanno davvero le immagini
6. `X.12.006` Collegare una pagina web al portafoglio
7. `X.12.007` Leggere dati dal contratto con ethers
8. `X.12.008` Inviare una transazione dalla pagina
9. `X.12.009` Gestire errori e conferme
10. `X.12.010` Progetto: una piccola applicazione su una rete di prova

### Blocco 4 · Strumenti avanzati e finanza decentralizzata (X13-X16, lezioni 121-160)

Altri tipi di consenso, reti di secondo livello e come funziona (e dove si rompe) la DeFi.

#### X13 · Altri tipi di consenso

Prova di partecipazione, validatori, finalità, tolleranza ai guasti bizantini e confronto. Cintura: verde.
**Rimando:** Il consenso nei sistemi distribuiti in generale è in Database e dati a grande scala (B15).

1. `X.13.001` Il problema dei generali bizantini
2. `X.13.002` Perché si cercano alternative alla prova di lavoro
3. `X.13.003` La prova di partecipazione
4. `X.13.004` Validatori e penalità
5. `X.13.005` La finalità: quando un blocco non si cambia più
6. `X.13.006` Attacchi tipici alla prova di partecipazione
7. `X.13.007` Altri approcci: autorità e consenso a maggioranza
8. `X.13.008` Confronto tra consensi: sicurezza, velocità, decentralizzazione
9. `X.13.009` Il trilemma: cosa vuol dire e cosa no
10. `X.13.010` Esercizi: confrontare tre blockchain in una tabella

#### X14 · Reti di secondo livello e ponti

Rollup, canali, sidechain, ponti tra blockchain, costi e rischi. Cintura: verde.

1. `X.14.001` Perché scalare sopra la blockchain
2. `X.14.002` Canali e sidechain
3. `X.14.003` I rollup: raggruppare le transazioni
4. `X.14.004` Rollup ottimistici e a conoscenza zero
5. `X.14.005` La disponibilità dei dati
6. `X.14.006` Ponti tra blockchain
7. `X.14.007` Perché i ponti sono bersagli di attacchi
8. `X.14.008` Costi e tempi di prelievo
9. `X.14.009` L'esperienza di chi usa queste reti
10. `X.14.010` Esercizi: confrontare le commissioni su due reti

#### X15 · Finanza decentralizzata e stablecoin

Scambi automatici, prestiti, garanzie, stablecoin, come funzionano nel codice e dove sono i rischi. Cintura: verde.
**Rimando:** Aspetti di mercato e regole: Hedge fund (H20). Qui solo il funzionamento tecnico, nessun consiglio d'investimento.

1. `X.15.001` Cos'è la finanza decentralizzata (DeFi)
2. `X.15.002` Gli scambi automatici (AMM)
3. `X.15.003` La formula del prodotto costante
4. `X.15.004` Slippage e perdita temporanea: cosa sono
5. `X.15.005` I prestiti con garanzia
6. `X.15.006` Le liquidazioni automatiche
7. `X.15.007` Le stablecoin: tipi e come tengono il valore
8. `X.15.008` Quando una stablecoin perde l'ancoraggio
9. `X.15.009` I rischi tecnici: errori di codice, oracoli, governance
10. `X.15.010` Esercizi: calcolare uno scambio in una piscina di liquidità di esempio

#### X16 · Oracoli, identità e riservatezza

Dati dal mondo reale, identità digitale, prove a conoscenza zero, DAO e organizzazioni on-chain. Cintura: verde.

1. `X.16.001` La blockchain non vede il mondo: il problema dell'oracolo
2. `X.16.002` Oracoli di prezzo e di eventi
3. `X.16.003` Randomicità verificabile
4. `X.16.004` Identità sulla blockchain: nomi e credenziali
5. `X.16.005` Riservatezza: cosa si può nascondere
6. `X.16.006` Prove a conoscenza zero: l'idea con un esempio
7. `X.16.007` Organizzazioni autonome (DAO)
8. `X.16.008` Votazioni on-chain: pro e contro
9. `X.16.009` Governance dei protocolli
10. `X.16.010` Esercizi: valutare come si fida un contratto dei suoi dati

### Blocco 5 · Sicurezza, regole e progetto (X17-X20, lezioni 161-200)

Come si rompono i contratti, come si proteggono gli utenti e che regole valgono.

#### X17 · Vulnerabilità degli smart contract

Rientranza, errori di calcolo, controllo degli accessi, ordine delle operazioni e perché gli errori restano per sempre. Cintura: blu.
**Rimando:** Concetti di sicurezza applicativa: Cybersecurity (C5).

1. `X.17.001` Perché un errore in un contratto costa tanto
2. `X.17.002` Il caso della DAO del 2016
3. `X.17.003` La rientranza (reentrancy)
4. `X.17.004` Controlli degli accessi dimenticati
5. `X.17.005` Errori nei numeri: overflow e arrotondamenti
6. `X.17.006` Dipendere dal tempo e dall'ordine delle transazioni
7. `X.17.007` Chiamate a contratti esterni
8. `X.17.008` Gli errori nei contratti aggiornabili
9. `X.17.009` Come si correggono questi errori
10. `X.17.010` Esercizi: trovare l'errore in un contratto di prova

#### X18 · Test, analisi e revisione

Test ben fatti, analisi automatica, controlli formali in sintesi, revisioni esterne e lista di controllo. Cintura: blu.

1. `X.18.001` Dal «funziona» al «è sicuro»
2. `X.18.002` Test di proprietà e test con valori casuali
3. `X.18.003` Strumenti di analisi statica
4. `X.18.004` Simulare un attacco in un ambiente di prova
5. `X.18.005` Controlli formali in sintesi
6. `X.18.006` La revisione esterna (audit): cosa è e cosa non garantisce
7. `X.18.007` Programmi di ricompensa per le vulnerabilità
8. `X.18.008` Piani di emergenza: il blocco di sicurezza
9. `X.18.009` Aggiornamenti e governo del contratto
10. `X.18.010` Esercizi: preparare un contratto alla revisione

#### X19 · Truffe, furti e come proteggersi

Schemi truffaldini, ingegneria sociale, falsi portafogli, buone abitudini e cosa fare dopo un furto. Cintura: blu.
**Rimando:** Phishing e ingegneria sociale: Cybersecurity (C26).

1. `X.19.001` Le truffe più comuni nel mondo cripto
2. `X.19.002` Promesse di guadagni facili: i segnali
3. `X.19.003` Finti siti e finti assistenti
4. `X.19.004` Firmare cose senza leggerle: i permessi sui token
5. `X.19.005` Token senza uscita e progetti abbandonati
6. `X.19.006` Furti famosi e cosa hanno insegnato
7. `X.19.007` Come si controlla un progetto prima di fidarsi
8. `X.19.008` Abitudini di sicurezza personali
9. `X.19.009` Cosa fare se hai subìto una truffa
10. `X.19.010` Esercizi: smontare tre annunci truffaldini

#### X20 · Regole e progetto finale

Quadro delle regole europee in sintesi, tutela dei dati, progetto completo e prossimi passi. Cintura: blu.
**Rimando:** Aspetti normativi e di mercato: Hedge fund (H20).

1. `X.20.001` Che cosa dice la legge in sintesi: il regolamento europeo MiCA
2. `X.20.002` Antiriciclaggio e identificazione degli utenti
3. `X.20.003` Dati personali e blockchain: il diritto alla cancellazione
4. `X.20.004` Progetti e responsabilità di chi li crea
5. `X.20.005` Progetto finale: idea e requisiti
6. `X.20.006` Progetto finale: il contratto
7. `X.20.007` Progetto finale: i test
8. `X.20.008` Progetto finale: l'interfaccia
9. `X.20.009` Presentare il progetto e la relazione sui rischi
10. `X.20.010` Come continuare: comunità, lavori e studio

## M · Mondo digitale per tutti

Le competenze digitali di ogni giorno, spiegate con calma e senza gergo: computer e telefono, internet, posta, servizi online, foto e documenti, sicurezza e privacy, informazione, regole, benessere e intelligenza artificiale. Per ragazzi, genitori e nonni.

- **Per chi:** Per chiunque voglia muoversi con sicurezza nel mondo digitale, senza bisogno di essere esperto.
- **Consigliato:** Nessun prerequisito. È il corso più adatto per cominciare, anche per chi non ha mai usato un computer.
- **Cartella e `course:`:** `mondo-digitale` · **Domande:** `src/lib/practice/banks-nuovi/mNN.ts`

### Blocco 1 · Primi passi (M1-M4, lezioni 1-40)

Computer, telefono, internet e posta elettronica da zero.

#### M1 · Computer e telefono

Come sono fatti, come si accendono e si usano, file, cartelle, programmi e app. Cintura: bianca.

1. `M.01.001` Che cos'è un computer e che cos'è uno smartphone
2. `M.01.002` Le parti che si vedono: schermo, tastiera, mouse e tocco
3. `M.01.003` Accendere, spegnere e riavviare
4. `M.01.004` Il desktop e le finestre
5. `M.01.005` File e cartelle: dove finiscono le cose
6. `M.01.006` Programmi e app: cosa sono e come si installano
7. `M.01.007` Le impostazioni più utili
8. `M.01.008` Come si usa la tastiera: lettere, numeri e scorciatoie
9. `M.01.009` Cosa fare quando si blocca tutto
10. `M.01.010` Esercizi: mettere in ordine cartelle e file

#### M2 · Internet e il browser

Cos'è internet, il browser, cercare con i motori di ricerca, siti sicuri e download. Cintura: bianca.
**Rimando:** Per capire come funziona internet dentro: Reti e internet (R1).

1. `M.02.001` Internet e il web: la differenza
2. `M.02.002` Il browser e le sue parti
3. `M.02.003` L'indirizzo di un sito
4. `M.02.004` Cercare con un motore di ricerca
5. `M.02.005` Leggere i risultati: cosa sono gli annunci
6. `M.02.006` I segnalibri e la cronologia
7. `M.02.007` Siti sicuri: il lucchetto e cosa vuol dire davvero
8. `M.02.008` Scaricare file e cosa controllare
9. `M.02.009` Schede, finestre e come tenere ordine
10. `M.02.010` Esercizi: cercare e confrontare tre fonti su uno stesso argomento

#### M3 · Posta elettronica e messaggi

Creare un account, scrivere e leggere email, allegati, rubrica, messaggi e videochiamate. Cintura: bianca.

1. `M.03.001` Che cos'è un indirizzo di posta elettronica
2. `M.03.002` Creare un account di posta
3. `M.03.003` Leggere e rispondere
4. `M.03.004` Scrivere un'email fatta bene
5. `M.03.005` Allegati: inviare e ricevere
6. `M.03.006` Rubrica, copia e copia nascosta
7. `M.03.007` La posta indesiderata (spam)
8. `M.03.008` Messaggi istantanei e gruppi
9. `M.03.009` Videochiamate: come si fanno
10. `M.03.010` Esercizi: scrivere una richiesta formale a una scuola o a un ufficio

#### M4 · Smartphone e tablet

Gestire telefono e tablet: impostazioni, app, notifiche, batteria, spazio, aggiornamenti. Cintura: bianca.

1. `M.04.001` Android e iPhone: le basi in comune
2. `M.04.002` Lo schermo principale e i gesti
3. `M.04.003` Installare e togliere le app
4. `M.04.004` Le notifiche: quali servono
5. `M.04.005` La batteria: cosa la consuma
6. `M.04.006` Lo spazio: cosa occupa memoria
7. `M.04.007` Aggiornare il sistema e le app
8. `M.04.008` Il Wi-Fi e i dati del telefono
9. `M.04.009` Accessibilità: testo grande, voce e altri aiuti
10. `M.04.010` Esercizi: sistemare un telefono pieno di cose

### Blocco 2 · Vivere online (M5-M8, lezioni 41-80)

Servizi, foto e documenti, social e programmi d'ufficio.

#### M5 · Servizi online di ogni giorno

Identità digitale, servizi pubblici, banca e pagamenti, acquisti e prenotazioni. Cintura: gialla.

1. `M.05.001` I servizi che si fanno da casa
2. `M.05.002` SPID e carta d'identità elettronica: cosa sono
3. `M.05.003` Servizi pubblici online: tessera sanitaria, fascicolo sanitario e altri
4. `M.05.004` La banca online e le app dei pagamenti
5. `M.05.005` Pagare online: carte e metodi
6. `M.05.006` Comprare in modo sicuro
7. `M.05.007` Resi, garanzie e diritti dell'acquirente
8. `M.05.008` Prenotare viaggi e visite
9. `M.05.009` Fatture e documenti online
10. `M.05.010` Esercizi: pianificare un acquisto senza rischi

#### M6 · Foto, video, musica e cloud

Fare e ordinare foto, condividere in modo sensato, spazio nel cloud, copia dei ricordi. Cintura: gialla.

1. `M.06.001` Fotografare con il telefono
2. `M.06.002` Ordinare le foto: album e nomi
3. `M.06.003` Modificare una foto con semplicità
4. `M.06.004` Registrare e montare un breve video
5. `M.06.005` Musica e video in streaming
6. `M.06.006` Il cloud: archiviare nella nuvola
7. `M.06.007` Condividere cartelle e link
8. `M.06.008` Quando condividere una foto non va bene
9. `M.06.009` Copia dei ricordi: un secondo posto
10. `M.06.010` Esercizi: un album di famiglia ordinato e salvato

#### M7 · Social e comunicazione

Come funzionano i social, profili, impostazioni di riservatezza, comportamento e contenuti. Cintura: gialla.

1. `M.07.001` Cosa sono i social e come guadagnano
2. `M.07.002` Creare un profilo: cosa scrivere e cosa no
3. `M.07.003` Le impostazioni di riservatezza
4. `M.07.004` Amici, follower e sconosciuti
5. `M.07.005` Cosa si pubblica e cosa resta per sempre
6. `M.07.006` Commenti e discussioni: comportarsi bene
7. `M.07.007` Gruppi e chat
8. `M.07.008` Segnalare e bloccare
9. `M.07.009` Il tempo che passa tra i social: come si misura
10. `M.07.010` Esercizi: rivedere il proprio profilo con occhi nuovi

#### M8 · Documenti, fogli e presentazioni

Scrivere un testo, fare un foglio di calcolo semplice, preparare una presentazione, con strumenti gratuiti. Cintura: gialla.
**Rimando:** Per i fogli di calcolo a fondo: Analista di dati (D2).

1. `M.08.001` Gli strumenti gratuiti: Fogli, Documenti e LibreOffice
2. `M.08.002` Scrivere un testo: stili, elenchi e pagine
3. `M.08.003` Un curriculum in una pagina
4. `M.08.004` Salvare, esportare in PDF e inviare
5. `M.08.005` Un foglio di calcolo: celle e somme
6. `M.08.006` Un piccolo bilancio familiare in un foglio
7. `M.08.007` Grafici semplici
8. `M.08.008` Una presentazione chiara: poche parole, una immagine
9. `M.08.009` Lavorare in due sullo stesso documento
10. `M.08.010` Esercizi: una relazione scolastica completa

### Blocco 3 · Sicurezza e privacy per tutti (M9-M12, lezioni 81-120)

Proteggere account, soldi e dati con regole semplici.

#### M9 · Password e accessi

Password buone, gestore di password, verifica in due passaggi e recupero degli account. Cintura: arancione.
**Rimando:** Password e 2FA a fondo: Cybersecurity (C3).

1. `M.09.001` Perché le password contano
2. `M.09.002` Cosa rende forte una password
3. `M.09.003` Una password diversa per ogni sito
4. `M.09.004` Il gestore di password: cos'è e come si usa
5. `M.09.005` La verifica in due passaggi
6. `M.09.006` Codici, app e chiavi di sicurezza
7. `M.09.007` Quando una password è finita in una fuga di dati
8. `M.09.008` Il recupero dell'account: prepararlo prima
9. `M.09.009` Accessi sui dispositivi: PIN, impronta e volto
10. `M.09.010` Esercizi: mettere in sicurezza i tuoi tre account più importanti

#### M10 · Truffe e inganni online

Phishing, messaggi falsi, finti operatori, acquisti truffa, come riconoscerli e cosa fare. Cintura: arancione.
**Rimando:** Il lato tecnico del phishing: Cybersecurity (C26).

1. `M.10.001` Come ragiona chi truffa
2. `M.10.002` Phishing: email e messaggi falsi
3. `M.10.003` Segnali di un messaggio falso
4. `M.10.004` Link e allegati: cosa non toccare
5. `M.10.005` Finte chiamate della banca e altri imbrogli al telefono
6. `M.10.006` Acquisti troppo belli per essere veri
7. `M.10.007` Finti investimenti e guadagni facili
8. `M.10.008` Truffe sentimentali e richieste di soldi
9. `M.10.009` Cosa fare se ci sei cascato: i primi minuti
10. `M.10.010` Esercizi: riconoscere dieci messaggi, veri e falsi

#### M11 · Privacy e dati personali

Quali dati lasciamo, chi li raccoglie, cookie, permessi delle app, diritti sul trattamento dei dati. Cintura: arancione.
**Rimando:** Privacy e anonimato a fondo: Cybersecurity (C10).

1. `M.11.001` Cosa sono i dati personali
2. `M.11.002` Chi raccoglie i tuoi dati e perché
3. `M.11.003` I cookie e i banner
4. `M.11.004` I permessi delle app
5. `M.11.005` La posizione: quando condividerla
6. `M.11.006` Il GDPR in parole semplici: i tuoi diritti
7. `M.11.007` Chiedere di vedere o cancellare i tuoi dati
8. `M.11.008` Nomi utente, foto e traccia che lasci
9. `M.11.009` Navigare con più riservatezza
10. `M.11.010` Esercizi: l'esame della tua impronta digitale

#### M12 · Dispositivi al sicuro

Aggiornamenti, antivirus, copie di sicurezza, reti Wi-Fi pubbliche, furto e smarrimento. Cintura: arancione.

1. `M.12.001` Perché gli aggiornamenti sono importanti
2. `M.12.002` L'antivirus: serve e cosa fa
3. `M.12.003` Cosa sono i virus e i programmi dannosi
4. `M.12.004` Le copie di sicurezza: la regola 3-2-1
5. `M.12.005` Wi-Fi pubblici: cosa evitare
6. `M.12.006` Cifrare il telefono e il computer
7. `M.12.007` Se perdi o ti rubano il telefono
8. `M.12.008` Prima di vendere o regalare un dispositivo
9. `M.12.009` La sicurezza dei dispositivi di casa: router e telecamere
10. `M.12.010` Esercizi: un controllo di sicurezza di casa in 30 minuti

### Blocco 4 · Cittadini digitali (M13-M16, lezioni 121-160)

Informarsi bene, conoscere le regole, stare bene e usare i servizi pubblici.

#### M13 · Informazione e notizie false

Come si valutano le fonti, il controllo dei fatti, immagini e video manipolati e i meccanismi delle bufale. Cintura: verde.

1. `M.13.001` Dove ci informiamo oggi
2. `M.13.002` Fonti, autori e scopi
3. `M.13.003` Titoli, immagini e il clic facile
4. `M.13.004` Le bufale: come nascono e perché si diffondono
5. `M.13.005` Controllare un fatto in cinque minuti
6. `M.13.006` Le immagini fuori contesto
7. `M.13.007` Video e voci creati dall'IA: come ci si difende
8. `M.13.008` Algoritmi e bolle: cosa ci mostrano e perché
9. `M.13.009` Opinioni e fatti
10. `M.13.010` Esercizi: sbufalare tre notizie false

#### M14 · Regole, diritti e rispetto

Diritto d'autore, diffamazione, cyberbullismo, regole sulle immagini e a chi chiedere aiuto. Cintura: verde.

1. `M.14.001` Online valgono le stesse leggi di fuori
2. `M.14.002` Il diritto d'autore: cosa si può usare
3. `M.14.003` Licenze libere e contenuti da riusare
4. `M.14.004` Immagini di altre persone: consenso e regole
5. `M.14.005` Insulti e diffamazione online
6. `M.14.006` Il cyberbullismo: riconoscerlo e fermarlo
7. `M.14.007` Cosa fare se sei vittima o testimone
8. `M.14.008` Il sexting e le immagini private: rischi e tutele
9. `M.14.009` Dove chiedere aiuto
10. `M.14.010` Esercizi: casi da valutare, con la regola giusta

#### M15 · Benessere digitale

Tempo davanti agli schermi, sonno, attenzione, giochi, abitudini e vita fuori dallo schermo. Cintura: verde.

1. `M.15.001` Come ci cattura un'app
2. `M.15.002` Il tempo davanti agli schermi: come si misura
3. `M.15.003` Notifiche e attenzione
4. `M.15.004` Sonno e schermi
5. `M.15.005` Giochi online: divertimento e abitudini
6. `M.15.006` Acquisti nei giochi e nelle app
7. `M.15.007` Quando è troppo: i segnali
8. `M.15.008` Stare bene con gli altri anche dal vivo
9. `M.15.009` Il telefono a scuola e al lavoro
10. `M.15.010` Esercizi: una settimana di prova con nuove abitudini

#### M16 · Servizi pubblici digitali

Identità digitale, pratiche online, sanità, scuola, fisco e pagamenti verso la pubblica amministrazione. Cintura: verde.

1. `M.16.001` La pubblica amministrazione online
2. `M.16.002` SPID, CIE e CNS: quando serve quale
3. `M.16.003` L'app IO
4. `M.16.004` Il fascicolo sanitario elettronico
5. `M.16.005` Prenotare visite ed esami
6. `M.16.006` Scuola online: registro, iscrizioni e pagamenti
7. `M.16.007` Il fisco online: cosa si può fare da soli
8. `M.16.008` Pagare con pagoPA
9. `M.16.009` Firma digitale e PEC in parole semplici
10. `M.16.010` Esercizi: pianificare una pratica online dall'inizio alla fine

### Blocco 5 · Il futuro e le tue competenze (M17-M20, lezioni 161-200)

Intelligenza artificiale, un assaggio di programmazione, lavoro e progetto personale.

#### M17 · Intelligenza artificiale per tutti

Cos'è, come usarla bene, cosa evitare, scuola e lavoro, immagini e voci creati dall'IA. Cintura: blu.
**Rimando:** Per capire come funziona dentro: Intelligenza artificiale (I).

1. `M.17.001` Che cos'è l'intelligenza artificiale in poche parole
2. `M.17.002` Gli assistenti che rispondono alle domande
3. `M.17.003` Fare buone domande
4. `M.17.004` Quando le risposte sono sbagliate
5. `M.17.005` Cosa non scrivere mai in una chat
6. `M.17.006` Studiare con l'IA senza imbrogliare
7. `M.17.007` L'IA al lavoro: aiuto e limiti
8. `M.17.008` Immagini, voci e video creati dall'IA
9. `M.17.009` Le regole dell'Unione europea in parole semplici
10. `M.17.010` Esercizi: un compito svolto con l'IA, controllato a mano

#### M18 · Un assaggio di programmazione

Pensiero computazionale, algoritmi nella vita, primi programmi a blocchi e uno sguardo al codice. Cintura: blu.
**Rimando:** Per programmare sul serio: Programmazione generale (P) e Sviluppo web (W).

1. `M.18.001` Che cos'è un programma
2. `M.18.002` Gli algoritmi nella vita di tutti i giorni
3. `M.18.003` Scomporre un problema
4. `M.18.004` Programmare a blocchi: il primo programma
5. `M.18.005` Ripetizioni e scelte
6. `M.18.006` Variabili: dare un nome ai dati
7. `M.18.007` Dai blocchi al codice: un esempio
8. `M.18.008` Trovare e correggere gli errori
9. `M.18.009` Programmi che aiutano nella vita di tutti i giorni
10. `M.18.010` Esercizi: un piccolo gioco con i blocchi

#### M19 · Lavoro e competenze digitali

Curriculum, profili online, lavoro da remoto, strumenti di squadra, competenze richieste e come impararle. Cintura: blu.

1. `M.19.001` Le competenze digitali che servono oggi
2. `M.19.002` Il quadro europeo delle competenze digitali
3. `M.19.003` Un curriculum chiaro
4. `M.19.004` Il profilo professionale online
5. `M.19.005` Cercare lavoro in rete senza farsi truffare
6. `M.19.006` Il lavoro da remoto: strumenti e regole
7. `M.19.007` Posta, riunioni e documenti condivisi
8. `M.19.008` Organizzarsi: calendario, elenchi e promemoria
9. `M.19.009` Continuare a imparare: corsi gratuiti e come sceglierli
10. `M.19.010` Esercizi: il tuo piano per le prossime competenze

#### M20 · Progetto: la mia vita digitale in ordine

Un progetto personale che mette insieme tutto: account, sicurezza, ordine, regole e benessere. Cintura: blu.

1. `M.20.001` Il quadro di partenza: cosa hai e dove sta
2. `M.20.002` L'elenco dei tuoi account
3. `M.20.003` Mettere in sicurezza gli accessi
4. `M.20.004` Mettere in ordine file, foto e posta
5. `M.20.005` Impostare copie di sicurezza
6. `M.20.006` Rivedere privacy e permessi
7. `M.20.007` Impostare le abitudini di benessere digitale
8. `M.20.008` Un piano per la tua famiglia
9. `M.20.009` Spiegare a una persona cara quello che hai imparato
10. `M.20.010` Il tuo diario digitale: cosa hai cambiato e cosa resta da fare
