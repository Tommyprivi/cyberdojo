import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "P",
  cartella: "programmazione",
  titolo: "Programmazione generale",
  presentazione:
    "Il mestiere di programmare, a prescindere dal linguaggio: logica, algoritmi, strutture dati, Git e lavoro in squadra, progettazione del software. Gli esempi sono in Python, ma le idee valgono ovunque.",
  perChi: "Per chi vuole imparare a pensare come un programmatore, dal primo ciclo ai grandi progetti.",
  consigliato: "Nessun prerequisito. Il modulo Python di Fondamenta (F9) è un buon ripasso, ma non serve per partire.",
  blocchi: [
    {
      titolo: "Pensare come un programmatore",
      descrizione: "Logica, scomposizione dei problemi e primi programmi in Python.",
      moduli: [
        {
          titolo: "Pensiero logico",
          riassunto: "Problemi, algoritmi, pseudocodice, diagrammi di flusso e logica booleana",
          lezioni:
            "Che cos'è un programma e che cos'è un algoritmo | Scomporre un problema in pezzi piccoli | Istruzioni in sequenza: la ricetta e l'ordine | Pseudocodice: scrivere un algoritmo a parole | Diagrammi di flusso | Vero e falso: la logica booleana | AND, OR e NOT con le tabelle di verità | Condizioni a più strade | Ripetere: l'idea di ciclo | Mettere alla prova un algoritmo a mano (traccia di esecuzione)",
        },
        {
          titolo: "Primi programmi in Python",
          riassunto: "Variabili, tipi, input e output, condizioni e cicli, con Python come linguaggio di esempio",
          rinvio: "Il corso Fondamenta ha un modulo Python (F9): chi l'ha fatto può scorrere veloce questo modulo.",
          lezioni:
            "Installare Python e scrivere print | Variabili e nomi che si capiscono | Numeri, testo e booleani | Chiedere un dato all'utente: input | Operazioni e precedenza | Condizioni con if, elif ed else | Il ciclo while | Il ciclo for e range | Cicli dentro cicli | Esercizi guidati: tabelline e indovina il numero",
        },
        {
          titolo: "Funzioni e organizzazione",
          riassunto: "Funzioni, parametri, scope, moduli e un codice leggibile",
          lezioni:
            "Perché esistono le funzioni | Definire e chiamare una funzione | Parametri e valore restituito | Valori predefiniti e parametri con nome | Variabili locali e globali | Funzioni che ne chiamano altre | Spezzare un programma in funzioni | Moduli: importare codice altrui | Nomi, commenti e docstring | Esercizi: un convertitore di unità fatto bene",
        },
        {
          titolo: "Errori, file e dati semplici",
          riassunto: "Leggere gli errori, il debug, le eccezioni, leggere e scrivere file, CSV e JSON",
          lezioni:
            "Tipi di errore: di sintassi, a runtime e di logica | Leggere un traceback | Il debug con le stampe e con il debugger | Le eccezioni: try ed except | Sollevare errori: raise | Leggere e scrivere file di testo | Il formato CSV | Il formato JSON | Percorsi di file e cartelle | Progetto: un registro delle spese su file",
        },
      ],
    },
    {
      titolo: "Algoritmi",
      descrizione: "Come si risolvono i problemi in modo efficiente: cercare, ordinare, misurare e ricorrere.",
      moduli: [
        {
          titolo: "Cercare e ordinare",
          riassunto: "Ricerca lineare e binaria, ordinamenti semplici e veloci, stabilità",
          lezioni:
            "Cercare in un elenco: la ricerca lineare | La ricerca binaria | Perché serve l'ordine | Ordinare con il bubble sort | Ordinare con il selection sort | Ordinare con l'insertion sort | Merge sort: dividere e fondere | Quick sort: il perno | Ordinamento stabile e ordinare per più criteri | Gli ordinamenti dei linguaggi veri: sorted e sort",
        },
        {
          titolo: "Complessità",
          riassunto: "Misurare l'efficienza di un algoritmo: tempo, memoria e notazione O grande",
          lezioni:
            "Perché un programma può essere lento | Contare i passi di un algoritmo | La notazione O grande | Tempo costante e lineare | Tempo logaritmico: dimezzare ogni volta | Tempo quadratico: i cicli annidati | Esponenziale e fattoriale: quando esplode | Complessità in memoria | Misurare il tempo con il cronometro del codice | Confrontare due soluzioni allo stesso problema",
        },
        {
          titolo: "Ricorsione",
          riassunto: "Funzioni che richiamano sé stesse, caso base, pila delle chiamate e quando evitarla",
          lezioni:
            "Un problema che contiene un problema più piccolo | Il caso base e il passo ricorsivo | Il fattoriale | La sequenza di Fibonacci | La pila delle chiamate | Ricorsione infinita e limite di profondità | Ricorsione su liste e testo | Torri di Hanoi | Ricorsione contro iterazione | Esercizi: potenze, somma delle cifre e palindromi",
        },
        {
          titolo: "Tecniche di progettazione",
          riassunto: "Forza bruta, avido, dividi e conquista, backtracking e programmazione dinamica",
          lezioni:
            "La forza bruta: provare tutto | Gli algoritmi avidi: il resto con le monete | Dividi e conquista | Il backtracking: tornare indietro | Le otto regine | Il problema dello zaino | Programmazione dinamica: ricordare i risultati | Memoizzazione | La sottosequenza comune più lunga | Scegliere la tecnica giusta",
        },
      ],
    },
    {
      titolo: "Strutture dati",
      descrizione: "Come si organizzano i dati in memoria: liste, hash, alberi e grafi.",
      moduli: [
        {
          titolo: "Liste, pile e code",
          riassunto: "Array, liste concatenate, pile, code e quando usare quale",
          lezioni:
            "Che cos'è una struttura dati | L'array e la memoria | Le liste di Python da vicino | Le liste concatenate | Inserire e togliere: i costi a confronto | La pila (stack) | La coda (queue) | La coda a doppia entrata | Code con priorità | Esercizi: parentesi bilanciate e coda di stampa",
        },
        {
          titolo: "Hash, dizionari e insiemi",
          riassunto: "Tabelle hash, dizionari, insiemi, collisioni e conteggi",
          lezioni:
            "Cercare in un attimo: l'idea della tabella hash | Funzioni hash e indici | Le collisioni e come si gestiscono | I dizionari in Python | Contare le frequenze con un dizionario | Gli insiemi (set) | Unione, intersezione e differenza | Che cosa può fare da chiave e cosa no | Hash e sicurezza: stessa parola, scopi diversi | Esercizi: anagrammi e duplicati",
        },
        {
          titolo: "Alberi",
          riassunto: "Alberi, alberi binari di ricerca, visite, heap e alberi di decisione",
          lezioni:
            "Dati con una gerarchia: gli alberi | Radice, nodi, foglie e altezza | Alberi binari | Le visite: in ordine, prima e dopo | L'albero binario di ricerca | Inserire e cercare in un albero di ricerca | Alberi sbilanciati e alberi bilanciati | L'heap e la coda con priorità | Alberi nella vita reale: cartelle, DOM e decisioni | Esercizi: profondità e somma dei nodi",
        },
        {
          titolo: "Grafi",
          riassunto: "Grafi, rappresentazione, visite in ampiezza e profondità, cammini minimi",
          lezioni:
            "Reti di cose collegate: i grafi | Nodi, archi, pesi e direzione | Matrice e liste di adiacenza | La visita in ampiezza | La visita in profondità | Trovare il percorso più corto (senza pesi) | Percorsi con pesi: Dijkstra | Cicli e componenti connesse | Ordine topologico: dipendenze tra compiti | Esercizi: labirinti e mappe",
        },
      ],
    },
    {
      titolo: "Git, strumenti e qualità",
      descrizione: "Gli strumenti del mestiere: versioni, lavoro in squadra, test e codice pulito.",
      moduli: [
        {
          titolo: "Git: le basi",
          riassunto: "Repository, commit, storia, annullare e ignorare file",
          lezioni:
            "Perché serve il controllo di versione | Installare Git e configurarlo | Il primo repository | Preparare e salvare: add e commit | Vedere la storia: log e diff | Messaggi di commit che aiutano | Annullare: restore, reset e revert | Il file .gitignore | Segreti nel repository: cosa non va mai salvato | Esercizi: il tuo progetto sotto Git",
        },
        {
          titolo: "Git in squadra",
          riassunto: "Rami, fusioni, conflitti, repository remoti, GitHub e pull request",
          lezioni:
            "I rami (branch): lavorare senza rompere tutto | Unire i rami: il merge | Risolvere un conflitto | Repository remoti: clone, push e pull | GitHub: un account e il primo repository remoto | Le pull request | Fare una revisione del codice (code review) | Fork e contributi a progetti altrui | Rebase in sintesi e quando usarlo | Flussi di lavoro di squadra: come ci si organizza",
        },
        {
          titolo: "Test e qualità del codice",
          riassunto: "Test automatici, TDD, refactoring, analisi statica e codice leggibile",
          lezioni:
            "Perché testare il codice | Il primo test automatico | Cosa testare: casi normali, limite ed errori | Sviluppo guidato dai test (TDD) | Test e dati finti: i mock in sintesi | Copertura dei test: cosa dice e cosa no | Il refactoring: cambiare il codice senza cambiare il risultato | Odori del codice e codice duplicato | Analisi statica e formattazione automatica | Esercizi: ripulire un programma disordinato",
        },
        {
          titolo: "Ambiente di lavoro",
          riassunto: "Terminale, ambienti virtuali, pacchetti, documentazione e lettura del codice altrui",
          rinvio: "Il terminale Linux si impara in Fondamenta (F2-F4): qui si usa per lavorare.",
          lezioni:
            "Il terminale come strumento di lavoro | Un editor serio: scorciatoie e estensioni | Ambienti virtuali e dipendenze | Installare e aggiornare pacchetti | Versioni e compatibilità: il versionamento semantico | Leggere la documentazione ufficiale | Cercare l'errore: come si chiede aiuto bene | Leggere il codice scritto da altri | Documentare un progetto: README e commenti | Esercizi: preparare un progetto che un altro possa avviare",
        },
      ],
    },
    {
      titolo: "Progettare il software",
      descrizione: "Oggetti, paradigmi, pattern e architettura, fino a un progetto completo.",
      moduli: [
        {
          titolo: "Programmazione a oggetti",
          riassunto: "Classi, oggetti, ereditarietà, incapsulamento e polimorfismo",
          lezioni:
            "Perché servono gli oggetti | Classi e oggetti | Attributi e metodi | Il costruttore e lo stato dell'oggetto | Incapsulamento: nascondere i dettagli | Ereditarietà | Polimorfismo | Composizione contro ereditarietà | Metodi speciali: stampare, confrontare, sommare | Esercizi: un piccolo gioco a oggetti",
        },
        {
          titolo: "Paradigmi e linguaggi",
          riassunto: "Imperativo, a oggetti, funzionale, tipi statici e dinamici, confronto tra linguaggi",
          lezioni:
            "Che cos'è un paradigma di programmazione | Imperativo e dichiarativo | Programmazione funzionale: funzioni pure | Funzioni come valori: map, filter e reduce | Immutabilità e dati che non cambiano | Tipi statici e tipi dinamici | Linguaggi compilati e interpretati | Come è fatto un programma in C, Java, Rust e Go | Gestione della memoria: pila, heap e garbage collector | Come scegliere un linguaggio per un progetto",
        },
        {
          titolo: "Progettazione e architettura",
          riassunto: "Principi SOLID, design pattern, moduli, interfacce e concorrenza di base",
          lezioni:
            "Che cos'è un buon progetto | Un compito, una responsabilità | I principi SOLID in parole semplici | Interfacce e dipendenze | I design pattern: a cosa servono | Pattern Factory, Strategy e Observer | Architettura a livelli | Separare dati, logica e interfaccia | Concorrenza: fare più cose insieme | Race condition e blocchi: i guai della concorrenza",
        },
        {
          titolo: "Progetto finale e mestiere",
          riassunto: "Un progetto completo dall'idea alla consegna e come si lavora e si cresce nel mestiere",
          lezioni:
            "Dall'idea ai requisiti | Stimare il lavoro e dividerlo | Progettare i dati e le funzioni | Costruire la prima versione | Testare e correggere | Rifinire e documentare | Consegnare e presentare il progetto | Metodi di lavoro: Agile e Scrum in sintesi | Il mestiere: ruoli, portfolio e colloqui | Come continuare a imparare",
        },
      ],
    },
  ],
};
