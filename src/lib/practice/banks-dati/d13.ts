import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D13 (Analista di dati). Una chiave per lezione: "d13-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Scenari fittizi; i calcoli sono stati ricontrollati a mano.
 */
export const D13_ITEMS: Record<string, BankItem[]> = {
  "d13-scelta-progetto": [
    {
      q: "Quale di queste è una buona idea per un primo progetto di dati?",
      ok: "La raccolta differenziata della mia regione negli ultimi cinque anni",
      no: ["Analizzare tutta l'economia italiana", "Prevedere il futuro di ogni azienda europea", "Studiare tutte le statistiche dell'Istat insieme"],
    },
    {
      q: "Perché conviene cercare i dati prima di fissare definitivamente l'idea del progetto?",
      ok: "Perché senza dati disponibili l'idea non si può realizzare",
      no: ["Perché i dati si possono sempre inventare dopo", "Perché l'idea conta meno dei dati in ogni caso", "Perché cercare i dati dà più prestigio al progetto"],
    },
    {
      q: "Quale confine rende «analizzare le scuole» una domanda più fattibile?",
      ok: "Le scuole di un comune, in un anno, con una sola misura",
      no: ["Tutte le scuole d'Europa, in ogni anno, con ogni misura", "Le scuole, ma senza scegliere il periodo", "Le scuole, aggiungendo molte altre fonti di dati"],
    },
    {
      q: "Quale portale raccoglie i dataset aperti della pubblica amministrazione italiana?",
      ok: "dati.gov.it",
      no: ["Il sito di un social network", "Il sito di una banca", "Un forum di appassionati di informatica"],
    },
    {
      q: "Serve un confronto tra paesi dell'Unione europea sulla disoccupazione. Quale fonte è la più adatta?",
      ok: "Eurostat, che pubblica statistiche confrontabili tra i paesi",
      no: ["Un'infografica trovata sui social senza fonte", "Il sito di un'azienda privata che vende corsi", "Un articolo di opinione senza numeri"],
    },
    {
      q: "Un dataset ha licenza CC BY 4.0. Cosa puoi fare?",
      ok: "Riusarlo, anche modificato, citando la fonte",
      no: ["Riusarlo senza citare nessuno", "Solo guardarlo, mai ripubblicare i risultati", "Rivenderlo dicendo che è tuo"],
    },
    {
      q: "Hai trovato un file senza licenza e senza spiegazione delle colonne. Cosa fai?",
      ok: "Cerco una fonte ufficiale con licenza chiara o chiedo all'ente come riusarlo",
      no: ["Lo uso comunque, perché è online", "Elimino le colonne che non capisco e continuo", "Lo pubblico senza citare la fonte"],
    },
    {
      q: "Perché serve la descrizione delle colonne (i metadati) di un dataset?",
      ok: "Perché senza sapere cosa significa ogni colonna si leggono male i numeri",
      no: ["Perché rende il file più piccolo", "Perché è obbligatoria solo per i file di grandi dimensioni", "Perché serve solo a chi usa Excel"],
    },
    {
      q: "Un dataset sulla salute degli alunni contiene nomi e cognomi. Come lo giudichi per un progetto pubblico?",
      ok: "Non adatto: contiene dati personali, e bisogna evitarlo o usare solo dati aggregati",
      no: ["Ottimo, perché più dettaglio c'è e meglio è", "Adatto, se cancello solo la colonna dei cognomi", "Adatto, perché i dati su minori sono sempre pubblici"],
    },
    {
      q: "Quale informazione NON serve citare quando usi un dataset aperto?",
      ok: "Il numero di righe della tua cartella di lavoro",
      no: ["L'ente che ha prodotto i dati", "La data in cui li hai scaricati", "La licenza con cui sono pubblicati"],
    },
    {
      q: "Un progetto richiede quindici fonti diverse, tre linguaggi e sei mesi di lavoro. Cosa è meglio fare per un primo progetto?",
      ok: "Ridurlo a una domanda, una fonte e due o tre settimane",
      no: ["Cominciare subito e vedere come va", "Aggiungere altre fonti per sembrare più completo", "Rinunciare alla domanda e fare solo grafici"],
    },
    {
      q: "Il progetto della scuola riguarda il quartiere dove vivi e hai dati comunali aperti. Quale vantaggio ha?",
      ok: "È reale e verificabile: puoi confrontare i numeri con ciò che conosci",
      no: ["Non servono controlli, perché i dati comunali sono sempre perfetti", "Non devi citare la fonte, perché il quartiere è tuo", "Puoi usare dati personali dei vicini, perché li conosci"],
    },
  ],
  "d13-domanda-dati": [
    {
      q: "Quale di queste è una domanda misurabile?",
      ok: "La media dei prestiti mensili in estate è più alta di quella degli altri mesi?",
      no: ["La biblioteca è bella d'estate?", "Alla gente piace leggere?", "La biblioteca funziona bene?"],
    },
    {
      q: "Quale ipotesi i dati possono davvero smentire?",
      ok: "A luglio ci sono più prestiti che a gennaio",
      no: ["La biblioteca è importante per il quartiere", "A volte ci sono più prestiti, a volte meno", "I numeri diranno quello che devono dire"],
    },
    {
      q: "Perché si scrive il criterio per decidere prima di guardare i risultati?",
      ok: "Per non scegliere dopo il criterio che dà ragione alla propria idea",
      no: ["Perché i risultati sono sempre sbagliati", "Perché il criterio è obbligatorio per legge", "Perché i dati cambiano se li guardi"],
    },
    {
      q: "Prestiti estivi: giugno 300, luglio 250, agosto 190. Qual è la media mensile estiva, arrotondata all'intero?",
      ok: "247",
      no: ["250", "740", "190"],
    },
    {
      q: "Altri nove mesi hanno in totale 3875 prestiti. La media estiva è circa 247. L'ipotesi «d'estate si presta di più» regge?",
      ok: "No: la media degli altri mesi è circa 431, molto più alta",
      no: ["Sì, perché 247 è un numero alto", "Sì, perché agosto ha comunque dei prestiti", "Non si può dire nulla, servono sempre cento mesi"],
    },
    {
      q: "L'analisi smentisce la tua ipotesi. Cosa fai nel report?",
      ok: "Riporto il risultato com'è, spiegando anche i limiti",
      no: ["Cambio la misura finché mi dà ragione", "Tolgo i mesi che non convengono", "Non pubblico il risultato"],
    },
    {
      q: "Quale voce NON appartiene a un piano di analisi?",
      ok: "Il titolo che userò per i social network",
      no: ["Le colonne di dati che userò", "Il criterio per decidere se l'ipotesi regge", "I rischi che potrebbero falsare il confronto"],
    },
    {
      q: "Perché è utile indicare i rischi nel piano di analisi (ad esempio un mese con la biblioteca chiusa)?",
      ok: "Perché ti fanno controllare se un confronto è equo prima di fidarti del risultato",
      no: ["Perché li si può ignorare dopo", "Perché rendono il piano più lungo e quindi più serio", "Perché servono solo ai progetti con molti dati"],
    },
    {
      q: "Per la domanda «gli studenti stanno meglio?», quale prima mossa è corretta?",
      ok: "Definire cosa si intende per «meglio» e scegliere una misura precisa",
      no: ["Scaricare dati a caso e vedere cosa esce", "Fare subito un grafico a torta", "Scegliere la misura dopo aver visto i risultati"],
    },
    {
      q: "Quale misura è dichiarata in modo completo?",
      ok: "Prestiti registrati al mese, anno 2025",
      no: ["Il successo della biblioteca", "Quanta gente passa di lì", "I numeri dell'anno"],
    },
    {
      q: "Quale errore commette chi guarda i dati e solo dopo scrive l'ipotesi?",
      ok: "Rischia di scrivere l'ipotesi che i dati già confermano, ingannando se stesso",
      no: ["Nessuno: l'ordine delle fasi non conta", "Fa un lavoro più preciso del normale", "Può usare più dati, e questo è sempre meglio"],
    },
    {
      q: "I prestiti non contano chi entra solo a studiare. Come si usa questo limite?",
      ok: "Lo si dichiara e si valuta di misurare anche le presenze prima di decidere",
      no: ["Lo si nasconde, perché indebolisce il risultato", "Si decide comunque senza dirlo a nessuno", "Si cancellano i dati dei prestiti"],
    },
  ],
  "d13-analisi": [
    {
      q: "Qual è l'ordine corretto delle fasi di un'analisi?",
      ok: "Pulizia, esplorazione, analisi, controllo",
      no: ["Analisi, pulizia, controllo, esplorazione", "Controllo, analisi, esplorazione, pulizia", "Esplorazione, controllo, analisi, pulizia"],
    },
    {
      q: "Cosa si fa del file di dati originale?",
      ok: "Lo si conserva intatto e si lavora su una copia",
      no: ["Lo si corregge a mano direttamente", "Lo si cancella dopo la pulizia", "Lo si sovrascrive a ogni passaggio"],
    },
    {
      q: "Un file ha 8 righe: 1 duplicato esatto e 1 riga senza importo, escluse entrambe. Quante righe restano?",
      ok: "6",
      no: ["8", "7", "5"],
    },
    {
      q: "Sei importi: 20, 35, 40, 25, 30, 50. Qual è la loro somma?",
      ok: "200",
      no: ["180", "210", "190"],
    },
    {
      q: "Con una somma di 200 euro su 6 ordini, quale media è corretta (due decimali)?",
      ok: "33,33 euro",
      no: ["40,00 euro", "28,57 euro", "30,00 euro"],
    },
    {
      q: "Un valore mancante viene letto come zero e la media scende. Cosa andava fatto?",
      ok: "Decidere come trattarlo (escludere o recuperare) e annotare la scelta",
      no: ["Lasciare lo zero senza dire nulla", "Inventare un importo plausibile senza scriverlo", "Cancellare tutto il mese"],
    },
    {
      q: "Dopo la pulizia un risultato ti sorprende molto. Cosa fai per primo?",
      ok: "Cerco un errore: duplicati, filtri sbagliati, unità di misura",
      no: ["Lo pubblico subito perché è una scoperta", "Lo nascondo per non fare brutta figura", "Cambio il metodo finché somiglia a quanto mi aspettavo"],
    },
    {
      q: "Quale controllo di buon senso scopre un importo medio di 3300 euro in una piccola libreria?",
      ok: "Confrontare il valore con un ordine di grandezza plausibile",
      no: ["Rifare lo stesso calcolo senza cambiare niente", "Ordinare le colonne in ordine alfabetico", "Colorare il grafico"],
    },
    {
      q: "A cosa serve un notebook come Jupyter o Google Colab in un progetto?",
      ok: "A tenere insieme testo, codice e risultati, così il lavoro si può rifare",
      no: ["A nascondere il codice a chi legge", "A sostituire ogni controllo sui dati", "A modificare in automatico il file originale"],
    },
    {
      q: "Come si dimostra che un notebook è riproducibile?",
      ok: "Lo si rilancia da zero, dalla prima all'ultima cella, e si ottiene lo stesso risultato",
      no: ["Lo si lancia solo dall'ultima cella", "Lo si lascia com'è: se ha funzionato una volta, basta", "Si cancellano i commenti dal codice"],
    },
    {
      q: "Un ordine compare due volte con id, mese e importo identici. Cosa indica?",
      ok: "Un probabile duplicato da eliminare, annotando quanti ne hai tolti",
      no: ["Due ordini diversi da sommare sempre", "Un errore del tuo computer da ignorare", "Un dato importante da evidenziare"],
    },
    {
      q: "Perché è importante contare le righe prima e dopo la pulizia?",
      ok: "Per sapere quante e perché ne hai perse, e verificare che torni con il resto",
      no: ["Per rendere il file più leggero", "Perché è obbligatorio per usare Python", "Perché il numero di righe è il risultato dell'analisi"],
    },
  ],
  "d13-report": [
    {
      q: "Dove va la risposta alla domanda in un report breve?",
      ok: "In cima, nel titolo e nella sintesi",
      no: ["Solo nell'appendice, per ultima", "Solo nell'ultima pagina, per creare suspense", "Nel nome del file, senza nulla nel testo"],
    },
    {
      q: "Quale titolo funziona meglio per un report?",
      ok: "La raccolta differenziata di Valdoro è salita dal 54% al 67% in cinque anni",
      no: ["Analisi dei dati 2025", "Report finale versione 3", "Alcuni grafici sulla raccolta differenziata"],
    },
    {
      q: "Quale grafico mostra bene un andamento nel tempo?",
      ok: "Un grafico a linee",
      no: ["Una torta con dodici fette", "Un istogramma senza asse", "Una tabella senza grafici"],
    },
    {
      q: "In un grafico a barre, l'asse verticale parte da 60 invece che da 0. Qual è il rischio?",
      ok: "Le differenze piccole sembrano enormi e il lettore viene ingannato",
      no: ["Nessuno: l'asse non conta", "Il grafico diventa meno colorato", "I numeri risultano arrotondati"],
    },
    {
      q: "Due quartieri hanno 61% e 63% con asse da 60 a 64. Quanto sembra più lunga la barra del secondo rispetto al primo?",
      ok: "Tre volte, mentre la differenza reale è di 2 punti",
      no: ["Due volte", "Uguale, perché l'asse è tagliato", "Quattro volte"],
    },
    {
      q: "La quota sale dal 54% al 67%. Come si descrive correttamente?",
      ok: "Sale di 13 punti percentuali",
      no: ["Sale del 13%", "Sale del 67%", "Sale di 54 punti"],
    },
    {
      q: "Che cosa deve fare una buona raccomandazione?",
      ok: "Dire cosa fare in concreto e perché, ad esempio dove estendere un servizio",
      no: ["Dire genericamente di «migliorare la situazione»", "Elencare tutti i grafici fatti", "Rimandare ogni decisione a dopo altri studi"],
    },
    {
      q: "Perché si scrivono i limiti dell'analisi?",
      ok: "Perché dicono cosa i dati non provano e rendono il report credibile",
      no: ["Per giustificarsi in caso di errori", "Per far sembrare il lavoro più lungo", "Perché il regolamento lo impone sempre"],
    },
    {
      q: "La quota è salita mentre il comune estendeva il servizio. Cosa NON puoi affermare?",
      ok: "Che l'estensione del servizio sia la sola causa dell'aumento",
      no: ["Che la quota è aumentata nel periodo", "Che i dati vengono dal comune", "Che c'è stata un'estensione del servizio"],
    },
    {
      q: "Un report ha sette grafici, ma solo due rispondono alla domanda. Cosa è meglio fare?",
      ok: "Tenere i due che rispondono e spostare gli altri in appendice",
      no: ["Tenere tutti: più grafici sono più convincenti", "Cancellare ogni grafico e usare solo parole", "Mettere gli altri cinque in cima"],
    },
    {
      q: "Che cosa deve esserci sotto o vicino a un grafico?",
      ok: "Titolo con il messaggio, unità degli assi e fonte dei dati",
      no: ["Solo i colori usati", "Il nome del programma che l'ha creato", "Niente: il grafico parla da solo"],
    },
    {
      q: "A cosa serve l'appendice di un report?",
      ok: "A dare metodo, tabelle e codice a chi vuole controllare il lavoro",
      no: ["A nascondere le parti che non convincono", "A sostituire la sintesi iniziale", "A ripetere il titolo in piccolo"],
    },
  ],
  "d13-portfolio": [
    {
      q: "Quale ha più valore in un portfolio?",
      ok: "Due o tre progetti completi con domanda, dati con fonte, report e README",
      no: ["Venti esercizi presi dai tutorial", "Progetti a metà senza spiegazione", "Notebook senza commenti e senza dati"],
    },
    {
      q: "Cosa fa il README di un repository?",
      ok: "Spiega il progetto: domanda, dati, metodo, risultati, limiti e come rifarlo",
      no: ["Contiene la password del progetto", "Elenca solo i nomi dei file", "Sostituisce il codice dell'analisi"],
    },
    {
      q: "Chi non conosce il tuo progetto legge il README per un minuto. Cosa deve poter dire?",
      ok: "A quale domanda risponde il progetto e qual è la conclusione",
      no: ["Quanti file ci sono", "Che linguaggio ho usato per ogni riga", "Quanto tempo ho impiegato"],
    },
    {
      q: "Un file del progetto contiene nomi e email di clienti reali. Cosa fai prima di pubblicare?",
      ok: "Non lo pubblico: tolgo i dati personali o uso dati di esempio",
      no: ["Lo pubblico, tanto è un file solo", "Lo pubblico ma cambio il nome del file", "Lo pubblico in una cartella nascosta"],
    },
    {
      q: "Per sbaglio hai pubblicato una chiave di accesso a un servizio. Cosa fai?",
      ok: "La considero compromessa e la sostituisco con una nuova",
      no: ["Cancello il file e basta, la chiave è al sicuro", "Aspetto per vedere se qualcuno la usa", "La lascio dove sta, perché serve per il progetto"],
    },
    {
      q: "Perché cancellare un file da GitHub non basta a farlo sparire?",
      ok: "Perché resta nella storia delle versioni precedenti",
      no: ["Perché GitHub non permette di cancellare nulla mai", "Perché i file cancellati tornano dopo un giorno", "Perché serve il permesso del proprietario del sito"],
    },
    {
      q: "Hai usato un tutorial e uno strumento di IA per una parte del progetto. Cosa conviene fare?",
      ok: "Dichiararlo nel README spiegando cosa hai fatto tu",
      no: ["Nasconderlo, per sembrare più bravo", "Eliminare quella parte dal progetto", "Dire che è tutto tuo senza eccezioni"],
    },
    {
      q: "Per ogni progetto del portfolio, cosa ti serve saper fare a voce?",
      ok: "Spiegare in due minuti domanda, dati, risultato e limiti",
      no: ["Recitare il codice a memoria", "Elencare le librerie in ordine alfabetico", "Descrivere solo quanto ti è piaciuto"],
    },
    {
      q: "Quale struttura di cartelle aiuta chi apre il progetto?",
      ok: "Cartelle separate per dati grezzi, notebook e report",
      no: ["Tutto nella stessa cartella, con nomi simili", "Una sola cartella chiamata «prova»", "Solo file compressi senza indicazioni"],
    },
    {
      q: "Hai meno di 18 anni e vuoi mettere sul profilo pubblico nome, scuola e foto. Cosa è prudente?",
      ok: "Parlarne prima con un genitore o con chi ti segue e pubblicare solo ciò che va bene",
      no: ["Pubblicare tutto: più dettagli, più credibilità", "Pubblicare solo dati di altri, mai i tuoi", "Pubblicare l'indirizzo di casa per essere trovati"],
    },
    {
      q: "Quale errore è comune nei portfolio dei principianti?",
      ok: "Molti repository senza descrizione, copiati dai tutorial",
      no: ["Un progetto completo con un README chiaro", "Una domanda precisa con fonti citate", "Una conclusione con i limiti indicati"],
    },
    {
      q: "Che cosa serve GitHub Pages in un portfolio?",
      ok: "A presentare i progetti migliori in una pagina web semplice e gratuita, ma non è obbligatoria",
      no: ["A proteggere con password i dati personali", "A calcolare in automatico i risultati", "A sostituire ogni README"],
    },
  ],
  "d13-ruoli-colloqui": [
    {
      q: "Chi costruisce e mantiene le pipeline che portano dati puliti dove servono?",
      ok: "Il data engineer",
      no: ["Il BI analyst, con i suoi cruscotti", "Il data scientist, con i suoi modelli", "L'analista, solo con i fogli di calcolo"],
    },
    {
      q: "Quale ruolo costruisce soprattutto cruscotti e report stabili per chi decide?",
      ok: "Il BI analyst",
      no: ["Il data engineer", "Il data scientist", "Il responsabile delle pipeline"],
    },
    {
      q: "Chi usa soprattutto statistica e modelli predittivi per stimare ciò che accadrà?",
      ok: "Il data scientist",
      no: ["Il BI analyst", "L'analytics engineer", "Il responsabile del cruscotto"],
    },
    {
      q: "Quale ruolo trasforma dati grezzi in tabelle pulite e documentate per gli analisti, di solito con SQL?",
      ok: "L'analytics engineer",
      no: ["Il data scientist", "Il progettista grafico", "Il responsabile commerciale"],
    },
    {
      q: "«Data scientist» è sempre il primo ruolo da puntare?",
      ok: "No: sono mestieri diversi, e conviene scegliere quello che piace fare ogni giorno",
      no: ["Sì, perché è il ruolo più alto della scala", "Sì, perché non serve esperienza", "No, ma solo perché tutti gli altri ruoli sono più pagati"],
    },
    {
      q: "Quale competenza è richiesta quasi per tutti questi ruoli?",
      ok: "SQL",
      no: ["Solo l'uso di un singolo strumento di moda", "La grafica pubblicitaria", "La contabilità avanzata"],
    },
    {
      q: "Hai 16 anni e vuoi lavorare con i dati. Quale consiglio generale è sensato?",
      ok: "Continuare a studiare, fare pratica con SQL e Python e costruire un portfolio",
      no: ["Pagare subito un corso costoso che garantisce un lavoro", "Lasciare la scuola per cercare lavoro", "Aspettare i 25 anni prima di cominciare"],
    },
    {
      q: "Hai 38 anni e lavori da dieci in logistica. Come sfrutti la tua esperienza?",
      ok: "Unisco la conoscenza del settore alle competenze sui dati, con un progetto nel mio ambito",
      no: ["La nascondo, perché conta solo la tecnica", "Ricomincio da zero in un altro settore", "Cambio tutto senza fare progetti"],
    },
    {
      q: "Una scuola promette «lavoro sicuro e stipendio garantito» dopo il corso. Come reagisci?",
      ok: "Diffido: nessun corso può promettere lavoro o stipendio, chiedo dati verificabili",
      no: ["Pago subito, perché è una garanzia", "Mi fido se il sito è curato", "Chiedo solo il prezzo e basta"],
    },
    {
      q: "Una certificazione riconosciuta in un settore garantisce un posto di lavoro?",
      ok: "No: dà struttura allo studio e a volte un filtro, ma non sostituisce la pratica",
      no: ["Sì, sempre, per tutti", "Sì, ma solo se costa molto", "No, e non serve mai a nulla"],
    },
    {
      q: "Al colloquio ti fanno una domanda su un argomento che non conosci. Cosa fai?",
      ok: "Dico che non lo so e spiego come cercherei la risposta",
      no: ["Invento una risposta sicura", "Cambio discorso", "Dico che non sono adatto al ruolo"],
    },
    {
      q: "Quale preparazione è più utile prima di un colloquio da analista?",
      ok: "Spiegare bene due progetti, ripassare SQL e prepararsi a ragionare ad alta voce su un caso",
      no: ["Imparare a memoria definizioni di libro", "Portare solo il curriculum stampato", "Evitare di vedere il progetto per non agitarsi"],
    },
  ],
};
