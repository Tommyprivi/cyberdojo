import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "E",
  cartella: "hacking-etico",
  titolo: "Hacking etico e CTF",
  presentazione:
    "Imparare a pensare come un attaccante per difendere meglio, solo in modo legale: etica e legge, laboratorio isolato, gare CTF, crittografia, forensics, web, sistemi, reti, analisi dei programmi e metodo di un test di sicurezza. Solo su bersagli propri o autorizzati.",
  perChi: "Per chi vuole imparare la sicurezza offensiva in modo etico e legale, e partecipare alle gare CTF.",
  consigliato: "Serve sapere usare il terminale Linux e le basi di rete (Fondamenta F1-F7). Il corso Cybersecurity (C1-C5) è la base teorica consigliata.",
  blocchi: [
    {
      titolo: "Regole, laboratorio e CTF",
      descrizione: "Prima di tutto la legge e il laboratorio isolato; poi che cos'è una gara CTF.",
      moduli: [
        {
          titolo: "Etica e legge",
          riassunto: "Cosa è lecito, cosa è reato, autorizzazione scritta, divulgazione responsabile e codice di comportamento",
          rinvio: "Principi, etica e legge sono introdotti in Cybersecurity (C1): qui si applicano al mestiere di chi attacca per difendere.",
          lezioni:
            "Hacker, cracker e le parole giuste | Perché si attacca per difendere | L'accesso abusivo in Italia: cosa dice la legge | Le tre regole: tuo, autorizzato, in un ambiente isolato | L'autorizzazione scritta e l'ambito di un test | Le regole d'ingaggio | Divulgazione responsabile delle vulnerabilità | I programmi di ricompensa (bug bounty): regole e limiti | Un codice di comportamento personale | Esercizi: lecito o no? casi da valutare",
        },
        {
          titolo: "Il laboratorio sicuro",
          riassunto: "Macchine virtuali, rete isolata, sistemi volutamente vulnerabili, istantanee e regole di igiene",
          rinvio: "Macchine virtuali e Kali: Fondamenta (F1). Home lab: Cybersecurity (C11).",
          lezioni:
            "Perché serve un laboratorio | Cosa serve: computer, memoria e disco | Una macchina virtuale per attaccare e una per difendersi | Rete isolata solo-host: niente contatto con internet | Sistemi volutamente vulnerabili per esercitarsi | Istantanee: tornare indietro in un clic | Ordine e igiene: cartelle, note e prove | Come non esporre il laboratorio per errore | Aggiornare e mantenere gli strumenti | Esercizi: il laboratorio pronto e provato",
        },
        {
          titolo: "Che cos'è una CTF",
          riassunto: "Formati delle gare, categorie, flag, punteggi, piattaforme legali e gratuite, giocare in squadra",
          lezioni:
            "Che cos'è una gara CTF | Le flag: cosa sono e come si consegnano | Jeopardy e attacco-difesa | Le categorie: crittografia, web, forensics, binari, miscellanea | Le piattaforme legali per allenarsi | Le CTF italiane e per ragazzi | Come si legge il testo di una sfida | Come si gioca in squadra | I write-up: raccontare come si è risolto | Esercizi: la prima sfida guidata",
        },
        {
          titolo: "Strumenti e abitudini del mestiere",
          riassunto: "Terminale, appunti, strumenti di conversione, Python per le sfide, ricerca e metodo",
          lezioni:
            "Il metodo prima degli strumenti | Prendere appunti mentre si lavora | Il terminale di chi risolve sfide | Convertire e decodificare: CyberChef | Python come coltellino svizzero | Leggere la documentazione e cercare bene | Quando ci si blocca: cosa provare | Gestire il tempo in una gara | Imparare dai write-up degli altri | Esercizi: tre sfide di riscaldamento",
        },
      ],
    },
    {
      titolo: "Le prime categorie di sfide",
      descrizione: "Crittografia semplice, forensics, ricerca da fonti aperte e piccoli programmi.",
      moduli: [
        {
          titolo: "Codifiche e crittografia semplice",
          riassunto: "Base64, esadecimale, cifrari classici, XOR, hash e come si riconoscono",
          rinvio: "La crittografia moderna a fondo è in Cybersecurity (C2).",
          lezioni:
            "Codificare non è cifrare | Base64, esadecimale e binario | Riconoscere una codifica a colpo d'occhio | Il cifrario di Cesare | Cifrari a sostituzione e analisi delle frequenze | Il cifrario di Vigenère | Lo XOR e le sue proprietà | Hash: cosa sono e come si riconoscono | Le tabelle arcobaleno e perché il sale le ferma | Esercizi: sette messaggi da decifrare",
        },
        {
          titolo: "Forensics e steganografia",
          riassunto: "Analisi di file, metadati, immagini nascoste, archivi e tracce di rete, in modo legale",
          rinvio: "Forensics e incident response: Cybersecurity (C9).",
          lezioni:
            "Che cos'è l'analisi forense nelle CTF | Il tipo di un file e i numeri magici | I metadati di una foto | Estrarre il testo dai file: strings | Dentro gli archivi e i documenti | Steganografia: nascondere dati nelle immagini | Immagini e canali di colore | Suoni e spettrogrammi | Leggere una cattura di rete | Esercizi: un'indagine su un file sospetto",
        },
        {
          titolo: "OSINT: informazioni da fonti aperte",
          riassunto: "Cercare in modo etico: motori di ricerca, immagini, mappe, registri pubblici, rischi e limiti",
          rinvio: "Privacy e anonimato: Cybersecurity (C10).",
          lezioni:
            "Che cos'è l'OSINT e a cosa serve | Le regole: solo dati pubblici e solo per scopi legittimi | Cercare con precisione | Le immagini: ricerca inversa e luoghi | Le mappe e le foto satellitari | Domini e siti: chi c'è dietro | Account e nomi utente: cosa si trova e cosa non si deve cercare | Verificare le notizie e i falsi | Proteggere la propria impronta digitale | Esercizi: ritrovare un luogo da una foto",
        },
        {
          titolo: "Programmare per le sfide",
          riassunto: "Piccoli programmi in Python: file, testo, rete, espressioni regolari e automatizzare il lavoro ripetitivo",
          rinvio: "Python base: Fondamenta (F9).",
          lezioni:
            "Quando conviene scrivere uno script | Leggere e trasformare file | Le espressioni regolari per cercare | Numeri, byte e conversioni | Parlare con un servizio di prova via rete | Chiedere pagine web da uno script | Provare molte combinazioni nel proprio laboratorio | Calcoli con numeri grandi | Librerie utili per le CTF | Esercizi: automatizzare una sfida lunga",
        },
      ],
    },
    {
      titolo: "Il web",
      descrizione: "Come si ragiona su un sito, le vulnerabilità più comuni e come si correggono.",
      moduli: [
        {
          titolo: "Il web con gli occhi di un tester",
          riassunto: "Richieste e risposte, strumenti del browser, proxy di intercettazione e mappa di un'applicazione",
          rinvio: "OWASP Top 10 e difese: Cybersecurity (C5).",
          lezioni:
            "Richieste, risposte e codici di stato | Intestazioni e cookie | Gli strumenti dello sviluppatore del browser | Un proxy che intercetta: cosa fa e perché serve | Mappare un'applicazione | Parametri, form e API | Cosa dice il codice della pagina | File e cartelle nascoste: robots.txt e simili | Perché non si ferma al lato del browser | Esercizi: esplorare un sito di prova",
        },
        {
          titolo: "Vulnerabilità web: iniezione e script",
          riassunto: "SQL injection, XSS e comandi: come nascono, come si riconoscono nel laboratorio e come si correggono",
          rinvio: "Query sicure e SQL injection: Cybersecurity (C6).",
          lezioni:
            "Quando l'input diventa codice | SQL injection: l'idea in un esempio | Riconoscere una SQL injection nel laboratorio | Come si corregge una SQL injection | XSS: script iniettati nella pagina | Tipi di XSS | Come si corregge un XSS | Iniezione di comandi: l'idea | Validare, filtrare, escapare: tre cose diverse | Esercizi: trovare e correggere tre falle in un'app di prova",
        },
        {
          titolo: "Vulnerabilità web: accessi e logica",
          riassunto: "Autenticazione debole, accesso a oggetti altrui, upload, SSRF e errori di progettazione",
          lezioni:
            "Autenticazione fragile: cosa si guarda | Gestione delle sessioni | Accesso agli oggetti altrui (IDOR) | Controllo dei permessi mancante | Caricare file: i rischi | Richieste dal server verso l'interno: SSRF | Errori di logica: sconti, quantità e passaggi saltati | File inclusi e percorsi: cosa si può sbagliare | Configurazioni errate e informazioni di troppo | Esercizi: un'app di prova con cinque difetti",
        },
        {
          titolo: "Sfide web e write-up",
          riassunto: "Risolvere sfide web con metodo, API, JWT e scrivere un buon resoconto",
          lezioni:
            "Una sfida web dall'inizio alla fine | Come si cerca il punto debole con metodo | Le API e i loro difetti tipici | JWT e token: cosa si controlla | Sessioni e cookie nelle sfide | Evitare i vicoli ciechi | Strumenti automatici: aiuto, non pensiero | Scrivere un write-up chiaro | Segnalare un problema vero: come si scrive | Esercizi: tre sfide web e il resoconto",
        },
      ],
    },
    {
      titolo: "Sistemi e reti",
      descrizione: "Ricognizione, privilegi, password e traffico di rete, sempre in laboratorio.",
      moduli: [
        {
          titolo: "Ricognizione e scansione",
          riassunto: "Scoprire host e servizi nel laboratorio, leggere i risultati e distinguere il segnale dal rumore",
          rinvio: "Ricognizione e scansioni nel laboratorio sono introdotte in Cybersecurity (C8).",
          lezioni:
            "Ricognizione passiva e attiva | Scoprire gli host di una rete di prova | Le porte e cosa nascondono | Scansionare con nmap nel laboratorio | Riconoscere servizi e versioni | Leggere il risultato di una scansione | Quanto rumore fa una scansione | Cosa vede chi difende | Scansioni non permesse: dove finisce il lecito | Esercizi: la mappa di una rete di prova",
        },
        {
          titolo: "Privilegi su Linux",
          riassunto: "Permessi, programmi con privilegi, sudo, attività pianificate e come si fa hardening",
          rinvio: "Permessi e hardening: Fondamenta (F3) e Cybersecurity (C12).",
          lezioni:
            "Che cos'è l'escalation dei privilegi | Utenti, gruppi e permessi: ripasso | I file con permessi speciali | sudo e le sue configurazioni | Attività pianificate e script modificabili | Servizi e percorsi sbagliati | Segreti dimenticati nei file | Strumenti che cercano errori di configurazione | Come si corregge ogni caso | Esercizi: una macchina di prova da mettere in sicurezza",
        },
        {
          titolo: "Password, hash e accessi",
          riassunto: "Come si conservano le password, attacchi a dizionario nel laboratorio, politiche e autenticazione forte",
          rinvio: "Password e 2FA: Cybersecurity (C3).",
          lezioni:
            "Come i sistemi conservano le password | Funzioni hash lente e sale | Password deboli e quelle che si indovinano | L'attacco a dizionario in un laboratorio | Le liste di parole e le regole | I tentativi bloccati e i limiti di velocità | Il riuso delle password | Autenticazione a più fattori: cosa ferma | Gestori di password | Esercizi: misurare la forza di password in un test controllato",
        },
        {
          titolo: "Traffico di rete e attacchi locali",
          riassunto: "Catture di pacchetti, protocolli in chiaro, attacchi sulla rete locale spiegati e difesi",
          rinvio: "Analisi del traffico: Cybersecurity (C13); Wireshark: Fondamenta (F8).",
          lezioni:
            "Leggere il traffico in una cattura | I protocolli in chiaro e cosa rivelano | Credenziali nel traffico di una rete di prova | ARP e l'attacco al centro (MITM) spiegato | Come si difende una rete locale | DNS: risposte false e difese | Il Wi-Fi e le sue debolezze note | Proteggere la propria rete: lista di controllo | Strumenti di difesa che rilevano questi attacchi | Esercizi: un'indagine su una cattura di prova",
        },
      ],
    },
    {
      titolo: "Programmi, metodo e carriera",
      descrizione: "Capire come funziona un programma, il test di sicurezza completo e come si continua.",
      moduli: [
        {
          titolo: "Reverse engineering: le basi",
          riassunto: "Come è fatto un programma, assembly in parole semplici, strumenti di analisi, in sfide legali",
          lezioni:
            "Che cos'è il reverse engineering e a cosa serve | Dal codice al programma eseguibile | Come è fatto un file eseguibile | Registri, memoria e istruzioni: la prima occhiata | Leggere un piccolo assembly | Strumenti: disassemblatori e decompilatori | Analisi statica e dinamica | Un programma che chiede una password: come si ragiona | Programmi protetti e ostacoli comuni | Esercizi: tre programmi di prova",
        },
        {
          titolo: "Memoria e vulnerabilità dei programmi",
          riassunto: "Pila e heap, errori di memoria, protezioni moderne e come si scrive codice più sicuro",
          rinvio: "Sicurezza nel ciclo di sviluppo: Cybersecurity (C24).",
          lezioni:
            "Come usa la memoria un programma | La pila e le chiamate | Quando un dato va oltre lo spazio assegnato | Il buffer overflow: l'idea | Errori nelle stringhe di formato e negli interi | L'heap e i suoi errori | Le protezioni: canarino, pila non eseguibile, ASLR | Perché le protezioni non bastano da sole | Linguaggi sicuri e pratiche difensive | Esercizi: leggere il codice di un programma debole in laboratorio",
        },
        {
          titolo: "Un test di sicurezza completo",
          riassunto: "Metodologia dalla preparazione al rapporto, priorità dei rischi, rapporto per chi decide",
          rinvio: "Metodologia del penetration test: Cybersecurity (C21).",
          lezioni:
            "Le fasi di un test di sicurezza | Preparare: obiettivi, ambito e permessi | Raccogliere le informazioni | Trovare i punti deboli | Verificare in sicurezza ciò che si è trovato | Non fare danni: le regole d'oro | Valutare la gravità: i punteggi | Scrivere il rapporto: chi lo legge e cosa gli serve | Consigliare le correzioni | Esercizi: un test completo in laboratorio, con rapporto",
        },
        {
          titolo: "CTF in squadra, bug bounty e carriera",
          riassunto: "Giocare in squadra, programmi di ricompensa, certificazioni e un progetto finale",
          lezioni:
            "Organizzare una squadra: ruoli e strumenti | Condividere appunti e risultati | Gestire una gara di molte ore | Dopo la gara: analisi e crescita | Bug bounty: come funzionano davvero | Il primo rapporto di vulnerabilità | I mestieri della sicurezza offensiva | Certificazioni: cosa servono e cosa costano | Progetto finale: il tuo laboratorio e il tuo portfolio | Come continuare: gare, comunità e studio",
        },
      ],
    },
  ],
};
