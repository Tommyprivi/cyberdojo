import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "M",
  cartella: "mondo-digitale",
  titolo: "Mondo digitale per tutti",
  presentazione:
    "Le competenze digitali di ogni giorno, spiegate con calma e senza gergo: computer e telefono, internet, posta, servizi online, foto e documenti, sicurezza e privacy, informazione, regole, benessere e intelligenza artificiale. Per ragazzi, genitori e nonni.",
  perChi: "Per chiunque voglia muoversi con sicurezza nel mondo digitale, senza bisogno di essere esperto.",
  consigliato: "Nessun prerequisito. È il corso più adatto per cominciare, anche per chi non ha mai usato un computer.",
  blocchi: [
    {
      titolo: "Primi passi",
      descrizione: "Computer, telefono, internet e posta elettronica da zero.",
      moduli: [
        {
          titolo: "Computer e telefono",
          riassunto: "Come sono fatti, come si accendono e si usano, file, cartelle, programmi e app",
          lezioni:
            "Che cos'è un computer e che cos'è uno smartphone | Le parti che si vedono: schermo, tastiera, mouse e tocco | Accendere, spegnere e riavviare | Il desktop e le finestre | File e cartelle: dove finiscono le cose | Programmi e app: cosa sono e come si installano | Le impostazioni più utili | Come si usa la tastiera: lettere, numeri e scorciatoie | Cosa fare quando si blocca tutto | Esercizi: mettere in ordine cartelle e file",
        },
        {
          titolo: "Internet e il browser",
          riassunto: "Cos'è internet, il browser, cercare con i motori di ricerca, siti sicuri e download",
          rinvio: "Per capire come funziona internet dentro: Reti e internet (R1).",
          lezioni:
            "Internet e il web: la differenza | Il browser e le sue parti | L'indirizzo di un sito | Cercare con un motore di ricerca | Leggere i risultati: cosa sono gli annunci | I segnalibri e la cronologia | Siti sicuri: il lucchetto e cosa vuol dire davvero | Scaricare file e cosa controllare | Schede, finestre e come tenere ordine | Esercizi: cercare e confrontare tre fonti su uno stesso argomento",
        },
        {
          titolo: "Posta elettronica e messaggi",
          riassunto: "Creare un account, scrivere e leggere email, allegati, rubrica, messaggi e videochiamate",
          lezioni:
            "Che cos'è un indirizzo di posta elettronica | Creare un account di posta | Leggere e rispondere | Scrivere un'email fatta bene | Allegati: inviare e ricevere | Rubrica, copia e copia nascosta | La posta indesiderata (spam) | Messaggi istantanei e gruppi | Videochiamate: come si fanno | Esercizi: scrivere una richiesta formale a una scuola o a un ufficio",
        },
        {
          titolo: "Smartphone e tablet",
          riassunto: "Gestire telefono e tablet: impostazioni, app, notifiche, batteria, spazio, aggiornamenti",
          lezioni:
            "Android e iPhone: le basi in comune | Lo schermo principale e i gesti | Installare e togliere le app | Le notifiche: quali servono | La batteria: cosa la consuma | Lo spazio: cosa occupa memoria | Aggiornare il sistema e le app | Il Wi-Fi e i dati del telefono | Accessibilità: testo grande, voce e altri aiuti | Esercizi: sistemare un telefono pieno di cose",
        },
      ],
    },
    {
      titolo: "Vivere online",
      descrizione: "Servizi, foto e documenti, social e programmi d'ufficio.",
      moduli: [
        {
          titolo: "Servizi online di ogni giorno",
          riassunto: "Identità digitale, servizi pubblici, banca e pagamenti, acquisti e prenotazioni",
          lezioni:
            "I servizi che si fanno da casa | SPID e carta d'identità elettronica: cosa sono | Servizi pubblici online: tessera sanitaria, fascicolo sanitario e altri | La banca online e le app dei pagamenti | Pagare online: carte e metodi | Comprare in modo sicuro | Resi, garanzie e diritti dell'acquirente | Prenotare viaggi e visite | Fatture e documenti online | Esercizi: pianificare un acquisto senza rischi",
        },
        {
          titolo: "Foto, video, musica e cloud",
          riassunto: "Fare e ordinare foto, condividere in modo sensato, spazio nel cloud, copia dei ricordi",
          lezioni:
            "Fotografare con il telefono | Ordinare le foto: album e nomi | Modificare una foto con semplicità | Registrare e montare un breve video | Musica e video in streaming | Il cloud: archiviare nella nuvola | Condividere cartelle e link | Quando condividere una foto non va bene | Copia dei ricordi: un secondo posto | Esercizi: un album di famiglia ordinato e salvato",
        },
        {
          titolo: "Social e comunicazione",
          riassunto: "Come funzionano i social, profili, impostazioni di riservatezza, comportamento e contenuti",
          lezioni:
            "Cosa sono i social e come guadagnano | Creare un profilo: cosa scrivere e cosa no | Le impostazioni di riservatezza | Amici, follower e sconosciuti | Cosa si pubblica e cosa resta per sempre | Commenti e discussioni: comportarsi bene | Gruppi e chat | Segnalare e bloccare | Il tempo che passa tra i social: come si misura | Esercizi: rivedere il proprio profilo con occhi nuovi",
        },
        {
          titolo: "Documenti, fogli e presentazioni",
          riassunto: "Scrivere un testo, fare un foglio di calcolo semplice, preparare una presentazione, con strumenti gratuiti",
          rinvio: "Per i fogli di calcolo a fondo: Analista di dati (D2).",
          lezioni:
            "Gli strumenti gratuiti: Fogli, Documenti e LibreOffice | Scrivere un testo: stili, elenchi e pagine | Un curriculum in una pagina | Salvare, esportare in PDF e inviare | Un foglio di calcolo: celle e somme | Un piccolo bilancio familiare in un foglio | Grafici semplici | Una presentazione chiara: poche parole, una immagine | Lavorare in due sullo stesso documento | Esercizi: una relazione scolastica completa",
        },
      ],
    },
    {
      titolo: "Sicurezza e privacy per tutti",
      descrizione: "Proteggere account, soldi e dati con regole semplici.",
      moduli: [
        {
          titolo: "Password e accessi",
          riassunto: "Password buone, gestore di password, verifica in due passaggi e recupero degli account",
          rinvio: "Password e 2FA a fondo: Cybersecurity (C3).",
          lezioni:
            "Perché le password contano | Cosa rende forte una password | Una password diversa per ogni sito | Il gestore di password: cos'è e come si usa | La verifica in due passaggi | Codici, app e chiavi di sicurezza | Quando una password è finita in una fuga di dati | Il recupero dell'account: prepararlo prima | Accessi sui dispositivi: PIN, impronta e volto | Esercizi: mettere in sicurezza i tuoi tre account più importanti",
        },
        {
          titolo: "Truffe e inganni online",
          riassunto: "Phishing, messaggi falsi, finti operatori, acquisti truffa, come riconoscerli e cosa fare",
          rinvio: "Il lato tecnico del phishing: Cybersecurity (C26).",
          lezioni:
            "Come ragiona chi truffa | Phishing: email e messaggi falsi | Segnali di un messaggio falso | Link e allegati: cosa non toccare | Finte chiamate della banca e altri imbrogli al telefono | Acquisti troppo belli per essere veri | Finti investimenti e guadagni facili | Truffe sentimentali e richieste di soldi | Cosa fare se ci sei cascato: i primi minuti | Esercizi: riconoscere dieci messaggi, veri e falsi",
        },
        {
          titolo: "Privacy e dati personali",
          riassunto: "Quali dati lasciamo, chi li raccoglie, cookie, permessi delle app, diritti sul trattamento dei dati",
          rinvio: "Privacy e anonimato a fondo: Cybersecurity (C10).",
          lezioni:
            "Cosa sono i dati personali | Chi raccoglie i tuoi dati e perché | I cookie e i banner | I permessi delle app | La posizione: quando condividerla | Il GDPR in parole semplici: i tuoi diritti | Chiedere di vedere o cancellare i tuoi dati | Nomi utente, foto e traccia che lasci | Navigare con più riservatezza | Esercizi: l'esame della tua impronta digitale",
        },
        {
          titolo: "Dispositivi al sicuro",
          riassunto: "Aggiornamenti, antivirus, copie di sicurezza, reti Wi-Fi pubbliche, furto e smarrimento",
          lezioni:
            "Perché gli aggiornamenti sono importanti | L'antivirus: serve e cosa fa | Cosa sono i virus e i programmi dannosi | Le copie di sicurezza: la regola 3-2-1 | Wi-Fi pubblici: cosa evitare | Cifrare il telefono e il computer | Se perdi o ti rubano il telefono | Prima di vendere o regalare un dispositivo | La sicurezza dei dispositivi di casa: router e telecamere | Esercizi: un controllo di sicurezza di casa in 30 minuti",
        },
      ],
    },
    {
      titolo: "Cittadini digitali",
      descrizione: "Informarsi bene, conoscere le regole, stare bene e usare i servizi pubblici.",
      moduli: [
        {
          titolo: "Informazione e notizie false",
          riassunto: "Come si valutano le fonti, il controllo dei fatti, immagini e video manipolati e i meccanismi delle bufale",
          lezioni:
            "Dove ci informiamo oggi | Fonti, autori e scopi | Titoli, immagini e il clic facile | Le bufale: come nascono e perché si diffondono | Controllare un fatto in cinque minuti | Le immagini fuori contesto | Video e voci creati dall'IA: come ci si difende | Algoritmi e bolle: cosa ci mostrano e perché | Opinioni e fatti | Esercizi: sbufalare tre notizie false",
        },
        {
          titolo: "Regole, diritti e rispetto",
          riassunto: "Diritto d'autore, diffamazione, cyberbullismo, regole sulle immagini e a chi chiedere aiuto",
          lezioni:
            "Online valgono le stesse leggi di fuori | Il diritto d'autore: cosa si può usare | Licenze libere e contenuti da riusare | Immagini di altre persone: consenso e regole | Insulti e diffamazione online | Il cyberbullismo: riconoscerlo e fermarlo | Cosa fare se sei vittima o testimone | Il sexting e le immagini private: rischi e tutele | Dove chiedere aiuto | Esercizi: casi da valutare, con la regola giusta",
        },
        {
          titolo: "Benessere digitale",
          riassunto: "Tempo davanti agli schermi, sonno, attenzione, giochi, abitudini e vita fuori dallo schermo",
          lezioni:
            "Come ci cattura un'app | Il tempo davanti agli schermi: come si misura | Notifiche e attenzione | Sonno e schermi | Giochi online: divertimento e abitudini | Acquisti nei giochi e nelle app | Quando è troppo: i segnali | Stare bene con gli altri anche dal vivo | Il telefono a scuola e al lavoro | Esercizi: una settimana di prova con nuove abitudini",
        },
        {
          titolo: "Servizi pubblici digitali",
          riassunto: "Identità digitale, pratiche online, sanità, scuola, fisco e pagamenti verso la pubblica amministrazione",
          lezioni:
            "La pubblica amministrazione online | SPID, CIE e CNS: quando serve quale | L'app IO | Il fascicolo sanitario elettronico | Prenotare visite ed esami | Scuola online: registro, iscrizioni e pagamenti | Il fisco online: cosa si può fare da soli | Pagare con pagoPA | Firma digitale e PEC in parole semplici | Esercizi: pianificare una pratica online dall'inizio alla fine",
        },
      ],
    },
    {
      titolo: "Il futuro e le tue competenze",
      descrizione: "Intelligenza artificiale, un assaggio di programmazione, lavoro e progetto personale.",
      moduli: [
        {
          titolo: "Intelligenza artificiale per tutti",
          riassunto: "Cos'è, come usarla bene, cosa evitare, scuola e lavoro, immagini e voci creati dall'IA",
          rinvio: "Per capire come funziona dentro: Intelligenza artificiale (I).",
          lezioni:
            "Che cos'è l'intelligenza artificiale in poche parole | Gli assistenti che rispondono alle domande | Fare buone domande | Quando le risposte sono sbagliate | Cosa non scrivere mai in una chat | Studiare con l'IA senza imbrogliare | L'IA al lavoro: aiuto e limiti | Immagini, voci e video creati dall'IA | Le regole dell'Unione europea in parole semplici | Esercizi: un compito svolto con l'IA, controllato a mano",
        },
        {
          titolo: "Un assaggio di programmazione",
          riassunto: "Pensiero computazionale, algoritmi nella vita, primi programmi a blocchi e uno sguardo al codice",
          rinvio: "Per programmare sul serio: Programmazione generale (P) e Sviluppo web (W).",
          lezioni:
            "Che cos'è un programma | Gli algoritmi nella vita di tutti i giorni | Scomporre un problema | Programmare a blocchi: il primo programma | Ripetizioni e scelte | Variabili: dare un nome ai dati | Dai blocchi al codice: un esempio | Trovare e correggere gli errori | Programmi che aiutano nella vita di tutti i giorni | Esercizi: un piccolo gioco con i blocchi",
        },
        {
          titolo: "Lavoro e competenze digitali",
          riassunto: "Curriculum, profili online, lavoro da remoto, strumenti di squadra, competenze richieste e come impararle",
          lezioni:
            "Le competenze digitali che servono oggi | Il quadro europeo delle competenze digitali | Un curriculum chiaro | Il profilo professionale online | Cercare lavoro in rete senza farsi truffare | Il lavoro da remoto: strumenti e regole | Posta, riunioni e documenti condivisi | Organizzarsi: calendario, elenchi e promemoria | Continuare a imparare: corsi gratuiti e come sceglierli | Esercizi: il tuo piano per le prossime competenze",
        },
        {
          titolo: "Progetto: la mia vita digitale in ordine",
          riassunto: "Un progetto personale che mette insieme tutto: account, sicurezza, ordine, regole e benessere",
          lezioni:
            "Il quadro di partenza: cosa hai e dove sta | L'elenco dei tuoi account | Mettere in sicurezza gli accessi | Mettere in ordine file, foto e posta | Impostare copie di sicurezza | Rivedere privacy e permessi | Impostare le abitudini di benessere digitale | Un piano per la tua famiglia | Spiegare a una persona cara quello che hai imparato | Il tuo diario digitale: cosa hai cambiato e cosa resta da fare",
        },
      ],
    },
  ],
};
