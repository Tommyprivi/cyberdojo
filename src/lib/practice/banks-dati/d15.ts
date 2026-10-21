import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D15 (Analista di dati). Una chiave per lezione: "d15-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 *
 * Dati di riferimento (fittizi) usati nei calcoli:
 * - stella: vendite V1..V6 (importo 12, 8, 30, 6, 24, 20; totale 100), Milano 64, Torino 36, Caffè 92, Accessori 8.
 * - misure: 4 righe (importo 100, 50, 80, 70; costo 60, 20, 48, 28): totale 300, costo 156, margine 144 = 48%.
 */
export const D15_ITEMS: Record<string, BankItem[]> = {
  "d15-stella": [
    {
      q: "In un modello a stella, che cosa contiene la tabella dei fatti?",
      ok: "Gli eventi misurabili, come le vendite con quantità e importo",
      no: ["L'elenco dei prodotti con nome e categoria", "Il calendario con i nomi dei mesi", "Le definizioni delle metriche scritte a parole"],
    },
    {
      q: "Che cosa descrive la granularità di una tabella dei fatti?",
      ok: "Che cosa rappresenta una singola riga della tabella",
      no: ["Quante righe può contenere al massimo la tabella", "Quanti colori si usano nei grafici del report", "Quante tabelle delle dimensioni sono collegate"],
    },
    {
      q: "Nella tabella dei fatti con le vendite V1 (12), V2 (8), V3 (30), V4 (6), V5 (24), V6 (20), qual è il totale degli importi?",
      ok: "100",
      no: ["92", "64", "110"],
    },
    {
      q: "Le vendite del negozio di Milano sono V1 (12), V2 (8), V5 (24) e V6 (20). Quanto vale il totale di Milano?",
      ok: "64",
      no: ["36", "56", "44"],
    },
    {
      q: "Torino ha le vendite V3 (30) e V4 (6). Quanto vale il totale degli importi di Torino?",
      ok: "36",
      no: ["30", "64", "100"],
    },
    {
      q: "I prodotti 1 e 3 sono nella categoria Caffè, il prodotto 2 in Accessori. Con V1 (prodotto 1, 12), V2 (prodotto 2, 8), V3 (prodotto 3, 30), V4 (prodotto 1, 6), V5 (prodotto 1, 24), V6 (prodotto 3, 20), quanto vale la categoria Caffè?",
      ok: "92",
      no: ["100", "8", "72"],
    },
    {
      q: "Nelle vendite di gennaio V1 (12), V2 (8), V3 (30), V4 (6), quanto vale il totale del mese?",
      ok: "56",
      no: ["44", "100", "50"],
    },
    {
      q: "Le vendite di febbraio sono V5 (24) e V6 (20). Quanto vale il totale di febbraio?",
      ok: "44",
      no: ["56", "24", "20"],
    },
    {
      q: "Il prodotto «Caffè in grani» compare in V1 con quantità 2, in V4 con quantità 1 e in V5 con quantità 4. Quante unità sono state vendute in totale?",
      ok: "7",
      no: ["3", "6", "42"],
    },
    {
      q: "Una spesa di spedizione di 5 euro per un ordine di 3 prodotti viene ripetuta su ognuna delle 3 righe della tabella dei fatti. Quanto conta il report come spedizione?",
      ok: "15 euro: la stessa spesa è sommata tre volte per una granularità mescolata",
      no: ["5 euro, perché la somma ignora le ripetizioni", "3 euro, perché si divide per le righe", "0 euro, perché le spese non entrano nei fatti"],
    },
    {
      q: "Perché è utile una chiave surrogata nella dimensione dei prodotti?",
      ok: "Perché identifica una versione della riga e conserva la storia anche se il codice del gestionale cambia",
      no: ["Perché è più corta del nome del prodotto e il report va più veloce in ogni caso", "Perché sostituisce la tabella dei fatti", "Perché rende inutili le altre dimensioni"],
    },
    {
      q: "Il prodotto CAF-250 passa dalla categoria «Caffè» a «Caffè speciali». Come si conserva la storia delle vendite passate?",
      ok: "Si crea una nuova riga della dimensione con una nuova chiave surrogata; le vendite vecchie puntano alla vecchia",
      no: ["Si cambia la categoria nella riga esistente: tutte le vendite passate passano alla nuova", "Si cancella il prodotto e lo si ricrea", "Si copia la categoria dentro ogni riga dei fatti"],
    },
    {
      q: "Dove va scritto il nome della categoria di un prodotto in un modello a stella ben fatto?",
      ok: "Nella tabella delle dimensioni dei prodotti, in un solo posto",
      no: ["In ogni riga della tabella dei fatti, per averlo sempre sotto mano", "In un file separato per ogni report", "Nel nome della colonna dell'importo"],
    },
    {
      q: "Quale caratteristica distingue di solito una tabella dei fatti da una tabella delle dimensioni?",
      ok: "I fatti crescono di continuo con ogni evento, le dimensioni cambiano poco",
      no: ["I fatti non contengono mai numeri", "Le dimensioni hanno sempre più righe dei fatti", "Le dimensioni contengono le somme già calcolate"],
    },
  ],

  "d15-misure": [
    {
      q: "Qual è la differenza principale tra una misura e una colonna calcolata?",
      ok: "La misura si calcola sui dati filtrati in quel momento, la colonna si calcola riga per riga e resta scritta",
      no: ["La misura è sempre più lenta della colonna e serve solo per i grafici a torta", "La colonna cambia quando si applicano i filtri del report, la misura no", "Sono la stessa cosa con nomi diversi"],
    },
    {
      q: "Il totale delle righe con importo 100, 50, 80, 70 e costo 60, 20, 48, 28 è importo 300 e costo 156. Quanto vale il margine totale?",
      ok: "144",
      no: ["156", "300", "48"],
    },
    {
      q: "Con importo totale 300 e margine totale 144, quanto vale il margine percentuale corretto?",
      ok: "48%",
      no: ["50%", "144%", "52%"],
    },
    {
      q: "Le quattro righe hanno margine percentuale di riga 40%, 60%, 40%, 60%. Perché la loro media (50%) non è il margine percentuale corretto?",
      ok: "Perché non tiene conto dei pesi: le righe con importi diversi contano in modo diverso, e va fatto somma diviso somma",
      no: ["Perché le percentuali non si possono mai calcolare in DAX", "Perché la media di quattro numeri si calcola dividendo per tre", "Perché la media è giusta solo con meno di quattro righe"],
    },
    {
      q: "Nelle quattro righe, Milano ha importo 100 + 50 con costo 60 + 20. Quanto vale il margine di Milano?",
      ok: "70",
      no: ["150", "80", "74"],
    },
    {
      q: "Torino ha importo 80 + 70 = 150 e costo 48 + 28 = 76. Quanto vale il margine di Torino?",
      ok: "74",
      no: ["70", "76", "150"],
    },
    {
      q: "Quanto vale la misura Margine % per Milano, con margine 70 e importo 150?",
      ok: "46,7%",
      no: ["49,3%", "50%", "70%"],
    },
    {
      q: "La categoria Accessori comprende le righe 2 (importo 50, costo 20) e 4 (importo 70, costo 28). Quanto vale Margine % per Accessori?",
      ok: "60%",
      no: ["40%", "48%", "72%"],
    },
    {
      q: "La categoria Caffè comprende le righe 1 (importo 100, costo 60) e 3 (importo 80, costo 48). Quanto vale il costo totale di Caffè?",
      ok: "108",
      no: ["180", "72", "156"],
    },
    {
      q: "Un'analista scrive la percentuale come una colonna calcolata e poi la media nel report filtrato per negozio. Che problema rischia?",
      ok: "Un risultato che non rispecchia il vero margine del negozio, perché si fa la media di percentuali di riga",
      no: ["Nessuno, la colonna si ricalcola in base al filtro", "Il report non si apre più", "I costi vengono contati due volte nel database"],
    },
    {
      q: "Che cosa cambia tra la cella «Milano» e la cella «Torino» quando si usa la stessa misura Importo?",
      ok: "Cambia il contesto di filtro: la stessa formula vede solo le righe del negozio della cella",
      no: ["Cambia la formula, che viene riscritta per ogni negozio", "Cambia il tipo di dato dell'importo", "Cambia la tabella dei fatti"],
    },
    {
      q: "In DAX, a che cosa serve la funzione DIVIDE rispetto all'operatore di divisione?",
      ok: "A evitare l'errore quando il denominatore è zero, restituendo un valore vuoto o scelto",
      no: ["A dividere sempre per cento", "A calcolare la media delle righe", "A rendere la misura una colonna calcolata"],
    },
    {
      q: "Quale equivalente di una misura somma costo e somma importo si usa in SQL?",
      ok: "SUM(importo) e SUM(costo) con GROUP BY sulla dimensione scelta",
      no: ["Una colonna AVG sulla percentuale di ogni riga", "Un ORDER BY sul margine", "Un DELETE sulle righe in perdita"],
    },
    {
      q: "Quando conviene usare una colonna calcolata invece di una misura?",
      ok: "Quando serve un valore che descrive ogni riga e non dipende dai filtri, come il prezzo con IVA",
      no: ["Quando il numero deve cambiare con ogni filtro del report", "Quando si calcola un totale generale", "Quando si divide una somma per un'altra somma"],
    },
  ],

  "d15-semantico": [
    {
      q: "Che cos'è il livello semantico in un sistema di business intelligence?",
      ok: "Uno strato di definizioni di business tra i dati e i report, con metriche e regole di calcolo",
      no: ["Un secondo database dove si copiano tutti i dati", "Un tema grafico uguale per tutti i report", "Un registro dei permessi degli utenti"],
    },
    {
      q: "Due report mostrano ricavi diversi, 1220 e 1000, e usano gli stessi dati. Qual è la causa più probabile?",
      ok: "Definizioni diverse della metrica, per esempio con e senza IVA",
      no: ["Un guasto del server", "I dati sono stati cancellati", "Un errore dello schermo"],
    },
    {
      q: "I ricavi con IVA al 22% sono 1220. Quanto valgono senza IVA?",
      ok: "1000",
      no: ["1000,4", "1242", "1198"],
    },
    {
      q: "Dai ricavi senza IVA di 1000 si sottraggono resi per 80. Quanto sono i ricavi netti?",
      ok: "920",
      no: ["1080", "1220", "80"],
    },
    {
      q: "Un incasso lordo di 550 comprende un'IVA al 10%. Quanto vale senza IVA?",
      ok: "500",
      no: ["495", "605", "540"],
    },
    {
      q: "Un incasso lordo di 2440 comprende un'IVA al 22%. Quanto vale senza IVA?",
      ok: "2000",
      no: ["1903,2", "2440", "1952"],
    },
    {
      q: "Cinque clienti hanno 10, 25, 45, 80 e 120 giorni dall'ultimo acquisto. Quanti sono attivi con la definizione «acquisto negli ultimi 30 giorni»?",
      ok: "2",
      no: ["1", "3", "4"],
    },
    {
      q: "Con gli stessi clienti (10, 25, 45, 80, 120 giorni), quanti sono attivi con la definizione «acquisto negli ultimi 90 giorni»?",
      ok: "4",
      no: ["2", "3", "5"],
    },
    {
      q: "Con gli stessi clienti (10, 25, 45, 80, 120 giorni), quanti sono attivi se la soglia è di 60 giorni?",
      ok: "3",
      no: ["2", "4", "1"],
    },
    {
      q: "Con gli stessi clienti, quanti sono attivi se la soglia è di 15 giorni?",
      ok: "1",
      no: ["2", "0", "3"],
    },
    {
      q: "Come evita il livello semantico che due report diano numeri diversi per la stessa metrica?",
      ok: "La metrica è definita e calcolata in un solo posto, e tutti i report la riusano",
      no: ["Ogni report ricalcola la metrica con più cura", "Si impedisce di creare nuovi report", "Si nasconde il numero a chi non lo conosce"],
    },
    {
      q: "Che cosa dovrebbe contenere la definizione scritta di una metrica come «ricavi netti»?",
      ok: "Che cosa conta, che cosa esclude, il periodo e il proprietario",
      no: ["Solo il colore del grafico", "Solo il nome della tabella di origine", "Il nome di chi ha costruito il primo report"],
    },
    {
      q: "La Finanza cambia la definizione di «ricavi netti» nel livello semantico. Che cosa succede ai report che la usano?",
      ok: "Tutti mostrano il nuovo numero insieme, senza ritoccare ogni report",
      no: ["Restano sul vecchio numero finché qualcuno non li modifica uno a uno", "Smettono di funzionare", "Il numero cambia solo nel report della Finanza"],
    },
    {
      q: "Un collega dice: «Il livello semantico è un altro magazzino dati». Perché è impreciso?",
      ok: "Perché è uno strato di definizioni e regole sopra i dati, non una copia dei dati",
      no: ["Perché i dati non si possono mai copiare", "Perché esiste solo nei servizi gratuiti", "Perché contiene solo i colori dei report"],
    },
  ],

  "d15-dirigenti": [
    {
      q: "Da dove conviene partire per progettare una dashboard per i dirigenti?",
      ok: "Dalle decisioni che il dirigente prende e dalle domande a cui deve rispondere",
      no: ["Dai dati disponibili, mettendoli tutti in pagina", "Dai colori del logo aziendale", "Dai grafici più spettacolari dello strumento"],
    },
    {
      q: "I ricavi del mese sono 184 e l'obiettivo è 200. A quale percentuale dell'obiettivo si è arrivati?",
      ok: "92%",
      no: ["8%", "108%", "84%"],
    },
    {
      q: "Con le soglie verde da 100% in su, giallo da 90% a 99%, rosso sotto il 90%, di che colore sono i ricavi al 92% dell'obiettivo?",
      ok: "Giallo",
      no: ["Verde", "Rosso", "Nessun colore, la soglia non vale"],
    },
    {
      q: "Con le stesse soglie, di che colore sono ricavi di 170 su un obiettivo di 200?",
      ok: "Rosso (85%)",
      no: ["Giallo (85%)", "Verde (85%)", "Giallo (95%)"],
    },
    {
      q: "Con le stesse soglie, di che colore sono ricavi di 210 su un obiettivo di 200?",
      ok: "Verde (105%)",
      no: ["Giallo (105%)", "Rosso (105%)", "Verde (95%)"],
    },
    {
      q: "Con le stesse soglie, di che colore sono ricavi di 198 su un obiettivo di 200?",
      ok: "Giallo (99%)",
      no: ["Verde (99%)", "Rosso (99%)", "Verde (98%)"],
    },
    {
      q: "I ricavi passano da 160 del mese precedente a 184. Di quanto sono cresciuti in percentuale?",
      ok: "15%",
      no: ["24%", "13%", "87%"],
    },
    {
      q: "I ricavi passano da 120 del mese precedente a 150. Di quanto sono cresciuti in percentuale?",
      ok: "25%",
      no: ["30%", "20%", "80%"],
    },
    {
      q: "I ricavi passano da 120 a 108. Come cambia il numero rispetto al mese precedente?",
      ok: "Cala del 10%",
      no: ["Cala del 12%", "Cresce del 10%", "Cala di 108%"],
    },
    {
      q: "Perché un numero come «Ricavi: 184» da solo non basta in una dashboard?",
      ok: "Senza un confronto, come obiettivo o periodo precedente, non si capisce se è un buon risultato",
      no: ["Perché i numeri interi non si usano nei report", "Perché i dirigenti non amano i numeri", "Perché 184 è troppo piccolo per essere mostrato"],
    },
    {
      q: "In quale ordine conviene organizzare una dashboard esecutiva?",
      ok: "Pochi numeri chiave in alto, poi la scomposizione per capire dove si muove, poi il dettaglio",
      no: ["Prima la tabella di dettaglio e poi i numeri chiave", "Tutti i grafici della stessa dimensione, senza ordine", "Prima i filtri, poi gli sfondi"],
    },
    {
      q: "Una soglia usa solo il rosso e il verde per segnalare lo stato. Quale problema rischia?",
      ok: "Chi non distingue i colori o stampa in bianco e nero perde il segnale: serve anche un simbolo o una parola",
      no: ["Nessuno, i colori bastano a tutti", "Il report non si aggiorna", "I dati diventano sbagliati"],
    },
    {
      q: "Qual è la scelta migliore per la versione per telefono di una dashboard?",
      ok: "Una pagina verticale con 3-5 numeri chiave grandi, uno sotto l'altro, e la data di aggiornamento",
      no: ["La stessa pagina del computer ridotta, con tutti i grafici", "Una tabella molto larga da scorrere di lato", "Venti filtri da impostare ogni volta"],
    },
    {
      q: "Quale titolo di grafico è più utile a un dirigente?",
      ok: "«Ricavi al 92% dell'obiettivo»",
      no: ["«Grafico ricavi»", "«Pagina 2»", "«Dati del mese»"],
    },
    {
      q: "Perché troppi avvisi automatici sono un problema?",
      ok: "Dopo poco nessuno li legge più, e quelli importanti si perdono",
      no: ["Perché consumano troppo spazio sul disco", "Perché cambiano i numeri del report", "Perché gli avvisi sono vietati dal GDPR"],
    },
  ],

  "d15-governance": [
    {
      q: "Che cos'è una fonte dati certificata?",
      ok: "Un insieme di dati controllato, con proprietario, definizione scritta e controllo di qualità",
      no: ["Un file protetto da una password", "Un database installato sul computer del direttore", "Un file che nessuno può leggere"],
    },
    {
      q: "Le vendite di prova sono: Milano 40, Milano 30, Torino 50, Roma 20, Torino 10. Con la regola per riga «ognuno vede solo il suo negozio», quanto vede il responsabile di Milano?",
      ok: "70",
      no: ["40", "150", "80"],
    },
    {
      q: "Con le stesse vendite (Milano 40, Milano 30, Torino 50, Roma 20, Torino 10), quanto vede il responsabile di Torino con la regola per riga?",
      ok: "60",
      no: ["50", "70", "150"],
    },
    {
      q: "Con le stesse vendite, quanto vede la direzione se non ha alcuna regola per riga?",
      ok: "150",
      no: ["70", "60", "100"],
    },
    {
      q: "Quanto vede il responsabile di Roma, con le stesse vendite e la regola per riga?",
      ok: "20",
      no: ["0", "150", "40"],
    },
    {
      q: "In un'azienda ci sono 48 report e 18 non sono stati aperti negli ultimi 90 giorni. Quale percentuale è inutilizzata?",
      ok: "37,5%",
      no: ["18%", "62,5%", "27,5%"],
    },
    {
      q: "Di 48 report, 12 sono duplicati di altri e si decide di unirli. Quanti report restano?",
      ok: "36",
      no: ["60", "12", "30"],
    },
    {
      q: "Di 60 report, 15 sono duplicati. Quale percentuale dei report si può eliminare unendoli?",
      ok: "25%",
      no: ["15%", "75%", "40%"],
    },
    {
      q: "Un'analista nasconde in un grafico la colonna degli stipendi, ma la colonna resta nel modello. Perché non è una vera protezione?",
      ok: "Perché la protezione sta nella pagina e non nei dati: chi modifica o esporta il report può comunque arrivarci",
      no: ["Perché gli stipendi non si possono mai nascondere", "Perché nascondere rende il report più lento", "Perché il grafico resta sempre in bianco"],
    },
    {
      q: "Quale è il modo più sicuro di tenere fuori da un report una colonna che non serve a nessuna domanda?",
      ok: "Non caricarla nel modello",
      no: ["Caricarla e dare solo a pochi il link", "Rinominarla con un nome strano", "Metterla in fondo alla tabella"],
    },
    {
      q: "Quale livello di sensibilità è adatto a un report con gli stipendi dei dipendenti?",
      ok: "Strettamente riservato",
      no: ["Pubblico", "Interno, visibile a tutti i dipendenti", "Non serve alcuna etichetta"],
    },
    {
      q: "Per dati personali di clienti, quale principio del GDPR è collegato a «caricare solo ciò che serve»?",
      ok: "La minimizzazione dei dati",
      no: ["La portabilità dei dati", "La crittografia del disco", "Il diritto di voto"],
    },
    {
      q: "Per fare un report simile a uno esistente ma con un filtro diverso, quale scelta riduce i duplicati?",
      ok: "Usare il report base con filtri o varianti ben fatte, mantenuto da un solo proprietario",
      no: ["Copiare il report e modificare la copia", "Esportare i dati in un foglio personale", "Fare una copia per ogni utente"],
    },
    {
      q: "Un report senza proprietario, con dati vecchi di un anno, è ancora raggiungibile da molte persone. Che cosa prevede il ciclo di vita?",
      ok: "Una revisione periodica che lo individua, avvisa gli utenti e lo ritira con ordine",
      no: ["Lasciarlo dov'è, tanto non dà fastidio", "Cancellarlo subito senza avvisare nessuno", "Copiarlo per tenerne una versione di scorta"],
    },
  ],

  "d15-rilascio": [
    {
      q: "Quando conviene far partire l'aggiornamento pianificato di un report rispetto al caricamento dei dati di origine?",
      ok: "Dopo la fine del caricamento, con un margine di sicurezza",
      no: ["Prima del caricamento, così il report è pronto presto", "Nello stesso istante, per fare in fretta", "A caso, le due cose sono indipendenti"],
    },
    {
      q: "Il caricamento dei dati finisce alle 06:20. Quale orario è adatto per l'aggiornamento del report?",
      ok: "06:45",
      no: ["06:00", "05:30", "06:10"],
    },
    {
      q: "Se l'aggiornamento del report parte prima della fine del caricamento, che cosa mostra?",
      ok: "I dati precedenti, che sembrano aggiornati ma non lo sono",
      no: ["Un errore, sempre", "I dati futuri", "Nessun dato"],
    },
    {
      q: "Prima della modifica i ricavi di gennaio erano 920, dopo sono 935. Quanto vale la differenza in percentuale, circa?",
      ok: "1,63%",
      no: ["15%", "0,16%", "2,6%"],
    },
    {
      q: "La tolleranza del test di regressione è 0,5%. Ricavi prima 920, dopo 935 (circa 1,63% di differenza). Che cosa si fa?",
      ok: "Si ferma il rilascio e si cerca la causa, perché la differenza supera la tolleranza",
      no: ["Si pubblica, perché 15 è un numero piccolo", "Si cambia la tolleranza a 2%", "Si cancella il test"],
    },
    {
      q: "Ricavi prima 920, dopo 924. La differenza è 4, circa 0,43%. Con tolleranza 0,5%, che esito ha il test?",
      ok: "Passa: la differenza è sotto la tolleranza",
      no: ["Non passa: ogni differenza è un errore", "Non passa: 4 è più di 0,5", "Il test non si può fare con numeri decimali"],
    },
    {
      q: "Ricavi prima 1000, dopo 1020, tolleranza 0,5%. Che esito ha il test di regressione?",
      ok: "Non passa: la differenza è del 2%",
      no: ["Passa: 20 è meno di 1000", "Passa: la differenza è del 0,2%", "Non passa: la differenza è del 20%"],
    },
    {
      q: "Che cosa verifica un test di regressione sui numeri?",
      ok: "Che i numeri di riferimento che dovevano restare uguali non siano cambiati dopo una modifica",
      no: ["Che il report abbia un bel colore", "Che gli utenti aprano il report ogni giorno", "Che il server sia acceso"],
    },
    {
      q: "Perché si usano ambienti separati di sviluppo, test e produzione?",
      ok: "Per provare e controllare le modifiche prima che le veda chi decide",
      no: ["Per avere tre copie dello stesso report e confonderle", "Per rendere il rilascio più lento di proposito", "Perché è obbligatorio per legge"],
    },
    {
      q: "Un'analista vuole correggere una misura. Qual è la prassi corretta?",
      ok: "Modificare in sviluppo, controllare in test, poi pubblicare in produzione",
      no: ["Modificare direttamente il report in produzione", "Chiedere a un collega di farlo di notte", "Pubblicare e aspettare le segnalazioni"],
    },
    {
      q: "Una definizione di ricavi cambia e i numeri di gennaio passano da 1220 a 920. Che cosa si fa prima del rilascio?",
      ok: "Si comunica agli utenti che cosa cambia, perché, da quando e di quanto cambiano i numeri",
      no: ["Niente: gli utenti se ne accorgeranno da soli", "Si nasconde il vecchio numero", "Si aspetta che qualcuno protesti"],
    },
    {
      q: "Sono stati invitati 80 utenti e 52 hanno aperto il report negli ultimi 30 giorni. Qual è l'adozione?",
      ok: "65%",
      no: ["52%", "35%", "28%"],
    },
    {
      q: "Sono stati invitati 60 utenti e 45 hanno aperto il report. Qual è l'adozione?",
      ok: "75%",
      no: ["45%", "25%", "15%"],
    },
    {
      q: "Sono stati invitati 120 utenti e 30 hanno aperto il report. Qual è l'adozione?",
      ok: "25%",
      no: ["30%", "75%", "4%"],
    },
    {
      q: "L'adozione di un report è bassa. Qual è la reazione più utile?",
      ok: "Chiedere agli utenti perché non lo usano e migliorare il report",
      no: ["Dare la colpa agli utenti", "Aggiungere altri grafici senza chiedere nulla", "Smettere di aggiornarlo"],
    },
    {
      q: "Che cosa conviene fare se l'aggiornamento pianificato fallisce una notte?",
      ok: "Ricevere un avviso e mostrare nel report la data dell'ultimo aggiornamento riuscito",
      no: ["Niente, si vedrà dopo qualche settimana", "Nascondere la data di aggiornamento", "Cancellare il report"],
    },
  ],
};
