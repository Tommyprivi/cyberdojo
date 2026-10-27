import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "X",
  cartella: "blockchain",
  titolo: "Blockchain e crypto (tecnica)",
  presentazione:
    "Come funzionano davvero blockchain e criptovalute dal punto di vista tecnico: crittografia, Bitcoin, Ethereum e contratti intelligenti, consenso, reti di secondo livello, sicurezza e truffe. Un corso di tecnica, non di investimenti: nessun consiglio finanziario.",
  perChi: "Per chi vuole capire la tecnologia dietro le criptovalute, o imparare a scrivere contratti intelligenti.",
  consigliato: "Il blocco 1 si segue da zero. Dal blocco 3 serve un po' di programmazione (Programmazione generale P1-P4 o Sviluppo web W7-W8).",
  blocchi: [
    {
      titolo: "Perché esiste la blockchain",
      descrizione: "Il problema della fiducia, gli ingredienti crittografici e Bitcoin spiegato dal principio.",
      moduli: [
        {
          titolo: "Il problema che risolve",
          riassunto: "Registri, fiducia, denaro digitale, doppia spesa e che cosa promette (e non promette) una blockchain",
          lezioni:
            "Chi tiene il registro: banche, notai e fiducia | Il denaro digitale e il problema della doppia spesa | Un registro condiviso: l'idea | Una breve storia: dal 1991 a Bitcoin | Che cos'è davvero una blockchain | Cosa promette e cosa non promette | Pubblica, privata, con permessi | Blockchain e database: quando serve davvero | Parole giuste e parole gonfiate: token, coin, crypto | Esercizi: valutare tre idee di «blockchain per tutto»",
        },
        {
          titolo: "Gli ingredienti crittografici",
          riassunto: "Hash, alberi di Merkle, chiavi pubbliche e private, firme digitali e numeri casuali",
          rinvio: "Hash, cifratura e firme sono in Cybersecurity (C2): qui si usano per costruire la blockchain.",
          lezioni:
            "Hash: l'impronta digitale dei dati | Proprietà di un buon hash: SHA-256 | Provare un hash a mano e con il codice | Concatenare i blocchi con gli hash | L'albero di Merkle | Chiave privata e chiave pubblica | La firma digitale: provare che sei tu | Indirizzi: come si ricavano dalla chiave pubblica | Numeri casuali: perché sono importanti | Esercizi: costruire una mini catena di blocchi in Python",
        },
        {
          titolo: "Bitcoin: come funziona",
          riassunto: "Transazioni, blocchi, minatori, ricompense, commissioni e il percorso di un pagamento",
          lezioni:
            "Il documento di Satoshi Nakamoto | Una transazione: ingressi e uscite | Gli UTXO: monete e resto | Dal pagamento al blocco | Il lavoro dei minatori | La prova di lavoro in parole semplici | La ricompensa e il dimezzamento | Le commissioni | Quante conferme servono | Esercizi: seguire una transazione vera su un esploratore di blocchi",
        },
        {
          titolo: "Portafogli e chiavi",
          riassunto: "Cos'è un portafoglio, frase di recupero, tipi di portafoglio, copie di sicurezza e errori da evitare",
          lezioni:
            "Un portafoglio non contiene monete | Chiavi, indirizzi e saldo | La frase di recupero (seed) | Portafogli software, hardware e su carta | Chi custodisce le chiavi: te o un servizio | Come si fa una copia di sicurezza | Phishing e finti portafogli | Cosa succede se perdi le chiavi | Usare una rete di prova senza rischi | Esercizi: creare un portafoglio di prova e firmare un messaggio",
        },
      ],
    },
    {
      titolo: "Dentro Bitcoin",
      descrizione: "Script, rete, consenso, limiti e miglioramenti.",
      moduli: [
        {
          titolo: "Transazioni e script",
          riassunto: "Formato delle transazioni, linguaggio Script, tipi di indirizzi, multifirma e blocchi temporali",
          lezioni:
            "Com'è fatta una transazione dentro | Lo script che blocca una moneta | Pagare a un indirizzo: il caso più comune | Pagare a più firme (multifirma) | Blocchi temporali | I tipi di indirizzi: da quelli vecchi ai nuovi | Segregated Witness: cosa ha cambiato | Taproot in sintesi | Leggere una transazione con gli strumenti | Esercizi: costruire e verificare una transazione di prova",
        },
        {
          titolo: "Rete e consenso",
          riassunto: "Nodi, propagazione, catena più lunga, biforcazioni, attacco del 51% e finalità probabilistica",
          lezioni:
            "I nodi: chi fa funzionare la rete | Come si propaga una transazione | La memoria delle transazioni in attesa (mempool) | La catena più lunga (più lavoro) vince | Biforcazioni temporanee | Quando una transazione è sicura | L'attacco del 51% | Difficoltà e regolazione dei blocchi | Fork duri e fork morbidi | Esercizi: simulare una biforcazione",
        },
        {
          titolo: "Il mining",
          riassunto: "Cos'è davvero il mining, hardware, mining pool, energia, centralizzazione e incentivi",
          lezioni:
            "Cos'è il mining e cosa non è | La gara per il nonce | Dalle CPU agli ASIC | Le mining pool | Quanta energia usa e le discussioni intorno | I costi e la ricompensa: gli incentivi | Centralizzazione: chi controlla la rete | Come si ripartisce il potere tra minatori, nodi e utenti | Cosa succede quando le ricompense finiscono | Esercizi: calcolare la probabilità di trovare un blocco in un caso di esempio",
        },
        {
          titolo: "Limiti e miglioramenti",
          riassunto: "Velocità, costi, rete Lightning, privacy, ordini di grandezza e proposte di cambiamento",
          lezioni:
            "Quante transazioni al secondo | Perché i blocchi non sono più grandi | Canali di pagamento e la rete Lightning | Come funziona un pagamento Lightning | Privacy: cosa si vede sulla catena | Tecniche per migliorare la riservatezza e i loro limiti | Come si cambiano le regole: le proposte | Altre criptovalute nate da Bitcoin | Confronto tra approcci: sicurezza, velocità, apertura | Esercizi: leggere e commentare una proposta di miglioramento",
        },
      ],
    },
    {
      titolo: "Ethereum e contratti intelligenti",
      descrizione: "Programmi che vivono sulla blockchain e come si scrivono, si provano e si usano.",
      moduli: [
        {
          titolo: "Ethereum",
          riassunto: "Conti, saldi, gas, macchina virtuale, stato e transazioni",
          lezioni:
            "Da una moneta a un computer condiviso | Conti con saldo e conti con codice | Il gas: pagare il calcolo | La macchina virtuale di Ethereum | Lo stato della rete | Una transazione su Ethereum | Blocchi e commissioni | Le reti di prova e i rubinetti gratuiti | Esplorare un contratto sul sito di un esploratore di blocchi | Esercizi: inviare una transazione su una rete di prova",
        },
        {
          titolo: "Scrivere contratti con Solidity",
          riassunto: "Variabili, funzioni, visibilità, eventi, errori e un primo contratto completo",
          rinvio: "Le basi di programmazione sono in Programmazione generale (P1-P3).",
          lezioni:
            "Un contratto intelligente è un programma | Solidity: struttura di un contratto | Tipi di dati e variabili di stato | Funzioni e visibilità | Chi chiama il contratto: msg.sender | Mappature e strutture | Eventi: il diario del contratto | Errori e controlli: require e revert | Ricevere e inviare valore | Esercizi: il contratto di un salvadanaio",
        },
        {
          titolo: "Provare e pubblicare un contratto",
          riassunto: "Ambienti di sviluppo, test automatici, rete di prova, verifica del codice e costi di pubblicazione",
          lezioni:
            "L'ambiente di sviluppo: Hardhat o Foundry | Una rete locale di prova | Scrivere test per un contratto | Casi limite da provare | Pubblicare su una rete di prova | Interagire con il contratto dalla console | Costi del gas e come ridurli | Verificare il codice pubblicato | I contratti non si cambiano: come si aggiornano | Progetto: un contratto di raccolta fondi per una classe",
        },
        {
          titolo: "Token e applicazioni",
          riassunto: "Token fungibili e collezionabili, standard, interfacce web e collegamento ai portafogli",
          lezioni:
            "Cos'è un token | Lo standard dei token fungibili (ERC-20) | Creare un token di prova | Lo standard per oggetti unici (ERC-721) | Dove stanno davvero le immagini | Collegare una pagina web al portafoglio | Leggere dati dal contratto con ethers | Inviare una transazione dalla pagina | Gestire errori e conferme | Progetto: una piccola applicazione su una rete di prova",
        },
      ],
    },
    {
      titolo: "Strumenti avanzati e finanza decentralizzata",
      descrizione: "Altri tipi di consenso, reti di secondo livello e come funziona (e dove si rompe) la DeFi.",
      moduli: [
        {
          titolo: "Altri tipi di consenso",
          riassunto: "Prova di partecipazione, validatori, finalità, tolleranza ai guasti bizantini e confronto",
          rinvio: "Il consenso nei sistemi distribuiti in generale è in Database e dati a grande scala (B15).",
          lezioni:
            "Il problema dei generali bizantini | Perché si cercano alternative alla prova di lavoro | La prova di partecipazione | Validatori e penalità | La finalità: quando un blocco non si cambia più | Attacchi tipici alla prova di partecipazione | Altri approcci: autorità e consenso a maggioranza | Confronto tra consensi: sicurezza, velocità, decentralizzazione | Il trilemma: cosa vuol dire e cosa no | Esercizi: confrontare tre blockchain in una tabella",
        },
        {
          titolo: "Reti di secondo livello e ponti",
          riassunto: "Rollup, canali, sidechain, ponti tra blockchain, costi e rischi",
          lezioni:
            "Perché scalare sopra la blockchain | Canali e sidechain | I rollup: raggruppare le transazioni | Rollup ottimistici e a conoscenza zero | La disponibilità dei dati | Ponti tra blockchain | Perché i ponti sono bersagli di attacchi | Costi e tempi di prelievo | L'esperienza di chi usa queste reti | Esercizi: confrontare le commissioni su due reti",
        },
        {
          titolo: "Finanza decentralizzata e stablecoin",
          riassunto: "Scambi automatici, prestiti, garanzie, stablecoin, come funzionano nel codice e dove sono i rischi",
          rinvio: "Aspetti di mercato e regole: Hedge fund (H20). Qui solo il funzionamento tecnico, nessun consiglio d'investimento.",
          lezioni:
            "Cos'è la finanza decentralizzata (DeFi) | Gli scambi automatici (AMM) | La formula del prodotto costante | Slippage e perdita temporanea: cosa sono | I prestiti con garanzia | Le liquidazioni automatiche | Le stablecoin: tipi e come tengono il valore | Quando una stablecoin perde l'ancoraggio | I rischi tecnici: errori di codice, oracoli, governance | Esercizi: calcolare uno scambio in una piscina di liquidità di esempio",
        },
        {
          titolo: "Oracoli, identità e riservatezza",
          riassunto: "Dati dal mondo reale, identità digitale, prove a conoscenza zero, DAO e organizzazioni on-chain",
          lezioni:
            "La blockchain non vede il mondo: il problema dell'oracolo | Oracoli di prezzo e di eventi | Randomicità verificabile | Identità sulla blockchain: nomi e credenziali | Riservatezza: cosa si può nascondere | Prove a conoscenza zero: l'idea con un esempio | Organizzazioni autonome (DAO) | Votazioni on-chain: pro e contro | Governance dei protocolli | Esercizi: valutare come si fida un contratto dei suoi dati",
        },
      ],
    },
    {
      titolo: "Sicurezza, regole e progetto",
      descrizione: "Come si rompono i contratti, come si proteggono gli utenti e che regole valgono.",
      moduli: [
        {
          titolo: "Vulnerabilità degli smart contract",
          riassunto: "Rientranza, errori di calcolo, controllo degli accessi, ordine delle operazioni e perché gli errori restano per sempre",
          rinvio: "Concetti di sicurezza applicativa: Cybersecurity (C5).",
          lezioni:
            "Perché un errore in un contratto costa tanto | Il caso della DAO del 2016 | La rientranza (reentrancy) | Controlli degli accessi dimenticati | Errori nei numeri: overflow e arrotondamenti | Dipendere dal tempo e dall'ordine delle transazioni | Chiamate a contratti esterni | Gli errori nei contratti aggiornabili | Come si correggono questi errori | Esercizi: trovare l'errore in un contratto di prova",
        },
        {
          titolo: "Test, analisi e revisione",
          riassunto: "Test ben fatti, analisi automatica, controlli formali in sintesi, revisioni esterne e lista di controllo",
          lezioni:
            "Dal «funziona» al «è sicuro» | Test di proprietà e test con valori casuali | Strumenti di analisi statica | Simulare un attacco in un ambiente di prova | Controlli formali in sintesi | La revisione esterna (audit): cosa è e cosa non garantisce | Programmi di ricompensa per le vulnerabilità | Piani di emergenza: il blocco di sicurezza | Aggiornamenti e governo del contratto | Esercizi: preparare un contratto alla revisione",
        },
        {
          titolo: "Truffe, furti e come proteggersi",
          riassunto: "Schemi truffaldini, ingegneria sociale, falsi portafogli, buone abitudini e cosa fare dopo un furto",
          rinvio: "Phishing e ingegneria sociale: Cybersecurity (C26).",
          lezioni:
            "Le truffe più comuni nel mondo cripto | Promesse di guadagni facili: i segnali | Finti siti e finti assistenti | Firmare cose senza leggerle: i permessi sui token | Token senza uscita e progetti abbandonati | Furti famosi e cosa hanno insegnato | Come si controlla un progetto prima di fidarsi | Abitudini di sicurezza personali | Cosa fare se hai subìto una truffa | Esercizi: smontare tre annunci truffaldini",
        },
        {
          titolo: "Regole e progetto finale",
          riassunto: "Quadro delle regole europee in sintesi, tutela dei dati, progetto completo e prossimi passi",
          rinvio: "Aspetti normativi e di mercato: Hedge fund (H20).",
          lezioni:
            "Che cosa dice la legge in sintesi: il regolamento europeo MiCA | Antiriciclaggio e identificazione degli utenti | Dati personali e blockchain: il diritto alla cancellazione | Progetti e responsabilità di chi li crea | Progetto finale: idea e requisiti | Progetto finale: il contratto | Progetto finale: i test | Progetto finale: l'interfaccia | Presentare il progetto e la relazione sui rischi | Come continuare: comunità, lavori e studio",
        },
      ],
    },
  ],
};
