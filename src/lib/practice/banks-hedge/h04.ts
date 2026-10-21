import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo H4 (Hedge fund). Una chiave per lezione: "h04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 *
 * Convenzioni (dichiarate anche nelle lezioni): aziende e numeri fittizi, importi in milioni di euro;
 * azienda di riferimento «Officine Lumi» (10 milioni di azioni, prezzo 15 euro);
 * quick ratio = (attivo corrente - magazzino) / passività correnti; debt/equity = debiti finanziari / patrimonio netto;
 * EV = capitalizzazione + debiti finanziari - cassa; ROE = utile netto / patrimonio netto;
 * flusso operativo = utile netto + ammortamenti + variazione del circolante; flusso libero = flusso operativo - investimenti;
 * DCF con flussi a fine anno e tasso di sconto costante. Nessun numero è una previsione né un consiglio.
 */
export const H04_ITEMS: Record<string, BankItem[]> = {
  "h04-bilancio": [
    { q: "Un'azienda fittizia ha attivo totale 200 milioni e debiti totali 120 milioni. Quanto vale il patrimonio netto?", ok: "80 milioni", no: ["320 milioni", "120 milioni", "200 milioni"] },
    { q: "Perché lo stato patrimoniale «torna» sempre in pareggio?", ok: "Perché attivo = passivo + patrimonio netto: ciò che l'azienda possiede è finanziato da debiti o da capitale dei soci", no: ["Perché i revisori correggono i numeri finché i totali coincidono", "Perché i ricavi sono sempre uguali ai costi", "Perché i debiti sono sempre uguali al patrimonio netto"] },
    { q: "Che cosa mostra lo stato patrimoniale, a differenza del conto economico?", ok: "Una fotografia a una data: che cosa l'azienda possiede e come è finanziata", no: ["Un film di un periodo: ricavi, costi e utile", "La previsione dei guadagni dei prossimi anni", "L'elenco dei clienti e dei fornitori con i relativi prezzi"] },
    { q: "Quale tra queste voci è tipicamente un'attività corrente, cioè trasformabile in cassa entro circa un anno?", ok: "Il magazzino di prodotti finiti", no: ["Un impianto produttivo con vita utile di dieci anni", "Un debito verso una banca da rimborsare in cinque anni", "Il capitale versato dai soci"] },
    { q: "Attivo corrente 60 milioni, passività correnti 40 milioni. Quanto vale il current ratio (attivo corrente / passività correnti)?", ok: "1,5", no: ["0,67", "20", "2,0"] },
    { q: "Attivo corrente 60 milioni, di cui magazzino 30 milioni; passività correnti 40 milioni. Quanto vale il quick ratio, cioè (attivo corrente - magazzino) / passività correnti?", ok: "0,75", no: ["1,5", "0,5", "1,25"] },
    { q: "Debiti finanziari 60 milioni, patrimonio netto 120 milioni. Quanto vale il rapporto debiti finanziari / patrimonio netto?", ok: "0,5", no: ["2,0", "0,33", "1,5"] },
    { q: "Che cosa significa che un'azienda ha un patrimonio netto negativo?", ok: "Ha più debiti di quanto possiede: il capitale dei soci è stato consumato dalle perdite", no: ["Ha troppa cassa e deve distribuirla ai soci", "Ha chiuso l'anno con ricavi negativi", "Non ha debiti verso nessuno"] },
    { q: "Un'azienda ha attivo 150 milioni e patrimonio netto 90 milioni. A quanto ammontano i suoi debiti totali?", ok: "60 milioni", no: ["240 milioni", "90 milioni", "150 milioni"] },
    { q: "I crediti verso clienti crescono molto più in fretta dei ricavi. Quale spiegazione va controllata per prima?", ok: "I clienti pagano in ritardo, oppure le vendite non vengono davvero incassate", no: ["L'azienda sta guadagnando di più per ogni vendita", "L'azienda ha ridotto i debiti verso le banche", "Il magazzino è diventato più grande"] },
    { q: "Il patrimonio netto a bilancio è il prezzo a cui il mercato valuta l'azienda?", ok: "No: è un valore contabile, il mercato può valutarla molto più o molto meno", no: ["Sì, i due valori coincidono sempre", "Sì, ma solo per le aziende quotate in borsa", "No: il patrimonio netto è sempre più alto del prezzo di mercato"] },
    { q: "Debiti finanziari 60 milioni, cassa 10 milioni. Quanto vale il debito netto?", ok: "50 milioni", no: ["70 milioni", "60 milioni", "10 milioni"] },
    { q: "Attivo 205 milioni; passività: fornitori 25, debiti finanziari a breve 15, debiti finanziari a lungo 45. Quanto vale il patrimonio netto?", ok: "120 milioni", no: ["85 milioni", "205 milioni", "180 milioni"] },
    { q: "Perché un analista legge anche le note al bilancio e non solo i prospetti?", ok: "Perché spiegano i criteri contabili, le stime usate e gli impegni che non si vedono nei numeri principali", no: ["Perché contengono i prezzi futuri delle azioni", "Perché sostituiscono il conto economico", "Perché servono solo ai revisori e non agli investitori"] },
  ],

  "h04-conto-economico": [
    { q: "Ricavi 200 milioni, costo del venduto 120 milioni. Quanto vale il margine lordo in percentuale dei ricavi?", ok: "40%", no: ["60%", "80%", "120%"] },
    { q: "Ricavi 200 milioni ed EBITDA 40 milioni. Quanto vale il margine EBITDA?", ok: "20%", no: ["5%", "40%", "16%"] },
    { q: "EBITDA 40 milioni, ammortamenti 15 milioni. Quanto vale l'EBIT (risultato operativo)?", ok: "25 milioni", no: ["55 milioni", "40 milioni", "15 milioni"] },
    { q: "EBIT 25 milioni, interessi 5 milioni, imposte al 25% sull'utile prima delle imposte. Quanto vale l'utile netto?", ok: "15 milioni", no: ["20 milioni", "18,75 milioni", "5 milioni"] },
    { q: "Utile netto 15 milioni su ricavi di 200 milioni. Quanto vale il margine netto?", ok: "7,5%", no: ["13,3%", "15%", "75%"] },
    { q: "Utile netto 15, ammortamenti 15, variazione del capitale circolante -5 (assorbe cassa). Quanto vale il flusso di cassa operativo?", ok: "25 milioni", no: ["35 milioni", "30 milioni", "5 milioni"] },
    { q: "Flusso di cassa operativo 25 milioni, investimenti in impianti 10 milioni. Quanto vale il flusso di cassa libero?", ok: "15 milioni", no: ["35 milioni", "25 milioni", "10 milioni"] },
    { q: "Un'azienda dichiara un utile positivo ma la cassa in fondo all'anno è scesa. Quale spiegazione è possibile?", ok: "Clienti che non hanno ancora pagato, scorte aumentate o forti investimenti", no: ["L'utile è sempre uguale alla cassa, quindi i dati sono falsi", "Gli ammortamenti hanno fatto uscire cassa", "Le imposte non si pagano mai in contanti"] },
    { q: "L'ammortamento è un'uscita di cassa nell'anno in cui compare nel conto economico?", ok: "No: ripartisce nel tempo il costo di un bene già pagato", no: ["Sì, è un pagamento ai fornitori dell'anno", "Sì, è una tassa sui macchinari", "No: è un ricavo che non è stato incassato"] },
    { q: "I ricavi passano da 200 a 220 milioni. Di quanto sono cresciuti in percentuale?", ok: "10%", no: ["20%", "9,1%", "11%"] },
    { q: "Utile netto 30 milioni, di cui 20 milioni da una sola vendita di un immobile. Quanto vale l'utile ricorrente?", ok: "10 milioni", no: ["50 milioni", "20 milioni", "30 milioni"] },
    { q: "EBIT 25 milioni, interessi 5 milioni. Quante volte l'utile operativo copre gli interessi?", ok: "5 volte", no: ["20 volte", "0,2 volte", "30 volte"] },
    { q: "Quali sono le tre sezioni del rendiconto finanziario?", ok: "Attività operativa, investimenti e finanziamento", no: ["Ricavi, costi e utile", "Attivo, passivo e patrimonio netto", "Vendite, magazzino e crediti"] },
    { q: "Flusso operativo +25, investimenti -10, finanziamento -9 (rimborsi e dividendi). Di quanto varia la cassa nell'anno?", ok: "+6 milioni", no: ["+24 milioni", "-6 milioni", "+26 milioni"] },
    { q: "Che cosa indica la sigla EBITDA?", ok: "L'utile prima di interessi, imposte, svalutazioni e ammortamenti", no: ["L'utile netto dopo tutte le imposte", "I ricavi meno il costo del venduto", "Il flusso di cassa distribuito ai soci"] },
  ],

  "h04-indici-multipli": [
    { q: "Un'azienda fittizia ha 10 milioni di azioni quotate 15 euro ciascuna. Quanto vale la capitalizzazione di borsa?", ok: "150 milioni di euro", no: ["25 milioni di euro", "15 milioni di euro", "1,5 milioni di euro"] },
    { q: "Utile netto 15 milioni e 10 milioni di azioni. Quanto vale l'utile per azione?", ok: "1,5 euro", no: ["0,67 euro", "15 euro", "150 euro"] },
    { q: "Prezzo 15 euro e utile per azione 1,5 euro. Quanto vale il P/E?", ok: "10", no: ["0,1", "22,5", "16,5"] },
    { q: "Capitalizzazione 150 milioni, debiti finanziari 60 milioni, cassa 10 milioni. Quanto vale l'enterprise value (EV)?", ok: "200 milioni", no: ["220 milioni", "150 milioni", "80 milioni"] },
    { q: "EV 200 milioni ed EBITDA 40 milioni. Quanto vale il multiplo EV/EBITDA?", ok: "5", no: ["0,2", "8", "3,75"] },
    { q: "Capitalizzazione 150 milioni, patrimonio netto 120 milioni. Quanto vale il rapporto prezzo/patrimonio netto (P/B)?", ok: "1,25", no: ["0,8", "30", "1,5"] },
    { q: "Capitalizzazione 150 milioni, ricavi 200 milioni. Quanto vale il rapporto prezzo/ricavi (P/S)?", ok: "0,75", no: ["1,33", "50", "1,25"] },
    { q: "Un P/E di 10 equivale a un «rendimento degli utili» (utile / prezzo) di quanto?", ok: "10%", no: ["1%", "100%", "20%"] },
    { q: "Utile netto 15 milioni, patrimonio netto 120 milioni. Quanto vale il ROE?", ok: "12,5%", no: ["8%", "7,5%", "125%"] },
    { q: "Dividendo di 0,30 euro per azione e prezzo di 15 euro. Quanto vale il rendimento da dividendo?", ok: "2%", no: ["5%", "0,2%", "4,5%"] },
    { q: "Perché per confrontare aziende con livelli di debito diversi si usa spesso l'EV/EBITDA invece del solo P/E?", ok: "Perché l'EV tiene conto anche del debito, che chi compra l'azienda si deve prendere", no: ["Perché l'EBITDA è sempre più alto dell'utile netto e quindi più prudente", "Perché il P/E non si può calcolare per le aziende indebitate", "Perché l'EV/EBITDA prevede il prezzo futuro"] },
    { q: "Il prezzo di un'azione raddoppia e l'utile per azione resta uguale. Che cosa succede al P/E?", ok: "Raddoppia", no: ["Si dimezza", "Resta uguale", "Diventa zero"] },
    { q: "Due aziende dello stesso settore: la prima ha P/E 10, la seconda P/E 20. Quale lettura è più prudente?", ok: "La prima costa meno per euro di utile: può essere un'occasione o avere problemi, serve capire perché", no: ["La prima è sicuramente un affare", "La seconda è sicuramente sopravvalutata", "I due P/E non dicono nulla, sono solo numeri"] },
    { q: "Un ROE molto alto è sempre un buon segno?", ok: "No: può dipendere da molto debito o da un patrimonio netto ridotto dalle perdite", no: ["Sì, indica sempre un'azienda senza rischi", "Sì, perché il ROE misura il flusso di cassa", "No: il ROE non può mai superare il 10%"] },
    { q: "Capitalizzazione 90 milioni e utile ricorrente 10 milioni. Quanto vale il P/E sull'utile ricorrente?", ok: "9", no: ["0,11", "80", "11,1"] },
  ],

  "h04-valore-intrinseco": [
    { q: "Che cosa si intende per valore intrinseco di un'azienda?", ok: "La stima di quanto valgono oggi i flussi di cassa che produrrà in futuro", no: ["Il prezzo a cui l'azione è quotata oggi", "Il patrimonio netto scritto a bilancio", "Il prezzo massimo toccato dall'azione nell'ultimo anno"] },
    { q: "Un'azienda fittizia produrrà 8 milioni l'anno per sempre e il tasso di sconto è 10%. Quanto vale oggi (flusso / tasso)?", ok: "80 milioni", no: ["8 milioni", "800 milioni", "88 milioni"] },
    { q: "Flusso del prossimo anno 8 milioni, crescita 2% l'anno per sempre, tasso di sconto 10%. Quanto vale, con la formula flusso / (tasso - crescita)?", ok: "100 milioni", no: ["80 milioni", "66,7 milioni", "133 milioni"] },
    { q: "Stesso caso (flusso 8, crescita 2%) ma con tasso di sconto 12%. Quanto vale?", ok: "80 milioni", no: ["100 milioni", "57 milioni", "66,7 milioni"] },
    { q: "Valore intrinseco stimato 20 euro per azione, prezzo 15 euro. Quanto vale il margine di sicurezza, calcolato come (valore - prezzo) / valore?", ok: "25%", no: ["33%", "5%", "75%"] },
    { q: "Valore stimato 100 euro per azione e margine di sicurezza richiesto del 30%. Qual è il prezzo massimo da pagare?", ok: "70 euro", no: ["130 euro", "30 euro", "77 euro"] },
    { q: "Perché chi valuta le aziende pretende un margine di sicurezza?", ok: "Perché le stime sono incerte e il margine copre in parte i propri errori", no: ["Perché il mercato garantisce di tornare al valore intrinseco", "Perché così il rendimento è certo", "Perché lo impone la legge a ogni investitore"] },
    { q: "Il valore intrinseco di un'azienda è un numero esatto e uguale per tutti?", ok: "No: è una stima, meglio un intervallo, e analisti diversi arrivano a numeri diversi", no: ["Sì, se si usano tutti i dati del bilancio", "Sì, ma solo per aziende quotate", "No: è sempre uguale al patrimonio netto"] },
    { q: "Se il tasso di sconto sale e i flussi restano uguali, che cosa succede al valore stimato?", ok: "Scende", no: ["Sale", "Resta uguale", "Diventa uguale al prezzo di mercato"] },
    { q: "Un'azienda produrrà 12 milioni l'anno per sempre e il tasso di sconto è 6%. Quanto vale?", ok: "200 milioni", no: ["72 milioni", "12,7 milioni", "20 milioni"] },
    { q: "Il patrimonio netto a bilancio coincide con il valore intrinseco?", ok: "No: il bilancio registra costi storici, il valore intrinseco guarda i flussi futuri", no: ["Sì, per definizione", "Sì, se l'azienda è in utile", "No: il valore intrinseco è sempre più basso del patrimonio netto"] },
    { q: "Nella formula flusso / (tasso - crescita), perché la crescita non può superare il tasso di sconto per sempre?", ok: "Altrimenti il risultato sarebbe negativo o infinito, senza senso: nessuna azienda cresce più dell'economia in eterno", no: ["Perché il tasso di sconto deve essere sempre il 10%", "Perché la crescita è sempre zero", "Perché il flusso diventa negativo dopo un anno"] },
    { q: "Il prezzo di un'azione scende del 30% senza notizie sull'azienda. Il valore intrinseco è sceso del 30%?", ok: "Non necessariamente: il prezzo si muove anche per emozioni e liquidità, il valore dipende dai flussi attesi", no: ["Sì, il prezzo e il valore coincidono sempre", "Sì, ma solo se il calo dura un anno", "No: il valore è sceso del 60%"] },
    { q: "Un flusso di 5 milioni l'anno per sempre, tasso di sconto 5%. Quanto vale?", ok: "100 milioni", no: ["25 milioni", "5 milioni", "0,25 milioni"] },
  ],

  "h04-dcf": [
    { q: "Un flusso di 11 milioni arriva tra un anno e il tasso di sconto è 10%. Quanto vale oggi?", ok: "10 milioni", no: ["12,1 milioni", "11 milioni", "9 milioni"] },
    { q: "Un flusso di 12,1 milioni arriva tra due anni e il tasso di sconto è 10%. Quanto vale oggi?", ok: "10 milioni", no: ["9,9 milioni", "11 milioni", "13,3 milioni"] },
    { q: "Un flusso di 13,31 milioni arriva tra tre anni e il tasso di sconto è 10% (1,1 x 1,1 x 1,1 = 1,331). Quanto vale oggi?", ok: "10 milioni", no: ["11,3 milioni", "12,1 milioni", "4,4 milioni"] },
    { q: "Tra un anno ricevi 55 milioni e il tasso di sconto è 10%. Quanto vale oggi?", ok: "50 milioni", no: ["49,5 milioni", "55 milioni", "60,5 milioni"] },
    { q: "Valore fra due anni di 121 milioni, tasso di sconto 10%. Quanto vale oggi?", ok: "100 milioni", no: ["110 milioni", "101 milioni", "99 milioni"] },
    { q: "Flussi attualizzati: 15 + 15 + 15 milioni; valore terminale attualizzato 150 milioni. Quanto vale l'enterprise value (EV)?", ok: "195 milioni", no: ["45 milioni", "150 milioni", "165 milioni"] },
    { q: "EV 195 milioni, debito netto 50 milioni, 10 milioni di azioni. Quanto vale il capitale per azione?", ok: "14,5 euro", no: ["19,5 euro", "24,5 euro", "4,5 euro"] },
    { q: "Flusso del primo anno dopo la previsione esplicita 20 milioni, crescita 0%, tasso di sconto 10%. Quanto vale il valore terminale (a quella data)?", ok: "200 milioni", no: ["20 milioni", "2.000 milioni", "22 milioni"] },
    { q: "Flusso del primo anno dopo la previsione esplicita 18 milioni, crescita 2%, tasso di sconto 10%. Quanto vale il valore terminale?", ok: "225 milioni", no: ["180 milioni", "150 milioni", "204 milioni"] },
    { q: "Il valore terminale a fine anno 3 è 133,1 milioni e il tasso di sconto è 10%. Quanto vale oggi?", ok: "100 milioni", no: ["133,1 milioni", "110 milioni", "120,9 milioni"] },
    { q: "Se il tasso di sconto aumenta e i flussi previsti restano uguali, che cosa succede al valore DCF?", ok: "Diminuisce", no: ["Aumenta", "Resta uguale", "Diventa uguale al prezzo di mercato"] },
    { q: "Flussi esplicitamente previsti attualizzati 30 milioni, valore terminale attualizzato 90 milioni. Quale quota del valore viene dal valore terminale?", ok: "75%", no: ["25%", "33%", "90%"] },
    { q: "Perché nel DCF il valore terminale è la parte più delicata?", ok: "Perché spesso pesa gran parte del valore e piccole modifiche di tasso e crescita lo spostano molto", no: ["Perché è l'unica parte che si conosce con certezza", "Perché non dipende da nessuna ipotesi", "Perché si calcola sul prezzo dell'ultimo giorno di borsa"] },
    { q: "EV 130 milioni, debiti finanziari 60 milioni, cassa 10 milioni. Quanto vale il capitale dei soci?", ok: "80 milioni", no: ["200 milioni", "70 milioni", "60 milioni"] },
    { q: "Un flusso costante di 10 milioni (crescita 0%): il tasso scende dal 10% all'8%. Quanto vale ora il valore terminale?", ok: "125 milioni", no: ["100 milioni", "80 milioni", "110 milioni"] },
    { q: "Un DCF con risultato di 14,53 euro per azione è più affidabile di uno che dà «tra 12 e 17 euro»?", ok: "No: la precisione dei decimali è apparente, le ipotesi restano incerte", no: ["Sì, perché è più preciso", "Sì, perché usa più cifre", "No: il DCF è sempre esatto, quindi i due valori coincidono"] },
  ],

  "h04-confronto": [
    { q: "Tre aziende fittizie dello stesso settore hanno EV/EBITDA di 4, 6 e 8. Qual è la mediana?", ok: "6", no: ["4", "8", "18"] },
    { q: "Multipli EV/EBITDA dei confronti: 4, 5, 6 e 30 (un caso anomalo). Qual è la mediana?", ok: "5,5", no: ["11,25", "6", "30"] },
    { q: "Perché con un valore anomalo spesso si preferisce la mediana alla media?", ok: "Perché la mediana è molto meno spostata dai casi estremi", no: ["Perché la mediana è sempre più alta", "Perché la media non si può calcolare con quattro dati", "Perché la mediana include il valore anomalo due volte"] },
    { q: "EBITDA 40 milioni e multiplo di confronto 6. Quale enterprise value implicito si ottiene?", ok: "240 milioni", no: ["46 milioni", "6,7 milioni", "34 milioni"] },
    { q: "EV implicito 240 milioni, debito netto 50 milioni, 10 milioni di azioni. Quanto vale il capitale per azione?", ok: "19 euro", no: ["24 euro", "29 euro", "14 euro"] },
    { q: "Il P/E mediano delle aziende confrontabili è 10 e l'utile per azione dell'azienda è 1,5 euro. Quale prezzo implicito si ottiene?", ok: "15 euro", no: ["11,5 euro", "6,7 euro", "1,5 euro"] },
    { q: "Azienda X: EV 300 milioni ed EBITDA 50 milioni. Azienda Y: EV 240 milioni ed EBITDA 60 milioni. Quale costa meno per euro di EBITDA?", ok: "Y, con multiplo 4 contro 6", no: ["X, con multiplo 6 contro 4", "Sono uguali, perché la differenza di EV è compensata", "X, perché ha l'EV più alto"] },
    { q: "Azienda A: ricavi 200 e EBIT 25. Azienda B: ricavi 400 e EBIT 40. Quale ha il margine operativo più alto?", ok: "A, con 12,5% contro 10%", no: ["B, perché ha l'EBIT più alto", "B, con 10% contro 8%", "Sono uguali"] },
    { q: "Azienda A: utile 15 e patrimonio netto 120. Azienda B: utile 20 e patrimonio netto 200. Qual è il ROE più alto?", ok: "A, con 12,5% contro 10%", no: ["B, perché l'utile è più alto", "B, con 10% contro 8%", "Sono uguali"] },
    { q: "Perché confrontare un'azienda con altre dello stesso settore e dimensione simile?", ok: "Perché margini, crescita e rischi dipendono molto dal tipo di attività", no: ["Perché i multipli sono uguali in tutti i settori", "Perché la legge vieta di confrontare settori diversi", "Perché così il prezzo non può cambiare"] },
    { q: "Una società di confronto ha multiplo EV/EBITDA 5 e EBITDA 20 milioni; il debito netto è 30 milioni. Quanto vale il capitale?", ok: "70 milioni", no: ["100 milioni", "130 milioni", "20 milioni"] },
    { q: "Perché i bilanci da confrontare devono avere criteri contabili e periodi omogenei?", ok: "Perché con regole o date diverse gli stessi numeri non misurano la stessa cosa", no: ["Perché i criteri non cambiano mai i numeri", "Perché il confronto riguarda solo i nomi delle voci", "Perché il periodo influisce solo sul prezzo delle azioni"] },
    { q: "Due aziende hanno lo stesso P/E, ma una cresce molto più in fretta. Che cosa significa?", ok: "Che a parità di prezzo per euro di utile una offre più crescita: serve guardare anche questo", no: ["Che hanno lo stesso valore", "Che quella che cresce è sicuramente sopravvalutata", "Che il P/E è sbagliato"] },
    { q: "Tutto il settore ha multipli molto alti. L'azienda ha un multiplo nella media del settore. Il confronto prova che è conveniente?", ok: "No: dice solo che costa come le altre, e l'intero settore può essere caro", no: ["Sì, perché è nella media", "Sì, perché i multipli alti sono sempre giustificati", "No: perché la media non esiste mai"] },
  ],

  "h04-trappole": [
    { q: "Un'azienda fittizia ha capitalizzazione 80 milioni e utile 20 milioni, ma 12 milioni sono una vendita di un immobile una tantum. Quanto vale il P/E sull'utile dichiarato?", ok: "4", no: ["10", "8", "0,25"] },
    { q: "Stesso caso: capitalizzazione 80 milioni, utile ricorrente 8 milioni. Quanto vale il P/E sull'utile ricorrente?", ok: "10", no: ["4", "6,7", "100"] },
    { q: "Che cos'è una «trappola del valore» (value trap)?", ok: "Un'azienda che sembra a buon mercato per i multipli ma che vale poco, perché i suoi utili si stanno deteriorando", no: ["Un'azienda che sale sempre quando il P/E scende", "Un'azienda quotata solo sul mercato italiano", "Un'azienda con molta cassa e pochi debiti"] },
    { q: "Un'azienda del ramo siderurgico ha P/E molto basso proprio nell'anno di massimi utili. Quale rischio ricorda questo caso?", ok: "Che gli utili siano al massimo del ciclo e possano calare, rendendo il multiplo basso ingannevole", no: ["Che il P/E basso garantisca utili stabili", "Che il settore non abbia bilanci", "Che i multipli non si possano usare nel settore"] },
    { q: "L'utile cresce ogni anno, ma il flusso di cassa operativo è negativo da tre anni. Che cosa conviene fare?", ok: "Indagare: i ricavi possono non essere incassati o i costi essere rimandati", no: ["Fidarsi dell'utile, perché è il dato più importante", "Ignorare il flusso di cassa, perché non conta", "Considerare l'azienda sicura perché cresce"] },
    { q: "Se aumento la crescita di lungo periodo da 2% a 3% in un DCF, che cosa succede in genere al valore stimato?", ok: "Aumenta molto: per questo vanno provati più scenari", no: ["Resta praticamente uguale", "Diminuisce", "Diventa uguale al prezzo di mercato"] },
    { q: "Che cos'è l'ancoraggio nella valutazione di un'azione?", ok: "Restare attaccati a un numero iniziale, come il prezzo di acquisto o una stima passata, e non aggiornare il giudizio", no: ["Usare una stima basata solo sul bilancio", "Confrontare l'azienda con la mediana del settore", "Calcolare il valore terminale su dieci anni"] },
    { q: "Perché confrontare un'azienda solo con altre che sono sopravvissute può ingannare?", ok: "Perché le aziende fallite sono sparite dal confronto e il gruppo sembra più sano di quello che era", no: ["Perché le aziende sopravvissute non hanno bilanci", "Perché la sopravvivenza abbassa tutti i multipli", "Perché il confronto è vietato dalla legge"] },
    { q: "Un'azienda ha un debito importante che non compare tra le voci principali del bilancio, ma solo nelle note. Quale errore evita chi legge anche le note?", ok: "Sottostimare il debito e quindi sopravvalutare il capitale dei soci", no: ["Contare due volte la cassa", "Sovrastimare i ricavi", "Calcolare male il P/E sui prezzi di borsa"] },
    { q: "Un'azienda quota il 50% in meno delle sue concorrenti, a parità di settore. Qual è la lettura più prudente?", ok: "Capire perché: può essere un'occasione, ma di solito esiste una ragione", no: ["È sicuramente un affare", "È sicuramente una truffa", "I multipli non si possono confrontare mai"] },
    { q: "Capitalizzazione 90 milioni e patrimonio netto 120 milioni (P/B 0,75). L'azione è per forza a sconto?", ok: "No: gli attivi possono valere meno di quanto scritto a bilancio", no: ["Sì, un P/B sotto 1 è sempre un affare", "Sì, perché il patrimonio netto è il valore vero", "No: il P/B non si calcola mai"] },
    { q: "Utile ricorrente 10 milioni, 10 milioni di azioni, prezzo 8 euro. Quanto vale il P/E?", ok: "8", no: ["0,125", "80", "1"] },
    { q: "Un'azione ha un rendimento da dividendo del 12%, molto più alto della media. Che cosa può segnalare?", ok: "Che il mercato si aspetta un taglio del dividendo, perché il prezzo è sceso molto", no: ["Che il dividendo è garantito per sempre", "Che l'azienda ha zero debiti", "Che il P/E è per forza basso"] },
    { q: "I ricavi crescono molto, ma i crediti verso clienti crescono ancora di più. Perché va controllato?", ok: "Perché i ricavi potrebbero essere registrati prima di essere incassati, o gonfiati", no: ["Perché i crediti non c'entrano con i ricavi", "Perché i crediti aumentano sempre il flusso di cassa", "Perché significa che il P/E è alto"] },
    { q: "Un modello DCF dà un valore di 14,53 euro a un'azione. Come lo si legge con prudenza?", ok: "Come un punto in un intervallo, da verificare con scenari e con altri metodi", no: ["Come un prezzo certo a cui comprare", "Come una previsione del prezzo di domani", "Come un valore più affidabile del bilancio"] },
  ],
};
