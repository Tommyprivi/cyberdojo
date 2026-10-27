import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "I",
  cartella: "intelligenza-artificiale",
  titolo: "Intelligenza artificiale",
  presentazione:
    "Che cos'è davvero l'intelligenza artificiale: come si usa bene, come impara una macchina, reti neurali, modelli di linguaggio e IA generativa, fino a costruire applicazioni e metterle in produzione. Con onestà sui limiti, sui rischi e sulle regole.",
  perChi: "Per chi vuole capire l'IA e saperla usare e costruire, dai curiosi ai futuri sviluppatori.",
  consigliato: "Il blocco 1 si segue da zero. Dal blocco 2 serve un po' di Python (Programmazione generale P, blocco 1, o Fondamenta F9).",
  blocchi: [
    {
      titolo: "Capire l'intelligenza artificiale",
      descrizione: "Che cosa è, che cosa non è, come usarla bene e quali regole valgono.",
      moduli: [
        {
          titolo: "Che cos'è l'IA",
          riassunto: "Storia, parole giuste, tipi di IA, cosa sa fare e cosa no, esempi di ogni giorno",
          lezioni:
            "Intelligenza artificiale: di cosa stiamo parlando | Una breve storia dell'IA | Programmi con regole e programmi che imparano | Apprendimento automatico, reti neurali, IA generativa: le parole giuste | IA stretta e IA generale: cosa esiste davvero | L'IA nelle cose di ogni giorno | Cosa sa fare bene l'IA | Cosa non sa fare (e perché sembra di sì) | Miti e paure: separare i fatti dalle storie | Un'IA in un esperimento: addestra un riconoscitore di immagini senza codice",
        },
        {
          titolo: "Usare bene gli assistenti di IA",
          riassunto: "Come scrivere richieste efficaci, verificare le risposte, errori inventati e uso responsabile",
          lezioni:
            "Che cos'è un assistente di IA e come risponde | Scrivere una buona richiesta (prompt) | Dare un contesto, un ruolo e un formato | Fare domande a più passaggi | Le risposte inventate (allucinazioni) | Come verificare una risposta | Chiedere fonti: cosa funziona e cosa no | IA per studiare senza barare | IA per scrivere, riassumere e tradurre | Regole d'uso: cosa non incollare mai in una chat",
        },
        {
          titolo: "I dati: il carburante dell'IA",
          riassunto: "Da dove vengono i dati, esempi ed etichette, qualità, quantità e pregiudizi",
          rinvio: "Tabelle, pulizia e qualità dei dati sono in Analista di dati (D1, D8).",
          lezioni:
            "Perché per l'IA i dati contano più del codice | Dati strutturati e non strutturati | Esempi ed etichette | Dati di addestramento, di validazione e di prova | Quanti dati servono | Dati sporchi, mancanti e sbilanciati | Da dove vengono i dati: raccolti, acquistati, generati | I dati personali e il consenso | Il pregiudizio nei dati (bias): come entra e come si vede | Esercizio: guardare un piccolo insieme di dati e trovare i problemi",
        },
        {
          titolo: "IA, società e regole",
          riassunto: "Lavoro, scuola, informazione, diritto d'autore, AI Act europeo in sintesi, uso responsabile",
          lezioni:
            "IA e lavoro: cosa cambia e cosa no | IA e scuola | Informazione e falsi: immagini, voci e video creati dall'IA | Riconoscere un contenuto creato dall'IA | Diritto d'autore e IA: le questioni aperte | Privacy e IA | Il regolamento europeo sull'IA (AI Act) in sintesi | Rischi alti e usi vietati secondo l'AI Act | Impatto ambientale dell'IA | Le tue regole personali per usare l'IA",
        },
      ],
    },
    {
      titolo: "Machine learning",
      descrizione: "Far imparare una macchina dagli esempi: modelli semplici, valutazione e scelta.",
      moduli: [
        {
          titolo: "Python e dati per l'IA",
          riassunto: "Notebook, NumPy, pandas, grafici e un insieme di dati pronto per un modello",
          rinvio: "NumPy, pandas e notebook sono trattati in Analista di dati (D4); qui si usano per preparare un modello.",
          lezioni:
            "L'ambiente di lavoro: notebook e librerie | Array con NumPy | Tabelle con pandas | Leggere un insieme di dati | Capire i dati con statistiche semplici | Grafici per esplorare i dati | Pulire valori mancanti e valori strani | Trasformare le colonne in numeri | Dividere i dati: addestramento e prova | Progetto: preparare un insieme di dati su un caso reale",
        },
        {
          titolo: "Regressione e classificazione",
          riassunto: "Prevedere un numero e prevedere una categoria con scikit-learn",
          rinvio: "Un'introduzione al machine learning c'è già in Analista di dati (D11): qui si va più a fondo.",
          lezioni:
            "Che cos'è un modello | Prevedere un numero: la regressione lineare | Come si misura l'errore | Il primo modello con scikit-learn | Prevedere una categoria: la classificazione | La regressione logistica | I k vicini più prossimi | Alberi decisionali | Il rischio di imparare a memoria: overfitting | Progetto: prevedere il prezzo di una casa o la sopravvivenza di un passeggero",
        },
        {
          titolo: "Valutare i modelli",
          riassunto: "Accuratezza, matrice di confusione, precisione e richiamo, validazione incrociata, scelta dei parametri",
          lezioni:
            "Quanto è bravo un modello: come si misura | L'accuratezza e perché inganna | La matrice di confusione | Precisione e richiamo | Il compromesso tra falsi allarmi e casi mancati | Curva ROC e area sotto la curva | Validazione incrociata | Scegliere i parametri del modello | Confrontare modelli in modo onesto | Quando un modello è abbastanza buono",
        },
        {
          titolo: "Altri modelli di apprendimento",
          riassunto: "Foreste casuali, boosting, raggruppamenti, riduzione delle dimensioni e rilevare anomalie",
          lezioni:
            "Unire tanti modelli: l'idea degli ensemble | Foreste casuali | Boosting in sintesi | Apprendimento non supervisionato: niente etichette | Raggruppare con k-means | Quanti gruppi scegliere | Ridurre le dimensioni: l'analisi delle componenti principali | Trovare le anomalie | Cenni sull'apprendimento per rinforzo | Progetto: segmentare i clienti di un negozio fittizio",
        },
      ],
    },
    {
      titolo: "Reti neurali e deep learning",
      descrizione: "Come funziona un neurone artificiale e come si costruiscono reti profonde.",
      moduli: [
        {
          titolo: "Dal neurone alla rete",
          riassunto: "Il neurone artificiale, pesi, funzioni di attivazione, strati e prima rete a mano",
          lezioni:
            "Il neurone biologico e il neurone artificiale | Pesi, somma e soglia | Funzioni di attivazione | Mettere i neuroni in strati | Perché servono gli strati nascosti | Una rete piccola calcolata a mano | Una rete che impara le porte logiche | Rappresentare i dati come numeri | Una rete in poche righe con Keras o PyTorch | Progetto: riconoscere le cifre scritte a mano",
        },
        {
          titolo: "Come impara una rete",
          riassunto: "Funzione di errore, discesa del gradiente, retropropagazione, ottimizzatori e regole contro l'overfitting",
          lezioni:
            "La funzione di errore (loss) | Scendere lungo la collina: la discesa del gradiente | Il passo di apprendimento | Retropropagazione in parole semplici | Cicli di addestramento: batch ed epoche | Ottimizzatori: SGD e Adam | Guardare le curve di addestramento | Regolarizzazione e dropout | Inizializzazione e normalizzazione | Progetto: migliorare una rete che va male",
        },
        {
          titolo: "Immagini e reti convoluzionali",
          riassunto: "Pixel, filtri, convoluzioni, pooling, trasferimento dell'apprendimento e limiti",
          lezioni:
            "Come vede un computer: i pixel | I filtri che cercano bordi e forme | La convoluzione | Pooling e mappe delle caratteristiche | Mettere insieme una rete convoluzionale | Aumentare le immagini: i dati si moltiplicano | Usare un modello già addestrato | Trasferimento dell'apprendimento (fine-tuning) | Rilevare e segmentare oggetti in sintesi | Dove sbagliano i modelli di visione: esempi avversari",
        },
        {
          titolo: "Sequenze e attenzione",
          riassunto: "Testo e serie temporali, reti ricorrenti, il meccanismo di attenzione e la strada verso i transformer",
          lezioni:
            "Dati che hanno un ordine: testo, suoni, serie nel tempo | Le reti ricorrenti | Il problema della memoria corta | LSTM e GRU in sintesi | Dal testo ai numeri: parole e vettori | L'attenzione: guardare le parti che contano | Auto-attenzione | Perché l'attenzione ha battuto le reti ricorrenti | Tradurre con una rete a sequenze | Progetto: classificare il tono di frasi brevi",
        },
      ],
    },
    {
      titolo: "Linguaggio e IA generativa",
      descrizione: "Come funzionano i modelli di linguaggio e di immagini e come si costruiscono applicazioni con loro.",
      moduli: [
        {
          titolo: "Il linguaggio per le macchine",
          riassunto: "Token, embedding, somiglianza tra significati, modelli di linguaggio semplici e ricerca per significato",
          lezioni:
            "Elaborazione del linguaggio naturale: i problemi | Dividere il testo in token | Contare le parole: il sacco di parole | Gli embedding: parole come punti in uno spazio | Somiglianza tra significati: distanza e coseno | Un modello di linguaggio semplice: indovinare la parola dopo | Ricerca per significato | Classificare testi | Lingue diverse e l'italiano | Progetto: un motore di ricerca per significato su poche frasi",
        },
        {
          titolo: "Transformer e modelli di linguaggio",
          riassunto: "Come funziona un modello grande: transformer, addestramento, messa a punto, limiti e valutazione",
          lezioni:
            "L'architettura transformer | Attenzione a più teste | Posizione e contesto | Addestrare un modello di linguaggio: prevedere il token successivo | Dati, calcolo e costi dell'addestramento | Dal modello di base all'assistente: messa a punto e istruzioni | Imparare dal giudizio umano | Come il modello genera il testo: probabilità e temperatura | Finestra di contesto e memoria | Perché sbaglia: limiti, allucinazioni e come si valutano",
        },
        {
          titolo: "Immagini, audio e video generativi",
          riassunto: "Modelli di diffusione, immagini da testo, voce e musica, diritti e riconoscimento dei contenuti falsi",
          lezioni:
            "Generare invece di riconoscere | Reti generative avversarie in sintesi | La diffusione: dal rumore all'immagine | Immagini da testo: come si guidano | Richieste per le immagini: stile, composizione, limiti | Modificare immagini: riempire e variare | Voce: sintesi vocale e clonazione | Musica e suoni generati | Video generati: stato e limiti | Falsi, marchi invisibili e provenienza dei contenuti",
        },
        {
          titolo: "Costruire con i modelli di linguaggio",
          riassunto: "API, richieste strutturate, ricerca nei propri documenti (RAG), strumenti e agenti, valutazione",
          rinvio: "Il lato sicurezza (prompt injection e simili) è in Cybersecurity C25.",
          lezioni:
            "Usare un modello da programma: le API | Messaggi, ruoli e costi in token | Risposte in formato strutturato | Dare istruzioni stabili: il messaggio di sistema | Dare conoscenza al modello: il contesto | RAG: cercare nei propri documenti e poi rispondere | Dividere i documenti e conservare gli embedding | Far usare strumenti al modello | Agenti: pianificare e ripetere passi | Progetto: un assistente che risponde sui documenti di un'associazione",
        },
      ],
    },
    {
      titolo: "IA in produzione e responsabile",
      descrizione: "Dal quaderno al servizio vero: qualità, sicurezza, equità e un progetto completo.",
      moduli: [
        {
          titolo: "Progetti di IA ben fatti",
          riassunto: "Impostare il problema, dati e baseline, esperimenti ordinati, riproducibilità e collaborazione",
          lezioni:
            "Un problema di IA o un problema che non lo è | Definire il successo prima di cominciare | La soluzione più semplice come punto di confronto | Raccogliere e descrivere i dati del progetto | Esperimenti ordinati: cosa cambiare e cosa tenere | Registrare risultati e versioni | Riproducibilità: stesso codice, stessi risultati | Errori classici: la perdita di dati dal test | Lavorare in squadra su un progetto di IA | Relazione onesta su un esperimento",
        },
        {
          titolo: "Portare un modello in produzione",
          riassunto: "Salvare e servire un modello, API, prestazioni, monitoraggio e cambiamento dei dati nel tempo",
          rinvio: "Container e cloud: corso Cloud e DevOps (L).",
          lezioni:
            "Dal quaderno al servizio | Salvare e caricare un modello | Un'API che risponde con le previsioni | Prestazioni: tempo di risposta e costi | Modelli più piccoli e più veloci | Eseguire un modello sul proprio computer | Monitorare un modello in produzione | I dati cambiano: la deriva del modello | Aggiornare un modello senza rompere tutto | Progetto: un servizio di previsione che gira su un server",
        },
        {
          titolo: "Sicurezza, equità e IA responsabile",
          riassunto: "Esempi avversari, avvelenamento dei dati, equità, spiegabilità, valutazione dell'impatto",
          rinvio: "Prompt injection e rischi dei modelli lato attacco: Cybersecurity C25.",
          lezioni:
            "Quando un modello è dannoso: esempi di fallimenti | Equità: cosa significa e come si misura | Le fonti di pregiudizio lungo tutto il progetto | Spiegare le decisioni di un modello | Esempi avversari: ingannare un modello | Avvelenare i dati e rubare i modelli (concetti) | Privacy nei modelli: cosa possono rivelare | Valutare l'impatto prima di costruire | Documentare un modello: la scheda del modello | Lista di controllo per un'IA responsabile",
        },
        {
          titolo: "Progetto finale e carriera",
          riassunto: "Un progetto di IA completo, il portafoglio dei lavori, i mestieri dell'IA e come continuare",
          lezioni:
            "Scegliere un progetto che vale la pena | Dati e problema ben posti | Un primo modello semplice | Migliorare con metodo | Valutare con onestà | Costruire una piccola applicazione attorno al modello | Spiegare il risultato a chi non è tecnico | Presentare il progetto | I mestieri dell'IA: analista, ingegnere di apprendimento automatico, ricercatore | Come continuare a imparare: corsi, gare e comunità",
        },
      ],
    },
  ],
};
