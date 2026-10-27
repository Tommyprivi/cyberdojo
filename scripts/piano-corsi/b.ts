import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "B",
  cartella: "database-grandi-dati",
  titolo: "Database e dati a grande scala",
  presentazione:
    "Come si conservano e si interrogano i dati quando diventano tanti: database relazionali e NoSQL, transazioni, indici, replicazione e sharding, sistemi distribuiti, data warehouse e big data.",
  perChi: "Per chi vuole progettare e gestire database e archivi di dati, dal piccolo progetto alla grande applicazione.",
  consigliato: "Conviene aver fatto SQL in Analista di dati (D3) e le basi di programmazione (P1-P4). Dove i corsi esistenti coprono già un argomento, qui si rimanda.",
  blocchi: [
    {
      titolo: "Le basi dei database",
      descrizione: "Che cos'è un database, come si progetta e come si usa da un programma.",
      moduli: [
        {
          titolo: "Che cos'è un database",
          riassunto: "File e database, DBMS, modelli di dati, cosa garantisce un database e cosa lo rende utile",
          lezioni:
            "Perché non basta un file | Che cos'è un database e che cos'è un DBMS | I modelli di dati: relazionale, a documenti, chiave-valore, a grafo | Come è fatto un DBMS dentro | Client e server: come ci si collega | Il linguaggio SQL e dove si usa | Che cosa garantisce un database: le proprietà ACID | Cosa non fa un database da solo | Un database dei film, esplorato a mano | Come scegliere un database per un progetto",
        },
        {
          titolo: "Progettare un database",
          riassunto: "Modello a entità e relazioni, chiavi, relazioni uno-a-molti e molti-a-molti, normalizzazione",
          rinvio: "Tabelle, chiavi primarie ed esterne sono introdotte in Analista di dati (D3): qui si progetta da zero.",
          lezioni:
            "Dal problema ai dati: le domande da fare | Entità, attributi e relazioni | Il diagramma entità-relazione | Chiavi primarie: naturali e artificiali | Chiavi esterne e integrità referenziale | Relazioni uno-a-molti | Relazioni molti-a-molti e tabelle ponte | La normalizzazione: perché si fa | Prima, seconda e terza forma normale | Progetto: il database di una biblioteca scolastica",
        },
        {
          titolo: "SQL essenziale",
          riassunto: "Ripasso veloce di creazione, inserimento, modifica, selezione, JOIN e raggruppamenti",
          rinvio: "SQL spiegato con calma: Analista di dati (D3). Qui un ripasso mirato, per chi parte da qui.",
          lezioni:
            "Creare tabelle: CREATE TABLE e i tipi di dato | Vincoli: NOT NULL, UNIQUE, CHECK, DEFAULT | Inserire, modificare e togliere righe | SELECT, WHERE e ORDER BY | Raggruppare: GROUP BY e funzioni di aggregazione | JOIN: unire le tabelle | Sottoquery e CTE in sintesi | Viste | Cambiare la struttura: ALTER TABLE | Esercizi: le query della biblioteca",
        },
        {
          titolo: "Usare il database da un programma",
          riassunto: "Driver, connessioni, query con parametri, ORM, migrazioni e gestione degli errori",
          rinvio: "Il lato sviluppo web è anche in Sviluppo web (W18).",
          lezioni:
            "Un programma che parla con il database | Connessioni e pool di connessioni | Eseguire una query dal codice | Parametri: mai costruire query incollando testo | Leggere i risultati in strutture del linguaggio | Gli ORM: vantaggi e insidie | Il problema delle N+1 query | Migrazioni: cambiare il database con ordine | Gestire gli errori e i tentativi ripetuti | Progetto: un'applicazione che legge e scrive su PostgreSQL",
        },
      ],
    },
    {
      titolo: "Il database relazionale a fondo",
      descrizione: "Transazioni, indici, funzioni avanzate di PostgreSQL e amministrazione.",
      moduli: [
        {
          titolo: "Transazioni e concorrenza",
          riassunto: "ACID in pratica, livelli di isolamento, blocchi, deadlock e anomalie",
          rinvio: "Una prima introduzione alle transazioni è in Analista di dati (D18): qui si studia cosa succede con molti utenti insieme.",
          lezioni:
            "Che cos'è una transazione | BEGIN, COMMIT e ROLLBACK | Atomicità e coerenza | Isolamento: più utenti nello stesso momento | Le anomalie: lettura sporca, non ripetibile e fantasma | I livelli di isolamento | Blocchi di riga e di tabella | Deadlock: quando due transazioni si aspettano | Controllo ottimistico e versioni delle righe (MVCC) | Esercizi: il conto corrente e le prenotazioni dei posti",
        },
        {
          titolo: "Indici e prestazioni",
          riassunto: "Come si cerca in una tabella grande, B-tree, piani di esecuzione, statistiche e query lente",
          lezioni:
            "Perché una query è lenta | Scansione completa e uso di un indice | L'indice B-tree | Indici su più colonne e ordine delle colonne | Indici unici e parziali | Leggere un piano di esecuzione (EXPLAIN) | Le statistiche e il pianificatore | Il costo degli indici: scritture più lente | Riscrivere una query lenta | Progetto: da 8 secondi a 80 millisecondi",
        },
        {
          titolo: "PostgreSQL in pratica",
          riassunto: "Tipi avanzati, JSON, funzioni finestra, viste materializzate, funzioni e estensioni",
          lezioni:
            "Perché PostgreSQL | Installare PostgreSQL e usare psql | Tipi di dato: date, intervalli, array, enumerazioni | JSON e JSONB | Funzioni finestra | Viste materializzate | Funzioni e procedure | Trigger: reagire ai cambiamenti | Ricerca nel testo | Estensioni: PostGIS e altre",
        },
        {
          titolo: "Amministrare un database",
          riassunto: "Utenti e permessi, copie di sicurezza, ripristino, aggiornamenti e protezione dei dati",
          rinvio: "SQL injection e sicurezza dei dati in Cybersecurity (C6).",
          lezioni:
            "Il mestiere dell'amministratore | Utenti, ruoli e privilegi | Il principio del minimo privilegio | Copie di sicurezza logiche e fisiche | Ripristinare: la copia non provata non esiste | Ripristino a un istante preciso | Aggiornare PostgreSQL senza perdere dati | Monitorare spazio, connessioni e query lente | Cifrare le connessioni e i dati | Piano di emergenza: cosa fare se il database si rompe",
        },
      ],
    },
    {
      titolo: "Oltre il relazionale: NoSQL",
      descrizione: "Documenti, chiave-valore, serie temporali, grafi e ricerca: ogni dato ha il suo posto.",
      moduli: [
        {
          titolo: "Database a documenti",
          riassunto: "Documenti JSON, MongoDB, modellare per le letture, aggregazioni e quando conviene",
          lezioni:
            "Che cosa significa NoSQL | Il documento: JSON come riga | Primi passi con MongoDB | Inserire, leggere, aggiornare e cancellare | Filtri e operatori | Incorporare o riferire: come modellare | Indici nei documenti | Le pipeline di aggregazione | Schema flessibile: libertà e rischi | Documenti o tabelle: come decidere",
        },
        {
          titolo: "Chiave-valore e cache",
          riassunto: "Redis, tipi di dato, scadenze, cache, sessioni, contatori e code semplici",
          lezioni:
            "Il database più semplice: chiave e valore | Installare Redis e il primo comando | Stringhe, liste, insiemi e hash | Scadenza dei dati (TTL) | Una cache davanti al database | Invalidare la cache: il problema difficile | Sessioni e contatori | Classifiche con gli insiemi ordinati | Code e pubblicazione di messaggi | Persistenza: cosa resta se si spegne",
        },
        {
          titolo: "Serie temporali e colonne larghe",
          riassunto: "Dati che arrivano nel tempo, database a colonne larghe, finestre temporali e conservazione",
          lezioni:
            "Dati con il tempo: sensori, log e metriche | Come si conservano le serie temporali | TimescaleDB e InfluxDB: primi passi | Scrivere e interrogare per intervalli di tempo | Aggregare per finestre | Retention: quanto tempo conservare i dati | Database a colonne larghe: Cassandra | La chiave di partizione e il modello per le query | Compromessi: cosa si perde con questo modello | Progetto: le temperature di cento sensori",
        },
        {
          titolo: "Grafi, ricerca e vettori",
          riassunto: "Database a grafo, motori di ricerca, ricerca per testo e per significato",
          rinvio: "I grafi come strutture dati sono in Programmazione generale (P12).",
          lezioni:
            "Quando le relazioni sono il dato | Nodi e relazioni: il modello a grafo | Neo4j e il linguaggio Cypher | Percorsi e raccomandazioni | Motori di ricerca: Elasticsearch e OpenSearch | L'indice invertito | Cercare nel testo: pesi e rilevanza | Ricerca con filtri e aggregazioni | Database vettoriali e ricerca per significato | Scegliere tra più database nello stesso progetto",
        },
      ],
    },
    {
      titolo: "Dati su più macchine",
      descrizione: "Quando una macchina non basta: replicazione, sharding e sistemi distribuiti.",
      moduli: [
        {
          titolo: "Replicazione e alta disponibilità",
          riassunto: "Copie dei dati, principale e repliche, passaggio automatico, ritardo e lettura dalle repliche",
          lezioni:
            "Perché avere più copie | Principale e repliche | Replicazione sincrona e asincrona | Il ritardo di replicazione e le letture vecchie | Passare a una replica quando il principale si rompe | Il rischio del doppio principale (split brain) | Leggere dalle repliche: quando si può | Replicazione in più luoghi | Alta disponibilità: cosa promette e cosa no | Esercizio: simulare un guasto e il ritorno in servizio",
        },
        {
          titolo: "Partizionamento e sharding",
          riassunto: "Dividere i dati, chiavi di divisione, ribilanciare, query su più parti e i costi della complessità",
          lezioni:
            "Quando una macchina non basta più | Scalare in verticale e in orizzontale | Partizionare una tabella | Dividere per intervallo, per elenco e per hash | Lo sharding: dati su più server | Scegliere la chiave giusta | Hotspot: quando un pezzo lavora più degli altri | Query che attraversano più pezzi | Ribilanciare: aggiungere e togliere nodi | Quando NON conviene fare sharding",
        },
        {
          titolo: "Sistemi distribuiti",
          riassunto: "Guasti, tempo, teorema CAP, consistenza, consenso e transazioni distribuite",
          lezioni:
            "Che cos'è un sistema distribuito | I guasti sono la regola: nodi, rete e messaggi persi | Il tempo non è lo stesso su ogni macchina | Il teorema CAP | Consistenza forte e consistenza finale | I quorum: leggere e scrivere con la maggioranza | Il consenso: Raft in parole semplici | Transazioni su più sistemi: il commit a due fasi | Idempotenza: ripetere senza fare danni | Esempi reali: come si comportano alcuni database famosi",
        },
        {
          titolo: "Messaggi, code e flussi",
          riassunto: "Code di messaggi, Kafka, eventi, elaborazione in tempo reale e coerenza tra servizi",
          lezioni:
            "Perché separare chi produce da chi consuma | Le code di messaggi | Argomenti e abbonamenti | Kafka: il registro degli eventi | Partizioni e gruppi di consumatori | Consegna: almeno una volta, al massimo una volta, esattamente una volta | Gli eventi come fonte della verità | Il modello outbox: scrivere e pubblicare senza perdite | Elaborare i flussi in tempo reale | Progetto: un flusso di ordini tra tre servizi",
        },
      ],
    },
    {
      titolo: "Big data e analisi",
      descrizione: "Magazzini di dati, elaborazione distribuita, formati e governance.",
      moduli: [
        {
          titolo: "Data warehouse e OLAP",
          riassunto: "Analisi contro operazioni, schema a stella, database a colonne e modellare per l'analisi",
          rinvio: "ETL e pipeline sono in Analista di dati (D9, D14): qui si guarda la parte database.",
          lezioni:
            "Operazioni e analisi: due lavori diversi | OLTP e OLAP | Che cos'è un data warehouse | Fatti e dimensioni | Lo schema a stella | Dimensioni che cambiano nel tempo | Database a colonne | Compressione e scansioni veloci | Cubi e aggregazioni | Progetto: un magazzino dati per un negozio",
        },
        {
          titolo: "Elaborazione distribuita",
          riassunto: "Dividere il lavoro su molte macchine: MapReduce, Spark, DataFrame e costi",
          lezioni:
            "Quando i dati non stanno in memoria | Dividi il lavoro: l'idea di MapReduce | Il sistema di file distribuito e Hadoop in breve | Spark: cos'è e perché ha vinto | I DataFrame in Spark | Trasformazioni e azioni: l'esecuzione pigra | Raggruppamenti e unioni su dati grandi | Il mescolamento dei dati (shuffle) e perché costa | Partizioni e prestazioni | Progetto: contare le parole di un grande archivio di testi",
        },
        {
          titolo: "Data lake, formati e streaming",
          riassunto: "File di dati, Parquet, data lake e lakehouse, tabelle versionate e flussi continui",
          lezioni:
            "Il data lake: tutti i dati in un posto | Formati: CSV, JSON, Avro e Parquet | Perché Parquet è così efficiente | Cartelle e partizioni per data | Lakehouse: ordine sopra il lake | Tabelle con versioni e viaggi nel tempo | Qualità dei dati: controlli automatici | Dati in arrivo continuo: batch e streaming | Finestre e ritardi nell'elaborazione dei flussi | Progetto: un piccolo lakehouse con strumenti gratuiti",
        },
        {
          titolo: "Governance, costi e progetto finale",
          riassunto: "Catalogo dei dati, linee guida, privacy, costi nel cloud e un progetto completo",
          rinvio: "Privacy e GDPR in sintesi: Analista di dati (D12) e Cybersecurity (C10).",
          lezioni:
            "Chi è responsabile dei dati | Catalogo, descrizioni e proprietari | Qualità e fiducia nei dati | Ciclo di vita: conservare e cancellare | Diritto alla cancellazione nei sistemi grandi | Costi dei dati nel cloud | Scegliere la tecnologia giusta per la dimensione giusta | Progetto finale: requisiti e scelta del modello di dati | Progetto finale: realizzazione e prove di carico | Progetto finale: relazione su compromessi e limiti",
        },
      ],
    },
  ],
};
