import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H10 (Hedge fund). Una chiave per lezione: "h10-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Tutti i numeri sono fittizi e ricontrollati a mano.
 */
export const H10_ITEMS: Record<string, BankItem[]> = {
  "h10-due-diligence": [
    {
      q: "Che cos'è la due diligence di un investitore prima di affidare soldi a un fondo?",
      ok: "Un controllo approfondito su gestore, strategia e organizzazione, fatto prima di investire",
      no: ["Una commissione che si paga al gestore all'ingresso", "Un documento con cui il fondo promette un rendimento minimo", "Il controllo che fa l'autorità solo dopo una frode"],
    },
    {
      q: "Quale domanda fa parte della due diligence OPERATIVA (e non di quella sull'investimento)?",
      ok: "Chi calcola il valore delle quote: un amministratore indipendente o il gestore stesso?",
      no: ["Quante azioni compra il fondo la prossima settimana?", "Qual è stato il mese migliore degli ultimi tre anni?", "Il gestore pensa che il mercato salirà o scenderà?"],
    },
    {
      q: "Un fondo non ha un amministratore indipendente: il gestore calcola da solo il valore delle quote e scrive da solo i rendiconti. Perché è un segnale d'allarme?",
      ok: "Nessuno di esterno controlla che i numeri siano veri, e il gestore potrebbe sbagliare o truccarli",
      no: ["Perché il fondo pagherà commissioni più alte", "Perché la legge vieta ai fondi di avere un amministratore", "Perché il fondo non potrà mai guadagnare"],
    },
    {
      q: "Perché si controlla chi è il revisore (auditor) dei bilanci del fondo?",
      ok: "Perché un revisore esterno, serio e indipendente rende più difficile nascondere errori o falsità",
      no: ["Perché il revisore decide quali titoli comprare", "Perché il revisore garantisce che il fondo non perderà", "Perché il revisore incassa le commissioni per conto del fondo"],
    },
    {
      q: "Il gestore dice: «La strategia è segreta, non posso spiegarvi come guadagniamo, fidatevi». Come ragiona un investitore prudente?",
      ok: "Se non capisco come si guadagna e dove sta il rischio, non investo",
      no: ["Se è segreta, vuol dire che è molto brava: investo di più", "Il segreto è normale, non serve capire nulla", "Mi basta che il gestore sia simpatico"],
    },
    {
      q: "Quale di questi è un tipico segnale d'allarme (red flag) in un fondo?",
      ok: "Rendimenti molto alti e quasi senza mai un mese negativo, ma senza una spiegazione chiara",
      no: ["Rendimenti che a volte sono negativi e vengono spiegati", "Un amministratore e un revisore indipendenti e noti", "Un documento che elenca chiaramente i rischi"],
    },
    {
      q: "Un consulente dice a un investitore: «Devi decidere entro stasera, i posti sono quasi finiti». Che cosa fa chi ha fatto una buona due diligence?",
      ok: "Rifiuta la fretta: una decisione seria si prende con calma, dopo i controlli",
      no: ["Firma subito per non perdere l'occasione", "Versa metà della somma per sicurezza e controlla dopo", "Si fida perché la fretta indica un fondo molto richiesto"],
    },
    {
      q: "In un fondo, chi tiene al sicuro i titoli e il denaro è un soggetto diverso dal gestore (custode o prime broker). Perché è un punto a favore?",
      ok: "Il gestore decide cosa comprare ma non può prendere i soldi da solo: c'è una separazione dei ruoli",
      no: ["Perché così il fondo paga meno tasse", "Perché il custode garantisce un rendimento", "Perché il gestore non deve più rispondere agli investitori"],
    },
    {
      q: "Quale controllo ha senso fare sul gestore e sul suo team?",
      ok: "Verificare esperienza, carriera passata e se ha avuto sanzioni o problemi con le autorità",
      no: ["Contare quanti follower ha sui social", "Guardare solo quanto è elegante l'ufficio", "Chiedere solo se ha un titolo di studio famoso"],
    },
    {
      q: "Quale fonte è più affidabile per verificare se un intermediario o un gestore è autorizzato?",
      ok: "I registri ufficiali delle autorità (per esempio Consob e Banca d'Italia)",
      no: ["Le recensioni entusiaste trovate sul sito del fondo", "Il messaggio di un conoscente che ci ha guadagnato", "Il numero di pubblicità viste online"],
    },
    {
      q: "Un amico dice: «Mio cugino ha investito in questo fondo e ha guadagnato, quindi è sicuro». Perché non basta?",
      ok: "Un risultato positivo di una persona non prova che il fondo sia serio: anche le truffe pagano qualcuno all'inizio",
      no: ["Perché i cugini non possono investire nei fondi", "Perché i guadagni degli amici sono sempre falsi", "Perché basta un solo caso per dimostrare che è sicuro"],
    },
    {
      q: "Dopo la due diligence, due fondi sembrano simili. Uno ha un documento chiaro su rischi, commissioni e rimborsi; l'altro risponde alle domande a voce e «si vedrà». Quale scelta è più prudente?",
      ok: "Preferire quello con tutto scritto e chiaro; se mancano risposte, non investire",
      no: ["Preferire quello che risponde a voce, perché è più flessibile", "Sceglierli a caso: sono uguali", "Investire in entrambi in parti uguali senza leggere altro"],
    },
    {
      q: "Che cosa NON può garantire nemmeno la migliore due diligence?",
      ok: "Che il fondo non perda denaro in futuro: riduce i rischi, non li elimina",
      no: ["Che i documenti siano stati letti con attenzione", "Che si conoscano le commissioni prima di investire", "Che si sappia chi è il revisore del fondo"],
    },
  ],
  "h10-track-record": [
    {
      q: "Un fondo fa +10% in un anno e -10% l'anno dopo. Dopo i due anni, rispetto all'inizio, com'è andato?",
      ok: "-1%: da 100 si va a 110 e poi a 99",
      no: ["0%: i due risultati si annullano", "+1%", "-10%"],
    },
    {
      q: "Un fondo fa +20%, poi -10%, poi +5% in tre anni. Qual è il rendimento totale composto (da 100 a quanto)?",
      ok: "+13,4%: 100 diventa 113,4",
      no: ["+15%: si sommano i tre risultati", "+5%: è la media dei tre risultati", "+18%"],
    },
    {
      q: "Il valore di un fondo passa da 100 a 130 (massimo), poi scende a 104. Qual è il drawdown?",
      ok: "-20%: (104 - 130) / 130",
      no: ["-26%: si sottrae 104 da 130 e si guarda solo la differenza in euro", "-4%: è la distanza dal punto di partenza di 100", "-30%"],
    },
    {
      q: "Un fondo perde il 20% da un massimo. Di quanto deve salire poi, in percentuale, per tornare al massimo?",
      ok: "+25%: da 80 a 100",
      no: ["+20%", "+15%", "+30%"],
    },
    {
      q: "Un fondo perde il 50% da un massimo. Di quanto deve salire poi per tornare al massimo?",
      ok: "+100%: da 50 a 100",
      no: ["+50%", "+75%", "+25%"],
    },
    {
      q: "Un fondo ha un rendimento lordo del 12% su 100 euro. Commissione di gestione 2% sul capitale e di performance 20% sul profitto lordo (convenzione della lezione). Qual è il rendimento netto?",
      ok: "7,6%: 12 - 2 - 2,4",
      no: ["10%: si toglie solo la gestione", "9,6%: si toglie solo la performance", "12%: le commissioni non cambiano il rendimento"],
    },
    {
      q: "Un fondo fa +50% in un anno e -50% l'anno successivo. Com'è andato dopo i due anni?",
      ok: "-25%: da 100 a 150 e poi a 75",
      no: ["0%: la media dei due anni è zero", "+25%", "-50%"],
    },
    {
      q: "Un fondo ha un rendimento medio dell'8%, tasso privo di rischio 2% e volatilità 10%. Quanto vale l'indice di Sharpe (convenzione della lezione)?",
      ok: "0,6: (8 - 2) / 10",
      no: ["0,8: 8 / 10", "1,0: 10 / 10", "0,2: 2 / 10"],
    },
    {
      q: "Fondo A: rendimento 9%, tasso privo di rischio 3%, volatilità 12%. Fondo B: rendimento 7%, tasso privo di rischio 2%, volatilità 5%. Quale ha l'indice di Sharpe più alto?",
      ok: "Il fondo B (1,0 contro 0,5): rende meno ma con molto meno rischio",
      no: ["Il fondo A, perché ha il rendimento più alto", "Hanno lo stesso indice di Sharpe", "Non si può calcolare con questi dati"],
    },
    {
      q: "Tre anni consecutivi di +10% ciascuno: qual è il rendimento totale?",
      ok: "+33,1%: 100 diventa 133,1",
      no: ["+30%: si sommano i tre anni", "+10%", "+31%"],
    },
    {
      q: "Un track record dura soltanto 12 mesi, tutti in un mercato che saliva. Che cosa se ne può concludere?",
      ok: "Poco: è troppo breve e non mostra come si comporta il fondo quando il mercato scende",
      no: ["Che il gestore è bravissimo e il risultato si ripeterà", "Che il fondo non può più perdere", "Che il rischio del fondo è zero"],
    },
    {
      q: "Che cosa vuol dire «distorsione da sopravvivenza» nel confrontare i fondi?",
      ok: "Se nelle statistiche restano solo i fondi sopravvissuti, i risultati sembrano migliori della realtà perché mancano quelli chiusi",
      no: ["Che i fondi vivono più a lungo quando guadagnano", "Che il gestore sopravvive grazie alle commissioni", "Che un fondo non può chiudere se è in perdita"],
    },
    {
      q: "Perché, nel leggere un track record, conta il rendimento NETTO e non solo quello lordo?",
      ok: "Perché le commissioni sono pagate dall'investitore e riducono davvero ciò che gli resta",
      no: ["Perché il netto è sempre più alto del lordo", "Perché il lordo non esiste nei fondi", "Perché le commissioni si pagano solo se il fondo perde"],
    },
    {
      q: "Un fondo ha un massimo drawdown di -25% e ci ha messo 3 anni a recuperare. Perché è un'informazione utile?",
      ok: "Mostra quanto si può soffrire nel momento peggiore e quanto tempo si può restare in perdita",
      no: ["Mostra il guadagno che il fondo farà il prossimo anno", "Serve solo al gestore per calcolare le commissioni", "Mostra che il fondo non rischia più"],
    },
  ],
  "h10-comunicazione": [
    {
      q: "Una lettera agli investitori dice: «+12% quest'anno!» ma non cita le commissioni. Che cosa manca per essere onesti?",
      ok: "Dire se il rendimento è lordo o netto e mostrare cosa resta all'investitore dopo le commissioni",
      no: ["Niente: il numero lordo è l'unico che conta", "Aggiungere altri numeri positivi", "Togliere ogni numero, per non spaventare"],
    },
    {
      q: "Un fondo ha avuto questi rendimenti netti: +12%, -8%, +6%, +10%. Il materiale pubblicitario mostra solo gli ultimi due anni. Quanto vale il rendimento totale composto di quei due anni?",
      ok: "+16,6%: 1,06 x 1,10 = 1,166",
      no: ["+16%: si sommano 6 e 10", "+8%: è la media", "+20,1%"],
    },
    {
      q: "Con gli stessi rendimenti (+12%, -8%, +6%, +10%), quanto vale il rendimento totale composto dei QUATTRO anni?",
      ok: "+20,1%: 1,12 x 0,92 x 1,06 x 1,10 = 1,2014",
      no: ["+20%: si sommano i quattro anni", "+16,6%", "+30%"],
    },
    {
      q: "Perché mostrare solo gli anni migliori di un fondo è una comunicazione scorretta?",
      ok: "Dà un'immagine troppo bella, perché nasconde gli anni negativi e il vero rischio",
      no: ["Perché gli anni migliori non contano mai", "Perché i numeri positivi sono sempre falsi", "Perché la legge impone di mostrare solo gli anni peggiori"],
    },
    {
      q: "Un fondo ha fatto +5% in tre mesi e scrive: «Rendimento: 20% all'anno». Che cosa non va?",
      ok: "Moltiplicare un trimestre per quattro non è una previsione: i mercati non ripetono lo stesso risultato ogni trimestre",
      no: ["Niente: è il calcolo corretto del rendimento annuo", "Il calcolo corretto sarebbe 5% diviso 4", "Non va il fatto di aver usato percentuali"],
    },
    {
      q: "Quale frase è una comunicazione onesta?",
      ok: "«Abbiamo guadagnato il 6% netto l'anno scorso. Negli anni passati abbiamo avuto anche perdite, e potrebbe succedere ancora»",
      no: ["«Rendimento garantito del 10% l'anno, senza rischi»", "«Non abbiamo mai sbagliato e non sbaglieremo»", "«Chi investe oggi raddoppia il capitale in due anni»"],
    },
    {
      q: "A che cosa serve mostrare il confronto con un benchmark (un indice di riferimento adatto)?",
      ok: "A capire se il risultato del fondo è merito del gestore o semplicemente di un mercato che saliva",
      no: ["A nascondere le commissioni", "A garantire che il fondo batterà l'indice", "A far sembrare i rendimenti più grandi"],
    },
    {
      q: "Quale confronto è scorretto?",
      ok: "Confrontare un fondo prudente con un indice azionario molto rischioso solo perché quest'anno ha reso di più",
      no: ["Confrontare un fondo azionario con un indice azionario simile", "Mostrare più benchmark e spiegare la scelta", "Mostrare il benchmark sullo stesso periodo del fondo"],
    },
    {
      q: "Un fondo ha perso il 15% in un anno. Come dovrebbe comunicarlo ai suoi investitori?",
      ok: "Subito, con chiarezza: quanto si è perso, perché è successo e che cosa si fa ora",
      no: ["Aspettare di recuperare e non dire nulla", "Parlare solo dei mesi positivi dell'anno", "Dire che la perdita è colpa degli investitori"],
    },
    {
      q: "Un messaggio dice: «Rendimenti passati eccezionali: sono la prova di quanto guadagnerai». Che cosa non è corretto?",
      ok: "I risultati passati non garantiscono quelli futuri: dirlo come promessa è ingannevole",
      no: ["Niente: il passato è sempre una garanzia", "Non è corretto usare la parola «rendimenti»", "Il passato non esiste per i fondi"],
    },
    {
      q: "Che cosa vuol dire, in sintesi, che le informazioni agli investitori devono essere «corrette, chiare e non fuorvianti»?",
      ok: "Che non devono ingannare, né con parole false né con omissioni o numeri scelti ad arte",
      no: ["Che devono essere il più breve possibile", "Che devono usare molto gergo tecnico", "Che devono parlare solo dei risultati positivi"],
    },
    {
      q: "Perché in un messaggio onesto compaiono anche i rischi, per esempio la possibilità di perdere denaro?",
      ok: "Perché l'investitore deve poter decidere sapendo che cosa rischia, non solo che cosa potrebbe guadagnare",
      no: ["Perché i rischi fanno aumentare i rendimenti", "Perché lo vuole il gestore per spaventare i clienti", "Perché senza rischi il fondo non pagherebbe le commissioni"],
    },
    {
      q: "Un gestore scopre un errore nei numeri già inviati agli investitori. Quale comportamento è corretto?",
      ok: "Dirlo agli investitori, correggere i dati e spiegare che cosa è successo",
      no: ["Aspettare che nessuno se ne accorga", "Correggere i numeri in silenzio solo nei prossimi rapporti", "Dare la colpa a un cliente"],
    },
  ],
  "h10-lockup": [
    {
      q: "Che cos'è il periodo di lock-up in un fondo?",
      ok: "Un periodo iniziale in cui l'investitore non può chiedere indietro i suoi soldi",
      no: ["Il periodo in cui il fondo non può comprare titoli", "Il periodo in cui il gestore non incassa commissioni", "Il periodo in cui il fondo non pubblica il valore delle quote"],
    },
    {
      q: "Perché un fondo che investe in strumenti difficili da vendere in fretta chiede un lock-up?",
      ok: "Perché non può vendere tutto in un giorno senza perdere valore: serve tempo per far fruttare le posizioni",
      no: ["Perché così può aumentare le commissioni", "Perché la legge vieta di rimborsare nel primo anno", "Perché i rimborsi sono sempre gratuiti"],
    },
    {
      q: "Un fondo ha un lock-up di 12 mesi. Dopo 8 mesi l'investitore ha bisogno dei soldi. Che cosa succede, in generale?",
      ok: "Di solito non può uscire fino alla fine del lock-up (o può solo con una penale, se prevista)",
      no: ["Può sempre uscire subito senza costi", "Il fondo è obbligato a comprargli le quote al doppio", "Il gestore deve pagare l'investitore di tasca propria"],
    },
    {
      q: "Un fondo permette rimborsi solo a fine trimestre, con preavviso di 60 giorni. Che cosa significa il preavviso?",
      ok: "La richiesta va inviata almeno 60 giorni prima della data di rimborso, altrimenti slitta alla data successiva",
      no: ["Il fondo restituisce i soldi 60 giorni prima della richiesta", "L'investitore deve aspettare 60 anni", "Il preavviso serve solo per cambiare banca"],
    },
    {
      q: "Un investitore possiede 500 quote e il valore di una quota è 120 euro. Quanto vale la sua partecipazione?",
      ok: "60.000 euro",
      no: ["6.000 euro", "620 euro", "600.000 euro"],
    },
    {
      q: "Quella stessa partecipazione vale 60.000 euro. Se esce prima del tempo con una penale del 3% prevista dal regolamento, quanto riceve?",
      ok: "58.200 euro: 60.000 meno 1.800",
      no: ["59.700 euro", "57.000 euro", "60.000 euro: la penale non si applica"],
    },
    {
      q: "Che cos'è un «gate» (barriera) sui rimborsi?",
      ok: "Un limite alla quota del fondo che può essere rimborsata in una data, per non essere costretti a svendere",
      no: ["Un premio per chi chiede il rimborso subito", "Un'imposta sui guadagni del fondo", "Il numero di investitori ammessi nel fondo"],
    },
    {
      q: "Un fondo vale 200 milioni e ha un gate del 10% a trimestre. Qual è il massimo rimborsabile in quel trimestre?",
      ok: "20 milioni",
      no: ["10 milioni", "2 milioni", "100 milioni"],
    },
    {
      q: "Il fondo ha un gate che permette di rimborsare 20 milioni, ma gli investitori ne chiedono 50 milioni in totale. Quale quota della sua richiesta ottiene ciascuno, se si divide in modo proporzionale?",
      ok: "Il 40%: 20 diviso 50",
      no: ["Il 25%", "Il 50%", "Il 100%: il gate non cambia nulla"],
    },
    {
      q: "Con quel gate (20 milioni disponibili su 50 richiesti), un investitore aveva chiesto di ritirare 5 milioni. Quanto riceve in quel trimestre?",
      ok: "2 milioni; il resto resta nel fondo e va richiesto di nuovo",
      no: ["5 milioni", "2,5 milioni", "1 milione"],
    },
    {
      q: "Con un gate, che cosa succede alla parte di rimborso non pagata?",
      ok: "Resta in coda e viene pagata nelle date successive, secondo le regole del fondo",
      no: ["Viene persa dall'investitore", "Viene pagata subito dal gestore con i suoi soldi", "Si trasforma in azioni gratuite"],
    },
    {
      q: "Perché ci sono tante richieste di rimborso tutte insieme quando i mercati scendono?",
      ok: "Perché molti investitori hanno paura e vogliono uscire nello stesso momento: è proprio quando il fondo fatica a vendere",
      no: ["Perché i fondi regalano denaro quando i mercati scendono", "Perché i rimborsi sono gratuiti solo in quel periodo", "Perché i gestori obbligano gli investitori a uscire"],
    },
    {
      q: "Che cos'è la «sospensione» dei rimborsi?",
      ok: "Un blocco temporaneo, in casi eccezionali, dei rimborsi per proteggere tutti gli investitori e il valore del fondo",
      no: ["La chiusura definitiva del fondo senza restituire nulla", "Un premio per chi resta nel fondo", "La cancellazione delle commissioni"],
    },
    {
      q: "Che cosa dovrebbe chiedersi un investitore prima di entrare in un fondo con lock-up e rimborsi limitati?",
      ok: "Se potrà fare a meno di quei soldi per tutto il tempo in cui potrebbero essere bloccati",
      no: ["Se il gestore è simpatico", "Se il fondo promette di guadagnare sempre", "Se potrà ritirare tutto in un giorno quando vuole"],
    },
  ],
  "h10-aspettative": [
    {
      q: "Quale promessa dovrebbe far sospettare, da subito, una truffa?",
      ok: "«Rendimenti alti, costanti e senza alcun rischio»",
      no: ["«Il valore può salire e scendere»", "«Si può perdere denaro, anche tutto»", "«Le commissioni sono indicate nel documento»"],
    },
    {
      q: "Un fondo rende il 8% lordo all'anno, ma le commissioni e i costi totali valgono il 3% l'anno. Qual è il rendimento netto annuo?",
      ok: "5%",
      no: ["8%", "11%", "3%"],
    },
    {
      q: "100.000 euro crescono del 5% netto ogni anno. Quanto valgono dopo 2 anni?",
      ok: "110.250 euro: 100.000 x 1,05 x 1,05",
      no: ["110.000 euro: si sommano 5% e 5%", "105.000 euro", "120.250 euro"],
    },
    {
      q: "100.000 euro crescono dell'8% lordo ogni anno. Quanto valgono dopo 2 anni, prima delle commissioni?",
      ok: "116.640 euro: 100.000 x 1,08 x 1,08",
      no: ["116.000 euro: si sommano 8% e 8%", "108.000 euro", "126.640 euro"],
    },
    {
      q: "Per due anni il fondo crea 116.640 euro lordi, ma dopo i costi l'investitore ha 110.250 euro. Quanto sono costate le commissioni in questi due anni (differenza)?",
      ok: "6.390 euro",
      no: ["6.640 euro", "3.000 euro", "639 euro"],
    },
    {
      q: "Un fondo perde il 10% per tre anni di fila. Da 100 a quanto si arriva?",
      ok: "72,9: 100 x 0,9 x 0,9 x 0,9",
      no: ["70: si sommano tre perdite del 10%", "90", "73,5"],
    },
    {
      q: "Un investitore ha 50.000 euro nel fondo e il fondo perde il 20% da un massimo. Quanto perde, in euro, sulla carta?",
      ok: "10.000 euro",
      no: ["20.000 euro", "5.000 euro", "2.000 euro"],
    },
    {
      q: "Perché una persona che mette nel fondo i soldi che le servono tra pochi mesi per pagare una spesa sta sbagliando?",
      ok: "Perché il fondo può scendere proprio allora, e può avere rimborsi bloccati o limitati",
      no: ["Perché i fondi non permettono mai di spendere i soldi", "Perché le spese sono sempre più alte dei guadagni", "Perché in un fondo i soldi sono sempre protetti"],
    },
    {
      q: "Che cosa vuol dire adattare l'investimento alla propria «tolleranza al rischio»?",
      ok: "Scegliere un rischio che si riesce a sopportare, anche nei periodi di perdita, senza vendere nel panico",
      no: ["Scegliere sempre l'investimento che promette di più", "Non guardare mai quanto rischia il fondo", "Copiare ciò che fanno gli amici"],
    },
    {
      q: "Perché è prudente non mettere in un solo fondo, o in un solo tipo di investimento, tutti i propri risparmi?",
      ok: "Perché diversificare riduce il danno se uno di essi va male",
      no: ["Perché i fondi non guadagnano mai", "Perché è vietato dalla legge", "Perché così si pagano meno commissioni"],
    },
    {
      q: "Dopo un anno negativo, un investitore dice: «Lo avevo capito che poteva succedere». Che cosa gli ha permesso di dirlo?",
      ok: "Aver letto in anticipo i rischi e aver scelto l'importo in base a ciò che poteva permettersi di perdere",
      no: ["Aver ricevuto una garanzia scritta di non perdere", "Aver scelto il fondo di moda", "Aver ignorato i documenti per non preoccuparsi"],
    },
    {
      q: "Un fondo ha avuto un anno eccezionale. Che aspettativa è realistica per l'anno dopo?",
      ok: "Nessuna certezza: può andare bene, male o in modo normale, e l'anno eccezionale può anche non ripetersi",
      no: ["Certamente un altro anno eccezionale", "Certamente una perdita, per compensare", "Esattamente lo stesso risultato"],
    },
    {
      q: "Che differenza c'è tra una buona aspettativa e una promessa?",
      ok: "L'aspettativa è un'idea ragionevole di cosa può succedere, con i rischi; la promessa assicura un risultato che nessuno può garantire",
      no: ["Sono la stessa cosa", "La promessa è più onesta, perché è più precisa", "L'aspettativa vale solo per i fondi in perdita"],
    },
    {
      q: "Questo corso è educativo. Che cosa NON fa?",
      ok: "Non dà consigli personali su cosa comprare o vendere né promette guadagni",
      no: ["Non spiega nessun concetto sui fondi", "Non parla mai di rischi", "Indica i fondi migliori per ogni persona"],
    },
  ],
};
