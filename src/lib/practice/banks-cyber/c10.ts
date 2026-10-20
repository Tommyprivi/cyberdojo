import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo C10 (Cybersecurity). Una chiave per lezione: "c10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta (15 per il progetto), una sola risposta giusta, opzioni distinte.
 */
export const C10_ITEMS: Record<string, BankItem[]> = {
  "c10-privacy": [
    {
      q: "Un negozio online salva il tuo indirizzo email e il tuo indirizzo di casa. Che cosa sono secondo il GDPR?",
      ok: "Dati personali, perché permettono di identificare una persona",
      no: ["Dati anonimi, perché non c'è il numero di carta", "Dati pubblici, perché li hai scritti tu", "Dati sensibili, perché riguardano la casa"],
    },
    {
      q: "Una palestra raccoglie nome, telefono e data di nascita dei clienti. Quale principio dice di raccogliere solo ciò che serve davvero?",
      ok: "Minimizzazione dei dati",
      no: ["Cifratura dei dati", "Portabilità dei dati", "Pseudonimizzazione dei dati"],
    },
    {
      q: "Un sito di ricette ti chiede il codice fiscale per mandarti la newsletter. Che cosa non va?",
      ok: "È un dato che non serve allo scopo: va contro la minimizzazione",
      no: ["Niente: più dati ha, meglio può proteggerti", "Il codice fiscale non è un dato personale", "Il problema è solo se il sito è straniero"],
    },
    {
      q: "Che cos'è la «base giuridica» del trattamento, in parole semplici?",
      ok: "Il motivo valido per cui un'organizzazione può usare i tuoi dati, come il contratto, la legge o il tuo consenso",
      no: ["Il documento che l'utente firma sempre all'iscrizione", "La legge che vieta di raccogliere dati", "L'elenco dei server dove i dati sono salvati"],
    },
    {
      q: "Compri online e il negozio usa il tuo indirizzo per spedirti il pacco. Quale base giuridica si applica di solito?",
      ok: "L'esecuzione del contratto di acquisto: senza indirizzo non può consegnare",
      no: ["Il consenso, perché hai cliccato su «acquista»", "L'interesse pubblico", "Nessuna: per spedire non servono basi"],
    },
    {
      q: "Scrivi a un'azienda e chiedi di sapere quali tuoi dati ha e come li usa. Quale diritto stai esercitando?",
      ok: "Il diritto di accesso",
      no: ["Il diritto all'oblio", "Il diritto di opposizione", "Il diritto di portabilità"],
    },
    {
      q: "Non usi più un servizio e chiedi di cancellare il tuo account e i tuoi dati. Quale diritto stai usando?",
      ok: "Il diritto alla cancellazione, detto anche diritto all'oblio",
      no: ["Il diritto di accesso", "Il diritto di rettifica", "Il diritto di limitare i cookie"],
    },
    {
      q: "Un'azienda ha scritto male il tuo cognome nel suo archivio. Che cosa puoi chiedere?",
      ok: "La rettifica, cioè la correzione dei dati sbagliati",
      no: ["La portabilità, cioè la copia dei dati", "La cancellazione obbligatoria di tutto l'account", "Un risarcimento automatico"],
    },
    {
      q: "Se un'azienda non risponde alle tue richieste sui dati, a chi in Italia puoi rivolgerti?",
      ok: "Al Garante per la protezione dei dati personali",
      no: ["Alla polizia postale, sempre e solo lei", "All'Agenzia delle Entrate", "A nessuno: il GDPR non prevede ricorsi"],
    },
    {
      q: "Un'azienda scopre che un portatile con i dati dei clienti è stato rubato e i dati non sono cifrati. Che cosa deve fare in generale?",
      ok: "Valutare il rischio e, se riguarda le persone, notificare il Garante entro 72 ore e informare i clienti coinvolti nei casi gravi",
      no: ["Aspettare di vedere se qualcuno usa i dati", "Comprare un nuovo portatile e non dire nulla", "Avvisare solo i giornali per trasparenza"],
    },
    {
      q: "Dopo un data breach con le tue password in chiaro, qual è la prima cosa sensata da fare come utente?",
      ok: "Cambiare la password su quel servizio e su ogni altro dove la usavi uguale, attivando la verifica in due passaggi",
      no: ["Aspettare che il sito risolva da solo", "Cambiare solo l'ultimo carattere della password", "Cancellare le email del servizio"],
    },
    {
      q: "Un sito conserva i dati dei clienti di dieci anni fa che non comprano più. Quale principio viola con più probabilità?",
      ok: "La limitazione della conservazione: i dati vanno tenuti solo per il tempo necessario",
      no: ["Il diritto di accesso", "La portabilità", "La cifratura in transito"],
    },
    {
      q: "Quale di questi dati NON è un dato personale?",
      ok: "Il numero medio di visite al sito in un mese, senza alcun riferimento alle persone",
      no: ["L'indirizzo email di un cliente", "L'indirizzo IP di un visitatore, se collegabile a lui", "La foto del volto di un dipendente"],
    },
    {
      q: "Perché ridurre i dati raccolti è anche una difesa di sicurezza, oltre che una regola legale?",
      ok: "Perché i dati che non hai non possono essere rubati e non danno guai in un data breach",
      no: ["Perché i dati occupano troppo spazio sul disco", "Perché i dati vecchi diventano illegali dopo un anno", "Perché meno dati rendono i server più veloci e quindi inattaccabili"],
    },
  ],
  "c10-tracciamento": [
    {
      q: "Visiti un sito di scarpe e per giorni vedi le stesse scarpe in annunci su altri siti. Qual è la spiegazione più probabile?",
      ok: "Un tracker di pubblicità ha riconosciuto il tuo browser e ha collegato le tue visite",
      no: ["Il tuo computer è stato hackerato", "Il sito di scarpe ha letto le tue email", "Il provider ha comprato le scarpe per te"],
    },
    {
      q: "Che cos'è un cookie di terze parti?",
      ok: "Un piccolo file messo nel browser da un sito diverso da quello che stai visitando, spesso per pubblicità",
      no: ["Un cookie che il browser copia nel cloud", "Un cookie cifrato dal sito che stai visitando", "Un virus nascosto in un cookie normale"],
    },
    {
      q: "Svuoti i cookie del browser ma un sito ti riconosce ancora. Quale tecnica può spiegarlo?",
      ok: "Il fingerprinting, cioè l'impronta ricavata da caratteristiche del tuo browser e del tuo dispositivo",
      no: ["La cifratura end-to-end", "Il salvataggio automatico della password", "Il firewall del router"],
    },
    {
      q: "Quali informazioni possono entrare nell'impronta del browser?",
      ok: "Dimensione dello schermo, font installati, lingua, fuso orario e versione del browser",
      no: ["Solo la tua password", "Solo il contenuto delle tue email", "Soltanto l'indirizzo del tuo router"],
    },
    {
      q: "Perché un browser molto personalizzato, con molte estensioni e font strani, può essere più riconoscibile?",
      ok: "Perché la combinazione di caratteristiche rare lo rende quasi unico tra milioni",
      no: ["Perché le estensioni inviano le password ai siti", "Perché i siti bloccano i browser con le estensioni", "Perché i font strani contengono cookie"],
    },
    {
      q: "Che cos'è un tracker?",
      ok: "Un pezzetto di codice o un servizio incluso in siti e app che registra cosa fai e lo manda a un'azienda",
      no: ["Un programma che cerca virus sul computer", "Un cookie che serve solo per ricordare la lingua", "Un tipo di VPN gratuita"],
    },
    {
      q: "Un'app torcia chiede accesso a contatti, microfono e posizione. Che cosa è sensato fare?",
      ok: "Negare i permessi che non servono alla sua funzione, o scegliere un'app diversa",
      no: ["Accettare tutto: i permessi servono solo a farla funzionare meglio", "Accettare e poi disinstallare dopo un mese", "Negare solo la posizione, il resto non ha rischi"],
    },
    {
      q: "Quale impostazione riduce di più il tracciamento tra siti diversi senza rompere quasi niente?",
      ok: "Bloccare i cookie di terze parti e usare un blocco dei tracker",
      no: ["Usare sempre la modalità anonima senza altro", "Chiudere il browser ogni sera", "Aumentare lo zoom della pagina"],
    },
    {
      q: "La «modalità anonima» (o privata) del browser cosa fa davvero?",
      ok: "Non salva cronologia e cookie sul tuo dispositivo, ma i siti e il provider possono comunque vedere la tua attività",
      no: ["Nasconde il tuo indirizzo IP ai siti", "Ti rende invisibile al provider internet", "Impedisce a ogni tracker di funzionare"],
    },
    {
      q: "Il banner dei cookie ti offre «Accetta tutto» e «Gestisci preferenze». Quale scelta protegge meglio la tua privacy?",
      ok: "Gestire le preferenze e rifiutare i cookie non essenziali",
      no: ["Accettare tutto: rifiutare non cambia nulla", "Chiudere il banner con la X, che equivale ad accettare tutto sempre", "Rifiutare e poi disattivare il Wi-Fi"],
    },
    {
      q: "Quali sono cookie davvero necessari e quindi legittimi anche senza consenso?",
      ok: "Quelli che tengono il login o il carrello della spesa durante la visita",
      no: ["Quelli che registrano i siti che visiti dopo", "Quelli che costruiscono un profilo pubblicitario", "Quelli che misurano le tue abitudini per i partner"],
    },
    {
      q: "Un'app gratuita di meteo chiede la posizione precisa sempre attiva, anche in background. Qual è il rischio principale?",
      ok: "Può ricostruire dove vivi, dove lavori e i tuoi spostamenti, e venderli a terzi",
      no: ["Consuma solo un po' più di batteria", "Può rompere il telefono", "Può leggere le password salvate nel browser"],
    },
    {
      q: "Come puoi ridurre il tracciamento a livello di dispositivo mobile?",
      ok: "Rivedere i permessi delle app, azzerare l'ID pubblicitario e disinstallare le app che non usi",
      no: ["Installare più app di sicurezza gratuite", "Lasciare tutti i permessi su «chiedi sempre»", "Usare sempre il carattere maiuscolo nelle password"],
    },
    {
      q: "Una pagina di un giornale carica decine di script di aziende esterne. Perché ti riguarda?",
      ok: "Ognuna di quelle aziende può vedere che hai visitato la pagina e raccogliere dati su di te",
      no: ["Rallenta solo il sito, senza conseguenze per te", "Rende la pagina più sicura perché controllata da più persone", "Serve solo a mostrare le immagini più nitide"],
    },
  ],
  "c10-vpn": [
    {
      q: "Usi una VPN per navigare. Che cosa vede il sito che visiti riguardo alla tua connessione?",
      ok: "L'indirizzo IP del server della VPN, non il tuo",
      no: ["Il tuo indirizzo IP di casa, perché la VPN non lo cambia", "Nome e cognome intestati alla VPN", "Nulla: il sito non può sapere da dove arrivi"],
    },
    {
      q: "Con una VPN attiva, chi può vedere i siti che visiti (non il contenuto cifrato)?",
      ok: "Il fornitore della VPN, perché il traffico passa da lui",
      no: ["Nessuno al mondo, la VPN è totalmente anonima", "Solo il tuo provider di casa", "Solo il sito di destinazione"],
    },
    {
      q: "Un annuncio dice: «Con la nostra VPN diventi completamente anonimo». Qual è il problema?",
      ok: "È una promessa esagerata: cookie, account e fingerprinting continuano a identificarti",
      no: ["Nessuno: le VPN rendono davvero anonimi", "Il problema è solo che costa troppo", "Le VPN funzionano solo sul telefono"],
    },
    {
      q: "Sei in un bar con il Wi-Fi gratuito e devi usare un sito bancario. Quale ruolo ha la VPN?",
      ok: "Cifra il traffico fino al server della VPN, quindi chi è sul Wi-Fi non lo legge; il sito bancario usa comunque HTTPS",
      no: ["Rende inutile HTTPS", "Impedisce alla banca di vedere chi sei", "Protegge il telefono da qualsiasi virus"],
    },
    {
      q: "Accedi con il tuo account Google mentre usi una VPN. Che cosa continua a sapere Google?",
      ok: "Che sei tu, perché sei entrato con il tuo account",
      no: ["Niente: la VPN nasconde anche l'account", "Solo il paese da cui ti colleghi, senza sapere chi sei", "Soltanto il nome del tuo provider"],
    },
    {
      q: "Quando ha senso una VPN aziendale?",
      ok: "Quando un dipendente da casa deve raggiungere in modo cifrato le risorse interne dell'azienda",
      no: ["Quando vuole scaricare più velocemente", "Quando vuole evitare gli antivirus", "Mai: le aziende non usano VPN"],
    },
    {
      q: "Quale criterio è più sensato per scegliere un fornitore di VPN?",
      ok: "Trasparenza su chi lo gestisce, politica sui log verificata da audit indipendenti e modello di business chiaro",
      no: ["Il prezzo più basso o gratis", "Il numero di paesi dove ha i server", "Il testimonial più famoso nella pubblicità"],
    },
    {
      q: "Perché una VPN gratuita può essere un rischio per la privacy?",
      ok: "Se non paghi, i soldi possono arrivare dalla vendita dei tuoi dati di navigazione",
      no: ["Perché le VPN gratuite sono sempre più lente di dieci volte", "Perché sono vietate dalla legge", "Perché non cifrano mai nulla"],
    },
    {
      q: "Che cosa NON risolve una VPN?",
      ok: "Un file infetto scaricato e aperto, o una password data a un sito di phishing",
      no: ["Un Wi-Fi pubblico che intercetta il traffico", "Un sito che vede il tuo IP reale", "Un provider curioso della tua navigazione"],
    },
    {
      q: "Sei nella tua rete di casa e visiti un sito con HTTPS dal tuo account. Una VPN aggiunge una grande protezione?",
      ok: "Poca: nasconde le visite al provider ma le sposta al fornitore della VPN, e il sito ti riconosce dall'account",
      no: ["Sì, rende impossibile qualsiasi tracciamento", "Sì, protegge anche dal phishing", "No, e anzi peggiora sempre la sicurezza"],
    },
    {
      q: "Una VPN dichiara «zero log». Che cosa vuol dire e perché va presa con cautela?",
      ok: "Dice di non conservare dati sulla tua attività, ma è una dichiarazione da verificare con audit indipendenti",
      no: ["Significa che la VPN è tecnicamente impossibile da spiare", "Significa che nessun server memorizza nulla, nemmeno temporaneamente", "Significa che è garantita dalla legge in ogni paese"],
    },
    {
      q: "Perché una VPN può far sembrare che ti colleghi da un altro paese?",
      ok: "Perché i siti vedono l'indirizzo IP del server della VPN, che si trova in quel paese",
      no: ["Perché cambia il fuso orario del tuo computer", "Perché cancella il tuo indirizzo IP dal provider", "Perché modifica il tuo codice fiscale"],
    },
    {
      q: "Un collega dice: «Con la VPN posso fare quello che voglio, tanto non mi trovano». Quale risposta è corretta?",
      ok: "Falso: il fornitore conosce il tuo IP e, con un ordine dell'autorità, può essere obbligato a collaborare; la legge vale comunque",
      no: ["Vero: la VPN cancella ogni traccia", "Vero, ma solo se la VPN è a pagamento", "Falso solo se usi il Wi-Fi di casa"],
    },
    {
      q: "Qual è la differenza tra «VPN che nasconde l'IP» e «VPN per accedere a una rete aziendale»?",
      ok: "La prima sposta la fiducia sul fornitore della VPN; la seconda ti collega in modo cifrato alla rete della tua azienda",
      no: ["Sono due nomi per la stessa cosa e funzionano allo stesso modo", "La prima è illegale, la seconda no", "La prima cifra, la seconda no"],
    },
  ],
  "c10-tor": [
    {
      q: "Come funziona a grandi linee Tor?",
      ok: "Il traffico passa attraverso più nodi, con strati di cifratura, e nessun nodo conosce insieme chi sei e dove vai",
      no: ["Un solo server cifra tutto e lo manda al sito", "Il traffico viene diviso in pezzi inviati a siti diversi", "Il traffico viaggia in un cavo riservato"],
    },
    {
      q: "Perché si dice che Tor funziona «a cipolla»?",
      ok: "Perché il messaggio è avvolto in più strati di cifratura, e ogni nodo ne toglie uno solo",
      no: ["Perché ci sono tre strati di password", "Perché ogni nodo piange una lacrima di dati", "Perché i siti sono messi uno dentro l'altro"],
    },
    {
      q: "Nel circuito Tor, che cosa sa il primo nodo (il guardiano)?",
      ok: "Il tuo indirizzo IP, ma non quale sito stai visitando",
      no: ["Il sito di destinazione, ma non il tuo IP", "Sia il tuo IP sia il sito di destinazione", "Né il tuo IP né il sito"],
    },
    {
      q: "Che cosa vede l'ultimo nodo (il nodo di uscita) verso un sito senza HTTPS?",
      ok: "Può vedere il contenuto in chiaro, ma non sa chi sei",
      no: ["Sa chi sei, ma non vede cosa invii", "Vede il tuo indirizzo IP di casa", "Non vede nulla in nessun caso"],
    },
    {
      q: "Accedi a Tor Browser con il tuo account personale di un social. Che cosa succede al tuo anonimato verso quel social?",
      ok: "Si perde: il social sa chi sei dall'account, anche se non vede il tuo IP",
      no: ["Resta totale: Tor nasconde anche l'account", "Si rafforza, perché il traffico è cifrato", "Non cambia nulla perché il social non esiste su Tor"],
    },
    {
      q: "Quale uso di Tor è legittimo e frequente?",
      ok: "Giornalisti, attivisti e cittadini di paesi con censura che vogliono informarsi o comunicare senza essere sorvegliati",
      no: ["Solo comprare cose illegali", "Solo chi vuole attaccare siti", "Nessuno: Tor serve solo ai criminali"],
    },
    {
      q: "Perché l'anonimato è così difficile anche con Tor?",
      ok: "Perché bastano piccoli errori, come accedere con un account, scaricare e aprire un file o un'abitudine riconoscibile, per identificarti",
      no: ["Perché Tor è un programma ormai rotto", "Perché i nodi cambiano ogni secondo", "Perché la legge vieta di nascondere l'IP"],
    },
    {
      q: "Quale comportamento può far perdere l'anonimato su Tor?",
      ok: "Aprire documenti scaricati fuori da Tor Browser, che si collegano direttamente a Internet",
      no: ["Usare più schede aperte nel Tor Browser", "Aggiornare Tor Browser", "Navigare su siti con HTTPS"],
    },
    {
      q: "Tor è lento rispetto a una connessione normale. Perché?",
      ok: "Perché il traffico fa un percorso più lungo attraverso tre nodi e viene cifrato più volte",
      no: ["Perché i nodi sono sempre sovraccarichi di virus", "Perché usa cavi diversi", "Perché il Tor Browser limita di proposito la banda"],
    },
    {
      q: "Un tuo amico dice: «Tor è illegale». Che cosa rispondi?",
      ok: "No: usare Tor è legale in Italia; è illegale ciò che si fa con Tor se è un reato, come per qualsiasi altro strumento",
      no: ["Ha ragione: è vietato usarlo", "È legale solo se hai un permesso scritto", "È legale solo per i giornalisti"],
    },
    {
      q: "Che cosa si intende per «sito .onion»?",
      ok: "Un servizio raggiungibile solo dentro la rete Tor, che nasconde anche la posizione del server",
      no: ["Un sito che vende solo cipolle", "Un sito con un certificato HTTPS scaduto", "Un sito gestito dal governo"],
    },
    {
      q: "Chi controlla una quantità enorme di nodi Tor potrebbe riuscire a collegare chi sei con dove vai. Che cosa dimostra?",
      ok: "Che Tor riduce il rischio ma non offre una garanzia assoluta: contano il numero di nodi e chi li gestisce",
      no: ["Che Tor è inutile e non va mai usato", "Che basta usare due browser", "Che Tor funziona solo con una VPN sopra"],
    },
    {
      q: "Quale confronto tra VPN e Tor è corretto?",
      ok: "Con una VPN devi fidarti di un solo fornitore; con Tor la fiducia è distribuita tra più nodi indipendenti",
      no: ["Con Tor devi fidarti di un solo fornitore", "VPN e Tor sono identiche, cambia solo il nome", "Tor cifra, la VPN no"],
    },
    {
      q: "Sei un'azienda e vedi connessioni da nodi di uscita Tor verso il tuo sito. Che cosa significa?",
      ok: "Visitatori che nascondono il proprio IP: può essere normale o sospetto, va valutato in base al comportamento",
      no: ["È sempre un attacco in corso", "Sono sempre dipendenti infedeli", "È un errore del firewall da ignorare"],
    },
  ],
  "c10-metadati": [
    {
      q: "Che cosa sono i metadati di una foto?",
      ok: "Informazioni nascoste nel file, come data, modello della fotocamera e a volte la posizione GPS",
      no: ["Le parti dell'immagine ritoccate con filtri", "I commenti sotto la foto sui social", "Il peso del file in megabyte"],
    },
    {
      q: "Pubblichi la foto del tuo gatto scattata in casa, con la posizione attivata. Che cosa può rivelare chi scarica il file originale?",
      ok: "Le coordinate GPS di dove vivi, se i metadati non sono stati rimossi",
      no: ["Solo il nome del gatto", "Solo il colore del pelo", "Nulla: le foto non contengono posizione"],
    },
    {
      q: "Un'azienda manda un PDF ai clienti. Quale informazione può restare nei metadati del documento?",
      ok: "Il nome dell'autore, il programma usato e le date di modifica",
      no: ["Le password dei clienti", "I contenuti cancellati del disco", "L'elenco dei dipendenti della rete"],
    },
    {
      q: "Molti social rimuovono la posizione dalle foto quando le carichi. Basta questo per essere sicuri?",
      ok: "No: lo sfondo, i monumenti, le insegne o il cielo possono ancora indicare dove sei",
      no: ["Sì, la posizione è l'unica informazione sensibile", "Sì, perché i social non salvano mai la foto originale", "No, ma solo se la foto è a colori"],
    },
    {
      q: "Un utente usa lo stesso nome e la stessa foto profilo su un forum anonimo e sul suo profilo personale. Che rischio corre?",
      ok: "Di collegare le due identità e perdere la separazione tra vita pubblica e privata",
      no: ["Nessun rischio, i nomi sono pubblici comunque", "Il forum lo bannerà", "Il suo provider rallenterà la connessione"],
    },
    {
      q: "Che cosa significa «separare le identità» online?",
      ok: "Usare email, nomi utente e dati diversi per ambiti diversi, come lavoro, social e acquisti",
      no: ["Avere due telefoni dello stesso modello", "Usare due volte la stessa password ma in ordine inverso", "Cancellare ogni account dopo un giorno"],
    },
    {
      q: "Quale abitudine sui social espone di più a rischi di furto di identità o di ingegneria sociale?",
      ok: "Pubblicare data di nascita, nome del cane, scuola e indirizzo, che spesso servono per le domande di recupero",
      no: ["Mettere un solo «mi piace» al giorno", "Seguire pochi account", "Usare un tema scuro"],
    },
    {
      q: "Perché fare i backup regolari è parte dell'igiene digitale?",
      ok: "Perché se un guasto o un ransomware cifra i file, si possono ripristinare",
      no: ["Perché il backup impedisce a qualsiasi virus di entrare", "Perché velocizza il computer", "Perché è obbligatorio per legge in ogni caso"],
    },
    {
      q: "Quale backup è più sicuro in caso di ransomware?",
      ok: "Una copia tenuta offline o in un luogo non sempre collegato al computer",
      no: ["Una copia nella stessa cartella dei file originali", "Una copia su un disco sempre collegato e scrivibile", "Nessuna copia: il ransomware si può pagare"],
    },
    {
      q: "Perché è importante installare gli aggiornamenti del sistema e delle app?",
      ok: "Perché correggono falle di sicurezza già note che altrimenti restano sfruttabili",
      no: ["Perché cambiano solo l'aspetto delle icone", "Perché eliminano i virus già presenti", "Perché rendono il dispositivo anonimo"],
    },
    {
      q: "Qual è il vantaggio principale di un gestore di password?",
      ok: "Permette di avere password lunghe, uniche e diverse per ogni servizio, ricordandone una sola",
      no: ["Rende la stessa password sicura su più siti", "Evita di dover mai usare la verifica in due passaggi", "Invia le password ai siti in modo anonimo"],
    },
    {
      q: "Un gestore di password è un unico punto di rischio? Quale risposta è più corretta?",
      ok: "Va protetto con una password principale forte e la verifica in due passaggi; resta comunque più sicuro che riusare le password",
      no: ["Sì, quindi è meglio tenere tutto a memoria con la stessa password", "No, è invulnerabile per definizione", "Sì, quindi è meglio scrivere le password su un post-it vicino al monitor"],
    },
    {
      q: "Prima di inviare un documento di lavoro a un esterno, che cosa è prudente fare?",
      ok: "Controllare e ripulire i metadati, oppure esportarlo in un formato che non li porti",
      no: ["Rinominare il file con una data", "Aumentare la dimensione del file", "Inviarlo sempre due volte"],
    },
    {
      q: "Condividi una foto con lo scontrino dell'ordine e il tuo nome sul pacco. Qual è il problema?",
      ok: "Dati personali visibili nell'immagine: nome, indirizzo e acquisti possono essere raccolti da chiunque",
      no: ["Nessuno: sono solo cose comuni", "Il problema sono solo i colori della foto", "Il problema è solo se la foto è in bianco e nero"],
    },
  ],
  "c10-progetto": [
    {
      q: "Una piccola azienda vuole fare il suo piano di sicurezza. Da dove conviene partire?",
      ok: "Da un inventario di cosa possiede e di quali dati tratta, per capire cosa proteggere",
      no: ["Dall'acquisto del firewall più costoso", "Dalla scelta dell'antivirus", "Dal chiedere ai dipendenti di cambiare password ogni giorno"],
    },
    {
      q: "Nell'analisi del rischio, che cosa si mette in relazione?",
      ok: "La probabilità che qualcosa accada e l'impatto che avrebbe sull'azienda",
      no: ["Il costo della licenza e il nome del fornitore", "Il numero di dipendenti e il numero di computer", "La velocità della rete e la quantità di dischi"],
    },
    {
      q: "Un ristorante tiene prenotazioni con nomi e telefoni su un foglio condiviso senza password. Quale pilastro della triade CIA è più a rischio?",
      ok: "La riservatezza, perché chiunque con il link può leggere i dati",
      no: ["L'integrità, perché i dati sono troppo pochi", "La disponibilità, perché il foglio è online", "Nessuno: i dati dei clienti non contano"],
    },
    {
      q: "Un'agenzia ha una password unica condivisa tra tutti i dipendenti per il gestionale. Quale controllo di accesso la migliora di più?",
      ok: "Account personali con il minimo dei permessi necessari e verifica in due passaggi",
      no: ["Cambiare la password condivisa ogni anno", "Scrivere la password sul muro dell'ufficio", "Mettere la password in un file sul desktop"],
    },
    {
      q: "Quale principio dice di dare a ciascuno solo gli accessi che servono al suo lavoro?",
      ok: "Il privilegio minimo",
      no: ["La segmentazione di rete", "La ridondanza dei server", "L'hash delle password"],
    },
    {
      q: "Una password viene memorizzata dal gestionale. Quale modo è corretto?",
      ok: "Come hash con salt, mai in chiaro",
      no: ["In chiaro, per poterla ricordare all'utente", "Cifrata con una chiave scritta accanto nello stesso file", "Con un semplice codice di sostituzione delle lettere"],
    },
    {
      q: "Un'azienda fa backup ogni notte sullo stesso server dei dati. Quale rischio rimane?",
      ok: "Se il server si guasta o viene cifrato da un ransomware, si perdono sia i dati sia i backup",
      no: ["Nessuno: più copie nello stesso posto sono sempre più sicure", "I backup rallentano il server", "Il rischio è solo di spazio sul disco"],
    },
    {
      q: "Quale regola dei backup è la più nota e valida in generale?",
      ok: "Almeno tre copie, su due supporti diversi, di cui una fuori sede o offline, e provare ogni tanto il ripristino",
      no: ["Una sola copia, ma molto cifrata", "Una copia al mese sul computer di lavoro", "Due copie nella stessa stanza"],
    },
    {
      q: "Un'applicazione web dell'azienda mostra un errore SQL completo all'utente dopo un apice inserito in un campo. Che cosa suggerisce?",
      ok: "Una possibile SQL injection e una gestione degli errori da correggere; servono query parametrizzate",
      no: ["Che il sito è molto sicuro perché ha messaggi dettagliati", "Che il database è cifrato", "Che l'utente ha un virus"],
    },
    {
      q: "Nei log del server compaiono centinaia di tentativi di accesso falliti dallo stesso indirizzo in un minuto. Quale controllo li ferma in automatico?",
      ok: "Un blocco dopo pochi tentativi falliti, come fail2ban, insieme alla verifica in due passaggi",
      no: ["Aumentare lo spazio dei log", "Spegnere il monitoraggio per non vedere gli allarmi", "Cambiare il colore del pannello di login"],
    },
    {
      q: "Un firewall separa la rete degli uffici da quella dei server. Come si chiama questo principio?",
      ok: "Segmentazione di rete",
      no: ["Cifratura end-to-end", "Hashing", "Tunneling"],
    },
    {
      q: "Un dipendente riceve un'email che sembra del direttore e chiede un bonifico urgente. Quale controllo è più efficace?",
      ok: "Una procedura per cui i pagamenti si confermano con una seconda persona o un secondo canale, come una telefonata",
      no: ["Rispondere subito per non far arrabbiare il direttore", "Un filtro contro le parole in maiuscolo", "Cambiare il logo dell'azienda"],
    },
    {
      q: "Durante un incidente si sospetta un ransomware su un computer. Qual è una prima azione sensata?",
      ok: "Isolare il computer dalla rete senza spegnerlo di colpo, avvisare chi gestisce la sicurezza e conservare le prove",
      no: ["Pagare subito il riscatto", "Formattare subito il disco per sicurezza", "Continuare a lavorare e vedere cosa succede"],
    },
    {
      q: "Quale ordine seguono in generale le fasi della risposta a un incidente?",
      ok: "Preparazione, rilevazione, contenimento, eradicazione, ripristino, lezioni apprese",
      no: ["Ripristino, contenimento, preparazione, rilevamento", "Eliminazione, rilevamento, ripristino, preparazione", "Contenimento, preparazione, lezioni apprese, rilevamento"],
    },
    {
      q: "L'azienda ha subito un data breach con dati di clienti. Oltre a risolvere il problema tecnico, che cosa deve valutare dal punto di vista della privacy?",
      ok: "Se avvisare il Garante entro 72 ore e se informare le persone coinvolte, in base al rischio per loro",
      no: ["Nulla: la privacy riguarda solo i siti web", "Se cancellare i log dell'accaduto", "Se pubblicare i dati rubati per trasparenza"],
    },
    {
      q: "Qual è l'ultimo ma importante passo dopo la chiusura di un incidente?",
      ok: "Analizzare cosa è successo e aggiornare i controlli, in modo che non si ripeta",
      no: ["Dimenticare in fretta l'accaduto", "Dare la colpa al singolo dipendente e basta", "Cambiare solo la password del direttore"],
    },
    {
      q: "Prima di fare un test di sicurezza su un sistema dell'azienda, che cosa serve?",
      ok: "Un permesso scritto e un ambiente o un ambito definito: si prova solo ciò che è proprio o autorizzato",
      no: ["Basta avere buone intenzioni", "Basta che sia un test e non un attacco", "Un permesso a voce di un collega"],
    },
  ],
};
