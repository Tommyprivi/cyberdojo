import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H7 (Hedge fund). Una chiave per lezione: "h07-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 *
 * Convenzioni (dichiarate anche nelle lezioni): numeri fittizi, nessuna previsione;
 * percentuali sul capitale (NAV) del fondo; volatilità annua come deviazione standard;
 * nei calcoli di rischio con due o più asset la correlazione è dichiarata (spesso zero);
 * 252 giorni di borsa all'anno; costi di negoziazione come percentuale del valore scambiato.
 */
export const H07_ITEMS: Record<string, BankItem[]> = {
  "h07-obiettivi-vincoli": [
    { q: "Un fondo fittizio punta a un rendimento annuo del 8% con una volatilità del 10%. Quanto vale il rapporto rendimento/volatilità (senza tasso privo di rischio)?", ok: "0,8", no: ["1,25", "0,08", "18"] },
    { q: "Il valore di un fondo fittizio ha toccato un massimo di 150 milioni e ora vale 135 milioni. Qual è il drawdown attuale?", ok: "10%", no: ["15%", "11,1%", "9%"] },
    { q: "Un fondo fittizio da 250 milioni ha un limite del 4% per ogni singola posizione. Quanto può valere al massimo una posizione?", ok: "10 milioni", no: ["4 milioni", "25 milioni", "100 milioni"] },
    { q: "Un fondo ha un capitale di 50 milioni e posizioni (lunghe e corte, in valore assoluto) per 150 milioni in totale. Qual è la leva lorda?", ok: "3 volte il capitale", no: ["0,33 volte il capitale", "2 volte il capitale", "100 volte il capitale"] },
    { q: "Un fondo da 100 milioni ha una volatilità obiettivo del 12% annuo. Quanto vale, in ordine di grandezza, un'oscillazione annua tipica (una deviazione standard)?", ok: "Circa 12 milioni", no: ["Circa 1,2 milioni", "Circa 112 milioni", "Circa 8,3 milioni"] },
    { q: "Quale di queste frasi descrive un vincolo e non un obiettivo?", ok: "La leva lorda non deve superare 2 volte il capitale", no: ["Vogliamo un rendimento annuo del 6%", "Desideriamo una crescita regolare del valore", "Vogliamo fare meglio dell'indice di riferimento"] },
    { q: "Perché la liquidità è un vincolo importante per un fondo che permette rimborsi agli investitori?", ok: "Perché gli investitori possono chiedere indietro i soldi, e servono posizioni vendibili in tempo", no: ["Perché i titoli vanno venduti tutti ogni mese", "Perché tenere liquidità fa sempre guadagnare di più", "Perché la legge vieta di tenere titoli poco scambiati"] },
    { q: "Il fondo vuole un rendimento molto alto e una volatilità molto bassa nello stesso tempo. Che cosa va detto?", ok: "In generale i due obiettivi sono in tensione: più rendimento richiede di solito più rischio", no: ["Sono sempre compatibili con un buon gestore", "La volatilità non conta se il rendimento è alto", "Basta aumentare la leva per ottenere entrambi"] },
    { q: "Un fondo da 200 milioni ha un limite di drawdown del 10% dal massimo. A quale valore del fondo scatta il limite?", ok: "180 milioni", no: ["190 milioni", "160 milioni", "220 milioni"] },
    { q: "Che cos'è il mandato di un fondo?", ok: "Il documento che fissa obiettivi, strategie ammesse e limiti da rispettare", no: ["La previsione dei rendimenti dei prossimi anni", "Il contratto con il broker sulle commissioni", "L'elenco dei titoli che il gestore deve comprare"] },
    { q: "Un fondo perde il 20% dal suo massimo. Quale guadagno serve per tornare al massimo?", ok: "25%", no: ["20%", "30%", "16,7%"] },
    { q: "Il gestore è già alla leva massima consentita di 2 volte, ma non ha raggiunto l'obiettivo di rendimento. Che cosa è corretto fare?", ok: "Rispettare il vincolo e rivedere strategia o obiettivo", no: ["Superare il limite, tanto è solo per qualche giorno", "Spostare le posizioni in un altro veicolo senza dirlo", "Chiedere al broker di non segnalare la leva"] },
    { q: "Un fondo da 300 milioni ha un limite del 5% per posizione e ha una posizione da 12 milioni. La posizione rispetta il limite?", ok: "Sì: pesa il 4%, sotto il limite del 5%", no: ["No: pesa esattamente il 5%", "No: 12 milioni supera il 5", "Non si può dire senza il rendimento atteso"] },
  ],

  "h07-allocazione": [
    { q: "Un fondo fittizio ha il 40% in una strategia con rendimento atteso 8%, il 30% in una con 6%, il 20% in una con 5% e il 10% in una con 10%. Qual è il rendimento atteso del portafoglio?", ok: "7,0%", no: ["7,25%", "6,5%", "29%"] },
    { q: "Due strategie hanno volatilità 6% e 8%, correlazione zero e pesi 50/50. Qual è la volatilità del portafoglio?", ok: "5%", no: ["7%", "10%", "14%"] },
    { q: "Due strategie hanno volatilità 6% e 8%, correlazione +1 e pesi 50/50. Qual è la volatilità del portafoglio?", ok: "7%", no: ["5%", "10%", "1%"] },
    { q: "Due strategie hanno entrambe volatilità 10%, correlazione -1 e pesi 50/50. Qual è la volatilità del portafoglio?", ok: "0%", no: ["10%", "5%", "20%"] },
    { q: "Un fondo da 200 milioni divide il capitale in parti uguali tra 4 strategie. Quanto va a ciascuna?", ok: "50 milioni", no: ["25 milioni", "40 milioni", "100 milioni"] },
    { q: "Due strategie hanno volatilità 5% e 10%. Se si assegnano pesi inversi alla volatilità, quali sono i pesi?", ok: "66,7% alla meno volatile e 33,3% all'altra", no: ["50% e 50%", "33,3% alla meno volatile e 66,7% all'altra", "75% e 25%"] },
    { q: "Perché è rischioso dare più capitale alla strategia che ha reso di più nell'ultimo anno?", ok: "Il passato non garantisce il futuro, e spesso si arriva dopo che il rialzo è già avvenuto", no: ["Perché le strategie che vincono perdono sempre l'anno dopo", "Perché la legge vieta di cambiare i pesi", "Perché il rendimento passato non si può calcolare"] },
    { q: "Perché una bassa correlazione tra strategie è utile a chi alloca il capitale?", ok: "Perché le perdite di una strategia sono compensate più spesso dai guadagni delle altre", no: ["Perché i rendimenti diventano garantiti", "Perché la volatilità sparisce del tutto", "Perché le commissioni diventano più basse"] },
    { q: "Le correlazioni storiche tra strategie restano sempre uguali, anche in una crisi?", ok: "No: possono salire proprio in crisi e la diversificazione protegge meno", no: ["Sì: la correlazione è una costante del mercato", "Sì, se il fondo è molto grande", "No: in crisi scendono sempre"] },
    { q: "Il limite per una singola strategia è il 30% del capitale. La strategia macro oggi pesa 36 su 100 milioni. Che cosa succede?", ok: "Ha superato il limite di 6 punti percentuali", no: ["Rispetta il limite", "Ha superato il limite di 36 punti percentuali", "Ha superato il limite di 30 punti percentuali"] },
    { q: "Un fondo assegna il 60% a una strategia, il 30% a un'altra e il 20% a una terza. Perché l'allocazione non è valida (senza leva)?", ok: "I pesi sommano 110%, ma devono sommare 100%", no: ["I pesi sommano 90%, ma devono sommare 100%", "Una strategia non può superare il 50%", "I pesi devono essere tutti uguali"] },
    { q: "Il 60% del capitale è in una strategia che rende 10% e il 40% in una che rende -5%. Qual è il rendimento del portafoglio?", ok: "4%", no: ["5%", "2,5%", "8%"] },
    { q: "Se il capitale è diviso in parti uguali tra due strategie, il contributo al rischio è uguale?", ok: "No: la strategia più volatile pesa molto di più nel rischio totale", no: ["Sì: stesso capitale significa stesso rischio", "Sì, se la correlazione è alta", "No: pesa di più la strategia meno volatile"] },
  ],

  "h07-risk-parity": [
    { q: "Qual è l'idea di base del risk parity?", ok: "Ogni componente contribuisce in modo uguale al rischio del portafoglio", no: ["Ogni componente riceve lo stesso capitale", "Ogni componente ha lo stesso rendimento atteso", "Il portafoglio non può mai perdere"] },
    { q: "Obbligazioni con volatilità 5% e azioni con volatilità 15%, correlazione trascurabile. Con pesi inversi alla volatilità, quali sono i pesi?", ok: "75% obbligazioni e 25% azioni", no: ["50% e 50%", "25% obbligazioni e 75% azioni", "60% obbligazioni e 40% azioni"] },
    { q: "Tre asset hanno volatilità 10%, 20% e 20%. Con pesi inversi alla volatilità, quali sono i pesi?", ok: "50%, 25%, 25%", no: ["33%, 33%, 33%", "20%, 40%, 40%", "25%, 25%, 50%"] },
    { q: "Portafoglio 50/50 con obbligazioni (volatilità 5%) e azioni (volatilità 15%), correlazione zero. Quanto contribuiscono le azioni al rischio totale (come quota della varianza)?", ok: "90%", no: ["50%", "75%", "25%"] },
    { q: "Portafoglio 75/25 con obbligazioni (volatilità 5%) e azioni (volatilità 15%), correlazione zero. Quanto contribuiscono le obbligazioni al rischio totale (quota della varianza)?", ok: "50%", no: ["75%", "25%", "90%"] },
    { q: "Due asset hanno volatilità 3% e 12%, correlazione zero. Con pesi inversi alla volatilità, quali sono i pesi?", ok: "80% sul meno volatile e 20% sull'altro", no: ["50% e 50%", "20% sul meno volatile e 80% sull'altro", "75% e 25%"] },
    { q: "Un portafoglio risk parity ha volatilità 5% e si vuole arrivare al 10%. Quanta esposizione totale serve (in rapporto al capitale), a parità di proporzioni?", ok: "2 volte il capitale", no: ["0,5 volte il capitale", "5 volte il capitale", "1 volta il capitale"] },
    { q: "Perché i portafogli risk parity usano spesso la leva?", ok: "I pesi sono alti sulle attività poco volatili, quindi il portafoglio è poco rischioso e la leva lo porta al livello voluto", no: ["Perché la leva elimina il rischio", "Perché è obbligatoria per legge", "Perché serve solo a pagare le commissioni"] },
    { q: "Quale rischio importante ha un portafoglio risk parity con leva?", ok: "Se obbligazioni e azioni scendono insieme, la leva amplifica le perdite", no: ["Non ha rischi, perché è diversificato", "Il rischio è la troppa diversificazione", "Le obbligazioni non possono mai scendere"] },
    { q: "Quattro asset con volatilità molto diverse pesano il 25% ciascuno. Perché non è un portafoglio risk parity?", ok: "Gli asset più volatili contribuiscono molto di più al rischio degli altri", no: ["Perché i pesi uguali sono vietati", "Perché in risk parity i pesi devono sommare 200%", "Perché il risk parity usa solo due asset"] },
    { q: "In un portafoglio risk parity la volatilità di un asset raddoppia e gli altri restano uguali. Che cosa succede al suo peso?", ok: "Si riduce", no: ["Aumenta", "Resta uguale", "Diventa zero"] },
    { q: "Qual è un limite pratico del risk parity?", ok: "Stima il rischio con dati passati, e il rischio può cambiare", no: ["Richiede di prevedere i rendimenti futuri con precisione", "Non si può calcolare con più di un asset", "Elimina il rischio di perdita"] },
    { q: "Se la correlazione tra gli asset non è zero, bastano i pesi inversi alla volatilità per ottenere contributi uguali al rischio?", ok: "No: bisogna considerare anche le correlazioni", no: ["Sì: le correlazioni non contano mai", "Sì: basta dividere per il numero di asset", "No: servono solo i rendimenti attesi"] },
  ],

  "h07-esposizione": [
    { q: "Fondo fittizio con capitale 100: posizioni lunghe per 120 e corte per 70. Quanto vale l'esposizione netta in percentuale del capitale?", ok: "50%", no: ["190%", "70%", "120%"] },
    { q: "Fondo fittizio con capitale 100: posizioni lunghe per 120 e corte per 70. Quanto vale l'esposizione lorda in percentuale del capitale?", ok: "190%", no: ["50%", "120%", "170%"] },
    { q: "Un fondo ha lunghe per 80 e corte per 80 su un capitale di 100. Che cosa sono esposizione netta e lorda?", ok: "Netta 0% e lorda 160%", no: ["Netta 160% e lorda 0%", "Netta 80% e lorda 80%", "Netta 0% e lorda 80%"] },
    { q: "Esposizione netta 50% e mercato in calo del 10%, con titoli che si muovono come il mercato. Che cosa accade circa al fondo?", ok: "Perde circa il 5%", no: ["Perde il 10%", "Non perde, le posizioni corte compensano tutto", "Perde il 15%"] },
    { q: "Un fondo ha capitale 200 milioni, lunghe per 260 e corte per 60. Quanto vale l'esposizione netta sul capitale?", ok: "100%", no: ["130%", "160%", "30%"] },
    { q: "Un fondo ha capitale 50 milioni, lunghe per 75 e corte per 25. Quanto vale l'esposizione lorda sul capitale?", ok: "200%", no: ["100%", "150%", "50%"] },
    { q: "Il limite di esposizione netta è 30% del capitale. Il fondo ha capitale 100, lunghe 110 e corte 60. Che cosa succede?", ok: "Supera il limite: la netta è 50%", no: ["Rispetta il limite: la netta è 30%", "Rispetta il limite: la lorda è 170%", "Supera il limite: la netta è 110%"] },
    { q: "Perché si controlla anche l'esposizione lorda e non solo quella netta?", ok: "Misura la leva complessiva e il rischio che lunghe e corte si muovano in modo diverso", no: ["Perché è la perdita massima possibile", "Perché sostituisce il limite di drawdown", "Perché la lorda non può mai superare la netta"] },
    { q: "Si vende allo scoperto per 10 milioni un titolo. Quale perdita è teoricamente possibile?", ok: "Più di 10 milioni, perché il prezzo può salire senza limite", no: ["Al massimo 10 milioni", "Nessuna perdita, perché si è venduto", "Al massimo il 50% dei 10 milioni"] },
    { q: "Che cosa significa un'esposizione netta del -20%?", ok: "Le posizioni corte superano le lunghe: il fondo guadagna se il mercato scende e perde se sale (a parità di altre cose)", no: ["Il fondo ha già perso il 20%", "Il fondo ha una leva negativa", "Il fondo non ha posizioni lunghe"] },
    { q: "Come si calcola l'esposizione netta?", ok: "Posizioni lunghe meno posizioni corte, in percentuale del capitale", no: ["Posizioni lunghe più posizioni corte", "Solo le posizioni lunghe", "Il capitale meno la leva"] },
    { q: "Un fondo ha un'esposizione lorda del 250% del capitale. Quanto vale la leva lorda?", ok: "2,5 volte il capitale", no: ["250 volte il capitale", "0,4 volte il capitale", "1,5 volte il capitale"] },
    { q: "Esposizione netta pari a zero ma lorda al 200%. Che cosa è corretto dire?", ok: "Il rischio di mercato è basso, ma restano rischio di selezione e di leva, perché lunghe e corte possono muoversi in modo diverso", no: ["Il fondo non può perdere", "Il fondo non ha alcun rischio, perché la netta è zero", "La lorda non conta se la netta è zero"] },
  ],

  "h07-ribilanciamento": [
    { q: "Portafoglio fittizio 50/50 da 100 (50 azioni e 50 obbligazioni). Le azioni salgono del 50% e le obbligazioni restano ferme. Quanto pesano ora le azioni?", ok: "60%", no: ["75%", "50%", "55%"] },
    { q: "Nello stesso caso (azioni 75, obbligazioni 50), quanto si deve vendere di azioni per tornare a 50/50?", ok: "12,5", no: ["25", "7,5", "50"] },
    { q: "Perché si ribilancia un portafoglio?", ok: "Per riportare il rischio al livello voluto, perché i pesi cambiano con i prezzi", no: ["Per garantire un guadagno", "Per vendere sempre i titoli in perdita", "Perché la legge lo impone ogni mese"] },
    { q: "Il peso obiettivo di un asset è 40% con una banda di più o meno 5 punti. Oggi pesa 47%. Che cosa si fa?", ok: "Si ribilancia: ha superato il limite della banda (45%)", no: ["Niente: la banda è ±10 punti", "Si ribilancia solo a fine anno", "Si compra altro dello stesso asset"] },
    { q: "Il peso obiettivo è 40% con una banda di più o meno 5 punti. Oggi pesa 43%. Che cosa si fa?", ok: "Niente: è dentro la banda tra 35% e 45%", no: ["Si ribilancia subito", "Si vende tutto l'asset", "Si raddoppia la posizione"] },
    { q: "Un ribilanciamento muove 20 milioni e il costo è 0,05% del valore scambiato. Quanto si paga?", ok: "10.000", no: ["100.000", "1.000", "10"] },
    { q: "Che effetto ha ribilanciare troppo spesso?", ok: "Aumentano i costi di negoziazione", no: ["Il rischio diventa zero", "I pesi si allontanano dal target", "Le commissioni di performance scompaiono"] },
    { q: "Che effetto ha ribilanciare troppo di rado?", ok: "I pesi si allontanano dal target e il portafoglio può correre più rischio del voluto", no: ["Aumentano sempre i guadagni", "Il rischio scende da solo", "I costi diventano maggiori"] },
    { q: "Che differenza c'è tra ribilanciamento a calendario e a soglia?", ok: "A calendario si agisce a date fisse; a soglia solo quando un peso esce da una banda", no: ["Sono la stessa cosa", "A calendario si agisce solo in perdita; a soglia solo in guadagno", "A soglia si ribilancia ogni giorno"] },
    { q: "Un'azione sale con forza per mesi. Che cosa può causare vendere una parte per ribilanciare?", ok: "Può ridurre i guadagni se il rialzo continua, ma tiene il rischio sotto controllo", no: ["Garantisce di vendere al massimo", "Fa perdere sempre denaro", "Non cambia nulla, perché il peso resta uguale"] },
    { q: "Portafoglio 50/50 da 200 (100 azioni e 100 obbligazioni). Le azioni scendono del 40% e le obbligazioni restano ferme. Quanto pesano ora le azioni?", ok: "37,5%", no: ["40%", "30%", "50%"] },
    { q: "Nello stesso caso (azioni 60, obbligazioni 100), che cosa serve per tornare a 50/50?", ok: "Vendere 20 di obbligazioni e comprare 20 di azioni", no: ["Vendere 20 di azioni e comprare 20 di obbligazioni", "Non fare nulla", "Vendere 40 di obbligazioni e tenere i soldi fermi"] },
    { q: "Il ribilanciamento crea guadagni da solo?", ok: "No: riporta i pesi al target e controlla il rischio, ma non garantisce guadagni", no: ["Sì: vende sempre al prezzo più alto", "Sì: elimina le perdite", "No: serve solo a ridurre le commissioni"] },
    { q: "Quale difficoltà può avere un ribilanciamento in un mercato in crisi?", ok: "Può essere difficile vendere o comprare a prezzi corretti perché mancano compratori o venditori", no: ["Le regole vietano di negoziare", "I pesi diventano uguali da soli", "I costi di negoziazione diventano zero"] },
  ],

  "h07-monitoraggio": [
    { q: "Una posizione vale 5 milioni. Il volume scambiato ogni giorno vale 1 milione e il fondo vende al massimo il 20% del volume. Quanti giorni servono per uscire?", ok: "25 giorni", no: ["5 giorni", "20 giorni", "100 giorni"] },
    { q: "I rendimenti giornalieri di un fondo hanno una deviazione standard dell'1%. Con 252 giorni di borsa, quanto vale circa la volatilità annua?", ok: "Circa 16%", no: ["Circa 1%", "Circa 252%", "Circa 63%"] },
    { q: "Il valore di un fondo ha toccato un massimo di 80 milioni e ora vale 72 milioni. Quanto vale il drawdown?", ok: "10%", no: ["8%", "11,1%", "9%"] },
    { q: "Soglia di allerta del drawdown 8%, soglia di blocco 12%. Il drawdown è 10%. In che stato è il fondo?", ok: "Sopra l'allerta e sotto il blocco: si segnala e si valuta che cosa fare", no: ["Sotto l'allerta: va tutto bene", "Oltre il blocco: si chiude il fondo", "Nessun problema: conta solo il rendimento"] },
    { q: "Un fondo da 200 milioni ha le cinque posizioni maggiori per 30 milioni in totale. Quanto pesano sul capitale?", ok: "15%", no: ["6%", "30%", "150%"] },
    { q: "La volatilità obiettivo è 10% e quella realizzata è 14%. Qual è la differenza?", ok: "4 punti percentuali sopra l'obiettivo", no: ["4 punti percentuali sotto l'obiettivo", "14 punti percentuali sopra l'obiettivo", "1,4 punti percentuali sopra l'obiettivo"] },
    { q: "Perché si fissa una soglia di allerta prima del limite vero e proprio?", ok: "Per avere il tempo di agire prima di violare il limite", no: ["Per avere un limite doppio e più alto", "Per evitare di monitorare il fondo ogni giorno", "Per eliminare il rischio"] },
    { q: "Perché il monitoraggio del rischio dovrebbe essere affidato anche a una funzione indipendente dal gestore?", ok: "Perché chi guadagna dalla performance può avere un conflitto di interessi", no: ["Perché il gestore non sa calcolare il rischio", "Perché la funzione indipendente può cambiare i limiti", "Perché così si evitano i rimborsi"] },
    { q: "Perché guardare solo il rendimento non basta per monitorare un fondo?", ok: "Un rendimento alto può nascondere troppa leva, troppa concentrazione o poca liquidità", no: ["Perché il rendimento è sempre falso", "Perché il rendimento non si può misurare", "Perché conta solo il drawdown"] },
    { q: "Che cosa si cerca di capire con l'attribuzione del rendimento?", ok: "Da dove viene il risultato: abilità, esposizione al mercato o fattori di rischio", no: ["Quanto sarà il rendimento dell'anno prossimo", "Quali investitori hanno guadagnato di più", "Quanto costa il ribilanciamento"] },
    { q: "L'esposizione netta ha un limite del 30%. Oggi è 32% da due giorni. Che cosa è corretto fare?", ok: "Segnalare la violazione, documentarla e riportare l'esposizione dentro il limite", no: ["Aspettare che il mercato scenda", "Alzare il limite senza avvisare nessuno", "Ignorare la cosa, perché è solo il 2%"] },
    { q: "Che cosa misura un indicatore di liquidità come i giorni per liquidare il portafoglio?", ok: "Il tempo per vendere le posizioni senza muovere troppo il prezzo", no: ["Il tempo per ricevere il rendimento", "Il numero di investitori nel fondo", "Il tempo che manca alla fine dell'anno"] },
    { q: "Rimborsi richiesti pari al 20% del capitale, da pagare entro 30 giorni. Le posizioni vendibili in 30 giorni valgono il 15% del capitale. Che cosa si nota?", ok: "Mancano 5 punti percentuali del capitale: c'è un problema di liquidità", no: ["Va tutto bene: 15% basta", "Si hanno 5 punti percentuali in più del necessario", "Il fondo deve solo comprare altre posizioni illiquide"] },
  ],
};
