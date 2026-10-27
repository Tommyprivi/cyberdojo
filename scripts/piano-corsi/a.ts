import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "A",
  cartella: "app-telefono",
  titolo: "App per telefono",
  presentazione:
    "Come nasce un'app: idea, schermate, codice, dati, sensori del telefono, sicurezza e pubblicazione. Si costruisce con strumenti gratuiti (app installabili dal web e React Native con Expo) e si guardano anche le strade native e Flutter.",
  perChi: "Per chi vuole creare app per Android e iPhone, anche senza esperienza.",
  consigliato: "Aiuta aver fatto i blocchi 1-2 di Sviluppo web (W) o il blocco 1 di Programmazione generale (P): le app usano JavaScript.",
  blocchi: [
    {
      titolo: "Il mondo delle app",
      descrizione: "Come funziona un'app, come si progetta e le prime app installabili.",
      moduli: [
        {
          titolo: "Come funziona un'app",
          riassunto: "Sistemi operativi mobili, store, permessi, tipi di app e come si costruiscono",
          lezioni:
            "Che cos'è un'app e che cosa c'è dentro | Android e iOS: due mondi | Gli store: come arrivano le app sul telefono | I permessi: cosa può fare un'app e chi decide | App native, web app e app ibride | Come funziona il ciclo di vita di un'app | Gli strumenti: telefono vero ed emulatore | Che cosa costa fare un'app (tempo, strumenti, store) | Un'app che conosci, smontata in pezzi | Scegliere la strada giusta per il tuo progetto",
        },
        {
          titolo: "Progettare un'app",
          riassunto: "Idea, utenti, schermate, flussi, bozze su carta e regole di design per il telefono",
          lezioni:
            "Da un problema a un'idea di app | A chi serve: gli utenti e i loro bisogni | Le funzioni minime: la prima versione | Disegnare le schermate su carta | Il percorso dell'utente da una schermata all'altra | Pollice e schermo piccolo: progettare per il tocco | Regole di design: spazi, testi e colori leggibili | Pulsanti, liste e menu che tutti capiscono | Prototipo cliccabile con uno strumento gratuito | Provare la bozza con una persona vera",
        },
        {
          titolo: "App installabili dal web",
          riassunto: "Web app progressive: manifest, service worker, icone, offline e installazione",
          rinvio: "HTML, CSS e JavaScript di base sono in Sviluppo web (W1-W8).",
          lezioni:
            "Che cos'è una web app progressiva (PWA) | Il manifest: nome, icone e colori | Le icone nelle varie dimensioni | Il service worker: un aiutante che sta dietro | Salvare i file per usarla offline | Una pagina di cortesia quando manca internet | Il pulsante «Installa» | Notifiche push in sintesi | Cosa può e cosa non può fare una PWA | Progetto: trasforma una pagina web in un'app installabile",
        },
        {
          titolo: "Primi passi con Expo",
          riassunto: "React Native, Expo, un'app che gira sul telefono e il ciclo di lavoro",
          lezioni:
            "React Native: scrivere app con JavaScript | Che cos'è Expo e perché semplifica | Creare il primo progetto | Provare l'app sul telefono con Expo Go | Come è fatta la cartella del progetto | Il primo schermo: Text e View | Il ricaricamento istantaneo e gli errori sullo schermo | Leggere i messaggi del terminale | Pubblicare il codice su Git | Progetto: «Ciao» personalizzato con il tuo nome",
        },
      ],
    },
    {
      titolo: "Costruire le schermate",
      descrizione: "Componenti, stile, navigazione e moduli di inserimento.",
      moduli: [
        {
          titolo: "I componenti base",
          riassunto: "View, Text, Image, ScrollView, FlatList, Pressable e come si combinano",
          lezioni:
            "I componenti: i mattoni dell'app | View e Text | Immagini locali e dal web | I pulsanti: Pressable e Button | Le props: personalizzare un componente | ScrollView: far scorrere lo schermo | FlatList: le liste lunghe fatte bene | Componenti scritti da te e riutilizzati | Gestire il tocco e il feedback | Progetto: un elenco di contatti",
        },
        {
          titolo: "Stile e layout",
          riassunto: "StyleSheet, flexbox, dimensioni, schermi diversi, temi chiaro e scuro",
          rinvio: "Il flexbox è spiegato anche in Sviluppo web (W5): qui la versione per React Native.",
          lezioni:
            "StyleSheet: come si dà stile in React Native | Flexbox sul telefono: l'asse principale | Allineare e distribuire | Dimensioni, margini e spazi | Schermi piccoli e grandi: adattarsi | Orientamento verticale e orizzontale | Aree sicure: tacca e barre di sistema | Colori, caratteri e coerenza grafica | Tema chiaro e tema scuro | Progetto: la schermata di profilo curata",
        },
        {
          titolo: "Navigazione",
          riassunto: "Più schermate, pila, schede, parametri e struttura di navigazione di un'app",
          lezioni:
            "Un'app ha più schermate: come si passa dall'una all'altra | Expo Router e le pagine come file | La navigazione a pila | Le schede in basso (tab) | Passare parametri tra schermate | Il pulsante indietro e i gesti | Menu laterale e finestre modali | Collegamenti diretti (deep link) | Schermate protette: chi può entrare | Progetto: un'app a tre schermate",
        },
        {
          titolo: "Input e moduli",
          riassunto: "Campi di testo, tastiera, validazione, selettori e invio dei dati",
          lezioni:
            "TextInput: ricevere testo | La tastiera giusta per ogni campo | Quando la tastiera copre il campo | Validare i dati e mostrare errori chiari | Interruttori, selettori e date | Form con più campi | Disabilitare il pulsante finché i dati non sono validi | Messaggi di conferma e di errore | Gestire il tocco doppio e gli invii ripetuti | Progetto: il modulo di registrazione di un'app",
        },
      ],
    },
    {
      titolo: "Dati e funzioni del telefono",
      descrizione: "Stato, memoria del telefono, dati dal web e sensori.",
      moduli: [
        {
          titolo: "Stato e dati",
          riassunto: "useState, effetti, dati che cambiano nel tempo e liste dinamiche",
          rinvio: "Gli hook di React (useState, useEffect) sono spiegati in Sviluppo web (W14).",
          lezioni:
            "Lo stato di un'app | useState nelle app | Aggiungere e togliere elementi da una lista | Modificare un elemento in una lista | useEffect: azioni al caricamento | Pulire dopo di sé: timer e ascoltatori | Lo stato condiviso tra schermate | Il contesto per i dati comuni | Un piccolo archivio di stato (Zustand) | Progetto: un'app di cose da fare",
        },
        {
          titolo: "Salvare i dati sul telefono",
          riassunto: "Archiviazione locale, file, database sul dispositivo e archivio sicuro per i segreti",
          lezioni:
            "Dove finiscono i dati quando chiudi l'app | AsyncStorage per piccole preferenze | Salvare e rileggere un elenco | Il database SQLite sul telefono | Creare tabelle e inserire righe | Leggere e filtrare i dati | File e cartelle dell'app | L'archivio sicuro per chiavi e token | Cosa succede se l'utente cancella l'app | Progetto: un diario che resta sul telefono",
        },
        {
          titolo: "Dati dal web e dal server",
          riassunto: "fetch, API, JSON, caricamento, errori, aggiornare per trascinamento e connessione assente",
          lezioni:
            "Un'app che parla con un server | fetch e JSON | Mostrare un elenco preso da un'API | Stati di caricamento, errore e vuoto | Aggiornare trascinando verso il basso | Caricare altre voci scorrendo | Inviare dati con POST | Intestazioni e chiavi di accesso | Che fare quando non c'è internet | Progetto: un'app di notizie o di meteo",
        },
        {
          titolo: "Sensori e funzioni del dispositivo",
          riassunto: "Fotocamera, posizione, notifiche, permessi, vibrazione e movimento",
          lezioni:
            "I sensori del telefono: cosa c'è dentro | Chiedere un permesso nel modo giusto | La fotocamera: scattare una foto | La galleria: scegliere una foto | La posizione e la mappa | Notifiche locali | Notifiche push: come funzionano | Vibrazione, suoni e feedback tattile | Accelerometro e giroscopio | Progetto: un'app che usa la fotocamera e la posizione",
        },
      ],
    },
    {
      titolo: "App fatte bene",
      descrizione: "Un'app vera ha utenti, un server, buone prestazioni e rispetta la privacy.",
      moduli: [
        {
          titolo: "Struttura di un'app che cresce",
          riassunto: "Organizzare cartelle e codice, TypeScript, gestione degli errori e stato globale ordinato",
          lezioni:
            "Quando un'app diventa grande: i problemi | Organizzare cartelle e componenti | TypeScript nelle app | Tipi per i dati del server | Stato globale ordinato | Separare chiamate di rete e interfaccia | Gestire gli errori in un posto solo | Configurazioni e variabili per ambiente | Strumenti di controllo del codice | Progetto: riordinare un'app disordinata",
        },
        {
          titolo: "Account e dati nel cloud",
          riassunto: "Registrazione, accesso, database nel cloud, sincronizzazione e notifiche dal server",
          rinvio: "Autenticazione e sicurezza lato server sono in Sviluppo web (W19).",
          lezioni:
            "Perché servono gli account | Registrazione e accesso dall'app | Tenere l'accesso tra un avvio e l'altro | Un database nel cloud per l'app | Leggere e scrivere dati dell'utente | Dati che si aggiornano in tempo reale | Immagini e file nel cloud | Sincronizzare dati tra telefono e server | Notifiche push inviate dal server | Progetto: un'app con account e dati personali",
        },
        {
          titolo: "Qualità: prestazioni, test, accessibilità",
          riassunto: "App veloci, testate, accessibili e che funzionano anche senza rete",
          lezioni:
            "Cosa rende un'app lenta | Liste e immagini ottimizzate | Misurare le prestazioni | Consumo di batteria e di dati | Funzionare offline: la regola dei dati locali | Testare i componenti | Testare l'app davanti a un utente vero | Accessibilità: lettori di schermo e testo grande | Lingue e formati: tradurre l'app | Progetto: miglioramenti misurati su un'app tua",
        },
        {
          titolo: "Sicurezza e privacy nelle app",
          riassunto: "Permessi minimi, dati personali, protezione delle chiavi, minori e regole degli store",
          rinvio: "Il lato attacco delle app mobili è in Hacking etico (E): qui si impara a costruire in modo sicuro.",
          lezioni:
            "Le app e i dati personali | Il principio del minimo indispensabile | Permessi: chiedere solo ciò che serve | Chiavi e segreti: mai dentro l'app | Cosa si può leggere da un'app installata | Comunicazioni sicure con HTTPS | Salvare in modo sicuro i dati sensibili | App per ragazzi: regole e cautele | Informativa sulla privacy e GDPR in sintesi | Lista di controllo di sicurezza prima di pubblicare",
        },
      ],
    },
    {
      titolo: "Pubblicare e andare oltre",
      descrizione: "Dalla prova al negozio, le altre strade per fare app e un progetto finale.",
      moduli: [
        {
          titolo: "Dalla prova al negozio",
          riassunto: "Build, firma, versioni, test con altri, regole e costi degli store",
          lezioni:
            "Che cosa significa pubblicare un'app | Nome, identificativo e versione | Icona e schermata di avvio | Costruire l'app con EAS Build | Firma digitale: perché serve | Distribuire a pochi tester prima del pubblico | Le schede dello store: testi e immagini | Le regole degli store e i motivi di rifiuto | I costi degli account sviluppatore: chi paga cosa | Il primo invio e cosa aspettarsi",
        },
        {
          titolo: "Altre strade: nativo e Flutter",
          riassunto: "Kotlin per Android, Swift per iPhone, Flutter e come scegliere tra le tecnologie",
          lezioni:
            "Sviluppo nativo: pro e contro | Kotlin e Android Studio | Un primo sguardo a Jetpack Compose | Swift e Xcode | Un primo sguardo a SwiftUI | Flutter e il linguaggio Dart | Un'app semplice in Flutter | Confronto tra React Native, Flutter e nativo | Strumenti senza codice: cosa fanno e i loro limiti | Come scegliere la tecnologia per un progetto",
        },
        {
          titolo: "Dopo la pubblicazione",
          riassunto: "Aggiornamenti, errori in produzione, statistiche, recensioni e manutenzione",
          lezioni:
            "Un'app non è mai finita | Aggiornamenti e compatibilità con i nuovi sistemi | Segnalazione automatica degli errori | Statistiche d'uso e privacy | Capire cosa fanno davvero gli utenti | Leggere e rispondere alle recensioni | Correggere un errore urgente | Funzioni nuove: come scegliere cosa fare | Tenere in ordine il codice nel tempo | Quando e come spegnere un'app",
        },
        {
          titolo: "Progetto finale",
          riassunto: "Un'app completa dall'idea alla consegna, con relazione e prova con utenti reali",
          lezioni:
            "Scegliere l'idea e i confini del progetto | Progettare schermate e dati | Costruire la prima schermata | Costruire la navigazione | Salvare e leggere i dati | Aggiungere una funzione del telefono | Rifinire l'aspetto e l'accessibilità | Provare con utenti veri e correggere | Preparare la pubblicazione | Presentare il progetto e la relazione finale",
        },
      ],
    },
  ],
};
