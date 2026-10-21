import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo T12 (Trading algoritmico con Python). Una chiave per lezione: "t12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const T12_ITEMS: Record<string, BankItem[]> = {
  "t12-bias": [
    {
      q: "Che cosa descrive l'avversione alla perdita?",
      ok: "Una perdita di una certa cifra pesa, in media, più di un guadagno della stessa cifra",
      no: ["Il fatto che le perdite non fanno mai male a chi ha un piano", "La tendenza a cercare solo investimenti senza alcun rischio", "L'abitudine di vendere subito qualunque cosa che sale"],
    },
    {
      q: "Marta ha una posizione in perdita da settimane. Non la chiude «per non realizzare la perdita» anche se la sua regola dice di uscire. Quale bias la guida?",
      ok: "L'avversione alla perdita: chiudere trasforma la perdita da possibile a certa",
      no: ["L'eccesso di fiducia nei suoi dati", "Il bias di sopravvivenza dei titoli", "Il look-ahead bias del backtest"],
    },
    {
      q: "Che cos'è l'effetto disposizione?",
      ok: "Vendere presto i titoli in guadagno e tenere troppo a lungo quelli in perdita",
      no: ["Tenere sempre tutti i titoli per anni senza mai guardarli", "Comprare solo dopo aver letto le notizie del giorno", "Vendere i titoli in perdita per ricomprarli subito uguali"],
    },
    {
      q: "Dopo tre operazioni vincenti di fila Luca raddoppia la dimensione delle posizioni perché «ormai ha capito il mercato». Qual è il problema principale?",
      ok: "Eccesso di fiducia: tre esiti sono pochi per concludere che c'è abilità e non fortuna",
      no: ["Nessun problema: le serie di vittorie si ripetono sempre", "Avversione alla perdita, perché ha guadagnato", "Un errore di arrotondamento nei prezzi"],
    },
    {
      q: "Perché l'eccesso di fiducia è pericoloso per chi fa trading?",
      ok: "Porta a rischiare più del dovuto e a sottovalutare le perdite possibili",
      no: ["Rende i costi di commissione più alti", "Impedisce di usare dati storici", "Fa scegliere sempre strumenti troppo prudenti"],
    },
    {
      q: "Che cos'è il bias di conferma?",
      ok: "Cercare e credere solo alle informazioni che confermano ciò che pensiamo già",
      no: ["Controllare due volte ogni ordine prima di inviarlo", "Aspettare la conferma di un indicatore tecnico", "Confermare i dati con una seconda fonte ufficiale"],
    },
    {
      q: "Un trader è sicuro che un titolo salirà. Legge solo gli articoli ottimisti e ignora quelli che avvertono dei rischi. Quale bias vede in azione?",
      ok: "Il bias di conferma",
      no: ["L'avversione alla perdita", "Il bias di sopravvivenza", "L'effetto dei costi di esecuzione"],
    },
    {
      q: "Che cos'è l'ancoraggio nelle decisioni finanziarie?",
      ok: "Restare legati a un numero di riferimento, per esempio il prezzo a cui si è comprato, anche se non è più rilevante",
      no: ["Fissare un ordine con stop in modo da non spostarlo mai", "Comprare solo titoli molto conosciuti", "Usare una media mobile come unico indicatore"],
    },
    {
      q: "Sara pensa: «Aspetto che torni al mio prezzo di acquisto, poi esco». Perché questo ragionamento è fragile?",
      ok: "Il mercato non sa a che prezzo hai comprato: conta il valore futuro, non il tuo punto di partenza",
      no: ["Perché il prezzo di acquisto non si può mai sapere", "Perché i prezzi tornano sempre al punto di partenza, ma solo di notte", "Perché uscire in pareggio è vietato dai broker"],
    },
    {
      q: "Quale di queste regole aiuta di più contro l'eccesso di fiducia?",
      ok: "Fissare in anticipo la dimensione massima della posizione, uguale dopo vittorie e sconfitte",
      no: ["Aumentare le dimensioni quando si vince", "Fidarsi dell'intuizione quando è forte", "Evitare di registrare i risultati per non scoraggiarsi"],
    },
    {
      q: "Perché conoscere i bias comportamentali non basta, da solo, a evitarli?",
      ok: "Perché agiscono anche quando li conosciamo: servono regole scritte decise prima, a mente fredda",
      no: ["Perché i bias esistono solo nei principianti", "Perché basta avere un computer veloce", "Perché i bias spariscono dopo il primo guadagno"],
    },
    {
      q: "Un backtest mostra un sistema ottimo e il suo autore pensa: «lo sapevo». Quale bias può averlo spinto a cercare proprio quel risultato?",
      ok: "Il bias di conferma: ha provato varianti finché i numeri gli hanno dato ragione",
      no: ["L'avversione alla perdita, perché i numeri sono positivi", "Nessuno: i backtest non hanno bias", "Il bias dell'ora legale"],
    },
    {
      q: "Un amico ti dice che perdere 100 euro e guadagnarne 100 «sono la stessa cosa». Che cosa rispondi, secondo la ricerca sul comportamento?",
      ok: "Matematicamente sì, ma per la maggior parte delle persone la perdita pesa di più, e questo altera le scelte",
      no: ["Hai ragione: nessuno sente la differenza", "Il guadagno pesa sempre di più della perdita", "Il peso dipende solo dal broker usato"],
    },
  ],
  "t12-fomo": [
    {
      q: "Che cosa significa FOMO nel contesto dei mercati?",
      ok: "Paura di restare fuori da un movimento di cui parlano tutti, che spinge a entrare di fretta",
      no: ["Un indicatore tecnico basato sui volumi", "Un tipo di ordine con prezzo limite", "Una regola che impone di chiudere a fine giornata"],
    },
    {
      q: "Un titolo è salito del 30% in una settimana e tutti i tuoi amici ne parlano. Senti l'impulso di comprare subito. Che cosa è più prudente fare?",
      ok: "Aspettare e applicare solo le regole scritte in anticipo; se non c'è un segnale della tua strategia, non entrare",
      no: ["Comprare subito per non perdere l'occasione", "Comprare il doppio per recuperare il ritardo", "Chiedere ai conoscenti quanto hanno guadagnato e copiarli"],
    },
    {
      q: "Perché entrare dopo un rialzo molto forte è rischioso?",
      ok: "Si compra quando molti hanno già comprato e il prezzo incorpora un grande entusiasmo, senza alcuna garanzia che continui",
      no: ["Perché dopo un rialzo i prezzi scendono sempre", "Perché i broker vietano di comprare dopo un rialzo", "Perché il rendimento dopo un rialzo è sempre garantito"],
    },
    {
      q: "Che cos'è il «revenge trading»?",
      ok: "Operare d'impulso per rifarsi subito di una perdita, spesso rischiando di più",
      no: ["Un metodo per ridurre i costi di commissione", "Una strategia che copia le operazioni di un fondo", "Un ordine che si attiva a un prezzo prefissato"],
    },
    {
      q: "Dopo una perdita Andrea apre subito tre operazioni più grandi del solito «per rifarsi». Qual è la scelta più prudente al suo posto?",
      ok: "Fermarsi, rispettare la dimensione prevista e riguardare il diario prima di operare ancora",
      no: ["Raddoppiare di nuovo finché si recupera", "Togliere lo stop per evitare di chiudere in perdita", "Cambiare strategia ogni ora"],
    },
    {
      q: "Quale di questi è un segnale che l'emozione sta guidando le decisioni?",
      ok: "Decidere in pochi secondi, senza aver controllato le regole, con il cuore che batte forte",
      no: ["Rispettare la check-list prima di ogni ordine", "Aspettare il segnale prima di entrare", "Registrare i risultati nel diario"],
    },
    {
      q: "Che differenza c'è tra FOMO e avversione alla perdita?",
      ok: "La FOMO è paura di perdere un'occasione e spinge a entrare; l'avversione alla perdita è il peso della perdita e spinge a non chiudere",
      no: ["Sono due nomi della stessa identica cosa", "La FOMO riguarda solo le obbligazioni", "L'avversione alla perdita riguarda solo i principianti"],
    },
    {
      q: "Su un social un profilo mostra solo operazioni vincenti e dice «entra anche tu, non restare indietro». Come va letto il messaggio?",
      ok: "Con scetticismo: vengono mostrati solo i successi e la pressione a decidere in fretta è già un segnale di allarme",
      no: ["Come una prova che la strategia funziona", "Come una garanzia di guadagno se si entra presto", "Come un consiglio personalizzato affidabile"],
    },
    {
      q: "Perché una regola come «aspetto 24 ore prima di entrare in una posizione non prevista dalla strategia» è utile?",
      ok: "Lascia calmare l'emozione e fa tornare la decisione alla strategia scritta",
      no: ["Perché dopo 24 ore il prezzo è sempre più basso", "Perché elimina del tutto il rischio", "Perché i mercati sono chiusi di notte"],
    },
    {
      q: "Quale fra queste è la reazione più sensata quando «tutti» parlano di un'azione che sta esplodendo?",
      ok: "Ricordare che la popolarità non è un segnale di valore e che si può restare fuori senza perdere nulla di reale",
      no: ["Considerare la popolarità una prova di qualità", "Vendere tutto il resto per comprare quella", "Prendere un prestito per comprarne di più"],
    },
    {
      q: "Quale errore fa chi pensa «se non compro ora perdo un'occasione irripetibile»?",
      ok: "Dimentica che le occasioni ci sono sempre e che la fretta fa saltare le regole sul rischio",
      no: ["Pensa troppo poco al prezzo di acquisto passato", "Aspetta troppo il segnale della strategia", "Usa troppe volte la check-list"],
    },
    {
      q: "Dopo una serie di perdite un trader si sente nervoso e arrabbiato. Che cosa è più prudente?",
      ok: "Sospendere l'attività e riprendere solo quando è calmo, seguendo le regole scritte",
      no: ["Continuare per recuperare mentre l'adrenalina è alta", "Aumentare le dimensioni per chiudere la serie negativa", "Spostare gli stop più lontano senza motivo"],
    },
  ],
  "t12-diario": [
    {
      q: "A che cosa serve un diario di trading?",
      ok: "A registrare le decisioni e le loro ragioni per imparare dagli errori con dati e non con i ricordi",
      no: ["A dimostrare agli altri quanto si guadagna", "A sostituire il backtest", "A prevedere il prezzo di domani"],
    },
    {
      q: "Quale di queste voci è più utile scrivere nel diario, oltre al risultato?",
      ok: "Il motivo dell'operazione e lo stato d'animo del momento",
      no: ["Il meteo della giornata", "Solo il prezzo massimo del giorno", "Il nome del broker usato"],
    },
    {
      q: "Perché è importante scrivere nel diario anche le operazioni in perdita?",
      ok: "Perché mostrano gli errori ripetuti, e ignorarle darebbe un quadro troppo ottimista",
      no: ["Perché le perdite si possono detrarre dal diario", "Perché le perdite non danno informazioni", "Perché il diario deve avere sempre lo stesso numero di vincite e perdite"],
    },
    {
      q: "Un diario contiene cinque operazioni simulate con risultati +40, -25, +10, -30, -20 (in unità fittizie). Quanto vale il totale?",
      ok: "-25",
      no: ["+25", "-15", "-75"],
    },
    {
      q: "Con gli stessi risultati +40, -25, +10, -30, -20, quante operazioni sono vincenti e quante perdenti?",
      ok: "2 vincenti e 3 perdenti",
      no: ["3 vincenti e 2 perdenti", "5 vincenti e 0 perdenti", "1 vincente e 4 perdenti"],
    },
    {
      q: "In un diario, quando conviene scrivere il motivo dell'ingresso in un'operazione?",
      ok: "Prima di entrare, quando si è ancora calmi",
      no: ["Solo dopo averla chiusa, quando si sa com'è andata", "Mai: il motivo si ricorda sempre bene", "Solo se l'operazione è andata male"],
    },
    {
      q: "Perché scrivere il motivo solo a cose fatte è meno affidabile?",
      ok: "Perché la memoria si adatta al risultato e si tende a giustificare quello che è successo",
      no: ["Perché dopo non si può più scrivere", "Perché i motivi cambiano a seconda del broker", "Perché è vietato dalla legge"],
    },
    {
      q: "Dopo un mese di diario noti che quasi tutte le perdite maggiori sono avvenute dopo le 16, quando eri stanco. Che cosa è più prudente fare?",
      ok: "Introdurre una regola scritta, per esempio nessuna nuova operazione dopo quell'ora, e verificarla nel tempo",
      no: ["Ignorare il dato: sarà un caso", "Operare di più dopo le 16 per recuperare", "Cancellare quelle righe dal diario"],
    },
    {
      q: "Quando si rivede un diario, che cosa si cerca soprattutto?",
      ok: "Schemi che si ripetono: stessi errori, stesse ore, stesse emozioni",
      no: ["Solo la singola operazione più bella", "Una conferma di essere bravi", "I nomi dei titoli più popolari"],
    },
    {
      q: "Che cosa succede se si tiene il diario solo quando le cose vanno bene?",
      ok: "Diventa una raccolta di successi e non mostra più i problemi veri",
      no: ["Diventa più accurato", "Elimina la necessità di una strategia", "Riduce i costi di commissione"],
    },
    {
      q: "Quale di queste frasi è una buona annotazione di diario?",
      ok: "«Entrato perché il segnale della regola 2 era attivo; ansioso dopo la perdita di ieri; uscito allo stop come previsto»",
      no: ["«Andata male, sfortuna»", "«Il mercato è truccato»", "«Domani mi rifaccio»"],
    },
    {
      q: "Il diario di trading con denaro fittizio (demo) ha senso?",
      ok: "Sì: allena l'abitudine a registrare e a rivedere le decisioni senza rischiare soldi veri",
      no: ["No: serve solo con soldi veri", "No: sulle demo le decisioni non si possono registrare", "Sì, ma solo se si ricordano i risultati a memoria"],
    },
  ],
  "t12-regole": [
    {
      q: "Perché è meglio scrivere le regole di trading prima di operare?",
      ok: "Perché quando si è sotto pressione le emozioni disturbano il giudizio, mentre le regole sono decise a mente fredda",
      no: ["Perché le regole rendono i guadagni sicuri", "Perché i broker lo richiedono", "Perché così non serve più il diario"],
    },
    {
      q: "Che cos'è una check-list pre-operazione?",
      ok: "Un elenco di controlli da spuntare prima di ogni ordine, per esempio segnale, dimensione e perdita massima",
      no: ["Un elenco dei titoli da comprare domani", "Un report dei guadagni mensili", "Un elenco degli amici da consultare"],
    },
    {
      q: "Quale di queste è una regola scritta ben formulata?",
      ok: "«Non rischio più dell'1% del capitale demo su una singola operazione»",
      no: ["«Cerco di stare attento»", "«Rischio quanto mi sento»", "«Faccio come va il mercato»"],
    },
    {
      q: "Con un capitale demo di 10.000 euro e una regola di rischio dell'1% per operazione, qual è la perdita massima accettata su una singola operazione?",
      ok: "100 euro",
      no: ["10 euro", "1.000 euro", "1 euro"],
    },
    {
      q: "Con un capitale demo di 20.000 euro e il limite dell'1% per operazione, qual è la perdita massima accettata su una singola operazione?",
      ok: "200 euro",
      no: ["20 euro", "2.000 euro", "100 euro"],
    },
    {
      q: "Il segnale della tua strategia non c'è, ma «senti» che il prezzo sta per salire. Che cosa dice la disciplina?",
      ok: "Non entrare: senza il segnale previsto dalle regole non c'è operazione",
      no: ["Entrare, perché l'intuizione conta più delle regole", "Entrare con metà dimensione solo per provare", "Cambiare la regola in quel momento per includere l'operazione"],
    },
    {
      q: "È giusto cambiare le regole durante una giornata di forti perdite?",
      ok: "No: eventuali modifiche si decidono a mente fredda, dopo aver rivisto i dati, non nel pieno dell'emozione",
      no: ["Sì, subito, per recuperare le perdite", "Sì, conviene allargare lo stop", "Sì, ma solo raddoppiando la dimensione"],
    },
    {
      q: "Qual è il vantaggio di avere un limite di perdita giornaliera scritto in anticipo?",
      ok: "Evita che una brutta giornata si trasformi in una serie di decisioni impulsive",
      no: ["Garantisce di non perdere mai", "Elimina i costi di esecuzione", "Aumenta i guadagni medi"],
    },
    {
      q: "Quale elemento NON dovrebbe far parte di una check-list pre-operazione seria?",
      ok: "«Quanto guadagnerò sicuramente con questa operazione?»",
      no: ["«C'è il segnale previsto dalla strategia?»", "«Quanto perderò al massimo se sbaglio?»", "«Sono calmo e riposato?»"],
    },
    {
      q: "Perché una check-list deve essere breve e semplice?",
      ok: "Perché se è lunga e complicata, nei momenti di fretta non viene usata",
      no: ["Perché le regole lunghe sono illegali", "Perché i broker non le accettano", "Perché più breve è, più è garantito il guadagno"],
    },
    {
      q: "Che cosa distingue una regola «vaga» da una regola «misurabile»?",
      ok: "La regola misurabile si può verificare con un numero, e si sa subito se è stata rispettata o no",
      no: ["La regola vaga è più flessibile e quindi migliore", "La regola misurabile funziona solo sul mercato azionario", "Non c'è nessuna differenza pratica"],
    },
    {
      q: "Luca ha violato la sua regola e ha avuto un guadagno. Che cosa è più prudente fare?",
      ok: "Annotarlo nel diario come violazione: un esito fortunato non rende buona una decisione sbagliata",
      no: ["Considerarlo una conferma che le regole non servono", "Non scriverlo, perché è andato bene", "Violare la regola più spesso"],
    },
  ],
  "t12-fermarsi": [
    {
      q: "Quale di queste situazioni è un buon motivo per fermarsi e sospendere l'attività?",
      ok: "Hai raggiunto il limite di perdita stabilito in anticipo, o ti accorgi di operare in preda a rabbia o ansia",
      no: ["Hai appena avuto un guadagno e vuoi raddoppiare", "Un conoscente ti dice che il mercato è sicuro", "Hai trovato una nuova app di trading"],
    },
    {
      q: "Che differenza c'è tra fare trading e giocare d'azzardo?",
      ok: "Nell'azzardo l'esito dipende dal caso e il banco ha un vantaggio sicuro; nei mercati si può ragionare su probabilità e rischio, ma si può comunque perdere molto, anche tutto, e il comportamento compulsivo è identico",
      no: ["Non c'è nessuna differenza, sono la stessa cosa in ogni caso", "Nel trading non si può mai perdere", "Nell'azzardo si perde, nel trading si vince sempre se si studia"],
    },
    {
      q: "Quale è un segnale di allarme di un rapporto problematico con il gioco o con il trading?",
      ok: "Non riuscire a smettere, mentire sulle somme perse e giocare per rifarsi",
      no: ["Fermarsi quando si raggiunge il limite stabilito", "Tenere un diario con le perdite", "Usare solo denaro demo"],
    },
    {
      q: "Una persona chiede un prestito agli amici per «rifarsi» di una perdita nei mercati. Che cosa è più prudente?",
      ok: "Non indebitarsi, fermarsi e parlare con una persona di fiducia o con un servizio di aiuto",
      no: ["Chiedere un prestito più grande per recuperare", "Nasconderlo a tutti per non preoccupare nessuno", "Usare la leva per recuperare più in fretta"],
    },
    {
      q: "A chi ci si può rivolgere in Italia per un problema di gioco d'azzardo?",
      ok: "Al Telefono Verde Nazionale (ISS) 800 55 88 22, gratuito, e ai servizi per le dipendenze (SerD) della propria ASL",
      no: ["Solo al proprio broker", "Solo a un influencer che dà segnali", "A nessuno: è un problema di volontà"],
    },
    {
      q: "Perché non bisogna mai investire denaro preso in prestito o che serve per vivere?",
      ok: "Perché le perdite sono possibili e potrebbero lasciare debiti o impedire di pagare spese essenziali",
      no: ["Perché il denaro in prestito rende meno", "Perché il broker lo vieta sempre", "Perché le perdite con denaro in prestito sono meno gravi"],
    },
    {
      q: "Dopo una serie di perdite un trader pensa «ormai devo per forza vincere». Quale errore sta facendo?",
      ok: "Crede che il caso «compensi»: ogni operazione è indipendente e la sfortuna passata non garantisce fortuna futura",
      no: ["Pensa troppo poco al passato", "Usa troppo il diario", "Rispetta troppo le regole"],
    },
    {
      q: "Quale comportamento è un buon modo per «uscire» da una giornata andata male?",
      ok: "Chiudere tutto secondo le regole, annotare l'accaduto e riprendere solo il giorno dopo con la mente fresca",
      no: ["Aprire altre operazioni per rifarsi", "Eliminare tutti gli stop", "Aumentare la dimensione al massimo"],
    },
    {
      q: "Che cosa vuol dire autoescludersi o darsi dei limiti prima di operare?",
      ok: "Fissare in anticipo tempi, importi e perdite massime e rispettarli, anche con la possibilità di staccarsi del tutto",
      no: ["Cambiare i limiti ogni volta che si perde", "Delegare le decisioni a un amico che promette guadagni", "Non scrivere nulla così non ci si sente in colpa"],
    },
    {
      q: "Un familiare nota che passi ore sui grafici, sei irritabile se non operi e hai nascosto delle perdite. Che cosa è più prudente fare?",
      ok: "Ascoltarlo, fermarti e chiedere aiuto a un servizio specializzato, senza vergogna",
      no: ["Rispondergli che non è affar suo e continuare", "Operare più in fretta per recuperare prima di parlarne", "Pensare che passerà da sola senza fare nulla"],
    },
    {
      q: "Perché in questo corso si usano solo dati storici e conti demo?",
      ok: "Perché si impara ragionando sul rischio senza mettere a repentaglio denaro vero",
      no: ["Perché i soldi veri non esistono nei mercati", "Perché i conti demo garantiscono guadagni", "Perché la legge vieta di operare con soldi veri"],
    },
    {
      q: "Quando si parla di indebitamento e leva, qual è un campanello d'allarme?",
      ok: "Rischiare più del capitale che si può permettere di perdere, o prendere denaro in prestito per operare",
      no: ["Usare solo una piccola parte del capitale", "Avere un limite di perdita scritto", "Operare solo su conto demo"],
    },
  ],
};
