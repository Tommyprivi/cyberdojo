import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H9 (Hedge fund): regolamentazione e compliance.
 * Una chiave per lezione: "h09-<argomento>". Ogni banca ha almeno 12 domande a scelta,
 * una sola risposta giusta, opzioni distinte. Fatti normativi in sintesi (ottobre 2026):
 * le fonti ufficiali fanno fede. Nessuna consulenza legale.
 */
export const H09_ITEMS: Record<string, BankItem[]> = {
  "h09-aifmd": [
    {
      q: "Che cosa regola, in sintesi, la direttiva europea AIFMD?",
      ok: "I gestori di fondi di investimento alternativi, come molti hedge fund: autorizzazione, regole e controlli",
      no: ["Solo le banche che prestano soldi alle famiglie", "Il prezzo delle azioni in borsa", "Le tasse sui guadagni dei piccoli risparmiatori"],
    },
    {
      q: "A chi si rivolge la direttiva: al fondo come «scatola» o a chi lo gestisce?",
      ok: "Soprattutto al gestore (AIFM), che deve essere autorizzato e rispettare regole di organizzazione",
      no: ["Solo agli investitori, che devono chiedere un permesso", "Solo alla borsa dove sono quotati i titoli", "A nessuno: è solo una raccomandazione"],
    },
    {
      q: "Perché l'AIFMD chiede che le attività del fondo siano affidate a un depositario separato dal gestore?",
      ok: "Perché chi decide gli investimenti non deve avere da solo in mano i beni dei clienti: è un controllo in più",
      no: ["Per far pagare meno commissioni al gestore", "Per garantire che il fondo non perda mai", "Perché il depositario sceglie le azioni al posto del gestore"],
    },
    {
      q: "Un gestore dice: «Sono autorizzato secondo la direttiva europea, quindi i miei investitori non perderanno mai». Che cosa è corretto rispondere?",
      ok: "L'autorizzazione riguarda regole e organizzazione, non garantisce i risultati: si può perdere denaro",
      no: ["È vero, l'autorizzazione assicura il capitale", "È vero, ma solo per gli investimenti in obbligazioni", "È falso perché i fondi autorizzati non possono investire in azioni"],
    },
    {
      q: "Che cosa devono fare i gestori sulla leva finanziaria (il debito usato per investire di più)?",
      ok: "Misurarla, tenerla sotto controllo e comunicarla secondo le regole",
      no: ["Nasconderla agli investitori per non spaventarli", "Evitarla del tutto: la direttiva la vieta sempre", "Comunicarla solo se il fondo perde"],
    },
    {
      q: "Quale gestione del rischio chiede la direttiva a un gestore di fondi alternativi?",
      ok: "Un sistema di gestione del rischio e della liquidità, con funzioni e procedure scritte",
      no: ["Nessuna: il rischio è un problema solo degli investitori", "Solo un'assicurazione contro ogni perdita", "Solo un controllo una volta ogni dieci anni"],
    },
    {
      q: "Che cos'è il «passaporto europeo» previsto per i gestori autorizzati, in sintesi?",
      ok: "La possibilità, seguendo le procedure, di offrire il fondo a investitori professionali in altri Paesi dell'Unione",
      no: ["Un documento che garantisce il rendimento in tutta Europa", "Un permesso per vendere il fondo a chiunque senza regole", "Una carta d'identità per gli investitori"],
    },
    {
      q: "Un piccolo gestore gestisce meno patrimonio delle soglie previste dalla direttiva. Che cosa significa, in sintesi?",
      ok: "Può avere regole più leggere (registrazione e segnalazioni), ma non è un via libera a tutto",
      no: ["Non ha nessuna regola da rispettare", "Deve chiudere subito il fondo", "Può usare la leva senza limiti"],
    },
    {
      q: "Perché una versione aggiornata della direttiva (AIFMD II) è stata approvata nel 2024?",
      ok: "Per rafforzare regole su liquidità, segnalazioni e fondi che erogano prestiti, tra altri aspetti",
      no: ["Per vietare gli hedge fund in Europa", "Per garantire un rendimento minimo agli investitori", "Per abolire la figura del depositario"],
    },
    {
      q: "Quale di queste regole serve a proteggere gli investitori da una valutazione «ritoccata» delle attività del fondo?",
      ok: "Procedure di valutazione chiare e, dove richiesto, indipendenti dal gestore",
      no: ["La valutazione decisa liberamente dal solo gestore", "La valutazione fatta una volta e mai più ripetuta", "La valutazione basata su voci raccolte tra gli amici"],
    },
    {
      q: "Tu vuoi sapere se un gestore ha una autorizzazione. Che cosa è corretto fare?",
      ok: "Controllare gli elenchi ufficiali dell'autorità di vigilanza, non fidarsi solo del volantino",
      no: ["Fidarsi del logo europeo sul sito del gestore", "Chiedere conferma a un conoscente che ha già investito", "Pensare che un nome inglese basti"],
    },
    {
      q: "Che cosa devono contenere le informazioni che un gestore dà agli investitori, secondo lo spirito della direttiva?",
      ok: "Strategia, rischi, costi e regole di rimborso, spiegati in modo chiaro e non fuorviante",
      no: ["Solo i risultati migliori dell'ultimo anno", "Solo il nome del gestore e il suo indirizzo", "Solo promesse di rendimento"],
    },
    {
      q: "In Italia chi gestisce fondi alternativi di norma lo fa tramite una SGR. Che cosa è una SGR, in sintesi?",
      ok: "Una società di gestione del risparmio, autorizzata e vigilata dalle autorità",
      no: ["Una banca che custodisce i conti correnti", "Una società di assicurazione sulla vita", "Un fondo riservato ai dipendenti pubblici"],
    },
  ],

  "h09-mifid": [
    {
      q: "Che cosa è la direttiva MiFID II, in sintesi?",
      ok: "Un insieme di regole europee per chi presta servizi di investimento, a protezione degli investitori e dei mercati",
      no: ["Una tassa europea sulle operazioni in borsa", "Un fondo comune garantito dall'Unione", "Un indice che misura il rischio dei mercati"],
    },
    {
      q: "Una banca ti chiede di compilare un questionario su conoscenze, esperienza e obiettivi. A che cosa serve?",
      ok: "A capire se un prodotto o un servizio è adatto a te, per tutelarti",
      no: ["A decidere quanto devi pagare di tasse", "A farti comprare il prodotto più costoso", "È solo burocrazia, le risposte non contano"],
    },
    {
      q: "Quali sono le tre categorie di clienti della MiFID II?",
      ok: "Clienti al dettaglio, clienti professionali e controparti qualificate",
      no: ["Piccoli, medi e grandi risparmiatori", "Italiani, europei ed extraeuropei", "Giovani, adulti e anziani"],
    },
    {
      q: "Perché un cliente al dettaglio ha più protezioni di un cliente professionale?",
      ok: "Perché si presume abbia meno conoscenza ed esperienza dei mercati",
      no: ["Perché investe somme più grandi", "Perché paga commissioni più alte", "Perché è sempre più anziano"],
    },
    {
      q: "Che cosa vuol dire «miglior esecuzione» (best execution)?",
      ok: "L'intermediario deve cercare il miglior risultato possibile per il cliente, considerando prezzo, costi e rapidità",
      no: ["Garantire sempre il prezzo più basso del giorno", "Eseguire gli ordini solo sul mercato più vicino", "Eseguire per primi gli ordini dei clienti più grandi"],
    },
    {
      q: "Un consulente ti consiglia un prodotto molto rischioso, ma il questionario dice che non hai esperienza e non puoi perdere nemmeno un euro. Che cosa è corretto?",
      ok: "Il prodotto non è adatto: deve essere spiegato il problema e, di norma, non consigliato",
      no: ["Va bene lo stesso, basta che tu firmi", "Va bene se il prodotto ha un nome rassicurante", "Va bene se la commissione è bassa"],
    },
    {
      q: "Che cosa vuol dire «trasparenza sui costi» secondo la MiFID II?",
      ok: "L'intermediario deve mostrare in anticipo costi e oneri del servizio e del prodotto",
      no: ["Il cliente scopre i costi solo a fine anno", "Solo le commissioni di acquisto vanno mostrate", "I costi si comunicano solo a chi li chiede per iscritto"],
    },
    {
      q: "Quale esempio descrive un «incentivo» (inducement) problematico per un consulente?",
      ok: "Ricevere un compenso da chi produce un prodotto che poi consiglia, senza che il cliente lo sappia",
      no: ["Ricevere lo stipendio fisso dalla banca", "Ricevere un grazie dal cliente", "Seguire un corso di formazione obbligatorio"],
    },
    {
      q: "Che cosa vuol dire «governo dei prodotti» (product governance)?",
      ok: "Chi crea e chi vende un prodotto finanziario deve definire a quale pubblico è destinato e controllare che arrivi a quel pubblico",
      no: ["Il governo sceglie quali prodotti si possono vendere", "Ogni prodotto deve avere il marchio dello Stato", "Il prodotto è venduto sempre a tutti"],
    },
    {
      q: "Un hedge fund (un FIA) è gestito da una SGR. Vale in tutto la MiFID II per il gestore?",
      ok: "In generale la gestione del fondo è regolata dalla AIFMD; la MiFID II si applica ai servizi di investimento e al modo in cui il fondo viene venduto o a certi servizi aggiuntivi",
      no: ["No, la MiFID II non c'entra mai con i fondi", "Sì, la MiFID II sostituisce completamente la AIFMD", "Dipende dal colore del logo"],
    },
    {
      q: "Una pubblicità dice: «Investi con noi, rendimento garantito del 20%». Che cosa è corretto pensare?",
      ok: "È un campanello d'allarme: le regole chiedono informazioni corrette, chiare e non fuorvianti, e nessun rendimento è garantito",
      no: ["Va bene, se c'è scritto in piccolo il nome della società", "Va bene, se la società è straniera", "Va bene, se la promessa è in inglese"],
    },
    {
      q: "Che cosa è corretto fare prima di firmare un contratto con un intermediario?",
      ok: "Leggere i documenti, chiedere dei costi e dei rischi e controllare che l'intermediario sia autorizzato",
      no: ["Firmare subito per non perdere l'occasione", "Fidarsi del tono gentile del venditore", "Compilare il questionario in modo da risultare più esperti"],
    },
  ],

  "h09-kyc": [
    {
      q: "Che cosa vuol dire «KYC» (know your customer, «conosci il cliente»)?",
      ok: "Identificare il cliente e capire chi è, che cosa fa e da dove vengono i suoi soldi",
      no: ["Chiedere al cliente quanto vuole guadagnare", "Scegliere i clienti più ricchi", "Spiegare al cliente come funziona il fondo"],
    },
    {
      q: "Qual è lo scopo dell'antiriciclaggio?",
      ok: "Impedire che denaro di origine illecita sembri pulito passando per banche, fondi e altri intermediari",
      no: ["Far pagare più tasse a tutti", "Controllare quanto spende ciascun cittadino", "Garantire che i fondi non perdano mai"],
    },
    {
      q: "Chi è il «titolare effettivo» di una società?",
      ok: "La persona fisica che in ultima analisi possiede o controlla la società",
      no: ["Il notaio che ha firmato l'atto", "Il dipendente che apre il conto", "La banca che custodisce il denaro"],
    },
    {
      q: "Un investitore vuole entrare nel fondo tramite una società con un'altra società sopra di essa. Che cosa è corretto fare?",
      ok: "Risalire la catena fino alle persone che controllano davvero, e documentarlo",
      no: ["Fermarsi alla prima società: basta il nome", "Chiedere solo il numero di telefono", "Accettare perché i soldi arrivano da una banca"],
    },
    {
      q: "Un cliente versa una somma molto alta e non sa spiegare da dove venga. Che cosa è corretto?",
      ok: "Approfondire i controlli e, se i dubbi restano, valutare la segnalazione di operazione sospetta",
      no: ["Accettare e non dire niente: il cliente è sempre un cliente", "Avvisare il cliente che sta per essere segnalato", "Restituire il denaro senza registrare nulla"],
    },
    {
      q: "A chi, in Italia, si inviano le segnalazioni di operazioni sospette di riciclaggio?",
      ok: "All'Unità di informazione finanziaria per l'Italia (UIF), presso la Banca d'Italia",
      no: ["Alla polizia municipale della città del cliente", "Al cliente stesso, per avere chiarimenti", "Al quotidiano economico più letto"],
    },
    {
      q: "Dopo aver fatto una segnalazione sospetta, che cosa deve fare chi l'ha inviata verso il cliente?",
      ok: "Non avvisarlo: la segnalazione è riservata",
      no: ["Telefonargli subito per chiedere spiegazioni", "Scrivergli un'email con la copia della segnalazione", "Dirlo ai suoi colleghi della concorrenza"],
    },
    {
      q: "Che cos'è l'«adeguata verifica rafforzata»?",
      ok: "Controlli più approfonditi per i clienti o le situazioni a rischio più alto",
      no: ["Un controllo uguale per tutti, ripetuto due volte", "Un premio per i clienti più fedeli", "Una procedura che si fa solo a fine anno"],
    },
    {
      q: "Che cos'è una «persona politicamente esposta»?",
      ok: "Chi ricopre o ha ricoperto cariche pubbliche importanti: richiede maggiore attenzione, non è automaticamente colpevole",
      no: ["Chi è iscritto a un partito politico", "Chi ha fatto una donazione elettorale", "Chi è stato condannato per un reato"],
    },
    {
      q: "Dopo l'apertura di un rapporto, i controlli antiriciclaggio finiscono?",
      ok: "No, si fa un monitoraggio continuo delle operazioni e si aggiornano i dati",
      no: ["Sì, dopo l'identificazione non serve altro", "Sì, tranne se il cliente lo chiede", "Solo quando il cliente cambia città"],
    },
    {
      q: "Perché un hedge fund deve fare KYC anche sugli investitori che versano tramite una banca?",
      ok: "Perché la responsabilità di conoscere il cliente resta anche del fondo e del suo gestore, che non possono scaricarla del tutto",
      no: ["Perché la banca non può farlo", "Perché è un'idea del gestore, non un obbligo", "Perché serve solo a mandare più pubblicità"],
    },
    {
      q: "Un cliente dice: «Non ho tempo per i documenti, ti pago una commissione più alta se salti i controlli». Che cosa è corretto?",
      ok: "Rifiutare e fare i controlli: saltarli è una violazione, e la richiesta stessa è un segnale di rischio",
      no: ["Accettare, se la commissione è davvero alta", "Accettare, ma fare i controlli dopo un mese", "Accettare, se il cliente è un amico del capo"],
    },
  ],

  "h09-conflitti": [
    {
      q: "Che cos'è un conflitto di interessi in un fondo?",
      ok: "Una situazione in cui l'interesse del gestore (o di qualcuno nel fondo) può entrare in contrasto con quello degli investitori",
      no: ["Una lite tra due investitori", "Un errore di calcolo nel prezzo delle quote", "Un'inchiesta delle autorità"],
    },
    {
      q: "Quale esempio è un tipico conflitto di interessi?",
      ok: "Il gestore assegna le operazioni migliori al fondo da cui guadagna di più in commissioni e quelle peggiori a un altro",
      no: ["Il gestore pubblica il bilancio nei tempi previsti", "Il gestore usa un foglio di calcolo", "Il gestore partecipa a un convegno"],
    },
    {
      q: "Il gestore gestisce due fondi e un'occasione di investimento è limitata. Che cosa è corretto?",
      ok: "Applicare regole di ripartizione scritte e uguali, e documentare come si è deciso",
      no: ["Darla al fondo che gli sta più simpatico", "Darla al fondo che ha la commissione di performance più alta", "Decidere dopo, in base a come va il prezzo"],
    },
    {
      q: "Un dipendente del fondo vuole comprare per sé le stesse azioni che il fondo sta per comprare. Che cosa è corretto?",
      ok: "Seguire la politica sulle operazioni personali: autorizzazione preventiva e divieti nei periodi sensibili",
      no: ["Comprare prima del fondo: tanto si guadagna in due", "Comprare dopo il fondo, senza dirlo a nessuno", "Comprare a nome di un parente"],
    },
    {
      q: "Quale è un modo corretto di gestire un conflitto di interessi che non si può evitare?",
      ok: "Informare in modo chiaro chi è coinvolto e applicare regole che tutelino gli investitori",
      no: ["Non parlarne perché «tanto nessuno se ne accorge»", "Spostare il problema in un altro ufficio senza dirlo", "Far firmare agli investitori una rinuncia in piccolo"],
    },
    {
      q: "A che cosa serve una «muraglia cinese» (barriera informativa) in una società finanziaria?",
      ok: "A tenere separate le informazioni riservate tra uffici diversi, per evitare abusi e conflitti",
      no: ["A tenere i clienti lontani dalla sede", "A nascondere i bilanci alle autorità", "A impedire ai gestori di parlare tra loro del tempo"],
    },
    {
      q: "Chi decide il valore di un'attività poco scambiata nel fondo? Perché è un'area di conflitto?",
      ok: "Se il gestore guadagna in base al valore, potrebbe essere tentato di gonfiarlo: servono procedure e controlli indipendenti",
      no: ["Lo decide il mercato, non c'è conflitto", "Lo decide l'investitore più grande", "Lo decide un sorteggio"],
    },
    {
      q: "Una commissione di performance può creare un conflitto di interessi?",
      ok: "Sì: può spingere a prendere rischi eccessivi, perché il gestore partecipa ai guadagni ma non allo stesso modo alle perdite",
      no: ["No, allinea sempre in modo perfetto gestore e investitore", "No, perché è fissata per legge", "Solo se il fondo è molto piccolo"],
    },
    {
      q: "Un broker offre al gestore regali costosi e viaggi. Che cosa è corretto?",
      ok: "Applicare la politica su regali e inviti: limiti, registro e, se serve, rifiuto",
      no: ["Accettare tutto se il prezzo delle operazioni resta lo stesso", "Accettare e non dirlo a nessuno", "Accettare solo se il regalo è un orologio"],
    },
    {
      q: "Che cosa deve fare il responsabile della compliance davanti a un conflitto che nessuno aveva previsto?",
      ok: "Valutarlo, tenerne traccia e proporre misure; se serve, informare gli organi di controllo",
      no: ["Aspettare che vada via da solo", "Nasconderlo alle autorità per non creare problemi", "Lasciare che lo risolva il collega più anziano"],
    },
    {
      q: "Quale è un esempio di conflitto legato al compenso di un venditore delle quote del fondo?",
      ok: "Il venditore è pagato di più se propone il prodotto più caro, anche se non è il più adatto",
      no: ["Il venditore riceve uno stipendio fisso uguale per tutti", "Il venditore indossa la divisa della banca", "Il venditore conosce bene il prodotto"],
    },
    {
      q: "Perché è utile avere un registro scritto dei conflitti e di come sono stati gestiti?",
      ok: "Perché permette controlli interni ed esterni e mostra come sono state prese le decisioni",
      no: ["Perché obbliga i clienti a leggerlo ogni mese", "Perché sostituisce il bilancio", "Perché serve a calcolare le tasse"],
    },
  ],

  "h09-controlli": [
    {
      q: "Che cosa sono le «tre linee di difesa» in una società finanziaria?",
      ok: "Chi opera e controlla il proprio lavoro; le funzioni di controllo (rischio e compliance); la revisione interna indipendente",
      no: ["Tre firewall informatici in sequenza", "Tre assicurazioni contro le perdite", "Tre livelli di commissioni"],
    },
    {
      q: "Che cosa fa la funzione di compliance?",
      ok: "Verifica che la società rispetti le leggi e le regole interne e aiuta a prevenire le violazioni",
      no: ["Sceglie le azioni da comprare", "Calcola il rendimento dei fondi", "Cerca nuovi clienti"],
    },
    {
      q: "Che cosa fa la funzione di risk management?",
      ok: "Misura e monitora i rischi del fondo e segnala quando si superano i limiti",
      no: ["Decide quali titoli comprare", "Vende il fondo ai clienti", "Prepara le dichiarazioni dei redditi"],
    },
    {
      q: "Perché la revisione interna (internal audit) deve essere indipendente?",
      ok: "Perché deve poter controllare anche le altre funzioni senza essere influenzata da chi controlla",
      no: ["Perché lavora solo di notte", "Perché non ha bisogno di regole", "Perché è pagata dai clienti"],
    },
    {
      q: "Il responsabile del rischio segnala che il fondo ha superato un limite di leva. Che cosa è corretto?",
      ok: "Agire secondo la procedura: ridurre l'esposizione o ottenere un'approvazione documentata, e registrare tutto",
      no: ["Ignorare il segnale: il gestore sa cosa fa", "Cambiare il limite senza avvisare nessuno", "Cancellare il messaggio dal registro"],
    },
    {
      q: "Che cosa vuol dire segnalare a una autorità (per esempio i dati periodici sul fondo)?",
      ok: "Inviare informazioni su portafoglio, leva, rischi e liquidità secondo i modelli e le scadenze previste",
      no: ["Mandare una cartolina di auguri alla Consob", "Comunicare solo se il fondo guadagna molto", "Mandare le informazioni solo quando le autorità lo scoprono"],
    },
    {
      q: "Un dipendente nota una pratica scorretta ma ha paura di parlarne. Che cosa dovrebbe esistere in una società seria?",
      ok: "Un canale di segnalazione protetto (whistleblowing), con tutela di chi segnala in buona fede",
      no: ["Un divieto di parlare tra colleghi", "Un premio per chi sta zitto", "Un registro pubblico dei nomi dei dipendenti"],
    },
    {
      q: "Che cosa è una «vendita allo scoperto» e perché ci sono regole di segnalazione?",
      ok: "Vendere titoli che non si possiedono, sperando di ricomprarli più bassi; in Europa le posizioni nette oltre soglie vanno comunicate alle autorità",
      no: ["Vendere titoli molto cari; le regole servono a fissare il prezzo", "Vendere un fondo senza commissioni; le regole servono a tassarlo", "Vendere solo a investitori professionali; le regole servono a vietarlo"],
    },
    {
      q: "Un gestore scopre un errore nel calcolo del valore delle quote del fondo, che ha danneggiato alcuni investitori. Che cosa è corretto?",
      ok: "Correggere, informare chi è coinvolto e le autorità se previsto, e documentare le cause",
      no: ["Aspettare che qualcuno se ne accorga", "Correggere il numero senza dirlo a nessuno", "Dare la colpa al sistema informatico e non fare altro"],
    },
    {
      q: "Perché si conservano le registrazioni (email, ordini, decisioni) per anni?",
      ok: "Per poter ricostruire cosa è successo e dimostrare alle autorità che le regole sono state rispettate",
      no: ["Per riempire gli archivi", "Per poter cancellare le prove quando serve", "Perché ai clienti piace leggerle"],
    },
    {
      q: "Una regola interna dice «niente operazioni sul titolo X finché abbiamo notizie riservate su X». A che cosa serve?",
      ok: "A evitare abusi di informazioni privilegiate e dare prova di controllo",
      no: ["A far salire il prezzo di X", "A ridurre le commissioni del fondo", "A nascondere le posizioni ai clienti"],
    },
    {
      q: "Che cos'è un controllo «a campione» o un test periodico di compliance?",
      ok: "Verifiche regolari su operazioni e procedure scelte a rotazione, per scoprire problemi prima che crescano",
      no: ["Una lotteria tra i dipendenti", "Un'ispezione fatta solo dopo uno scandalo", "Un controllo che si fa una sola volta, all'apertura del fondo"],
    },
  ],

  "h09-autorita": [
    {
      q: "Qual è, in sintesi, il compito principale della Consob?",
      ok: "Tutelare gli investitori e vigilare su trasparenza e correttezza dei comportamenti nei mercati",
      no: ["Stampare le banconote", "Fissare i tassi di interesse", "Garantire il rendimento dei fondi"],
    },
    {
      q: "Qual è, in sintesi, il compito della Banca d'Italia nella vigilanza sugli intermediari?",
      ok: "Vigilare sulla stabilità e sulla sana e prudente gestione degli intermediari (banche, SGR e altri)",
      no: ["Controllare i prezzi delle azioni ogni giorno", "Scegliere gli investimenti dei fondi", "Garantire il capitale agli investitori"],
    },
    {
      q: "Una persona riceve un'offerta di investimento da una società sconosciuta. Dove può controllare se è autorizzata?",
      ok: "Negli elenchi ufficiali di Consob e Banca d'Italia, e nei registri delle autorità europee quando serve",
      no: ["Solo sul sito della società stessa", "Chiedendo a un influencer", "Nei commenti sotto un video"],
    },
    {
      q: "Quale compito ha l'ESMA a livello europeo, in sintesi?",
      ok: "È l'autorità europea dei mercati: favorisce regole e prassi comuni tra i Paesi dell'Unione",
      no: ["Gestisce direttamente i fondi italiani", "Garantisce i depositi dei risparmiatori", "Stabilisce il prezzo delle azioni"],
    },
    {
      q: "Un'autorità trova che un gestore non ha rispettato le regole. Che cosa può fare, in generale?",
      ok: "Chiedere correzioni, applicare sanzioni e, nei casi più gravi, limitare o revocare l'autorizzazione",
      no: ["Solo mandare una lettera di scuse", "Pagare le perdite agli investitori al posto del gestore", "Nulla: le autorità non hanno poteri"],
    },
    {
      q: "Che cosa vuol dire che una società è «vigilata» da un'autorità?",
      ok: "Deve rispettare regole e può essere controllata, ma questo non garantisce che non perda soldi",
      no: ["Che lo Stato rimborsa ogni perdita", "Che i rendimenti sono assicurati", "Che le commissioni sono fisse per legge"],
    },
    {
      q: "Una SGR vuole lanciare un hedge fund in Italia. Che cosa è corretto aspettarsi?",
      ok: "Che serva l'autorizzazione e che le autorità competenti verifichino organizzazione, controlli e requisiti",
      no: ["Basta registrare un sito internet", "Basta un annuncio sui social", "Basta avere un conto in banca"],
    },
    {
      q: "Una persona vuole segnalare un sospetto abuso di mercato (per esempio un insider). Che cosa è corretto fare?",
      ok: "Rivolgersi agli strumenti di segnalazione ufficiali dell'autorità competente e non fare giustizia da sé",
      no: ["Pubblicare il nome del sospettato sui social", "Comprare titoli per approfittarne", "Ignorare il fatto: non è affare suo"],
    },
    {
      q: "Chi emette le regole europee e chi le applica in Italia, in sintesi?",
      ok: "L'Unione europea le definisce; in Italia le autorità nazionali, come Consob e Banca d'Italia, le applicano con i propri poteri",
      no: ["La Consob scrive tutte le direttive europee", "Gli investitori scelgono quali regole seguire", "Le regole europee si applicano solo agli Stati, non alle società"],
    },
    {
      q: "Chi riceve le segnalazioni di operazioni sospette per riciclaggio, in Italia?",
      ok: "La UIF, presso la Banca d'Italia",
      no: ["La Consob, in forma anonima", "La borsa, tramite un modulo", "Il Ministero dell'Istruzione"],
    },
    {
      q: "Un investitore perde soldi in un fondo di un gestore regolarmente autorizzato, senza irregolarità. L'autorità deve rimborsarlo?",
      ok: "No: la vigilanza controlla il rispetto delle regole, non copre le perdite di mercato",
      no: ["Sì, l'autorità rimborsa sempre", "Sì, entro 30 giorni", "Sì, ma solo se il fondo era italiano"],
    },
    {
      q: "Dove si trovano le informazioni più affidabili sulle regole del settore, in sintesi?",
      ok: "Sui siti ufficiali di Consob, Banca d'Italia, ESMA e sui testi di legge, controllando la data",
      no: ["Nei forum con i consigli più popolari", "Nei volantini del gestore", "Nei messaggi inoltrati su chat"],
    },
  ],
};
