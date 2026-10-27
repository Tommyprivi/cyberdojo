import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "W",
  cartella: "sviluppo-web",
  titolo: "Sviluppo web",
  presentazione:
    "Dalla prima pagina HTML a un sito vero con React e un server tuo: HTML, CSS, JavaScript, React, backend e API. Si impara costruendo, una pagina e un pezzo di sito alla volta.",
  perChi: "Per chi vuole creare siti e applicazioni web, anche partendo da zero.",
  consigliato: "Nessun prerequisito. Per la parte di rete e di sicurezza web rimandano Fondamenta (F7) e Cybersecurity (C4).",
  blocchi: [
    {
      titolo: "Una pagina web da zero",
      descrizione: "Come funziona il web e come si scrive una pagina con HTML e CSS.",
      moduli: [
        {
          titolo: "Come funziona il web",
          riassunto: "Browser, indirizzi, richieste e risposte, strumenti per sviluppare e la prima pagina",
          rinvio: "DNS, HTTP e HTTPS a fondo sono in Fondamenta F7: qui solo l'essenziale per chi sviluppa.",
          lezioni:
            "Che cosa succede quando apri un sito | Browser, server e indirizzi (URL) | Richieste e risposte in parole semplici | I tre linguaggi del web: HTML, CSS, JavaScript | Gli strumenti dello sviluppatore del browser | Un editor di testo e la cartella del progetto | La prima pagina web, salvata sul tuo computer | Aprire un file in locale e ricaricare la pagina | Leggere il codice di un sito vero senza paura | Come si impara a programmare: errori, pazienza e ricerca",
        },
        {
          titolo: "HTML: la struttura",
          riassunto: "Documento, titoli, paragrafi, elenchi, link e immagini, con i tag spiegati uno alla volta",
          lezioni:
            "Un documento HTML: doctype, head e body | Tag, attributi ed elementi | Titoli e paragrafi | Grassetto, corsivo e altri tag di testo | Elenchi puntati e numerati | I link: collegare pagine e siti | Percorsi dei file: relativi e assoluti | Le immagini e il testo alternativo | Commenti, spazi e caratteri speciali | Validare l'HTML e leggere gli errori",
        },
        {
          titolo: "HTML: pagine ben fatte",
          riassunto: "Tag semantici, tabelle, form, audio e video, accessibilità di base",
          lezioni:
            "Header, nav, main, section, article, footer | Perché la semantica conta (e per chi) | Le tabelle: righe, celle e intestazioni | Un modulo: form, input e pulsanti | Etichette, campi di testo, scelte e menu | Validazione di base dei campi nel browser | Audio, video e incorporamenti | Titoli e struttura della pagina: l'indice del documento | Accessibilità: lettori di schermo e tastiera | Progetto: la pagina di presentazione di un'associazione",
        },
        {
          titolo: "CSS: dare stile",
          riassunto: "Selettori, colori, testo, box model, specificità e ordine delle regole",
          lezioni:
            "Che cos'è il CSS e come si collega a una pagina | Selettori di elemento, di classe e di id | Colori: nomi, esadecimale e rgb | Caratteri, dimensioni e interlinea | Il box model: contenuto, padding, bordo e margine | Unità di misura: px, em, rem e percentuali | Sfondi, bordi e ombre | Pseudo-classi: hover, focus e le altre | Specificità e cascata: chi vince quando le regole si scontrano | Progetto: dare stile alla pagina dell'associazione",
        },
      ],
    },
    {
      titolo: "Layout e JavaScript di base",
      descrizione: "Pagine che si adattano a ogni schermo e primi programmi in JavaScript.",
      moduli: [
        {
          titolo: "CSS: il layout",
          riassunto: "Flusso della pagina, flexbox, posizionamento e centrare le cose senza trucchi",
          lezioni:
            "Il flusso normale: elementi block e inline | Display, larghezze e altezze | Flexbox: l'idea di asse principale | Flexbox: allineare e distribuire | Flexbox: andare a capo e dimensioni flessibili | Posizionamento: relative, absolute, fixed e sticky | Sovrapporre elementi con z-index | Overflow, scorrimento e testo troppo lungo | Centrare un elemento: i casi che servono davvero | Progetto: la barra di navigazione di un sito",
        },
        {
          titolo: "CSS: grid e responsive",
          riassunto: "Griglie, media query, immagini fluide, mobile first, variabili e animazioni semplici",
          lezioni:
            "CSS Grid: righe, colonne e gap | Grid: aree con nome e posizionamento | Grid o flexbox: come scegliere | Media query e punti di rottura | Mobile first: partire dal telefono | Immagini e video che si adattano | Variabili CSS e temi chiari e scuri | Transizioni e animazioni semplici | Un po' di ordine: nomi di classi e file CSS | Progetto: un sito che funziona da telefono e da PC",
        },
        {
          titolo: "JavaScript: i primi passi",
          riassunto: "Variabili, tipi, operatori, condizioni e cicli: ragionare in codice",
          rinvio: "La logica della programmazione è anche nel corso Programmazione generale (P): qui si applica a JavaScript.",
          lezioni:
            "Che cos'è JavaScript e dove si esegue | La console e il primo console.log | Variabili con let e const | Numeri, testo e booleani | Operatori e conversioni di tipo | Il confronto: == e === | Condizioni: if, else e switch | I cicli: for e while | Leggere e correggere un messaggio di errore | Esercizi guidati: indovina il numero",
        },
        {
          titolo: "JavaScript: funzioni e dati",
          riassunto: "Funzioni, array, oggetti, metodi utili e un modo ordinato di scrivere il codice",
          lezioni:
            "Funzioni: parametri e valore restituito | Funzioni freccia | Lo scope: dove vive una variabile | Gli array: creare e leggere | Cicli su array: for...of e forEach | Map, filter e reduce | Gli oggetti: proprietà e metodi | Array di oggetti: i dati veri sono fatti così | Destrutturazione, spread e template string | Progetto: la lista della spesa in codice",
        },
      ],
    },
    {
      titolo: "JavaScript nel browser",
      descrizione: "Far muovere la pagina: DOM, eventi, dati dal web e strumenti professionali.",
      moduli: [
        {
          titolo: "Il DOM e gli eventi",
          riassunto: "Leggere e cambiare la pagina da JavaScript, rispondere ai clic e alla tastiera",
          lezioni:
            "Il DOM: la pagina come albero | Trovare elementi: querySelector | Cambiare testo e attributi | Cambiare classi e stili | Creare e togliere elementi | Eventi: click, input e tastiera | Il listener di eventi e l'oggetto evento | La propagazione degli eventi | Delegare gli eventi a un contenitore | Progetto: una lista di cose da fare",
        },
        {
          titolo: "Form e dati nel browser",
          riassunto: "Leggere i form, validare, salvare nel browser e proteggere da input pericolosi",
          rinvio: "XSS e altri attacchi web in profondità: Cybersecurity C4.",
          lezioni:
            "Leggere i valori di un form | L'evento submit e preventDefault | Validare i dati: regole e messaggi chiari | Espressioni regolari essenziali | localStorage e sessionStorage | I cookie: cosa sono e a cosa servono | Mai fidarsi dell'input: perché innerHTML è rischioso | textContent e la scrittura sicura nella pagina | Drag and drop e file scelti dall'utente | Progetto: un modulo di iscrizione che salva i dati",
        },
        {
          titolo: "JavaScript moderno e asincrono",
          riassunto: "Moduli, tempo, promesse, fetch e JSON: parlare con altri server dal browser",
          lezioni:
            "Moduli ES: import ed export | Timer: setTimeout e setInterval | Perché serve la programmazione asincrona | Le promesse | Async e await | Gestire gli errori con try e catch | JSON: il formato dei dati sul web | fetch: chiedere dati a un'API | Stati di caricamento ed errore nell'interfaccia | Progetto: la pagina del meteo con dati da un'API pubblica",
        },
        {
          titolo: "Strumenti dello sviluppatore",
          riassunto: "Debug, npm, Vite, controlli automatici e primo contatto con TypeScript",
          rinvio: "Git e il lavoro in squadra sono nel corso Programmazione generale (P), blocco Git.",
          lezioni:
            "Il debugger del browser: punti di interruzione | La scheda Rete: vedere le richieste | Node.js e npm: cos'è un pacchetto | package.json e le dipendenze | Vite: un progetto che si ricarica da solo | Lint e formattazione automatica | Scrivere un primo test con Vitest | TypeScript: perché esiste | Tipi base in TypeScript | Progetto: il tuo modello di partenza per i prossimi progetti",
        },
      ],
    },
    {
      titolo: "React e il frontend moderno",
      descrizione: "Costruire interfacce con componenti, stato e dati, come si fa nei progetti veri.",
      moduli: [
        {
          titolo: "React: i componenti",
          riassunto: "JSX, componenti, props, liste e rendering condizionale",
          lezioni:
            "Perché React e che problema risolve | Il primo componente | JSX: HTML dentro JavaScript | Props: passare dati a un componente | Comporre componenti: l'albero dell'interfaccia | Liste e la proprietà key | Mostrare o nascondere: rendering condizionale | Stili in React: classi e CSS | Componenti puri e dati che scorrono dall'alto | Progetto: una scheda prodotto riutilizzabile",
        },
        {
          titolo: "React: stato ed effetti",
          riassunto: "useState, eventi, useEffect, dati dal server e come evitare i bug tipici",
          lezioni:
            "Lo stato: la memoria di un componente | useState passo per passo | Gestire gli eventi in React | Stato di oggetti e array: non si modifica, si sostituisce | Alzare lo stato: condividerlo tra componenti | Form controllati | useEffect: fare cose dopo il disegno | Caricare dati da un'API in un componente | Gli errori classici: cicli infiniti e dati vecchi | Progetto: un elenco filtrabile con dati dal web",
        },
        {
          titolo: "React: un'applicazione intera",
          riassunto: "Più pagine, stato condiviso, hook personalizzati e Next.js in sintesi",
          lezioni:
            "Più pagine in una app: il routing | Parametri nell'indirizzo e pagine dinamiche | Il contesto: dati condivisi senza passarli a mano | useReducer: stato complicato con ordine | Hook personalizzati | Gestire caricamento, errore e dati vuoti | Cache dei dati e librerie come TanStack Query | Next.js: pagine, layout e componenti server | Quando conviene un framework e quando no | Progetto: una piccola applicazione a più pagine",
        },
        {
          titolo: "Frontend di qualità",
          riassunto: "TypeScript in React, accessibilità, prestazioni, test e design system",
          lezioni:
            "TypeScript con React: props e stato tipizzati | Tipi utili: union, interfacce e generici | Accessibilità: tastiera, ruoli e contrasto | Prestazioni: cosa rallenta una pagina | Immagini, font e caricamento pigro | Misurare con Lighthouse e i Core Web Vitals | Testare i componenti | Test del comportamento dell'utente | Organizzare cartelle, nomi e componenti condivisi | Progetto: migliora e misura un'app esistente",
        },
      ],
    },
    {
      titolo: "Backend, API e messa online",
      descrizione: "Il lato server: costruire un'API, salvare dati, proteggere gli accessi e pubblicare.",
      moduli: [
        {
          titolo: "Node.js e il server",
          riassunto: "Node.js, moduli, file, un server HTTP e il framework Express",
          lezioni:
            "Che cos'è Node.js e come si usa | Moduli, file e percorsi in Node | Leggere e scrivere file | Variabili d'ambiente e configurazione | Un server HTTP minimo | Richieste, risposte, codici di stato e intestazioni | Express: rotte e gestori | Middleware: i passaggi di una richiesta | Servire file statici e pagine | Progetto: un piccolo server che risponde in JSON",
        },
        {
          titolo: "API REST e database",
          riassunto: "Progettare un'API, collegarla a un database, validare i dati e documentarla",
          rinvio: "SQL a fondo è nel corso Analista di dati (D) e nel corso Database e dati a grande scala (B).",
          lezioni:
            "Che cos'è un'API e cosa significa REST | Risorse, indirizzi e verbi: GET, POST, PUT, DELETE | Codici di stato: scegliere quello giusto | Un'API con CRUD completo in memoria | Collegare un database SQL | Query sicure con parametri | Validare i dati in ingresso con uno schema | Errori, log e messaggi per chi usa l'API | Documentare l'API: OpenAPI in sintesi | Progetto: l'API di un'agenda di appuntamenti",
        },
        {
          titolo: "Accessi e sicurezza",
          riassunto: "Registrazione e accesso, sessioni, token, permessi e le difese essenziali del backend",
          rinvio: "Le vulnerabilità web e il loro sfruttamento in laboratorio sono in Cybersecurity C4: qui si impara a costruire in modo sicuro.",
          lezioni:
            "Autenticazione e autorizzazione: due cose diverse | Salvare le password: hash, sale e algoritmi adatti | Registrazione e accesso passo per passo | Sessioni e cookie sicuri | Token e JWT: quando servono e quali rischi hanno | Accesso con provider esterni (OAuth) in sintesi | Permessi e ruoli: chi può fare cosa | CORS, CSRF e intestazioni di sicurezza | Segreti e chiavi: mai nel codice | Lista di controllo di sicurezza di un'API",
        },
        {
          titolo: "Pubblicare e progetto finale",
          riassunto: "Test del backend, hosting, dominio, monitoraggio e un progetto completo front e back",
          rinvio: "Container, CI/CD e cloud a fondo: corso Cloud e DevOps (L).",
          lezioni:
            "Testare un'API | Variabili d'ambiente in produzione | Dove si pubblica un sito: hosting statico e server | Pubblicare il frontend | Pubblicare il backend | Dominio, DNS e HTTPS | Log, errori e monitoraggio di base | Costi, limiti e come non avere sorprese | Progetto finale: progettazione e dati | Progetto finale: realizzazione, messa online e relazione",
        },
      ],
    },
  ],
};
