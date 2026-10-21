import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H2 (Hedge fund). Una chiave per lezione: "h02-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Tutti i numeri sono fittizi e i calcoli sono stati ricontrollati a mano.
 */
export const H02_ITEMS: Record<string, BankItem[]> = {
  // H.02.001 - Long/short
  "h02-long-short": [
    { q: "Come funziona la vendita allo scoperto di un'azione?", ok: "Si prendono in prestito azioni, si vendono subito e si ricomprano più tardi per restituirle", no: ["Si comprano azioni e si aspetta che salgano di prezzo", "Si vendono azioni che si possiedono già per incassare il guadagno", "Si compra un contratto che garantisce un guadagno senza rischio"] },
    { q: "Un fondo ha 70 milioni long e 30 milioni short su un capitale di 100 milioni. Quanto vale l'esposizione netta?", ok: "40%", no: ["100%", "30%", "70%"] },
    { q: "Un fondo ha 70 milioni long e 30 milioni short su un capitale di 100 milioni. Quanto vale l'esposizione lorda?", ok: "100%", no: ["40%", "70%", "30%"] },
    { q: "Un fondo ha 80 milioni long e 20 milioni short su un capitale di 100 milioni. Qual è la sua esposizione netta?", ok: "60%", no: ["100%", "20%", "80%"] },
    { q: "Un fondo ha 40 milioni long e 40 milioni short su un capitale di 100 milioni. Quali sono esposizione lorda e netta?", ok: "Lorda 80%, netta 0%", no: ["Lorda 0%, netta 80%", "Lorda 40%, netta 40%", "Lorda 80%, netta 80%"] },
    { q: "Si vende allo scoperto un'azione a 20 euro e il prezzo sale a 50 euro prima di ricomprarla. Quanto si perde per azione?", ok: "30 euro", no: ["20 euro", "50 euro", "10 euro"] },
    { q: "Un fondo ha 50 milioni long su un'azienda A e 50 milioni short su un'azienda B. Entrambe salgono del 10%. Qual è il risultato?", ok: "Zero: +5 milioni sul long e -5 milioni sullo short", no: ["+10 milioni, perché entrambe salgono", "-10 milioni, perché lo short perde più del long", "+5 milioni, perché il long guadagna e lo short non conta"] },
    { q: "Un fondo ha 50 milioni long su A e 50 milioni short su B. A scende del 6% e B scende del 10%. Qual è il risultato?", ok: "+2 milioni (-3 sul long e +5 sullo short)", no: ["-8 milioni, perché entrambe scendono", "+8 milioni, perché entrambe scendono", "-2 milioni, perché A perde"] },
    { q: "Un fondo ha 50 milioni long su A e 50 milioni short su B. A sale del 4% e B sale dell'8%. Qual è il risultato?", ok: "-2 milioni (+2 sul long e -4 sullo short)", no: ["+6 milioni, perché entrambe salgono", "+2 milioni, perché A sale", "-4 milioni, perché B sale"] },
    { q: "Qual è la perdita massima teorica di una posizione long e di una posizione short su un'azione?", ok: "Long: al massimo quanto investito; short: senza un tetto, perché il prezzo può salire molto", no: ["Per entrambe al massimo quanto investito", "Long: senza un tetto; short: al massimo quanto incassato", "Per entrambe senza un tetto"] },
    { q: "Che cos'è uno short squeeze?", ok: "Una salita rapida del prezzo causata da chi ha venduto allo scoperto ed è costretto a ricomprare", no: ["Un calo rapido del prezzo causato da molti acquirenti", "Una commissione che il broker applica agli investitori long", "Un divieto di comprare azioni di una certa azienda"] },
    { q: "Che cosa significa che un fondo long/short è market neutral?", ok: "Ha un'esposizione netta vicina a zero e quindi dipende poco dall'andamento generale del mercato", no: ["È sicuro di non perdere mai quando il mercato scende", "Ha solo posizioni long su azioni stabili", "Ha un'esposizione lorda pari a zero"] },
    { q: "Un fondo long/short può perdere anche se il mercato resta fermo. Quando succede?", ok: "Quando le azioni comprate vanno peggio di quelle vendute allo scoperto", no: ["Mai, perché le due posizioni si compensano sempre", "Solo quando il mercato sale molto", "Solo quando l'esposizione netta è zero"] },
  ],

  // H.02.002 - Global macro
  "h02-macro": [
    { q: "Che cosa osserva soprattutto un gestore di un fondo global macro per prendere le sue decisioni?", ok: "I grandi numeri di un'economia: inflazione, tassi d'interesse, debito pubblico, crescita", no: ["Solo i bilanci di una singola azienda", "Solo i grafici dei prezzi dell'ultimo giorno", "Solo le notizie sui social network"] },
    { q: "Su quali strumenti può operare un fondo global macro?", ok: "Valute, tassi d'interesse, indici di borsa, materie prime", no: ["Solo azioni di aziende italiane", "Solo obbligazioni di aziende in crisi", "Solo contratti di assicurazione sulla vita"] },
    { q: "Un fondo vende 4 milioni di una moneta a cambio 4 per 1 euro, incassando 1 milione di euro. Il cambio sale a 5 monete per euro. Quanto guadagna, senza costi?", ok: "200.000 euro", no: ["250.000 euro", "1.000.000 di euro", "Niente: perde 200.000 euro"] },
    { q: "Un fondo vende 4 milioni di una moneta a cambio 4 per 1 euro, incassando 1 milione di euro. Il cambio scende a 2 monete per euro (la moneta si rafforza). Qual è il risultato, senza costi?", ok: "Perdita di 1.000.000 di euro", no: ["Guadagno di 1.000.000 di euro", "Perdita di 500.000 euro", "Guadagno di 500.000 euro"] },
    { q: "Un fondo vende 9 milioni di una moneta a cambio 9 per 1 euro, incassando 1 milione di euro. Il cambio sale a 12 monete per euro. Qual è il risultato, senza costi?", ok: "Guadagno di 250.000 euro", no: ["Perdita di 250.000 euro", "Guadagno di 333.333 euro", "Guadagno di 3 milioni di euro"] },
    { q: "Un fondo vende 6 milioni di una moneta a cambio 6 per 1 euro, incassando 1 milione di euro. Il cambio scende a 4 monete per euro. Qual è il risultato, senza costi?", ok: "Perdita di 500.000 euro", no: ["Guadagno di 500.000 euro", "Perdita di 333.333 euro", "Guadagno di 2 milioni di euro"] },
    { q: "Un fondo vende 8 milioni di una moneta a cambio 8 per 1 euro, incassando 1 milione di euro. Il cambio sale a 10 monete per euro. Qual è il risultato, senza costi?", ok: "Guadagno di 200.000 euro", no: ["Perdita di 200.000 euro", "Guadagno di 250.000 euro", "Guadagno di 2 milioni di euro"] },
    { q: "Un gestore macro ha ragione sul lungo periodo, ma la moneta su cui punta resta forte per un altro anno. Che cosa può succedere?", ok: "Può perdere e dover chiudere la posizione prima che la sua idea si avveri", no: ["Non può succedere nulla: se l'idea è giusta guadagna comunque", "Il fondo guadagna perché il tempo gioca sempre a favore", "La banca centrale è obbligata a rimborsare la perdita"] },
    { q: "Qual è la differenza tra un fondo macro discrezionale e uno sistematico?", ok: "Il discrezionale decide con il giudizio del gestore, il sistematico segue regole di un modello", no: ["Il discrezionale usa solo valute, il sistematico solo azioni", "Il discrezionale non ha rischi, il sistematico sì", "Il discrezionale opera solo in Italia, il sistematico all'estero"] },
    { q: "Che cosa fa la leva in una posizione macro?", ok: "Ingrandisce la posizione rispetto al capitale e quindi sia i guadagni sia le perdite", no: ["Riduce il rischio perché divide la posizione in più parti", "Garantisce che la posizione non perda più del capitale", "Elimina l'effetto dei tempi sbagliati"] },
    { q: "Un fondo ha 10 milioni di capitale e una posizione macro da 50 milioni (leva 5). La posizione perde il 4%. Quanto perde il fondo in percentuale del suo capitale?", ok: "20%", no: ["4%", "5%", "40%"] },
    { q: "Un gestore macro famoso ha raccontato una serie di scommesse riuscite. Che cosa si può concludere?", ok: "Poco: i racconti di successo non includono chi ha sbagliato, quindi non sono una prova", no: ["Che la strategia macro guadagna sempre", "Che chiunque può ripetere i suoi risultati", "Che le scommesse macro non hanno rischi"] },
    { q: "Quali tre cose devono essere giuste in una scommessa macro perché porti un guadagno?", ok: "La direzione, la misura del movimento e il tempo", no: ["Il nome del Paese, il colore della moneta e il broker", "Solo la direzione: il resto non conta", "La leva, il costo del broker e il numero di notizie"] },
  ],

  // H.02.003 - Event driven
  "h02-event-driven": [
    { q: "Che cosa significa che un fondo è event driven?", ok: "Punta su un fatto preciso che cambia il prezzo di un'azienda, come una fusione o una scissione", no: ["Punta sull'andamento generale dell'economia di un Paese", "Segue solo regole di un modello matematico senza guardare gli eventi", "Compra solo azioni di aziende che pagano dividendi"] },
    { q: "Un'azienda viene offerta a 60 euro per azione e il prezzo di mercato è 57 euro. Quanto vale lo spread?", ok: "3 euro", no: ["57 euro", "60 euro", "117 euro"] },
    { q: "Un'azienda viene offerta a 42 euro per azione e il prezzo di mercato è 40 euro. Quanto vale lo spread in percentuale del prezzo di mercato?", ok: "5%", no: ["2%", "4,8%", "42%"] },
    { q: "Offerta a 60 euro, prezzo di mercato 57 euro. Se l'operazione salta il prezzo scenderebbe a 45 euro. Qual è il rapporto tra perdita possibile e guadagno possibile?", ok: "12 euro di perdita contro 3 di guadagno, cioè 4 a 1", no: ["3 euro di perdita contro 12 di guadagno, cioè 1 a 4", "15 euro di perdita contro 3 di guadagno, cioè 5 a 1", "Uguali: 3 euro contro 3 euro"] },
    { q: "In un'operazione il guadagno possibile è 2 euro e la perdita possibile è 8 euro. Con quale probabilità di successo si va in pari?", ok: "80%", no: ["50%", "25%", "20%"] },
    { q: "In un'operazione il guadagno possibile è 1 euro e la perdita possibile è 9 euro. Con quale probabilità di successo si va in pari?", ok: "90%", no: ["50%", "10%", "11%"] },
    { q: "Guadagno possibile 4 euro, perdita possibile 12 euro, probabilità di successo 90%. Qual è il risultato medio per azione?", ok: "+2,4 euro", no: ["+4 euro", "-1,2 euro", "+3,6 euro"] },
    { q: "Guadagno possibile 3 euro, perdita possibile 6 euro, probabilità di successo 60%. Qual è il risultato medio per azione?", ok: "-0,6 euro", no: ["+1,8 euro", "+0,6 euro", "-2,4 euro"] },
    { q: "Perché lo spread di una fusione non è un guadagno sicuro?", ok: "Perché è il compenso per il rischio che l'operazione non si chiuda", no: ["Perché è una tassa che si paga all'azienda compratrice", "Perché cambia ogni giorno in modo casuale senza motivo", "Perché viene sempre azzerato dalle commissioni"] },
    { q: "Quale tra questi è un esempio di evento su cui punta un fondo event driven?", ok: "Una scissione in cui un'azienda si divide in due", no: ["Il colore del logo di un'azienda", "L'apertura di un nuovo conto in banca", "Una variazione dell'ora legale"] },
    { q: "Quale di questi può far saltare un'operazione di fusione?", ok: "Le autorità della concorrenza non la autorizzano", no: ["Il prezzo del caffè al bar vicino alla sede", "Il giorno della settimana dell'annuncio", "Il numero di lettere nel nome delle aziende"] },
    { q: "Da quale prezzo si misurano guadagno e perdita di chi compra un'azienda oggetto di un'offerta?", ok: "Dal prezzo a cui ha comprato", no: ["Dal prezzo offerto dall'azienda compratrice", "Dal prezzo di prima dell'annuncio", "Dal prezzo massimo dell'ultimo anno"] },
    { q: "Perché un fondo event driven tiene molte operazioni insieme, ma questo non elimina il rischio?", ok: "Perché una che salta non basta a rovinare il fondo, ma in un mercato in crisi molte possono saltare insieme", no: ["Perché le operazioni non possono mai saltare insieme", "Perché con molte operazioni il guadagno è garantito", "Perché la legge impone almeno dieci operazioni"] },
  ],

  // H.02.004 - Relative value
  "h02-relative-value": [
    { q: "Che cos'è l'arbitraggio in senso stretto?", ok: "Sfruttare due prezzi diversi per lo stesso bene, bloccando un guadagno senza rischio", no: ["Comprare un'azione sperando che salga", "Scommettere che due titoli simili si allontanino per sempre", "Vendere ciò che si possiede quando il mercato scende"] },
    { q: "L'oro costa 200 a Milano e 203 a Londra. Comprarlo a Milano e venderlo a Londra costa 4 tra commissioni e trasporto. Qual è il risultato?", ok: "-1: la perdita di 1, perché i costi superano la differenza di prezzo", no: ["+3, perché la differenza di prezzo è 3", "+1, perché 4 meno 3 è positivo", "Zero, perché in un arbitraggio non si perde mai"] },
    { q: "L'oro costa 200 a Milano e 203 a Londra. Comprarlo a Milano e venderlo a Londra costa 2 tra commissioni e trasporto. Qual è il risultato?", ok: "+1", no: ["+3", "-1", "+5"] },
    { q: "Si vende allo scoperto un'azione a 30 e si compra un'azione simile a 26. Poi i prezzi diventano 29 e 28. Qual è il risultato per coppia, senza costi?", ok: "+3", no: ["+1", "-3", "+2"] },
    { q: "Si vende allo scoperto un'azione a 50 e si compra un'azione simile a 44. Poi entrambe valgono 47. Qual è il risultato per coppia, senza costi?", ok: "+6", no: ["+3", "0", "+9"] },
    { q: "Si vende allo scoperto un'azione a 20 e si compra un'azione simile a 18. Poi i prezzi diventano 23 e 19. Qual è il risultato per coppia, senza costi?", ok: "-2", no: ["+2", "-3", "-4"] },
    { q: "In una coppia la differenza di prezzo passa da 8 a 3. Qual è il risultato per coppia, senza costi?", ok: "+5", no: ["-5", "+3", "+11"] },
    { q: "In una coppia la differenza di prezzo passa da 3 a 9. Qual è il risultato per coppia, senza costi?", ok: "-6", no: ["+6", "-3", "+12"] },
    { q: "Da che cosa dipende il risultato di una coppia di azioni simili, una comprata e una venduta allo scoperto?", ok: "Da quanto cambia la distanza tra i due prezzi, non da dove va il mercato", no: ["Solo dalla direzione del mercato", "Solo dal prezzo della più cara delle due", "Dal numero di giorni in cui si tengono le posizioni, e basta"] },
    { q: "Il guadagno di una coppia è 4 euro, ma i costi tra commissioni e prestito titoli sono 1,5 euro. Quanto resta?", ok: "2,5 euro", no: ["4 euro", "5,5 euro", "1,5 euro"] },
    { q: "Perché un fondo che fa relative value con molta leva è esposto a un grosso rischio?", ok: "Perché i guadagni per coppia sono piccoli e la leva ingrandisce anche le perdite se la distanza si allarga", no: ["Perché la leva elimina il rischio che la distanza si allarghi", "Perché con la leva la distanza si chiude sempre più in fretta", "Perché la leva è vietata nel relative value"] },
    { q: "Due azioni simili si sono allontanate e non tornano vicine. Quale spiegazione è possibile?", ok: "Il «normale» è cambiato, per esempio una delle due ha un problema reale", no: ["Il mercato sbaglia sempre e prima o poi corregge", "Le azioni simili non possono mai allontanarsi", "È un errore di calcolo dei broker"] },
    { q: "Che cosa è il pairs trading?", ok: "Comprare un titolo e vendere allo scoperto uno simile, puntando sul fatto che la distanza si riduca", no: ["Comprare due titoli identici in due borse diverse nello stesso momento", "Comprare coppie di azioni qualunque senza criterio", "Vendere un titolo allo scoperto e comprarlo identico subito dopo"] },
  ],

  // H.02.005 - Quantitative
  "h02-quantitative": [
    { q: "Che cos'è un fondo quantitativo?", ok: "Un fondo che decide con matematica, dati e regole scritte eseguite da un programma", no: ["Un fondo che investe solo in poche azioni scelte dal gestore", "Un fondo che compra solo quando i giornali sono ottimisti", "Un fondo che non usa mai la vendita allo scoperto"] },
    { q: "Che cos'è un backtest?", ok: "La prova di una regola sui dati del passato per vedere come avrebbe funzionato", no: ["La previsione certa del rendimento futuro", "Il controllo dei conti da parte delle autorità", "La vendita di tutte le posizioni a fine anno"] },
    { q: "Che cos'è l'overfitting?", ok: "Una regola troppo adattata al passato, che funziona sui dati vecchi ma male sul futuro", no: ["Una regola con troppo poche condizioni, che non funziona mai", "Un guadagno che supera tutte le previsioni", "Un errore di battitura nel codice del programma"] },
    { q: "Una regola vince il 53% di 1.000 scommesse indipendenti, +1 per ogni vittoria e -1 per ogni sconfitta. Qual è il risultato atteso?", ok: "+60", no: ["+30", "+530", "+6"] },
    { q: "Una regola vince il 51% di 2.000 scommesse indipendenti, +1 per ogni vittoria e -1 per ogni sconfitta. Qual è il risultato atteso?", ok: "+40", no: ["+20", "+1.020", "+4"] },
    { q: "Una regola vince il 53% di 1.000 scommesse, +1 per vittoria e -1 per sconfitta. Qual è il vantaggio medio per scommessa?", ok: "+0,06", no: ["+0,6", "+0,53", "+0,03"] },
    { q: "Un gestore prova 10 regole casuali e ognuna ha il 5% di probabilità di sembrare brava per sola fortuna. Quanto è probabile che almeno una sembri brava?", ok: "Circa il 40%", no: ["Circa il 5%", "Circa il 50%", "Circa il 10%"] },
    { q: "Perché un fondo quant fa migliaia di piccole scommesse invece di poche grandi?", ok: "Perché con un vantaggio piccolo servono molte prove perché il caso si compensi", no: ["Perché ogni scommessa piccola è sicuramente vincente", "Perché la legge vieta le scommesse grandi", "Perché le scommesse piccole non pagano commissioni"] },
    { q: "Una regola guadagna molto sui dati con cui è stata cercata ma perde sul primo anno nuovo. Che cosa fa pensare?", ok: "Che possa essere overfitting, cioè un caso del passato e non un vantaggio vero", no: ["Che il mercato nuovo sbagli", "Che il backtest fosse corretto e il problema sia solo sfortuna", "Che la regola vada applicata con più capitale"] },
    { q: "Che cosa sono i dati fuori campione?", ok: "Dati che non sono stati usati per cercare la regola e servono a verificarla davvero", no: ["Dati mancanti o errati da cancellare", "Dati che arrivano da un campione di clienti del fondo", "I dati più recenti, che vanno ignorati"] },
    { q: "Perché le posizioni affollate sono un rischio per i fondi quant?", ok: "Perché molti usano idee simili e, se uno deve vendere in fretta, i prezzi si muovono contro anche gli altri", no: ["Perché i prezzi salgono sempre quando molti comprano", "Perché le posizioni affollate sono vietate dalla legge", "Perché un programma non può gestire più di una posizione"] },
    { q: "Che cos'è il look-ahead bias in un backtest?", ok: "Usare nel passato informazioni che allora non erano ancora disponibili", no: ["Guardare solo gli ultimi giorni di dati", "Aumentare la leva dopo un buon risultato", "Fidarsi troppo delle previsioni degli analisti"] },
    { q: "Una regola funziona solo con una media di 37 giorni e smette di funzionare con 35 o 40. Che cosa può indicare?", ok: "Probabile overfitting: la regola è adattata a un valore preciso", no: ["Che la regola è molto robusta", "Che 37 è il valore ideale per tutti i mercati", "Che i dati con 35 e 40 sono sbagliati"] },
  ],

  // H.02.006 - Credit e distressed
  "h02-credit-distressed": [
    { q: "Che cos'è un'obbligazione?", ok: "Un prestito diviso in pezzi: chi la compra presta soldi all'azienda, che promette di restituirli con gli interessi", no: ["Una quota di proprietà dell'azienda con diritto di voto", "Un contratto per comprare un bene a una data futura", "Un'assicurazione contro il fallimento dell'azienda"] },
    { q: "Perché il prezzo di un'obbligazione scende quando l'azienda va in difficoltà?", ok: "Perché aumenta il rischio che non riesca a restituire tutto", no: ["Perché gli interessi vengono pagati due volte", "Perché il valore nominale viene ridotto dalla borsa", "Perché le obbligazioni scendono sempre dopo un anno"] },
    { q: "Un fondo compra a 30 un'obbligazione da 100 di un'azienda in crisi. Il recupero finale è 45. Qual è il risultato in percentuale sul prezzo pagato (interessi ignorati)?", ok: "+50%", no: ["+15%", "+45%", "+30%"] },
    { q: "Un fondo compra a 80 un'obbligazione da 100. Il recupero finale è 60. Qual è il risultato in percentuale sul prezzo pagato (interessi ignorati)?", ok: "-25%", no: ["-20%", "-40%", "-33%"] },
    { q: "Un fondo compra a 40 un'obbligazione da 100. Il recupero finale è 25. Qual è il risultato in percentuale sul prezzo pagato (interessi ignorati)?", ok: "-37,5%", no: ["-15%", "-25%", "-60%"] },
    { q: "Un fondo compra a 20 un'obbligazione da 100. Il recupero finale è 35. Qual è il risultato in percentuale sul prezzo pagato (interessi ignorati)?", ok: "+75%", no: ["+15%", "+35%", "+57%"] },
    { q: "Il mercato ritiene ugualmente probabili un recupero di 70 e uno di 30. Qual è il valore medio atteso dell'obbligazione?", ok: "50", no: ["70", "30", "40"] },
    { q: "Il mercato attribuisce il 40% di probabilità a un recupero di 80 e il 60% a un recupero di 20. Qual è il valore medio atteso?", ok: "44", no: ["50", "32", "56"] },
    { q: "In un fallimento, chi viene pagato per ultimo?", ok: "Gli azionisti", no: ["Le banche con debiti garantiti", "Gli obbligazionisti senza garanzia", "I creditori con un impianto come garanzia"] },
    { q: "Chi viene generalmente pagato per primo in una ristrutturazione?", ok: "I creditori con debiti garantiti da beni", no: ["Gli azionisti", "Gli obbligazionisti subordinati", "Tutti nello stesso momento e nella stessa misura"] },
    { q: "Un'obbligazione di un'azienda in crisi costa molto poco. Perché non è per forza un affare?", ok: "Perché il prezzo basso riflette già il rischio che il mercato vede", no: ["Perché i prezzi bassi non possono mai salire", "Perché il fondo deve pagare una tassa sul prezzo basso", "Perché le obbligazioni in crisi non pagano mai nulla"] },
    { q: "Che cos'è una ristrutturazione dei debiti?", ok: "Un accordo per cambiare le condizioni dei debiti di un'azienda in difficoltà", no: ["La vendita delle azioni dell'azienda alla borsa", "Un aumento dei tassi deciso dalla banca centrale", "La cancellazione dell'azienda dal registro delle imprese senza accordi"] },
    { q: "Perché un fondo distressed può avere difficoltà a vendere in fretta le sue posizioni?", ok: "Perché i debiti di aziende in crisi si scambiano poco e vendere in fretta può costringere ad accettare prezzi molto più bassi", no: ["Perché la borsa chiude durante le crisi", "Perché i debiti in crisi non possono mai essere venduti", "Perché le vendite devono essere approvate dal ministero"] },
  ],

  // H.02.007 - Managed futures
  "h02-managed-futures": [
    { q: "Che cos'è un future?", ok: "Un contratto per comprare o vendere qualcosa a una data futura a un prezzo fissato oggi", no: ["Una quota di proprietà di un'azienda quotata", "Un prestito a breve termine tra banche", "Una previsione scritta da un analista"] },
    { q: "Che cos'è il trend following?", ok: "Una strategia che segue la direzione dei prezzi: compra ciò che sale e vende ciò che scende", no: ["Una strategia che compra solo ciò che è sceso molto", "Una strategia che prevede gli eventi prima che accadano", "Una strategia che non cambia mai le posizioni"] },
    { q: "Una regola di trend following ha successo 5 volte su 10, ogni guadagno vale +3 e ogni perdita -1. Qual è il risultato su 10 tentativi?", ok: "+10", no: ["+5", "+15", "+20"] },
    { q: "Una regola ha successo 2 volte su 10, ogni guadagno vale +6 e ogni perdita -1. Qual è il risultato su 10 tentativi?", ok: "+4", no: ["+12", "-8", "-4"] },
    { q: "Una regola ha successo 3 volte su 10, ogni guadagno vale +2 e ogni perdita -1. Qual è il risultato su 10 tentativi?", ok: "-1", no: ["+6", "+1", "-7"] },
    { q: "Una regola ha successo 4 volte su 10, ogni guadagno vale +2 e ogni perdita -1. Qual è il risultato su 10 tentativi?", ok: "+2", no: ["-2", "+8", "0"] },
    { q: "Una regola ha successo solo 1 volta su 5 e ogni perdita vale -1. Quanto deve valere almeno ogni guadagno per andare in pari?", ok: "4", no: ["2", "5", "1"] },
    { q: "Una regola ha successo solo 1 volta su 4 e ogni perdita vale -1. Quanto deve valere almeno ogni guadagno per andare in pari?", ok: "3", no: ["4", "2", "1"] },
    { q: "Che cos'è il whipsaw per un fondo che segue il trend?", ok: "Una serie di inversioni rapide dei prezzi che causano perdite ripetute", no: ["Un forte trend in una sola direzione che dura mesi", "Una commissione sul prestito dei titoli", "Un limite di legge sulla leva"] },
    { q: "In quale situazione il trend following tende a guadagnare?", ok: "Quando c'è un movimento lungo e netto dei prezzi in una direzione", no: ["Quando i prezzi salgono e scendono in modo casuale ogni giorno", "Quando i mercati sono chiusi", "Quando tutti gli investitori vendono insieme per un solo giorno"] },
    { q: "Perché i costi sono un problema per chi segue il trend?", ok: "Perché ci sono molti ingressi e molte uscite, quindi commissioni e differenze tra prezzo di acquisto e di vendita", no: ["Perché i futures non hanno costi ma i trend sì", "Perché la regola non consente di uscire dalle posizioni", "Perché il costo è fisso e uguale per ogni strategia"] },
    { q: "Che cosa fa una regola semplice basata sulla media degli ultimi 100 giorni?", ok: "Compra se il prezzo è sopra la media e vende allo scoperto o resta fuori se è sotto", no: ["Compra sempre quando il prezzo è sotto la media", "Vende tutto il primo giorno di ogni mese", "Compra solo quando il prezzo sale di 100 euro"] },
    { q: "Un fondo managed futures ha guadagnato nelle crisi passate. Che cosa si può dire per il futuro?", ok: "Non è una garanzia: è successo in alcuni periodi ma può non ripetersi", no: ["Guadagnerà in ogni crisi futura", "Perderà sempre nelle crisi", "Il guadagno è obbligatorio per legge"] },
  ],

  // H.02.008 - Multi-strategy
  "h02-multi-strategy": [
    { q: "Che cos'è un pod in un fondo multi-strategy?", ok: "Una squadra con capitale assegnato, una strategia e un limite di perdita", no: ["Un investitore che ha più del 10% del fondo", "Un tipo di contratto sui derivati", "Un ufficio che si occupa solo di pubblicità"] },
    { q: "Quattro pod da 100 milioni ciascuno chiudono a +8, -4, +2 e -2 milioni. Qual è il risultato del fondo sul capitale totale?", ok: "+1%", no: ["+4%", "+2%", "+8%"] },
    { q: "Cinque pod da 200 milioni ciascuno chiudono a +10, -20, +30, 0 e +10 milioni. Qual è il risultato del fondo sul capitale totale?", ok: "+3%", no: ["+30%", "+6%", "+1,5%"] },
    { q: "Tre pod da 100 milioni ciascuno chiudono a -3, -1 e +7 milioni. Qual è il risultato del fondo sul capitale totale?", ok: "+1%", no: ["+3%", "+7%", "+0,3%"] },
    { q: "Un pod ha 200 milioni e un limite di perdita del 4%. A quanti milioni di perdita il fondo lo ferma o gli toglie capitale?", ok: "8 milioni", no: ["4 milioni", "40 milioni", "16 milioni"] },
    { q: "Un pod ha 50 milioni e un limite di perdita del 10%. A quanti milioni di perdita viene fermato?", ok: "5 milioni", no: ["10 milioni", "0,5 milioni", "45 milioni"] },
    { q: "Un fondo da 400 milioni affida tutto il capitale a una sola squadra, che perde il 3%. Quanto perde il fondo?", ok: "12 milioni", no: ["3 milioni", "1,2 milioni", "120 milioni"] },
    { q: "Perché nelle crisi la diversificazione tra pod può funzionare meno?", ok: "Perché molte strategie diverse possono perdere nello stesso momento", no: ["Perché nelle crisi i pod vengono chiusi per legge", "Perché i limiti di perdita sono vietati durante le crisi", "Perché le strategie diverse diventano tutte identiche per definizione"] },
    { q: "Che cosa fa il controllo centrale del rischio in un multi-strategy?", ok: "Guarda tutti i pod insieme, controlla i limiti e può ridurre o togliere capitale", no: ["Sceglie ogni singola operazione di ogni pod", "Garantisce che nessun pod possa perdere", "Si occupa solo della contabilità dei dipendenti"] },
    { q: "Perché i fondi multi-strategy possono costare di più agli investitori?", ok: "Perché ogni squadra, i dati e i controlli costano, e una parte di questi costi può essere addebitata agli investitori", no: ["Perché per legge devono pagare più tasse", "Perché non usano mai commissioni di performance", "Perché ogni investitore deve versare un deposito segreto"] },
    { q: "Che effetto ha la leva su un fondo che somma tanti piccoli guadagni di più strategie?", ok: "Rende visibili i guadagni piccoli ma ingrandisce anche le perdite quando arrivano", no: ["Riduce sempre le perdite", "Elimina il rischio delle crisi", "Non ha alcun effetto sui risultati"] },
    { q: "Perché possono essere un rischio le posizioni affollate tra pod e fondi diversi?", ok: "Perché se tutti hanno la stessa idea e devono vendere in fretta, i prezzi si muovono contro tutti", no: ["Perché le posizioni affollate guadagnano sempre di più", "Perché il fondo non può avere più di un pod", "Perché le posizioni affollate sono vietate dai broker"] },
    { q: "Un pod perde fino al suo limite. Che cosa succede in un fondo multi-strategy ben gestito?", ok: "Il fondo riduce o toglie il capitale a quel pod per evitare perdite maggiori", no: ["Il fondo raddoppia il capitale per recuperare subito", "Il fondo nasconde la perdita agli altri pod", "Nulla: i limiti servono solo a fare scena"] },
  ],
};
