import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H1 (Hedge fund). Una chiave per lezione: "h01-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Tutti i numeri sono fittizi e ricontrollati a mano.
 */
export const H01_ITEMS: Record<string, BankItem[]> = {
  "h01-definizione": [
    {
      q: "Che cosa vuol dire, in origine, la parola «hedge» nel nome «hedge fund»?",
      ok: "Coprirsi, proteggersi dai rischi (come una siepe)",
      no: ["Guadagnare sempre", "Investire solo in oro", "Prestare soldi alle banche"],
    },
    {
      q: "Chi creò nel 1949 il primo fondo di questo tipo, comprando alcuni titoli e vendendone altri allo scoperto?",
      ok: "Alfred Winslow Jones, giornalista e sociologo",
      no: ["Warren Buffett, banchiere", "Ray Dalio, professore universitario", "Una banca centrale europea"],
    },
    {
      q: "Quale frase descrive meglio un hedge fund?",
      ok: "Un fondo privato che può usare strategie flessibili ed è riservato a investitori selezionati",
      no: [
        "Un fondo pubblico, venduto allo sportello a chiunque, con strategie sempre prudenti",
        "Un conto di risparmio garantito dallo Stato",
        "Una società che promette un rendimento fisso ogni anno",
      ],
    },
    {
      q: "Un amico dice: «Tutti gli hedge fund guadagnano anche quando il mercato scende». Che cosa è vero?",
      ok: "Falso: alcuni perdono, e anche tanto, in qualsiasi fase del mercato",
      no: [
        "Vero: il nome stesso garantisce il guadagno",
        "Vero: la legge obbliga il gestore a non perdere mai",
        "Vero: sono assicurati contro le perdite",
      ],
    },
    {
      q: "Che cos'è una vendita allo scoperto (short), in parole semplici?",
      ok: "Vendere un titolo preso in prestito, sperando di ricomprarlo più tardi a un prezzo più basso",
      no: [
        "Vendere un titolo che si possiede da molti anni",
        "Comprare un titolo e non venderlo mai",
        "Vendere un titolo solo a un amico",
      ],
    },
    {
      q: "Quale di queste è un mito sugli hedge fund?",
      ok: "Che siano tutti uguali e usino tutti la stessa strategia",
      no: [
        "Che chiedano commissioni diverse da quelle dei fondi comuni",
        "Che molti siano riservati a investitori selezionati",
        "Che possano usare strumenti come i derivati",
      ],
    },
    {
      q: "Un fondo si chiama «hedge fund» ma compra soltanto azioni e le tiene, senza coperture né vendite allo scoperto. Che cosa si può dire?",
      ok: "Il nome non garantisce nulla: bisogna leggere che cosa fa davvero il fondo",
      no: [
        "È impossibile: un hedge fund si copre sempre",
        "È illegale chiamarlo così",
        "Allora è sicuramente senza rischi",
      ],
    },
    {
      q: "Quale frase sul rischio è corretta?",
      ok: "Con un hedge fund si può perdere denaro, anche l'intera somma investita",
      no: [
        "Il capitale è sempre garantito se il gestore è bravo",
        "Il rischio c'è solo per chi investe poco",
        "Il rischio sparisce se si investe per più di un anno",
      ],
    },
    {
      q: "Il Sensei dice: «i mercati non regalano niente». Che cosa significa per chi valuta un fondo?",
      ok: "Una promessa di guadagno facile o sicuro è un segnale di allarme",
      no: [
        "Che i fondi più cari rendono sempre di più",
        "Che conviene fidarsi di chi promette di più",
        "Che i guadagni sono garantiti ai più ricchi",
      ],
    },
    {
      q: "Quale di questi strumenti un hedge fund può usare e un fondo comune tradizionale usa molto meno?",
      ok: "Vendite allo scoperto e leva finanziaria",
      no: [
        "Il conto corrente della banca",
        "Le monete da collezione",
        "Solo l'acquisto di titoli di Stato",
      ],
    },
    {
      q: "Questo corso è consulenza finanziaria?",
      ok: "No: è educazione, e nessuna lezione dice che cosa comprare o vendere",
      no: [
        "Sì, indica quali fondi comprare",
        "Sì, ma solo per i fondi esteri",
        "Sì, garantisce un rendimento minimo",
      ],
    },
    {
      q: "Marta legge che un fondo ha «battuto il mercato» in un anno. Qual è la conclusione più prudente?",
      ok: "Un anno solo non basta per giudicare: il risultato può dipendere dalla fortuna",
      no: [
        "Il fondo continuerà sicuramente a battere il mercato",
        "Il gestore non può aver rischiato",
        "Il fondo è garantito per gli anni successivi",
      ],
    },
  ],
  "h01-struttura": [
    {
      q: "Chi sono i tre protagonisti principali nella struttura di un hedge fund?",
      ok: "Il gestore, gli investitori e il veicolo (la società o il fondo che raccoglie i soldi)",
      no: [
        "Il cliente, il notaio e il giornalista",
        "Solo il gestore e lo Stato",
        "La borsa, la banca centrale e il broker online",
      ],
    },
    {
      q: "Che cosa fa il gestore di un hedge fund?",
      ok: "Decide come investire i soldi raccolti, secondo la strategia del fondo",
      no: [
        "Mette tutti i soldi di tasca propria",
        "Garantisce agli investitori che non perderanno",
        "Controlla da solo i propri risultati senza regole",
      ],
    },
    {
      q: "Che cos'è il «veicolo» di un fondo?",
      ok: "La società o la struttura giuridica (per esempio una società di capitali o una partnership) che raccoglie e detiene i soldi",
      no: [
        "Il camion che trasporta i documenti",
        "Il computer che calcola i prezzi",
        "Il contratto di lavoro del gestore",
      ],
    },
    {
      q: "Gli investitori di un fondo, in inglese, si chiamano spesso limited partner. Che cosa mettono in gioco?",
      ok: "Il loro capitale: rischiano al massimo la somma investita, ma non decidono gli acquisti",
      no: [
        "Solo il loro tempo, non soldi",
        "Il capitale e la responsabilità di tutti i debiti del gestore",
        "Niente: pagano soltanto le commissioni",
      ],
    },
    {
      q: "Perché molti gestori investono anche una parte dei propri soldi nel fondo che gestiscono?",
      ok: "Per condividere il rischio con gli investitori: se il fondo perde, perde anche lui",
      no: [
        "Perché la legge vieta di guadagnare altrimenti",
        "Per non pagare le tasse",
        "Per poter garantire il guadagno agli investitori",
      ],
    },
    {
      q: "Il fondo «Alba Capital» ha 100 milioni di euro raccolti da 40 investitori. Chi decide quali titoli comprare?",
      ok: "Il gestore, entro le regole scritte nel regolamento del fondo",
      no: [
        "Gli investitori, votando ogni acquisto",
        "La borsa, che sceglie al loro posto",
        "Il broker, senza ascoltare il gestore",
      ],
    },
    {
      q: "Dove sta, di solito, la differenza di ruolo tra gestore e investitore?",
      ok: "Il gestore prende le decisioni di investimento, l'investitore fornisce il capitale",
      no: [
        "Sono la stessa persona",
        "L'investitore decide, il gestore finanzia",
        "Il gestore mette tutto il capitale e l'investitore incassa",
      ],
    },
    {
      q: "Perché molti fondi hanno sede in Paesi come Lussemburgo, Irlanda o Isole Cayman?",
      ok: "Per ragioni di regole, di fisco e di abitudine del settore: l'investitore deve capire dove e come è regolato",
      no: [
        "Perché lì i mercati non esistono",
        "Perché è obbligatorio per legge in tutto il mondo",
        "Perché così il fondo non può mai perdere",
      ],
    },
    {
      q: "Dove si trovano le regole che dicono che cosa il gestore può fare con i soldi?",
      ok: "Nei documenti del fondo (per esempio il regolamento o il prospetto) che l'investitore deve leggere",
      no: [
        "In un accordo orale tra amici",
        "Non esistono regole: il gestore fa ciò che vuole",
        "Solo nel sito internet della borsa",
      ],
    },
    {
      q: "Un investitore perde l'intera somma versata nel fondo. Che cosa può accadere, in genere, ai suoi altri risparmi?",
      ok: "Restano suoi: ha rischiato solo il capitale investito, se il fondo non prevede altro",
      no: [
        "Vengono presi dal gestore",
        "Vengono sequestrati dalla borsa",
        "Si dimezzano automaticamente",
      ],
    },
    {
      q: "Quale situazione dovrebbe insospettire un investitore?",
      ok: "Un fondo in cui gestore, controlli e conti sono tutti in mano alla stessa persona, senza soggetti esterni",
      no: [
        "Un fondo con un amministratore esterno che controlla i conti",
        "Un fondo con regolamento scritto chiaramente",
        "Un fondo che pubblica rapporti periodici",
      ],
    },
    {
      q: "Se il fondo è il «contenitore» dei soldi, qual è il compito del gestore rispetto al contenitore?",
      ok: "Decidere come usare i soldi contenuti, non possederli",
      no: [
        "Possedere tutti i soldi del contenitore",
        "Impedire agli investitori di uscire sempre",
        "Garantire il valore del contenitore",
      ],
    },
  ],
  "h01-commissioni": [
    {
      q: "Che cosa significa «2 e 20» nelle commissioni di un hedge fund?",
      ok: "2% di commissione di gestione sul capitale e 20% di commissione di performance sul profitto",
      no: [
        "2 anni di attesa e 20 investitori",
        "2% sul profitto e 20% sul capitale",
        "2 euro al giorno e 20 euro al mese",
      ],
    },
    {
      q: "Un fondo gestisce 100 milioni di euro con commissione di gestione del 2%. Quanto incassa in un anno il gestore per questa voce?",
      ok: "2 milioni di euro",
      no: ["200.000 euro", "20 milioni di euro", "200 milioni di euro"],
    },
    {
      q: "Il fondo da 100 milioni guadagna 10 milioni lordi. La commissione di performance è il 20% del profitto, senza soglia. Quanto vale?",
      ok: "2 milioni di euro",
      no: ["10 milioni di euro", "20 milioni di euro", "200.000 euro"],
    },
    {
      q: "Stesso fondo: 100 milioni, profitto lordo di 10 milioni, commissione di gestione del 2% e di performance del 20% sul profitto. Quanto resta agli investitori (convenzione: la performance è calcolata sul profitto lordo)?",
      ok: "6 milioni di euro, cioè il 6% sul capitale",
      no: ["8 milioni di euro", "10 milioni di euro", "4 milioni di euro"],
    },
    {
      q: "Il fondo da 100 milioni perde 10 milioni. Commissione di gestione 2%, performance 20% solo sui profitti. Quanto pagano in totale gli investitori di commissioni e quanto perdono in tutto?",
      ok: "Pagano 2 milioni di commissioni e perdono in tutto 12 milioni",
      no: [
        "Non pagano nulla e perdono 10 milioni",
        "Pagano 4 milioni e perdono 14 milioni",
        "Pagano 2 milioni e perdono 8 milioni",
      ],
    },
    {
      q: "Che cos'è una soglia (hurdle) nella commissione di performance?",
      ok: "Un rendimento minimo da superare: la commissione si calcola solo sulla parte di profitto oltre la soglia",
      no: [
        "Un limite massimo di guadagno per il gestore",
        "Un'imposta pagata allo Stato",
        "Il numero minimo di investitori",
      ],
    },
    {
      q: "Fondo da 100 milioni, profitto lordo 10 milioni, soglia del 5% (5 milioni), performance del 20% solo sulla parte oltre la soglia. Quanto vale la commissione di performance?",
      ok: "1 milione di euro",
      no: ["2 milioni di euro", "500.000 euro", "5 milioni di euro"],
    },
    {
      q: "Con gli stessi dati (soglia 5%, profitto 10 milioni, gestione 2 milioni, performance 1 milione), quanto resta agli investitori?",
      ok: "7 milioni di euro, cioè il 7%",
      no: ["8 milioni di euro", "6 milioni di euro", "5 milioni di euro"],
    },
    {
      q: "Che cos'è il high-water mark (livello massimo raggiunto)?",
      ok: "La regola per cui la performance si paga solo se il valore supera il massimo già raggiunto in precedenza",
      no: [
        "Il livello massimo di commissione permesso dalla legge",
        "Il massimo che un investitore può ritirare",
        "La profondità massima del mare",
      ],
    },
    {
      q: "Perché la commissione di performance può spingere il gestore a prendere più rischi?",
      ok: "Perché se va bene guadagna una quota del profitto, mentre se va male non restituisce le commissioni già incassate",
      no: [
        "Perché la legge lo obbliga a rischiare",
        "Perché non guadagna nulla in nessun caso",
        "Perché paga lui tutte le perdite",
      ],
    },
    {
      q: "Un fondo da 50 milioni ha commissione di gestione del 2%. Quanto vale la commissione in un anno?",
      ok: "1 milione di euro",
      no: ["100.000 euro", "10 milioni di euro", "2 milioni di euro"],
    },
    {
      q: "Fondo da 50 milioni, profitto lordo 5 milioni, performance 20% sul profitto, nessuna soglia. Quanto vale la performance?",
      ok: "1 milione di euro",
      no: ["10 milioni di euro", "500.000 euro", "5 milioni di euro"],
    },
    {
      q: "Quale consiglio è corretto prima di investire in un fondo con commissioni alte?",
      ok: "Calcolare quanto resta al netto delle commissioni e chiedersi se il risultato lo giustifica",
      no: [
        "Guardare solo il rendimento lordo",
        "Ignorare le commissioni perché sono piccole",
        "Pensare che costi alti garantiscano risultati alti",
      ],
    },
  ],
  "h01-confronto": [
    {
      q: "Qual è una differenza tipica tra un fondo comune tradizionale e un hedge fund?",
      ok: "Il fondo comune è aperto al pubblico e ha regole stringenti, l'hedge fund è riservato a investitori selezionati e più flessibile",
      no: [
        "Il fondo comune è riservato ai ricchi, l'hedge fund è per tutti",
        "Il fondo comune non investe in titoli",
        "Non ci sono differenze",
      ],
    },
    {
      q: "Che cos'è un ETF?",
      ok: "Un fondo quotato in borsa che si compra e si vende come un'azione e di solito replica un indice",
      no: [
        "Un fondo privato riservato a chi ha un patrimonio elevato",
        "Un conto di risparmio con rendimento garantito",
        "Un prestito concesso dalle banche",
      ],
    },
    {
      q: "Quale prodotto, in generale, costa meno in commissioni?",
      ok: "Un ETF che replica un indice",
      no: [
        "Un hedge fund con 2 e 20",
        "Sono tutti uguali",
        "Un fondo che chiede performance sul profitto",
      ],
    },
    {
      q: "Quando puoi, di solito, vendere le quote di un ETF?",
      ok: "Durante gli orari di borsa, quasi in qualsiasi giorno di mercato aperto",
      no: [
        "Solo una volta all'anno",
        "Solo con il permesso del gestore",
        "Mai prima di cinque anni",
      ],
    },
    {
      q: "Che cos'è un periodo di lock-up in un hedge fund?",
      ok: "Un periodo iniziale in cui l'investitore non può ritirare i soldi",
      no: [
        "Un blocco dei conti del gestore",
        "La chiusura estiva del fondo",
        "Un controllo della banca centrale",
      ],
    },
    {
      q: "Un fondo comune armonizzato europeo (UCITS) è soggetto a regole su diversificazione e leva più o meno rigide di un hedge fund?",
      ok: "Più rigide: ci sono limiti su quanto si può concentrare e quanta leva si può usare",
      no: [
        "Meno rigide: può fare tutto",
        "Uguali, perché la legge è la stessa",
        "Non ci sono regole",
      ],
    },
    {
      q: "Come deve essere pensato l'obiettivo di un ETF su un indice?",
      ok: "Seguire l'indice, non batterlo",
      no: [
        "Battere sempre l'indice",
        "Garantire un rendimento annuo",
        "Evitare qualsiasi perdita",
      ],
    },
    {
      q: "Quale prodotto permette di uscire più facilmente in qualsiasi momento di borsa aperta?",
      ok: "Un ETF quotato",
      no: [
        "Un hedge fund con lock-up di un anno",
        "Una quota di fondo privato senza mercato",
        "Un investimento immobiliare",
      ],
    },
    {
      q: "Un fondo comune tradizionale spesso calcola il valore delle quote ogni giorno. Un hedge fund?",
      ok: "Spesso lo calcola con meno frequenza, per esempio una volta al mese, e i rimborsi hanno regole e preavvisi",
      no: [
        "Non lo calcola mai",
        "Lo calcola ogni secondo come un ETF",
        "Lo calcola soltanto alla chiusura del fondo",
      ],
    },
    {
      q: "Un amico dice: «Un hedge fund è migliore di un ETF perché costa di più». Che cosa rispondi?",
      ok: "Il costo non dice nulla sulla qualità: va guardato il risultato al netto delle commissioni e il rischio",
      no: [
        "Hai ragione, il prezzo misura sempre la qualità",
        "Costa di più perché non può perdere",
        "Costa di più perché lo garantisce lo Stato",
      ],
    },
    {
      q: "Qual è il principale vantaggio di un ETF per un principiante, rispetto a molti prodotti più complessi?",
      ok: "Costi bassi, trasparenza su che cosa contiene e possibilità di vendere in borsa",
      no: [
        "Rendimento garantito",
        "Zero rischio di perdita",
        "Accesso a segreti di mercato",
      ],
    },
    {
      q: "Quale di questi non è un tratto tipico di un hedge fund?",
      ok: "Essere venduto allo sportello a tutti, con liquidità giornaliera garantita",
      no: [
        "Poter usare la leva",
        "Avere commissioni di performance",
        "Avere periodi di blocco dei rimborsi",
      ],
    },
  ],
  "h01-investitori": [
    {
      q: "Perché molti hedge fund sono riservati a investitori qualificati o professionali?",
      ok: "Perché sono prodotti complessi e rischiosi: la regola presume che questi investitori sappiano valutarli e sopportare perdite",
      no: [
        "Perché solo i ricchi hanno diritto ai guadagni",
        "Perché i piccoli risparmiatori non possono mai perdere",
        "Perché lo Stato garantisce i ricchi",
      ],
    },
    {
      q: "Negli Stati Uniti, che cos'è un «accredited investor» in sintesi?",
      ok: "Una persona (o un ente) che rispetta soglie di reddito o di patrimonio fissate dalla legge",
      no: [
        "Chiunque abbia un conto in banca",
        "Chi lavora in borsa",
        "Chi ha già investito in un fondo",
      ],
    },
    {
      q: "In sintesi (controlla le fonti ufficiali, ottobre 2026), quale soglia per le persone fisiche usa la regola americana sul patrimonio?",
      ok: "Un patrimonio netto sopra 1 milione di dollari, senza contare la casa dove si abita",
      no: [
        "Un patrimonio di 10.000 dollari",
        "Un patrimonio di 100 milioni di dollari",
        "Qualsiasi patrimonio, purché in contanti",
      ],
    },
    {
      q: "Nell'Unione europea, la direttiva MiFID II distingue i clienti in quali grandi categorie?",
      ok: "Al dettaglio, professionali e controparti qualificate",
      no: [
        "Giovani, adulti e anziani",
        "Italiani, francesi e tedeschi",
        "Veloci, lenti e medi",
      ],
    },
    {
      q: "Quale di questi investitori è, per sua natura, tipicamente un investitore istituzionale?",
      ok: "Un fondo pensione",
      no: [
        "Uno studente con una paghetta",
        "Un conto di risparmio di un bambino",
        "Un amico che compra azioni per gioco",
      ],
    },
    {
      q: "Un sito ti scrive: «Entra nel nostro fondo esclusivo, rendimento garantito del 30%, basta un bonifico oggi». Che cosa è più prudente fare?",
      ok: "Diffidare: rendimenti garantiti e fretta sono segnali di truffa, e va verificato l'intermediario sui siti ufficiali (Consob, Banca d'Italia)",
      no: [
        "Versare subito, per non perdere l'occasione",
        "Fidarsi, perché il sito dice «esclusivo»",
        "Chiedere ai conoscenti e versare se sono d'accordo",
      ],
    },
    {
      q: "Essere un investitore qualificato elimina il rischio di perdita?",
      ok: "No: la qualifica è solo un requisito d'accesso, il rischio resta",
      no: [
        "Sì, lo Stato garantisce i qualificati",
        "Sì, per i primi cinque anni",
        "Sì, ma solo nei fondi esteri",
      ],
    },
    {
      q: "Quale controllo fa un gestore prima di accettare un nuovo investitore?",
      ok: "Verifica che sia un investitore ammesso e controlla l'origine dei soldi (norme antiriciclaggio)",
      no: [
        "Nessun controllo",
        "Chiede solo il numero di telefono",
        "Controlla solo la squadra del cuore",
      ],
    },
    {
      q: "Un ragazzo di 15 anni, con i risparmi della paghetta, può in generale investire in un hedge fund?",
      ok: "No: i fondi riservati richiedono requisiti e importi minimi molto alti",
      no: [
        "Sì, se ha almeno 100 euro",
        "Sì, se un amico lo presenta",
        "Sì, se lo chiede online",
      ],
    },
    {
      q: "Perché l'importo minimo d'ingresso di molti hedge fund è alto?",
      ok: "Per tenere il numero di investitori basso e selezionare chi può sopportare rischi e blocchi",
      no: [
        "Perché lo stabilisce la borsa",
        "Perché così il fondo non può perdere",
        "Perché le tasse lo impongono",
      ],
    },
    {
      q: "Che cosa vuol dire che le norme su chi può investire sono date «in sintesi, ottobre 2026»?",
      ok: "Che le regole possono cambiare e vanno sempre controllate sulle fonti ufficiali",
      no: [
        "Che valgono per sempre",
        "Che vanno applicate solo a ottobre",
        "Che sono segrete",
      ],
    },
    {
      q: "Quale ente italiano vigila sulla trasparenza e sulla correttezza dei comportamenti di molti intermediari finanziari?",
      ok: "La Consob",
      no: [
        "L'Istat",
        "L'Agenzia delle Dogane",
        "Il Ministero dei Trasporti",
      ],
    },
  ],
  "h01-panorama": [
    {
      q: "Dove si trovano tradizionalmente i principali centri degli hedge fund nel mondo?",
      ok: "New York, Londra e zone vicine come il Connecticut",
      no: [
        "Solo in piccoli villaggi di montagna",
        "Soltanto nei Paesi senza borsa",
        "Solo in Italia",
      ],
    },
    {
      q: "Come si può descrivere in sintesi la dimensione dell'industria mondiale degli hedge fund?",
      ok: "Migliaia di miliardi di dollari gestiti, ma una piccola parte di tutto il risparmio mondiale",
      no: [
        "Qualche migliaio di dollari in tutto",
        "Più di tutto il risparmio del mondo",
        "Non è misurabile in nessun modo",
      ],
    },
    {
      q: "Quale frase sul peso dei fondi più grandi è corretta?",
      ok: "Pochi fondi molto grandi gestiscono una parte rilevante del totale",
      no: [
        "Tutti i fondi hanno la stessa dimensione",
        "I fondi grandi non esistono",
        "I fondi piccoli gestiscono più di tutti i grandi",
      ],
    },
    {
      q: "In Italia, in sintesi (ottobre 2026), com'è il mercato degli hedge fund rispetto a Stati Uniti e Regno Unito?",
      ok: "È più piccolo: molti fondi usati da italiani hanno sede all'estero",
      no: [
        "È il più grande del mondo",
        "Non esiste alcun fondo",
        "È vietato per legge",
      ],
    },
    {
      q: "Come si chiamano nella normativa europea i fondi che non sono i classici fondi comuni armonizzati, compresi molti hedge fund?",
      ok: "Fondi di investimento alternativi (FIA o, in inglese, AIF)",
      no: [
        "Fondi di cassa",
        "Fondi per le vacanze",
        "Fondi solo per giovani",
      ],
    },
    {
      q: "Quale direttiva europea regola i gestori di fondi alternativi, in sintesi?",
      ok: "AIFMD (direttiva sui gestori di fondi di investimento alternativi)",
      no: [
        "GDPR sulla privacy",
        "La direttiva sulle batterie",
        "La direttiva sugli imballaggi",
      ],
    },
    {
      q: "I rendimenti degli hedge fund sono tutti simili?",
      ok: "No: tra un fondo e l'altro la differenza è molto grande, e alcuni chiudono",
      no: [
        "Sì, sono quasi identici",
        "Sì, per legge",
        "Sì, per i fondi quotati in borsa",
      ],
    },
    {
      q: "Perché si parla spesso di fondi che «chiudono»?",
      ok: "Perché ogni anno alcuni fondi, specie i meno riusciti, vengono liquidati e restituiscono i soldi",
      no: [
        "Perché la legge impone la chiusura ogni dicembre",
        "Perché non pagano le commissioni",
        "Perché i gestori vanno in pensione tutti insieme",
      ],
    },
    {
      q: "Se leggi solo i dati dei fondi ancora esistenti, che rischio corri?",
      ok: "Il bias di sopravvivenza: i fondi falliti spariscono dalle statistiche e il quadro sembra migliore",
      no: [
        "Nessun rischio",
        "Il rischio di pagare più tasse",
        "Il rischio di perdere la password",
      ],
    },
    {
      q: "Il gestore di un fondo diffonde una sola cifra: «+40% in un anno». Che cosa devi chiedere?",
      ok: "Su quanti anni, con quale rischio, al netto di quali commissioni e se i dati sono verificati da terzi",
      no: [
        "Niente: il dato basta",
        "Solo il colore del logo",
        "Soltanto il nome del gestore",
      ],
    },
    {
      q: "Dove si controlla se un intermediario italiano è autorizzato?",
      ok: "Sui siti ufficiali di Consob e Banca d'Italia, che pubblicano gli elenchi",
      no: [
        "Sul profilo social dell'intermediario",
        "Chiedendo all'intermediario stesso",
        "Su un forum anonimo",
      ],
    },
    {
      q: "Quale ruolo ha la Banca d'Italia, in sintesi, nel controllo del risparmio?",
      ok: "Vigila sulla stabilità di banche e intermediari, insieme ad altre autorità come la Consob",
      no: [
        "Gestisce lei tutti gli hedge fund",
        "Garantisce i guadagni dei fondi",
        "Non ha alcun ruolo",
      ],
    },
  ],
};
