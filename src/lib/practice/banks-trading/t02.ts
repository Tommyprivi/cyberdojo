import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T2 (Trading algoritmico con Python). Una chiave per lezione: "t02-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Tutti i numeri sono fittizi e ricontrollati a mano.
 */
export const T02_ITEMS: Record<string, BankItem[]> = {
  "t02-candele": [
    { q: "Che cosa significa la sigla OHLC nei dati di mercato?", ok: "Apertura, massimo, minimo, chiusura", no: ["Offerta, domanda, limite, commissione", "Ordine, rendimento, liquidità, costo", "Apertura, media, limite, chiusura"] },
    { q: "In una giornata un titolo apre a 20,00 e chiude a 20,50. Che candela è, con la convenzione verde/rossa?", ok: "Verde: la chiusura è sopra l'apertura", no: ["Rossa: il prezzo è salito quindi è un allarme", "Verde: la chiusura è sotto l'apertura", "Rossa: la chiusura è sopra l'apertura"] },
    { q: "Un titolo ha massimo 10,60 e minimo 9,80 in una giornata. Quanto vale l'intervallo (range) della candela?", ok: "0,80", no: ["10,60", "0,40", "20,40"] },
    { q: "Apertura 10,00 e chiusura 10,40: quanto è lungo il corpo della candela?", ok: "0,40", no: ["10,40", "0,20", "4,00"] },
    { q: "Che cosa rappresentano le sottili linee sopra e sotto il corpo di una candela?", ok: "I prezzi massimo e minimo raggiunti nel periodo", no: ["I prezzi di apertura e chiusura del giorno dopo", "Gli ordini non eseguiti", "L'errore di misura dei dati"] },
    { q: "Che cosa misura il volume di una giornata di borsa?", ok: "Quante azioni sono state scambiate in quel periodo", no: ["Quanti euro vale l'azienda", "Di quanto è salito il prezzo", "Quanti investitori hanno perso denaro"] },
    { q: "Un giorno il prezzo sale molto ma il volume è bassissimo. Che cosa conviene pensare?", ok: "Il movimento è stato fatto da pochi scambi: va guardato con cautela", no: ["Il movimento è sicuramente destinato a continuare", "Il volume non ha mai alcuna importanza", "I dati sono certamente sbagliati"] },
    { q: "Una piattaforma mostra le candele crescenti in bianco e un'altra in verde. Che cosa vuol dire?", ok: "I colori sono una convenzione: bisogna controllare la legenda della piattaforma", no: ["Una delle due piattaforme sbaglia i dati", "Il bianco indica sempre una candela ribassista", "Il colore indica il volume scambiato"] },
    { q: "Una candela ha un corpo molto piccolo e due lunghe ombre. Che cosa descrive con certezza?", ok: "Il prezzo si è mosso molto durante il periodo ma ha chiuso vicino all'apertura", no: ["Il prezzo salirà sicuramente il giorno dopo", "Il prezzo non si è mosso per niente", "Il volume è stato altissimo"] },
    { q: "Perché una candela giornaliera non basta per sapere come il prezzo si è mosso durante la giornata?", ok: "Riassume il giorno in quattro prezzi: non dice in che ordine sono stati toccati massimo e minimo", no: ["Perché contiene solo il prezzo di chiusura", "Perché è sempre calcolata sul giorno prima", "Perché non include mai il minimo"] },
    { q: "In una riga di dati OHLC il minimo vale 10,00 e il massimo 9,70. Che cosa significa?", ok: "La riga è incoerente: il massimo non può essere inferiore al minimo", no: ["Il titolo ha perso valore quel giorno", "È normale nei giorni con molto volume", "Il prezzo ha toccato un nuovo massimo storico"] },
    { q: "Quale di queste frasi sulle candele è corretta?", ok: "Descrivono quello che è successo nel periodo, non garantiscono quello che succederà", no: ["Una candela verde garantisce che il giorno dopo il prezzo salirà", "Una candela rossa garantisce che il titolo va venduto", "Il corpo lungo garantisce un guadagno"] },
  ],

  "t02-fonti": [
    { q: "Un sito offre dati di borsa gratis da scaricare. Che cosa si deve controllare prima di usarli in modo serio?", ok: "I termini d'uso e la licenza: gratis non vuol dire libero di ridistribuire", no: ["Niente: se è gratis si può fare di tutto", "Solo il colore dei grafici", "Solo che il sito sia in inglese"] },
    { q: "Perché una libreria non ufficiale che legge dati da un sito può smettere di funzionare da un giorno all'altro?", ok: "Se il sito cambia pagine o regole, il codice che lo legge si rompe", no: ["Perché i prezzi di borsa cambiano ogni secondo", "Perché Python scade ogni anno", "Perché i dati gratuiti si cancellano dopo un giorno"] },
    { q: "Quale fonte è di solito una buona scelta per dati macroeconomici (inflazione, tassi) liberamente consultabili?", ok: "I siti di istituti statistici e banche centrali", no: ["Un messaggio ricevuto da uno sconosciuto", "Un canale che vende segnali a pagamento", "Un forum anonimo senza fonti"] },
    { q: "Hai scaricato dati di borsa e dopo un mese il sito li ha cambiati. Perché conviene salvare una copia locale con la data di scarico?", ok: "Perché così l'analisi si può ripetere e ottenere gli stessi risultati", no: ["Perché i file locali sono sempre più precisi", "Perché i siti vietano di scaricare più di una volta", "Perché la copia aumenta il volume degli scambi"] },
    { q: "Due fonti gratuite danno chiusure leggermente diverse per lo stesso titolo. Che cosa è la cosa più sensata?", ok: "Capire come ciascuna tratta aggiustamenti e orari, e confrontare un campione", no: ["Fare la media e non pensarci più", "Usare sempre la fonte con il prezzo più alto", "Cancellare entrambe e inventare i dati"] },
    { q: "Che differenza c'è tra dati ritardati e dati in tempo reale?", ok: "I ritardati arrivano con alcuni minuti di ritardo; per studiare la storia vanno benissimo", no: ["I ritardati sono sempre sbagliati", "I tempo reale sono sempre gratuiti", "Non esiste nessuna differenza"] },
    { q: "Chi pubblica online un file con i dati scaricati da una fonte con licenza ristretta rischia di...", ok: "Violare i termini d'uso della fonte", no: ["Migliorare la qualità dei dati", "Ottenere automaticamente un rimborso", "Cambiare il prezzo del titolo"] },
    { q: "Che cos'è un file CSV?", ok: "Un file di testo con valori separati da un delimitatore, una riga per record", no: ["Un database con controlli automatici sui tipi", "Un programma per fare grafici", "Un tipo di ordine di borsa"] },
    { q: "Una fonte gratuita limita il numero di richieste al minuto. Che cosa è un comportamento corretto?", ok: "Rispettare il limite, scaricare una volta e riusare i dati salvati", no: ["Lanciare migliaia di richieste insieme per aggirare il limite", "Usare le credenziali di un'altra persona", "Cambiare continuamente indirizzo per non farsi riconoscere"] },
    { q: "Dove si deve conservare una chiave di accesso (API key) ricevuta da un fornitore di dati?", ok: "In una variabile d'ambiente o in un file fuori dal codice condiviso", no: ["Scritta nel codice che si pubblica online", "In un messaggio a un amico", "Nel titolo del file dei dati"] },
    { q: "Un servizio promette dati «esclusivi» che prevedono il mercato, a pagamento. Come ti comporti?", ok: "Con sospetto: nessun dato garantisce guadagni e i mercati non regalano niente", no: ["Compro subito, costa poco", "Lo consiglio a tutti gli amici", "Lo uso con un conto vero per provare"] },
    { q: "Perché è importante sapere da quale fonte arrivano i dati di un'analisi?", ok: "Perché qualità, aggiustamenti e licenza dipendono dalla fonte", no: ["Perché la fonte decide quale strategia guadagna", "Perché la fonte cambia i prezzi nel tempo", "Perché senza fonte Python non parte"] },
  ],

  "t02-pandas-serie": [
    { q: "In pandas, che cosa è una serie temporale?", ok: "Una serie di valori indicizzati da date ordinate nel tempo", no: ["Una colonna senza indice", "Un grafico con le candele", "Un file che contiene solo date"] },
    { q: "Quale funzione trasforma una lista di testi come \"2026-03-02\" in vere date?", ok: "pd.to_datetime", no: ["pd.to_float", "df.resample", "pd.cumprod"] },
    { q: "Se l'indice di un DataFrame è fatto di date, che cosa restituisce `df.loc[\"2026-03-03\":\"2026-03-05\"]`?", ok: "Le righe dal 3 al 5 marzo, estremi compresi", no: ["Solo la riga del 4 marzo", "Le righe dal 3 al 5 marzo, ultimo giorno escluso", "Tutte le righe tranne quelle indicate"] },
    { q: "Che cosa fa `resample(\"W\").last()` su prezzi giornalieri?", ok: "Raggruppa per settimana e tiene l'ultimo prezzo di ciascuna", no: ["Calcola la media di tutto l'anno", "Cancella i giorni di fine settimana", "Aggiunge una colonna di rendimenti"] },
    { q: "Con i prezzi di chiusura 10,0 / 10,5 / 11,0 che cosa dà `rolling(2).mean()` sulla terza riga?", ok: "10,75", no: ["10,5", "10,25", "10,0"] },
    { q: "Perché le prime righe di `rolling(3).mean()` valgono NaN?", ok: "Perché non ci sono ancora 3 valori nella finestra", no: ["Perché i primi prezzi sono sbagliati", "Perché pandas non sa calcolare le medie", "Perché le date sono fuori ordine"] },
    { q: "Che cosa fa `df[\"chiusura\"].shift(1)`?", ok: "Sposta i valori in giù di una riga: ogni riga vede il valore del giorno prima", no: ["Sposta i valori in su di una riga", "Cancella la prima riga per sempre", "Raddoppia ogni valore"] },
    { q: "Perché prima di lavorare con le date è importante ordinare l'indice (sort_index)?", ok: "Perché rolling, shift e slicing presuppongono che il tempo vada in avanti", no: ["Perché le date disordinate non esistono in pandas", "Perché l'ordine cambia i prezzi", "Perché senza ordine il codice non si avvia"] },
    { q: "Hai un campo data letto come testo (\"2026-03-02\"). Che cosa succede se non lo converti in data?", ok: "Non puoi usare funzioni temporali come resample e lo slicing per date", no: ["Pandas lo converte da solo in ogni caso", "I prezzi diventano negativi", "Il codice funziona uguale e più veloce"] },
    { q: "Quale errore si fa usando `shift(-1)` per calcolare un segnale di acquisto?", ok: "Si usa il prezzo di domani per decidere oggi: è look-ahead", no: ["Si usa un prezzo troppo vecchio", "Si perdono le date", "Si raddoppiano le commissioni"] },
    { q: "Con la media mobile a 3 giorni di 10,4 / 10,0 / 10,1, quanto vale la media sulla terza riga (arrotondata a 2 decimali)?", ok: "10,17", no: ["10,10", "10,03", "10,30"] },
    { q: "Perché i prezzi settimanali ottenuti con resample hanno meno righe di quelli giornalieri?", ok: "Perché ogni riga riassume una settimana intera", no: ["Perché pandas scarta i giorni peggiori", "Perché la settimana ha un solo giorno di borsa", "Perché si perdono i prezzi più alti"] },
  ],

  "t02-rendimenti": [
    { q: "Un prezzo passa da 50 a 60. Quanto vale il rendimento semplice?", ok: "20%", no: ["10%", "16,7%", "60%"] },
    { q: "Un prezzo passa da 80 a 60. Quanto vale il rendimento semplice?", ok: "-25%", no: ["-20%", "-33,3%", "-75%"] },
    { q: "Un prezzo scende del 50%. Di quanto deve salire per tornare al livello di partenza?", ok: "100%", no: ["50%", "25%", "150%"] },
    { q: "Parti da 100, sale del 20% e poi scende del 20%. Quanto vale alla fine?", ok: "96", no: ["100", "104", "98"] },
    { q: "Che formula dà il rendimento semplice tra il prezzo di ieri e quello di oggi?", ok: "prezzo di oggi diviso prezzo di ieri, meno 1", no: ["prezzo di oggi meno prezzo di ieri, senza dividere", "prezzo di ieri diviso prezzo di oggi, più 1", "prezzo di oggi per prezzo di ieri"] },
    { q: "Che cosa dà `pct_change()` su una serie di prezzi?", ok: "Il rendimento semplice rispetto alla riga precedente, come numero decimale", no: ["Il prezzo massimo del periodo", "Il rendimento logaritmico, sempre", "La media mobile a 20 giorni"] },
    { q: "Perché il primo valore di `pct_change()` è NaN?", ok: "Perché non esiste un prezzo precedente con cui confrontarlo", no: ["Perché il primo prezzo è sempre sbagliato", "Perché pandas ignora il primo giorno di borsa", "Perché il primo rendimento è sempre zero"] },
    { q: "Che proprietà comoda hanno i rendimenti logaritmici su più giorni?", ok: "Si possono sommare: la somma dà il rendimento logaritmico totale", no: ["Sono sempre positivi", "Sono sempre uguali a quelli semplici", "Non dipendono dai prezzi"] },
    { q: "Per rendimenti piccoli (qualche punto percentuale) semplice e logaritmico sono...", ok: "Molto vicini tra loro", no: ["Opposti di segno", "Uno il doppio dell'altro", "Sempre identici anche per rendimenti grandi"] },
    { q: "Con rendimenti giornalieri semplici +10% e poi -10%, quanto vale il rendimento complessivo?", ok: "-1%", no: ["0%", "+1%", "-10%"] },
    { q: "Come si ottiene il rendimento complessivo di più giorni con rendimenti semplici r1 ed r2?", ok: "(1 + r1) per (1 + r2), meno 1", no: ["r1 più r2, sempre esatto", "r1 per r2", "La media di r1 e r2"] },
    { q: "Quale convenzione conviene dichiarare sempre quando si mostra un rendimento?", ok: "Se è semplice o logaritmico e su quale periodo", no: ["Il colore del grafico", "Il nome del broker", "L'ora in cui si è guardato il prezzo"] },
  ],

  "t02-prezzi-corretti": [
    { q: "Che cos'è un frazionamento azionario (split) 2 per 1?", ok: "Ogni azione diventa due azioni e il prezzo si dimezza, il valore totale resta uguale", no: ["L'azienda perde metà del suo valore", "Gli azionisti ricevono denaro in contanti", "Il prezzo raddoppia e le azioni si dimezzano"] },
    { q: "Possiedi 10 azioni da 100 euro e c'è uno split 5 per 1. Che cosa hai dopo?", ok: "50 azioni da 20 euro", no: ["10 azioni da 20 euro", "50 azioni da 100 euro", "2 azioni da 500 euro"] },
    { q: "Nei prezzi grezzi un titolo passa da 82 a 41 per uno split 2 per 1. Che rendimento giornaliero apparente si legge?", ok: "-50%, ma è solo l'effetto dello split", no: ["+50%, perché le azioni sono raddoppiate", "0%, perché non cambia nulla", "-41%"] },
    { q: "Perché i prezzi corretti sono utili per calcolare i rendimenti?", ok: "Eliminano i salti dovuti a split e dividendi e rendono confrontabili i prezzi nel tempo", no: ["Perché sono sempre più alti dei grezzi", "Perché prevedono i prezzi futuri", "Perché evitano di pagare le tasse"] },
    { q: "Per uno split 2 per 1, come si correggono i prezzi di prima dello split?", ok: "Si moltiplicano per 0,5", no: ["Si moltiplicano per 2", "Si sottraggono 2", "Non si toccano mai"] },
    { q: "Un dividendo viene pagato: che cosa succede di solito al prezzo il giorno dello stacco?", ok: "Scende all'incirca dell'importo del dividendo", no: ["Sale del doppio del dividendo", "Resta sempre identico", "Va a zero"] },
    { q: "Il giorno prima dello stacco il titolo chiude a 50,00 e il dividendo è 1,00. Quale fattore corregge i prezzi precedenti (convenzione comune)?", ok: "0,98", no: ["0,99", "0,50", "1,02"] },
    { q: "Perché i prezzi corretti per i dividendi di solito sono più bassi dei grezzi nel passato?", ok: "Perché ogni dividendo riduce i prezzi precedenti dello stacco", no: ["Perché i dividendi sono costi per l'investitore", "Perché i dati vengono cancellati", "Perché i prezzi corretti ignorano l'inflazione"] },
    { q: "Nella chiusura corretta di una fonte, quale limite va ricordato?", ok: "Fornitori diversi possono usare metodi leggermente diversi", no: ["È identica per tutti i fornitori", "Contiene i prezzi del futuro", "Non cambia mai neanche dopo nuovi dividendi"] },
    { q: "Che cosa succede ai prezzi corretti vecchi quando l'azienda stacca un nuovo dividendo?", ok: "Possono essere ricalcolati, quindi cambiano anche i vecchi valori", no: ["Restano sempre fissi", "Diventano uguali ai grezzi", "Vengono cancellati"] },
    { q: "Un reverse split 1 per 10 riunisce le azioni: che cosa succede al prezzo grezzo?", ok: "Sale di circa dieci volte, senza cambiare il valore totale", no: ["Scende a un decimo", "Resta uguale", "Va a zero"] },
    { q: "Per un backtest sui rendimenti di un titolo con molti split e dividendi, quali prezzi si usano di solito?", ok: "Quelli corretti, dichiarando da quale fonte e con quale metodo", no: ["Quelli grezzi, ignorando gli split", "Prezzi inventati a mano", "Solo i prezzi del giorno dello split"] },
  ],

  "t02-pulizia": [
    { q: "Una riga di dati è duplicata (stessa data, stessi prezzi). Che cosa si fa?", ok: "Si elimina il duplicato, ad esempio con drop_duplicates", no: ["Si tiene per fare la media", "Si raddoppia il volume", "Si cancella tutta la tabella"] },
    { q: "Manca il prezzo di un giorno lavorativo. Quale riempimento è prudente in un backtest?", ok: "Riportare avanti l'ultimo prezzo noto (ffill)", no: ["Usare il prezzo del giorno dopo (bfill)", "Inventare un prezzo a caso", "Mettere zero"] },
    { q: "Perché riempire un buco con il prezzo del giorno dopo (bfill) è un problema?", ok: "Usa informazione del futuro: è look-ahead", no: ["Perché è più lento", "Perché pandas lo vieta", "Perché il prezzo è sempre più alto"] },
    { q: "Il sabato e la domenica non ci sono prezzi in borsa. È un errore nei dati?", ok: "No, la borsa è chiusa: i giorni mancanti sono normali", no: ["Sì, vanno riempiti con zero", "Sì, il dato è sempre corrotto", "Sì, vanno copiati dal lunedì"] },
    { q: "Un prezzo di 1000 compare tra prezzi vicini a 10. Che cosa fai per primo?", ok: "Lo segno come sospetto e controllo la fonte (forse un errore di virgola)", no: ["Lo lascio: i mercati sono imprevedibili", "Lo cancello senza guardare", "Lo uso per sapere il prezzo medio"] },
    { q: "In una riga OHLC la chiusura è 10,90 ma il massimo è 10,60. Che cosa dimostra?", ok: "La riga è incoerente: la chiusura non può superare il massimo", no: ["Una giornata molto positiva", "Un normale effetto dei dividendi", "Un volume insolito"] },
    { q: "La colonna dei prezzi è stata letta come testo. Quale problema ti aspetti?", ok: "Non si possono fare calcoli numerici finché non la converti", no: ["I calcoli sono più precisi", "Pandas aggiunge i dividendi", "Non cambia nulla"] },
    { q: "Quale comando segnala quali celle di un DataFrame sono vuote (NaN)?", ok: "df.isna()", no: ["df.shift()", "df.resample()", "df.cumsum()"] },
    { q: "Hai ordinato male le date (dal più recente al più vecchio). Che cosa fai prima di calcolare i rendimenti?", ok: "Ordino l'indice dal più vecchio al più recente", no: ["Calcolo comunque i rendimenti", "Cancello metà dei dati", "Moltiplico i prezzi per -1"] },
    { q: "Hai rimosso tutte le righe con un valore mancante. Quale rischio va dichiarato?", ok: "Puoi aver tolto giorni importanti e cambiato i risultati", no: ["Nessuno: più righe tolte, più dati puliti", "Il volume aumenta", "I prezzi diventano corretti"] },
    { q: "Perché conviene tenere una copia dei dati grezzi e lavorare su una copia pulita?", ok: "Per poter rivedere cosa è stato cambiato e ripetere la pulizia", no: ["Perché i dati grezzi sono più veloci", "Perché pandas lo richiede", "Per ridurre le commissioni"] },
    { q: "Dopo la pulizia, quale passaggio rende il lavoro onesto e ripetibile?", ok: "Annotare ogni correzione fatta e quante righe ha toccato", no: ["Non scrivere nulla", "Cancellare il file originale", "Rifare la pulizia a occhio ogni volta"] },
  ],

  "t02-grafici": [
    { q: "Quale libreria Python si usa più comunemente per disegnare un grafico di prezzo?", ok: "matplotlib", no: ["requests", "hashlib", "random"] },
    { q: "Che cosa mostra un grafico a linea di una serie di prezzi di chiusura?", ok: "L'andamento della chiusura giorno per giorno", no: ["Massimo, minimo, apertura e chiusura insieme", "Solo il volume", "I prezzi futuri"] },
    { q: "Perché un grafico senza titolo e senza etichette sugli assi è un cattivo grafico?", ok: "Non si capisce che cosa mostra né in quali unità", no: ["Perché i colori diventano bianchi", "Perché pandas dà errore", "Perché il prezzo cambia"] },
    { q: "Un asse verticale parte da 99 invece che da 0. Che effetto può avere?", ok: "Piccole variazioni sembrano enormi", no: ["Le variazioni sembrano nulle", "Il grafico è sempre più preciso", "Nessun effetto"] },
    { q: "In una scala logaritmica, che cosa significano distanze uguali sull'asse verticale?", ok: "Variazioni percentuali uguali", no: ["Variazioni in euro uguali", "Volumi uguali", "Lo stesso giorno"] },
    { q: "Un prezzo passa da 100 a 200 e poi a 400. In scala logaritmica i due salti appaiono...", ok: "Della stessa altezza, perché entrambi raddoppiano", no: ["Il secondo doppio del primo", "Il primo doppio del secondo", "Il secondo nullo"] },
    { q: "Vuoi confrontare due titoli con prezzi molto diversi (50 e 5000). Che cosa conviene fare?", ok: "Normalizzarli a base 100 sul primo giorno", no: ["Metterli sullo stesso asse senza cambiarli", "Tenere solo il più caro", "Usare solo il volume"] },
    { q: "Normalizzando a base 100 un titolo che parte da 50 e arriva a 60, quale valore finale si legge?", ok: "120", no: ["110", "60", "100"] },
    { q: "Quando conviene mostrare le candele invece della semplice linea?", ok: "Quando serve vedere apertura, massimo, minimo e chiusura di ogni periodo", no: ["Quando si vogliono nascondere i volumi", "Quando mancano i dati", "Mai, sono identiche alla linea"] },
    { q: "Quale istruzione fa comparire il grafico finale con matplotlib?", ok: "plt.show()", no: ["plt.hide()", "df.shift()", "pd.to_datetime()"] },
    { q: "Un grafico mostra una linea che sale sempre. Perché è sbagliato concludere che salirà ancora?", ok: "Il passato non garantisce il futuro e il grafico non mostra i rischi", no: ["Perché il grafico è sempre falso", "Perché i grafici non usano dati veri", "Perché i prezzi salgono in modo casuale solo di lunedì"] },
    { q: "Hai sovrapposto una media mobile ai prezzi. Che cosa devi aggiungere per rendere il grafico leggibile?", ok: "Una legenda che dica quale linea è il prezzo e quale la media", no: ["Un'altra media uguale", "Nessuna etichetta", "Un secondo titolo"] },
  ],
};
