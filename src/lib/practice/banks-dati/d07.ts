import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D7 (Analista di dati). Una chiave per lezione: "d07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const D07_ITEMS: Record<string, BankItem[]> = {
  // D.07.001 Scegliere il grafico giusto
  "d07-grafici": [
    { q: "Vuoi mostrare come cambiano gli abbonati mese per mese in un anno. Quale grafico scegli?", ok: "Un grafico a linee", no: ["Una torta", "Una dispersione (scatter)", "Un istogramma"] },
    { q: "Vuoi confrontare il fatturato di cinque negozi in un solo mese. Quale grafico scegli?", ok: "Un grafico a barre", no: ["Una linea che unisce i cinque negozi", "Una torta in 3D", "Una dispersione (scatter)"] },
    { q: "Vuoi capire se chi studia più ore prende voti più alti. Quale grafico scegli?", ok: "Una dispersione: un punto per studente, ore sull'asse x e voto sull'asse y", no: ["Una torta con una fetta per studente", "Barre impilate per mese", "Una linea con i mesi sull'asse x"] },
    { q: "Hai 500 tempi di consegna e vuoi vedere quanti stanno tra 1 e 2 giorni, tra 3 e 4 giorni e così via. Quale grafico scegli?", ok: "Un istogramma", no: ["Una torta", "Un grafico a linee nel tempo", "Una dispersione senza assi"] },
    { q: "Vuoi mostrare quanta parte del traffico di un sito arriva da tre fonti (ricerca, social, link diretti). Quale scelta è sensata?", ok: "Una torta o una barra impilata, perché le parti sommano a un totale", no: ["Una dispersione", "Un istogramma", "Un grafico a linee, una linea per ogni fonte senza ordine nel tempo"] },
    { q: "La domanda è «Le vendite stanno salendo o scendendo?». A quale famiglia di grafici appartiene?", ok: "Tendenza nel tempo", no: ["Composizione", "Distribuzione", "Relazione tra due misure"] },
    { q: "La domanda è «Quanto pesano i resi sul totale delle vendite?». A quale famiglia di grafici appartiene?", ok: "Composizione: una parte rispetto al tutto", no: ["Tendenza nel tempo", "Relazione tra due misure", "Distribuzione dei valori"] },
    { q: "La domanda è «Gli scontrini sono quasi tutti piccoli o ce ne sono di enormi?». A quale famiglia di grafici appartiene?", ok: "Distribuzione: come si spargono i valori", no: ["Composizione", "Tendenza nel tempo", "Confronto tra categorie"] },
    { q: "Qual è il primo passo giusto per scegliere un grafico?", ok: "Capire la domanda a cui il grafico deve rispondere", no: ["Scegliere il tipo che sembra più bello", "Scegliere i colori", "Provare tutti i tipi dello strumento e tenere il più vistoso"] },
    { q: "Hai altezza e peso di 40 persone e vuoi vedere se vanno insieme. Quale grafico scegli?", ok: "Una dispersione (scatter)", no: ["Una torta", "Una linea che unisce le persone in ordine alfabetico", "Una barra impilata"] },
    { q: "Perché una torta con 12 fette è una scelta debole?", ok: "L'occhio non riesce a confrontare tante fette piccole: con molte categorie le barre ordinate sono più chiare", no: ["Le torte non possono mostrare percentuali", "Le torte accettano al massimo dieci fette per regola del programma", "Le torte vanno usate solo per importi in euro"] },
    { q: "Un grafico a linee unisce le vendite di 4 città, che non hanno un ordine naturale. Cosa c'è che non va?", ok: "La linea suggerisce un andamento tra una città e l'altra che non esiste: servono barre", no: ["Le linee non si possono usare con i numeri", "Mancano i colori", "Le città vanno scritte in maiuscolo"] },
    { q: "Hai le vendite di 24 mesi di un solo prodotto. Quale scelta mostra meglio la forma dell'andamento?", ok: "Una linea, perché con tanti punti ordinati nel tempo la pendenza si legge subito", no: ["Una torta con 24 fette", "Un istogramma, perché i mesi sono tanti", "Una dispersione senza assi"] },
  ],

  // D.07.002 Barre, linee e torte
  "d07-barre-linee-torte": [
    { q: "Un grafico a barre ha l'asse verticale che parte da 40 invece che da 0. Qual è il difetto?", ok: "Le differenze tra le barre sembrano molto più grandi di quelle reali", no: ["Le barre diventano più difficili da colorare", "Non è un difetto: l'asse può partire dove si vuole", "I valori vengono arrotondati dal programma"] },
    { q: "Perché le barre devono partire da zero?", ok: "Perché la lunghezza della barra rappresenta il valore: se si taglia la base, il rapporto tra le barre cambia", no: ["Perché lo zero è il numero più importante", "Perché altrimenti lo strumento non disegna la barra", "Perché sull'asse non ci starebbero le etichette"] },
    { q: "Un grafico ha 8 barre verticali in ordine casuale con nomi di reparto molto lunghi. Qual è il miglioramento più utile?", ok: "Barre orizzontali, ordinate dal valore più alto al più basso", no: ["Aggiungere un effetto 3D alle barre", "Usare un colore diverso per ogni barra", "Trasformare tutto in una torta con 8 fette"] },
    { q: "Una linea mostra la temperatura corporea di un paziente tra 36 e 40 gradi. Partire da 36 sull'asse è accettabile?", ok: "Sì: in una linea conta la variazione, lo zero non ha qui un senso fisico utile, e l'asse resta ben etichettato", no: ["No, ogni grafico deve sempre partire da zero", "Sì, ma solo se si nascondono i numeri dell'asse", "No, perché le linee non si possono usare per le temperature"] },
    { q: "Quante fette conviene mettere al massimo in una torta?", ok: "Poche: di solito non più di cinque o sei", no: ["Almeno dieci, per essere precisi", "Tante, purché ognuna abbia un colore diverso", "Il numero non conta se c'è la legenda"] },
    { q: "Quattro fette di una torta valgono 27%, 25%, 24% e 24%. Perché la torta non è la scelta migliore?", ok: "Le fette sono quasi uguali e l'occhio non le distingue: barre ordinate mostrano la differenza", no: ["La somma non fa 100%", "Le torte non possono avere quattro fette", "Le percentuali nelle torte vanno scritte in decimali"] },
    { q: "Quale di questi dati NON ha senso mettere in una torta?", ok: "La temperatura massima di cinque città", no: ["Come si divide in categorie la spesa mensile di una famiglia", "Le quote di mercato di tre aziende che insieme coprono tutto il mercato", "La provenienza degli iscritti da tre regioni, sul totale degli iscritti"] },
    { q: "Perché un grafico a linee è adatto ai mesi dell'anno?", ok: "La linea collega punti ordinati nel tempo e fa vedere la pendenza, cioè la tendenza", no: ["Perché la linea è sempre più precisa di una barra", "Perché i mesi sono sempre dodici", "Perché la linea parte sempre da zero"] },
    { q: "Quale uso delle linee è un errore?", ok: "Unire con una linea l'altezza di cinque amici messi in ordine alfabetico", no: ["Unire con una linea gli abbonati di ogni mese", "Unire con una linea la temperatura di ogni ora del giorno", "Unire con una linea le vendite di ogni anno dal 2015 al 2024"] },
    { q: "Qual è il limite principale delle barre impilate quando i segmenti sono molti?", ok: "Solo il segmento alla base parte da zero: gli altri si confrontano male perché hanno basi diverse", no: ["Non possono mostrare valori positivi", "Non si possono colorare", "Mostrano solo il totale, mai le parti"] },
    { q: "Quando conviene usare barre orizzontali invece che verticali?", ok: "Quando le etichette delle categorie sono lunghe", no: ["Quando i valori sono negativi per forza", "Quando si vuole mostrare il tempo", "Mai: le barre verticali sono sempre migliori"] },
    { q: "Le barre vanno ordinate per valore, ma per quale tipo di categorie c'è un'eccezione?", ok: "Per quelle con un ordine naturale, come i mesi o le fasce di età", no: ["Per i nomi dei prodotti", "Per i nomi delle città", "Per le categorie con valori molto alti"] },
    { q: "Un grafico a linee ha otto linee dello stesso spessore e con colori vivaci. Come lo migliori?", ok: "Metti in grigio quasi tutte le linee ed evidenzia con un colore quella che conta", no: ["Aggiungi altre linee per dare più contesto", "Rendi tutte le linee più spesse", "Trasformalo in una torta con otto fette"] },
  ],

  // D.07.003 I colori
  "d07-colori": [
    { q: "Mostri la differenza di voto di ogni classe rispetto alla media (da -3 a +3, con lo zero al centro). Quale palette scegli?", ok: "Divergente: due colori che partono dal centro neutro", no: ["Sequenziale: un solo colore da chiaro a scuro", "Categorica: un colore diverso per ogni classe", "Arcobaleno, per rendere i dati più vivaci"] },
    { q: "Colori le province in base alla densità di popolazione, da poca a tanta. Quale palette scegli?", ok: "Sequenziale: un colore da chiaro a scuro", no: ["Categorica con colori molto diversi", "Divergente con rosso e verde", "Una palette casuale"] },
    { q: "Hai quattro tipi di prodotto senza un ordine tra loro. Quale palette usi?", ok: "Categorica: un colore distinto per ogni tipo", no: ["Sequenziale: dal più chiaro al più scuro", "Divergente con il centro neutro", "Un solo colore per tutti"] },
    { q: "Quante categorie, al massimo, si riescono a distinguere bene con colori diversi in un grafico?", ok: "Circa cinque-sette", no: ["Almeno venti", "Una sola", "Il numero non conta se i colori sono vivaci"] },
    { q: "Cosa conviene evitare per chi ha il daltonismo rosso-verde?", ok: "Distinguere due categorie usando soltanto rosso e verde", no: ["Usare blu e arancione insieme", "Scrivere le etichette direttamente sul grafico", "Usare colori con luminosità molto diverse"] },
    { q: "Oltre al colore, cosa aiuta chi non distingue bene i colori?", ok: "Etichette dirette, forme diverse o tratteggi", no: ["Colori ancora più saturi", "Sfondi scuri", "Togliere la legenda"] },
    { q: "Un grafico ha dieci barre grigie e una arancione. Qual è lo scopo?", ok: "Portare subito l'occhio sulla barra che conta di più", no: ["Mostrare che l'arancione è il valore più basso", "Indicare che le barre grigie sono errori", "Rendere il grafico più colorato"] },
    { q: "Il testo grigio chiaro su sfondo bianco in un grafico: qual è il problema?", ok: "Il contrasto è troppo basso: si legge male, soprattutto da schermi o proiettori deboli", no: ["Il grigio non si può stampare", "Il testo non cambia nulla per la lettura", "Il bianco rende i numeri sbagliati"] },
    { q: "Perché la scala arcobaleno è sconsigliata per dati continui?", ok: "Non ha un ordine chiaro da chiaro a scuro: l'occhio vede confini che nei dati non ci sono", no: ["Usa troppi pochi colori", "Non si può mai stampare", "È accettata solo per le mappe"] },
    { q: "In matplotlib, quale nome di colormap è divergente?", ok: "'RdBu'", no: ["'Blues'", "'Greys'", "'tab10'"] },
    { q: "In matplotlib, quale nome di colormap è pensato per categorie senza ordine?", ok: "'tab10'", no: ["'Blues'", "'RdBu'", "'Greys'"] },
    { q: "Un'azienda usa il rosso per i valori buoni e il verde per quelli cattivi. Perché è rischioso?", ok: "Rosso e verde hanno già un significato diffuso (pericolo e via libera): invertirli confonde chi legge", no: ["Perché il rosso costa di più da stampare", "Perché il verde è un colore sequenziale", "Perché i grafici accettano un solo colore caldo"] },
    { q: "Circa quanti uomini hanno una forma di daltonismo?", ok: "Circa 1 su 12", no: ["Circa 1 su 1000", "Circa 1 su 3", "Circa 1 su 100"] },
  ],

  // D.07.004 I grafici che ingannano
  "d07-ingannevoli": [
    { q: "Due barre valgono 98 e 100, ma l'asse parte da 96. Quanto sembra alta la seconda barra rispetto alla prima?", ok: "Il doppio", no: ["Uguale", "Il 2% in più", "Il 4% in più"] },
    { q: "Qual è l'aumento reale da 98 a 100?", ok: "Circa il 2%", no: ["Il 100%", "Il 50%", "Il 4%"] },
    { q: "Un grafico con doppio asse mette sulla stessa figura i gelati venduti e gli annegamenti, con scale scelte perché le linee si sovrappongano. Qual è l'inganno?", ok: "Le scale scelte fanno sembrare un legame diretto, ma entrambi dipendono dall'estate", no: ["I gelati causano gli annegamenti", "I due assi non si possono mai usare", "Il grafico è corretto perché le linee coincidono"] },
    { q: "Perché una torta in 3D inganna?", ok: "La fetta davanti sembra più grande di quella dietro per via della prospettiva, anche se vale lo stesso", no: ["Perché le fette in 3D sommano più di 100%", "Perché il 3D cambia i numeri nei dati", "Perché non si possono colorare le fette"] },
    { q: "Per mostrare un valore doppio, un grafico disegna un cerchio con il raggio doppio. Quante volte è più grande l'area?", ok: "4 volte", no: ["2 volte", "3 volte", "8 volte"] },
    { q: "Le vendite sono 140 a gennaio, 118 a giugno e 158 a dicembre. Un grafico mostra solo da giugno a dicembre con il titolo «+34%». Qual è il problema?", ok: "Ha scelto il periodo che dà l'effetto più forte: su tutto l'anno la crescita è circa 13%", no: ["Il 34% è calcolato male: da 118 a 158 non si cresce del 34%", "Un grafico non può mostrare solo sei mesi", "In realtà su tutto l'anno le vendite sono scese"] },
    { q: "Come si corregge un grafico a barre con l'asse tagliato?", ok: "Facendo partire l'asse da zero", no: ["Togliendo i numeri dall'asse", "Colorando le barre di rosso", "Aggiungendo un effetto 3D"] },
    { q: "Sull'asse del tempo gli anni 1990, 2000 e 2020 sono messi a distanze uguali. Cosa causa?", ok: "La pendenza della linea è falsata: il periodo più lungo sembra avere la stessa durata di uno più corto", no: ["Niente: gli anni vanno sempre a distanza uguale", "I valori vengono ricalcolati dal programma", "La linea diventa più precisa"] },
    { q: "Una torta ha tre fette con 50%, 45% e 35%. Che problema ha?", ok: "Le parti sommano a 130%: non rappresentano un intero", no: ["Ha troppe poche fette", "Le fette non sono colorate abbastanza", "Nessuno: le torte possono superare il 100%"] },
    { q: "Due linee salgono insieme negli anni. Cosa NON si può concludere solo da questo?", ok: "Che una delle due sia la causa dell'altra", no: ["Che le due misure nello stesso periodo siano aumentate", "Che i dati sono stati raccolti nello stesso periodo", "Che esiste una somiglianza tra le due curve"] },
    { q: "Un grafico non ha unità di misura sull'asse né la fonte dei dati. Che cosa manca per fidarsi?", ok: "Non si sa cosa è misurato né da dove vengono i dati: unità e fonte vanno dichiarate", no: ["Niente: basta che il grafico sia pulito", "Serve solo un titolo più lungo", "Serve un effetto 3D per renderlo credibile"] },
    { q: "Quale controllo aiuta di più a smascherare un grafico sospetto?", ok: "Leggere da dove parte l'asse, la scala, il periodo e la fonte", no: ["Contare quanti colori usa", "Guardare se il titolo è in grassetto", "Controllare la dimensione dell'immagine"] },
    { q: "Un grafico mostra gli incidenti totali di due paesi, ma uno ha una popolazione 10 volte più grande. Come lo correggi?", ok: "Mostrando un tasso, per esempio incidenti ogni 100.000 abitanti", no: ["Ingrandendo il paese più piccolo", "Mettendo l'asse in scala logaritmica senza dirlo", "Togliendo il nome dei paesi"] },
  ],

  // D.07.005 Raccontare con i dati
  "d07-storia": [
    { q: "Quale titolo per un grafico delle vendite dice già la conclusione?", ok: "Le vendite online sono raddoppiate in un anno, quelle dei negozi no", no: ["Vendite per canale", "Grafico delle vendite 2023-2024", "Dati di vendita"] },
    { q: "Quali sono le tre mosse di una storia con i dati?", ok: "Contesto, scoperta, azione", no: ["Titolo, grafico, firma", "Tabella, formula, risultato", "Introduzione, ripetizione, saluto"] },
    { q: "Che cos'è un'annotazione in un grafico?", ok: "Un breve testo o una freccia che segna un punto importante", no: ["Un secondo asse con unità diverse", "Una colonna nascosta nei dati", "Una legenda con tutti i colori"] },
    { q: "Presenti a un direttore che ha mezzo minuto. Cosa metti per primo?", ok: "La conclusione e l'azione che proponi", no: ["Il codice usato per il grafico", "Tutta la storia dei dati raccolti", "La spiegazione di come funziona lo strumento"] },
    { q: "Come guidi l'occhio verso la serie che conta in un grafico con sei linee?", ok: "Metti in grigio le altre e usa un colore solo per quella", no: ["Dai a ogni linea un colore diverso e vivace", "Metti tutte le linee dello stesso spessore e colore", "Aggiungi un effetto 3D alla linea importante"] },
    { q: "Un grafico ha otto annotazioni. È un buon grafico?", ok: "No: troppe annotazioni nascondono quella che conta, meglio tenerne una o due", no: ["Sì, più testo c'è, più si capisce", "Sì, purché siano tutte dello stesso colore", "Sì, le annotazioni non disturbano mai"] },
    { q: "Quale frase chiude bene una storia di dati?", ok: "Proponiamo di spostare il 20% del budget sui canali online entro marzo", no: ["Come si vede, i dati sono interessanti", "Ulteriori analisi saranno necessarie in futuro", "Il grafico mostra molte cose"] },
    { q: "Cosa serve nella prima mossa, il contesto?", ok: "Da dove partiamo: la situazione, l'obiettivo e perché interessa a chi ascolta", no: ["La conclusione finale", "Tutti i grafici in una volta", "I dettagli del codice"] },
    { q: "Cosa deve fare la seconda mossa, la scoperta?", ok: "Mostrare il dato o il cambiamento sorprendente che spiega il problema", no: ["Ripetere il contesto con parole diverse", "Elencare tutte le tabelle del database", "Proporre il prossimo budget"] },
    { q: "Per raccontare bene bisogna nascondere i dati che non convengono?", ok: "No: si sceglie cosa mettere in evidenza, ma senza nascondere o distorcere i dati", no: ["Sì, la storia deve essere pulita", "Sì, se il pubblico è importante", "Solo se i dati sono pochi"] },
    { q: "Perché un titolo con la conclusione è meglio di uno puramente descrittivo?", ok: "Chi guarda capisce subito cosa deve notare nel grafico", no: ["Perché è più corto", "Perché i grafici devono sempre avere una frase con un verbo", "Perché evita di dover mettere gli assi"] },
    { q: "Un grafico mostra solo che prezzo e vendite si muovono insieme, ma il titolo dice «Il prezzo alto causa il calo delle vendite». Qual è il problema?", ok: "Il titolo afferma più di quanto i dati dimostrano: si vede una relazione, non una causa", no: ["Il titolo è troppo corto", "Un titolo non può contenere la parola «causa»", "Non c'è nessun problema: se si muovono insieme una causa l'altra"] },
    { q: "Quali elementi conviene togliere per rendere un grafico più leggibile?", ok: "Griglie pesanti, bordi e legende ripetute che non aiutano a leggere", no: ["Il titolo e le unità di misura", "I dati più importanti", "Le etichette degli assi"] },
  ],

  // D.07.006 Le dashboard
  "d07-dashboard": [
    { q: "Qual è il primo passo per costruire una dashboard?", ok: "Capire l'obiettivo e chi la userà per decidere cosa", no: ["Scegliere i colori del tema", "Aggiungere tutti i grafici possibili", "Scegliere lo strumento più costoso"] },
    { q: "Quante metriche principali conviene mettere in una schermata?", ok: "Poche: quelle che servono a prendere una decisione, di solito cinque o sei", no: ["Almeno venti, per non perdere nulla", "Una sola per forza, sempre", "Il numero non conta se i grafici sono belli"] },
    { q: "Dove conviene mettere la metrica più importante?", ok: "In alto a sinistra, dove l'occhio comincia a leggere", no: ["In basso a destra, in piccolo", "Nascosta in una pagina secondaria", "Nel centro, in mezzo agli altri grafici uguali"] },
    { q: "A cosa serve un filtro in una dashboard?", ok: "A restringere i dati (periodo, reparto, area) senza creare un'altra dashboard", no: ["A cancellare i dati dal database", "A cambiare il colore dei grafici", "A trasformare i dati in un file di testo"] },
    { q: "Una dashboard ha 25 grafici e nessuno sa cosa guardare. Come la migliori?", ok: "Tieni le cinque o sei metriche chiave in prima pagina e sposta il resto in una pagina di dettaglio", no: ["Aggiungi altri cinque grafici per spiegare i primi", "Riduci le dimensioni dei grafici per farli stare tutti", "Cambia il tema da chiaro a scuro"] },
    { q: "Una scheda mostra solo «Vendite: 52.000». Cosa manca per capire se va bene?", ok: "Un confronto con l'obiettivo o con il periodo precedente", no: ["Un colore più vistoso", "Un effetto 3D", "Un secondo numero uguale al primo"] },
    { q: "Cosa significa gerarchia visiva?", ok: "Grandezza, colore e posizione guidano l'occhio dalle cose più importanti alle meno importanti", no: ["Mettere i grafici in ordine alfabetico", "Dare a ogni grafico la stessa dimensione", "Usare lo stesso colore per tutto"] },
    { q: "Un direttore ha due minuti. Cosa dovrebbe vedere subito nella dashboard?", ok: "I numeri chiave con il confronto e gli eventuali allarmi; i dettagli solo se li chiede", no: ["Tutte le tabelle grezze", "Il codice delle query", "Venti filtri da impostare prima di vedere qualcosa"] },
    { q: "Una dashboard usa rosso e verde su quasi tutti gli elementi. Qual è il problema?", ok: "L'enfasi perde valore: se tutto è colorato, non si capisce cosa richiede attenzione", no: ["I colori sono vietati nelle dashboard", "Il rosso e il verde non si vedono sugli schermi", "Le dashboard devono usare solo il nero"] },
    { q: "Una dashboard mostra dati vecchi di tre mesi senza alcuna data di aggiornamento. Qual è il problema?", ok: "Chi la legge crede che siano dati attuali: va indicata la data dell'ultimo aggiornamento", no: ["Nessuno: i dati vecchi sono sempre più sicuri", "Serve solo cambiare il titolo", "Serve un grafico a torta in più"] },
    { q: "Un grafico della dashboard mostra l'ultimo mese e un altro l'ultimo anno, senza dirlo. Cosa succede?", ok: "Chi legge li confronta credendoli dello stesso periodo: il periodo va scritto su ogni grafico", no: ["Niente: gli strumenti li allineano da soli", "I numeri diventano uguali", "Il filtro li cancella"] },
    { q: "L'obiettivo è ridurre i resi. Quale numero metti in primo piano?", ok: "La percentuale di resi sugli ordini, con la tendenza nel tempo", no: ["Il numero totale di clienti iscritti", "Le visite al sito", "Il fatturato totale"] },
    { q: "Qual è una differenza tra una dashboard e un report?", ok: "La dashboard dà un colpo d'occhio sugli indicatori e si aggiorna; il report spiega in modo più lungo e dettagliato", no: ["La dashboard non usa mai grafici", "Il report si aggiorna da solo ogni minuto", "Sono la stessa cosa con nomi diversi"] },
  ],

  // D.07.007 Gli strumenti
  "d07-strumenti": [
    { q: "Cosa disegna questo codice? `plt.bar(['A', 'B'], [3, 5])`", ok: "Due barre: B più alta di A", no: ["Una linea con due punti", "Due barre alte uguali", "Una torta con due fette"] },
    { q: "Quale riga mette un titolo a un grafico matplotlib?", ok: "`plt.title('Vendite')`", no: ["`plt.name('Vendite')`", "`plt.header('Vendite')`", "`plt.label('Vendite')`"] },
    { q: "Quale riga mostra il grafico a schermo in matplotlib?", ok: "`plt.show()`", no: ["`plt.display_chart()`", "`plt.print()`", "`plt.draw_all()`"] },
    { q: "Qual è il modo comune di importare matplotlib per disegnare i grafici?", ok: "`import matplotlib.pyplot as plt`", no: ["`import pyplot.matplotlib as plt`", "`from plt import matplotlib`", "`import plt from matplotlib`"] },
    { q: "Quale riga fa partire l'asse verticale da 0 fino a 35?", ok: "`plt.ylim(0, 35)`", no: ["`plt.y(0, 35)`", "`plt.axis_y(35)`", "`plt.ymax(0, 35)`"] },
    { q: "Quale riga salva il grafico in un file immagine?", ok: "`plt.savefig('grafico.png')`", no: ["`plt.save_png('grafico.png')`", "`plt.export('grafico.png')`", "`plt.write('grafico.png')`"] },
    { q: "Che rapporto c'è tra seaborn e matplotlib?", ok: "Seaborn si appoggia a matplotlib e rende più brevi i grafici statistici", no: ["Seaborn sostituisce matplotlib e lo rende inutile", "Seaborn funziona solo con Excel", "Sono due nomi dello stesso programma"] },
    { q: "Quale di questi strumenti ha una versione open source che puoi installare da solo?", ok: "Metabase", no: ["Tableau", "Power BI", "Excel"] },
    { q: "Vuoi fare un report gratuito collegato a un Foglio Google. Quale strumento scegli?", ok: "Looker Studio", no: ["Tableau Server", "Power BI Premium", "seaborn"] },
    { q: "Quando ha più senso matplotlib rispetto a Power BI?", ok: "Quando l'analisi è già in Python e vuoi un grafico riproducibile dal codice", no: ["Quando non sai programmare", "Quando vuoi trascinare i campi con il mouse", "Quando devi condividere una dashboard con filtri a molti colleghi"] },
    { q: "Cosa disegna questo codice? `plt.plot([1, 2, 3], [2, 4, 8])`", ok: "Una linea che passa per i punti (1, 2), (2, 4) e (3, 8)", no: ["Tre barre alte 1, 2 e 3", "Una torta con tre fette", "Un solo punto in (3, 8)"] },
    { q: "Cosa succede con questo codice? `plt.bar(['A', 'B', 'C'], [3, 5])`", ok: "Python segnala un errore (ValueError): ci sono tre etichette e solo due valori", no: ["Disegna tre barre e l'ultima è vuota", "Disegna due barre e ignora la C", "Disegna tre barre con altezze 3, 5 e 5"] },
    { q: "Cosa fa questa riga? `plt.xlabel('Mese')`", ok: "Scrive «Mese» come nome dell'asse orizzontale", no: ["Scrive «Mese» come titolo del grafico", "Disegna una barra chiamata Mese", "Cambia il colore dell'asse verticale"] },
    { q: "Come lavorano di solito Power BI e Tableau rispetto a matplotlib?", ok: "Si costruiscono i grafici trascinando i campi con il mouse, senza scrivere codice", no: ["Richiedono di scrivere tutto in Python", "Non possono fare dashboard", "Possono disegnare solo torte"] },
  ],
};
