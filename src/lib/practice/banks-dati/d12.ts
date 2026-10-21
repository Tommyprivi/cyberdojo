import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo D12 (Analista di dati). Una chiave per lezione: "d12-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Le domande descrivono scenari fittizi e chiedono «cosa è corretto fare»; non sono consulenza legale.
 */
export const D12_ITEMS: Record<string, BankItem[]> = {
  "d12-gdpr": [
    {
      q: "Una tabella contiene solo email, CAP e data di nascita, senza nomi. Come va trattata?",
      ok: "Come dati personali: insieme possono identificare una persona",
      no: ["Come dati anonimi, perché manca il nome", "Come dati pubblici, perché non c'è il cognome", "Come dati non personali, perché sono solo numeri e indirizzi"],
    },
    {
      q: "Quale di questi è un dato «particolare» (categoria che richiede più cautela)?",
      ok: "Una diagnosi medica di un paziente",
      no: ["Il nome di battesimo di un cliente", "Il CAP di residenza", "La data di un ordine online"],
    },
    {
      q: "Per un'analisi sulle vendite ti viene dato un file con nome, telefono, indirizzo e codice fiscale dei clienti. Che cosa è corretto fare?",
      ok: "Chiedere solo le colonne che servono davvero all'analisi",
      no: ["Tenere tutto, perché i dati in più potrebbero servire un giorno", "Chiedere anche le colonne mancanti, per essere completi", "Copiare il file sul proprio computer per lavorare più comodamente"],
    },
    {
      q: "Un'azienda ha raccolto gli indirizzi email per spedire gli ordini. Può usarli anche per un'analisi di marketing mai annunciata ai clienti?",
      ok: "Non in modo automatico: va verificato se lo scopo è compatibile con quello dichiarato",
      no: ["Sì, perché gli indirizzi ormai sono dell'azienda", "Sì, basta che i risultati siano mostrati solo in forma di grafico", "Sì, perché le email non sono dati personali"],
    },
    {
      q: "Che cosa vuol dire «limitazione della finalità» per chi analizza dati?",
      ok: "Usare i dati solo per lo scopo per cui sono stati raccolti, o per uno compatibile",
      no: ["Usare i dati solo per analisi che durano meno di un mese", "Limitare il numero di persone che possono vedere i grafici", "Usare i dati solo dopo averli aggregati"],
    },
    {
      q: "Una persona chiede a un'azienda di sapere quali dati ha su di lei. Di quale diritto si tratta?",
      ok: "Diritto di accesso",
      no: ["Diritto alla portabilità", "Diritto di opposizione", "Diritto di rettifica"],
    },
    {
      q: "Nel database di un negozio un cliente risulta con la data di nascita sbagliata e chiede di correggerla. Quale diritto esercita?",
      ok: "Diritto di rettifica",
      no: ["Diritto di accesso", "Diritto alla cancellazione", "Diritto di opposizione"],
    },
    {
      q: "Il consenso è l'unica base giuridica con cui un'azienda può trattare dati personali?",
      ok: "No: esistono anche contratto, obbligo di legge, interesse legittimo e altre basi",
      no: ["Sì, senza consenso non si può mai trattare un dato personale", "Sì, ma solo per i dati dei maggiorenni", "No, ma le altre basi valgono solo per le aziende pubbliche"],
    },
    {
      q: "Un'azienda deve conservare le fatture per obbligo di legge. Un cliente chiede di cancellare tutti i suoi dati. Che cosa è corretto?",
      ok: "Le fatture si conservano per il periodo di legge; gli altri dati senza più motivo vanno valutati per la cancellazione",
      no: ["Si cancella tutto subito, fatture comprese", "Si rifiuta qualsiasi richiesta, perché i dati sono dell'azienda", "Si tiene tutto per sempre, per sicurezza"],
    },
    {
      q: "Prima di avviare un nuovo progetto di analisi su dati sanitari di molte persone, che cosa è prudente chiedere a chi si occupa di privacy?",
      ok: "Se serve una valutazione d'impatto sulla protezione dei dati",
      no: ["Se il file si può mandare per email in un'unica volta", "Se si può saltare l'informativa, perché i dati sono già in azienda", "Quanto costa comprare altri dati per confronto"],
    },
    {
      q: "In sintesi, che cos'è la valutazione d'impatto (DPIA)?",
      ok: "Un'analisi fatta prima, per capire i rischi di un trattamento rischioso e come ridurli",
      no: ["Un elenco dei dati cancellati ogni anno", "Il rapporto che si scrive dopo un furto di dati", "Un documento che certifica che i dati sono anonimi"],
    },
    {
      q: "Un tuo collega propone di usare i dati dei clienti per allenare un modello, ma nessuno ha controllato lo scopo dichiarato nell'informativa. Che cosa fai?",
      ok: "Mi fermo e chiedo a chi si occupa di privacy se lo scopo è compatibile",
      no: ["Procedo e controllo dopo, se qualcuno si lamenta", "Procedo, perché è solo un esperimento interno", "Procedo ma tolgo la colonna del nome, così è a posto"],
    },
    {
      q: "Un dataset di 20 000 clienti ha una colonna «note libere» scritta dagli operatori. Perché è un rischio per la privacy?",
      ok: "Può contenere dati personali o particolari scritti senza controllo",
      no: ["Perché i testi liberi occupano troppo spazio", "Perché le note libere non si possono contare", "Non è un rischio: il testo non è mai un dato personale"],
    },
    {
      q: "In Italia, in sintesi, una violazione di dati personali che presenta un rischio per le persone va notificata al Garante entro quanto tempo dalla scoperta?",
      ok: "Entro 72 ore",
      no: ["Entro 7 giorni lavorativi", "Entro 30 giorni", "Entro la fine dell'anno"],
    },
  ],

  "d12-bias": [
    {
      q: "Un modello per selezionare candidati è allenato sulle assunzioni degli ultimi 10 anni, quasi tutte di uomini. Che cosa è probabile che succeda?",
      ok: "Il modello può imparare a preferire gli uomini, perché ricalca il passato",
      no: ["Il modello sarà neutrale, perché i numeri non hanno opinioni", "Il modello penalizzerà gli uomini, per compensare", "Il modello ignorerà il genere, perché non è una colonna"],
    },
    {
      q: "Un'app di salute è provata solo su volontari di 20-30 anni. Quale problema di dati può causare?",
      ok: "Funziona peggio per chi ha altre età, perché il campione non li rappresenta",
      no: ["Funziona meglio per tutti, perché i dati sono più omogenei", "Nessun problema, perché l'età non conta mai", "Funziona uguale, perché i campioni piccoli sono sempre precisi"],
    },
    {
      q: "Un modello non usa la colonna «etnia», ma usa il CAP, che nel suo territorio è molto legato all'etnia. Che cosa può succedere?",
      ok: "Il CAP può fare da sostituto e riprodurre lo stesso pregiudizio",
      no: ["Nulla, perché la colonna sensibile è stata tolta", "Il modello diventa più preciso e non ci sono rischi", "Il CAP è un dato pubblico, quindi non crea problemi"],
    },
    {
      q: "Una banca allena un modello solo sui prestiti concessi in passato. Perché il campione è distorto?",
      ok: "Di chi è stato rifiutato non si sa se avrebbe restituito il prestito: il campione è distorto",
      no: ["Perché i rifiutati non hanno dati personali", "Perché i rifiutati sono sempre pochi", "Non lo è: i prestiti concessi sono un campione casuale"],
    },
    {
      q: "Una squadra misura il «successo» di un dipendente con il numero di ore passate in ufficio. Che cosa può causare?",
      ok: "Svantaggia chi ha orari ridotti, per esempio per motivi di cura, anche se lavora bene",
      no: ["Premia tutti allo stesso modo", "Non ha effetti, perché le ore si misurano in modo oggettivo", "Svantaggia solo chi lavora da casa"],
    },
    {
      q: "In un test di valutazione, il gruppo A viene approvato nel 50% dei casi e il gruppo B nel 30%. Quale metrica di equità stai guardando?",
      ok: "La parità degli esiti positivi tra gruppi (parità demografica)",
      no: ["La parità degli errori sui veri negativi", "La precisione complessiva del modello", "La velocità con cui il modello decide"],
    },
    {
      q: "Tra le persone davvero qualificate, il gruppo A viene approvato nel 90% dei casi e il gruppo B nel 60%. Quale equità si guarda?",
      ok: "La parità delle opportunità: chi è qualificato dovrebbe avere la stessa probabilità di essere approvato",
      no: ["La parità del numero di candidati nei due gruppi", "La parità dell'età media dei due gruppi", "La parità tra le dimensioni dei due campioni"],
    },
    {
      q: "Un modello ha il 95% di accuratezza complessiva. Basta questo per dire che è equo?",
      ok: "No: può sbagliare molto di più per un gruppo piccolo senza che la media lo mostri",
      no: ["Sì, un'accuratezza alta vale per tutti i gruppi", "Sì, se i dati sono stati puliti prima", "Sì, se il modello è stato validato da un esperto"],
    },
    {
      q: "Un'analista scopre che un modello sbaglia molto di più per un gruppo. Che cosa è corretto fare?",
      ok: "Segnalarlo, documentarlo e discuterne con chi decide, prima di usare il modello",
      no: ["Non dire nulla, perché la media è buona", "Togliere dal test quel gruppo, così i numeri tornano", "Aspettare che qualcuno si lamenti"],
    },
    {
      q: "È sempre possibile rendere uguali tutte le metriche di equità nello stesso modello?",
      ok: "No: in generale non si possono soddisfare tutte insieme, e va scelto con attenzione quale conta di più",
      no: ["Sì, basta avere più dati", "Sì, basta usare un modello più complesso", "Sì, basta togliere le colonne sensibili"],
    },
    {
      q: "Un sondaggio sul gradimento di un servizio è fatto solo online. Chi può restare escluso dal campione?",
      ok: "Chi non usa Internet o lo usa poco, per esempio molte persone anziane",
      no: ["Nessuno, perché Internet raggiunge tutti allo stesso modo", "Solo chi non ha un'email", "Solo chi non ha un telefono"],
    },
    {
      q: "Se i dati storici rispecchiano una discriminazione del passato, usarli per decidere oggi…",
      ok: "rischia di ripetere quella discriminazione, anche se il modello non ha cattive intenzioni",
      no: ["è sempre giusto, perché i dati sono oggettivi", "non ha effetti, perché il passato è passato", "riduce i pregiudizi, perché il modello è imparziale"],
    },
    {
      q: "Un sistema è usato per decidere chi controllare di più e controlla di più un quartiere, che quindi ha più segnalazioni, che rafforzano il modello. Come si chiama questo meccanismo?",
      ok: "Circolo vizioso (ciclo di retroazione) che amplifica il bias",
      no: ["Normalizzazione dei dati", "Ottimizzazione dei parametri", "Compressione del dataset"],
    },
  ],

  "d12-anonimizzazione": [
    {
      q: "Sostituisci in una tabella ogni nome con un codice, e conservi altrove l'elenco nome-codice. Che cosa hai fatto?",
      ok: "Pseudonimizzazione: i dati restano personali",
      no: ["Anonimizzazione: i dati non sono più personali", "Cifratura irreversibile", "Aggregazione dei dati"],
    },
    {
      q: "Quale caratteristica distingue dati davvero anonimi da dati pseudonimizzati?",
      ok: "Dagli anonimi non si può più risalire a una persona con mezzi ragionevoli",
      no: ["Gli anonimi hanno meno righe", "Gli anonimi sono sempre cifrati", "Gli anonimi hanno i nomi in maiuscolo"],
    },
    {
      q: "Un file ha tolto nome e cognome ma conserva data di nascita, CAP e sesso. Perché non basta?",
      ok: "Quei tre dati insieme possono bastare a ritrovare una persona incrociandoli con altre fonti",
      no: ["Perché la data di nascita non è un dato", "Perché il CAP è sempre segreto", "Perché il sesso non può mai essere pubblicato"],
    },
    {
      q: "Trasformi gli indirizzi email con una funzione hash semplice e senza altri accorgimenti. Che cosa può fare chi prova molti indirizzi probabili?",
      ok: "Calcolare gli stessi hash e ritrovare le email originali",
      no: ["Niente, perché l'hash non si può mai confrontare", "Ritrovare solo il dominio dell'email", "Solo cancellare il file originale"],
    },
    {
      q: "Una tabella di 6 righe ha tre persone con età 30-39 e CAP 201** e tre con età 40-49 e CAP 201**. Quanto vale il k del k-anonimato?",
      ok: "3: ogni combinazione compare in almeno 3 righe",
      no: ["6: ci sono sei righe in tutto", "2: ci sono due gruppi", "1: le righe sono tutte diverse"],
    },
    {
      q: "Che cosa vuol dire, in parole semplici, k-anonimato?",
      ok: "Ogni persona non si distingue da almeno altre k-1 persone, guardando certi attributi",
      no: ["Ogni persona ha un codice lungo almeno k cifre", "Ogni dato è cifrato k volte", "Ogni tabella ha al massimo k righe"],
    },
    {
      q: "Per ottenere il k-anonimato si trasforma l'età precisa (34) in una fascia (30-39). Che tecnica è?",
      ok: "Generalizzazione",
      no: ["Cifratura", "Duplicazione", "Campionamento casuale"],
    },
    {
      q: "In un gruppo di k persone indistinguibili tutte hanno la stessa malattia. Che cosa succede se sai che una persona è nel gruppo?",
      ok: "Scopri la sua malattia, anche senza sapere quale riga sia la sua",
      no: ["Non scopri nulla, perché il gruppo è grande", "Scopri solo il suo nome", "Scopri il suo CAP esatto"],
    },
    {
      q: "Un'università pubblica una tabella con il voto di ogni studente, indicando solo anno di nascita, corso e città. In un corso c'è una sola studentessa nata nel 2004. Qual è il rischio?",
      ok: "Chi conosce quella studentessa può ritrovare il suo voto",
      no: ["Nessuno, perché non c'è il nome", "Il rischio è che il file occupi troppo spazio", "Il rischio è solo per gli studenti più anziani"],
    },
    {
      q: "Quale tecnica di anonimizzazione non nasconde una persona, ma pubblica solo conteggi per gruppo (ad esempio 120 clienti a Torino)?",
      ok: "Aggregazione",
      no: ["Mascheramento delle cifre", "Duplicazione delle righe", "Ordinamento alfabetico"],
    },
    {
      q: "Una piccola azienda anonimizza i dati e poi pubblica un secondo file con altri attributi sugli stessi clienti. Che attenzione serve?",
      ok: "Controllare che i due file, incrociati, non permettano di ritrovare le persone",
      no: ["Nessuna: ogni file è sicuro da solo", "Basta cifrare il secondo file", "Basta cambiare il nome dei file"],
    },
    {
      q: "Una collega dice: «Ho anonimizzato i dati, quindi posso metterli online ovunque». Qual è la risposta più prudente?",
      ok: "Prima va verificato il rischio di re-identificazione, e vanno consultati i responsabili della privacy",
      no: ["Vero, l'anonimizzazione risolve sempre ogni rischio", "Vero, se il file è in formato CSV", "Falso, perché i dati anonimi non si possono mai pubblicare"],
    },
    {
      q: "Quando conviene usare la pseudonimizzazione e non l'anonimizzazione?",
      ok: "Quando serve ancora poter collegare i dati alla stessa persona, per esempio per analisi nel tempo",
      no: ["Quando si vuole pubblicare il file online", "Quando i dati non servono più", "Quando si vuole eliminare ogni rischio"],
    },
  ],

  "d12-sicurezza": [
    {
      q: "Una stagista deve fare un grafico sui reclami. Ha bisogno di accedere all'intero database clienti?",
      ok: "No: basta l'accesso ai soli dati che servono al compito",
      no: ["Sì, per sicurezza è meglio dare accesso a tutto", "Sì, perché è la regola per tutti i nuovi", "Sì, ma solo per un giorno"],
    },
    {
      q: "Come si chiama il principio di dare a ciascuno solo gli accessi necessari al suo lavoro?",
      ok: "Minimo privilegio",
      no: ["Massima condivisione", "Accesso universale", "Ripartizione dei dati"],
    },
    {
      q: "Un'analista manda per email un foglio con nome, indirizzo e IBAN dei clienti a un fornitore, senza protezione. Qual è il problema principale?",
      ok: "L'email può finire a persone sbagliate e i dati non sono protetti",
      no: ["Il foglio è troppo grande", "Il fornitore non conosce Excel", "I fogli non possono contenere IBAN"],
    },
    {
      q: "Nascondi una colonna con i codici fiscali in un foglio e invii il file. I codici fiscali sono protetti?",
      ok: "No: la colonna nascosta resta nel file e chi lo riceve può mostrarla",
      no: ["Sì, perché nessuno la vede", "Sì, se il file ha un nome strano", "Sì, se il foglio è salvato in PDF"],
    },
    {
      q: "Devi condividere un file con dati personali con una collega. Qual è la scelta più prudente?",
      ok: "Una cartella condivisa con accesso solo alla persona indicata",
      no: ["Un link pubblico: chiunque ha il link può aprirlo", "Un'email a tutta la squadra, per sicurezza", "Una chiavetta lasciata sulla scrivania"],
    },
    {
      q: "In un messaggio con molti destinatari vuoi che non vedano gli indirizzi degli altri. Che cosa usi?",
      ok: "Il campo CCN, copia nascosta",
      no: ["Il campo CC", "Il campo Oggetto", "Il campo Rispondi a tutti"],
    },
    {
      q: "Che cosa vuol dire cifrare un file?",
      ok: "Renderlo illeggibile a chi non ha la chiave",
      no: ["Comprimerlo per occupare meno spazio", "Nasconderlo in una cartella", "Cambiargli il nome"],
    },
    {
      q: "Mandi un archivio cifrato con password a un cliente. Dove è prudente comunicare la password?",
      ok: "Su un altro canale, per esempio al telefono",
      no: ["Nella stessa email dell'archivio", "Nel nome del file", "In un commento dentro l'archivio"],
    },
    {
      q: "Un analista scarica dati dei clienti sul portatile per lavorare in treno. Che cosa è fondamentale?",
      ok: "Che il disco sia cifrato, per proteggere i dati se il portatile viene perso",
      no: ["Che il portatile sia di un colore facile da riconoscere", "Che il file si chiami «dati_clienti»", "Che il portatile sia sempre acceso"],
    },
    {
      q: "Per testare un nuovo report si copia l'intero database di produzione in un ambiente di test, senza protezioni. Qual è il problema?",
      ok: "Dati reali in un ambiente meno protetto: meglio dati fittizi o pseudonimizzati",
      no: ["Nessuno: i test sono sempre sicuri", "I test sono più lenti con dati reali", "Si possono usare solo dati reali nei test"],
    },
    {
      q: "Una regola per i backup dice «3-2-1». Che cosa significa?",
      ok: "3 copie dei dati, su 2 supporti diversi, 1 copia fuori sede",
      no: ["3 password, su 2 computer, in 1 giorno", "3 utenti, 2 cartelle, 1 file", "3 mesi di conservazione, 2 anni di archivio, 1 backup all'anno"],
    },
    {
      q: "Una collega lascia l'azienda. Che cosa va fatto con i suoi accessi ai dati?",
      ok: "Disattivarli subito, perché non servono più",
      no: ["Lasciarli attivi, può sempre servire", "Disattivarli solo se chiede lei", "Cambiare solo il suo nome nell'elenco"],
    },
    {
      q: "Una persona trova per errore una cartella con dati dei colleghi aperta a tutti. Che cosa è corretto fare?",
      ok: "Segnalarlo subito a chi si occupa di sicurezza e privacy",
      no: ["Scaricare i file per controllarli meglio", "Mandare il link a chi potrebbe essere interessato", "Non fare nulla, tanto non è il suo compito"],
    },
    {
      q: "Hai inviato per errore un file con dati personali al destinatario sbagliato. Che cosa è corretto fare?",
      ok: "Avvisare subito chi si occupa di privacy e sicurezza, senza aspettare di essere sicuri del danno",
      no: ["Aspettare per vedere se il destinatario risponde", "Cancellare la tua copia e non dire nulla", "Mandare un secondo messaggio con altri dati"],
    },
  ],

  "d12-governance": [
    {
      q: "Chi, di solito, decide a che cosa possono servire i dati di un'area e chi può accedervi, rispondendone?",
      ok: "Il data owner",
      no: ["Il data steward, da solo", "L'ultimo analista che li ha usati", "Il fornitore del software"],
    },
    {
      q: "Chi, di solito, cura nella pratica la qualità dei dati, le definizioni e le informazioni che li descrivono?",
      ok: "Il data steward",
      no: ["Il data owner, da solo", "Il responsabile delle pulizie dei dati", "Il cliente finale"],
    },
    {
      q: "A che cosa serve un catalogo dei dati?",
      ok: "A trovare i dataset e capire che cosa contengono, chi li gestisce e quanto sono sensibili",
      no: ["A cifrare i dataset", "A calcolare le statistiche dei dataset", "A cancellare i dataset vecchi"],
    },
    {
      q: "Due report mostrano numeri diversi per i «clienti attivi». Quale strumento aiuta a evitarlo?",
      ok: "Un glossario con una definizione condivisa di «cliente attivo»",
      no: ["Un grafico più grande", "Un font più leggibile", "Un backup più frequente"],
    },
    {
      q: "Quali sono, in ordine, le fasi tipiche del ciclo di vita di un dato?",
      ok: "Raccolta, uso, condivisione, archiviazione, cancellazione",
      no: ["Cancellazione, raccolta, uso, condivisione", "Uso, raccolta, cancellazione, archiviazione", "Condivisione, cifratura, backup, grafico"],
    },
    {
      q: "Nessuno sa più perché si conservino i dati di una campagna di tre anni fa. Che cosa suggerisce la governance?",
      ok: "Verificare lo scopo e il periodo di conservazione; se non c'è un motivo, cancellare",
      no: ["Tenerli per sempre, per non sbagliare", "Spostarli in una cartella nascosta", "Duplicarli, per sicurezza"],
    },
    {
      q: "Un'azienda cancella i dati di un cliente dal database principale, ma restano in vecchi file esportati e nei backup. Che cosa è corretto?",
      ok: "Considerare anche copie, esportazioni e backup nel piano di cancellazione",
      no: ["Basta il database principale, il resto non conta", "Basta cambiare il nome delle copie", "Le copie non sono dati"],
    },
    {
      q: "Che cosa vuol dire «periodo di conservazione» di un dato?",
      ok: "Per quanto tempo si tiene, secondo lo scopo e le regole applicabili, prima di cancellarlo o archiviarlo",
      no: ["Per quanto tempo il dato resta nel cestino", "Per quanto tempo il dato è visibile in un grafico", "Per quanto tempo si può cifrare"],
    },
    {
      q: "Una persona nuova nel team vuole usare un dataset che non conosce. Che cosa è più utile per capire se fidarsi?",
      ok: "Leggere nel catalogo origine, proprietario, significato delle colonne e data di aggiornamento",
      no: ["Chiedere a chiunque nei corridoi", "Controllare solo il nome del file", "Contare le righe e basta"],
    },
    {
      q: "Chi decide che un dataset può essere condiviso con un'altra area?",
      ok: "Il data owner, nel rispetto delle regole sulla privacy",
      no: ["Chi lo scarica per primo", "Qualunque analista che ha l'accesso", "Il collega con più anzianità"],
    },
    {
      q: "Una colonna si chiama «val» e nessuno ricorda che cosa misuri. Che cosa poteva evitarlo?",
      ok: "Una documentazione dei dati, con descrizione di ogni colonna e unità di misura",
      no: ["Un computer più potente", "Una password più lunga", "Un grafico a torta"],
    },
    {
      q: "Un'analista modifica per conto suo la regola con cui si calcola il fatturato in un report condiviso. Che cosa non va?",
      ok: "Le regole condivise vanno concordate con chi è responsabile dei dati e documentate",
      no: ["Niente: un'analista può cambiare ogni regola", "Va bene se il risultato sembra più realistico", "Va bene se lo fa di notte"],
    },
    {
      q: "In sintesi, che cosa deve poter dire l'azienda su un dato personale che tiene?",
      ok: "Perché lo tiene, dove si trova e fino a quando lo terrà",
      no: ["Solo quanto occupa di spazio", "Solo chi lo ha scaricato per ultimo", "Solo quando è stato fotografato il database"],
    },
  ],

  "d12-onesta": [
    {
      q: "Un sondaggio su 200 persone dà il 56% di soddisfatti. Come lo presenti con onestà?",
      ok: "Come una stima con un margine di incertezza, e indicando quanti hanno risposto",
      no: ["Come un valore esatto: il 56% di tutti i clienti", "Come un valore sicuramente superiore al 50%", "Come un valore che non serve spiegare"],
    },
    {
      q: "Il grafico mostra che le vendite di gelati e le scottature salgono insieme. Che cosa è onesto scrivere?",
      ok: "Che le due cose salgono insieme, probabilmente per l'estate: non che una causi l'altra",
      no: ["Che i gelati causano le scottature", "Che le scottature fanno vendere più gelati", "Che le due serie sono la stessa cosa"],
    },
    {
      q: "I dati coprono solo tre mesi. Dove va scritto il limite?",
      ok: "Nel rapporto, in modo visibile, vicino alle conclusioni",
      no: ["Da nessuna parte, se non influisce sul grafico", "In fondo, in piccolo, perché non confonda", "Solo se qualcuno lo chiede"],
    },
    {
      q: "Il tuo capo si aspetta un risultato positivo, ma i dati mostrano un effetto debole e incerto. Che cosa è corretto fare?",
      ok: "Riportare il risultato così com'è, spiegando l'incertezza",
      no: ["Cambiare il periodo finché il risultato è positivo", "Togliere dal grafico i dati sfavorevoli", "Dire solo la parte positiva"],
    },
    {
      q: "Per far sembrare una crescita enorme, un grafico a barre parte dal valore 95 invece che da 0. Che problema c'è?",
      ok: "L'asse troncato esagera visivamente la differenza",
      no: ["Nessuno: i grafici possono partire da dove si vuole", "Il grafico diventa meno colorato", "Il grafico non si può stampare"],
    },
    {
      q: "Hai provato 20 diversi confronti e solo uno dà un risultato «interessante». Che cosa è onesto fare?",
      ok: "Dire che hai fatto 20 prove: un risultato su 20 può essere frutto del caso",
      no: ["Presentare solo il confronto interessante", "Nascondere le altre 19 prove", "Non scrivere nessun limite"],
    },
    {
      q: "Usi un numero preso da un rapporto pubblicato. Che cosa devi fare?",
      ok: "Citare la fonte, con l'anno e dove trovarla",
      no: ["Scriverlo senza fonte, perché è pubblico", "Dire che lo hai calcolato tu", "Arrotondarlo senza dirlo"],
    },
    {
      q: "Dopo aver inviato un report, scopri un errore nei calcoli che cambia una conclusione. Che cosa è corretto fare?",
      ok: "Avvisare subito chi lo ha ricevuto e inviare la correzione",
      no: ["Aspettare il prossimo report, per correggere senza clamore", "Non dire nulla, se nessuno se n'è accorto", "Cancellare il vecchio file"],
    },
    {
      q: "Una media di soddisfazione è 4,2 su 5 ma risponde solo chi ha avuto un problema. Come si interpreta?",
      ok: "Con cautela: chi risponde può non rappresentare tutti i clienti",
      no: ["Come la soddisfazione di tutti i clienti", "Come un valore certo, perché è una media", "Come la mediana, che è uguale alla media"],
    },
    {
      q: "Che differenza c'è tra «non abbiamo trovato un effetto» e «abbiamo dimostrato che non c'è effetto»?",
      ok: "Nel primo caso i dati potrebbero essere troppo pochi o poco precisi per vedere un effetto; nel secondo no",
      no: ["Nessuna: le due frasi dicono la stessa cosa", "La seconda è sempre più prudente", "La prima significa che i dati sono sbagliati"],
    },
    {
      q: "Presenti i risultati a persone che non conoscono la statistica. Qual è l'approccio più onesto?",
      ok: "Parole semplici, numeri chiari, e dire che cosa i dati non permettono di concludere",
      no: ["Molte sigle, per sembrare precisi", "Una sola cifra senza contesto", "Solo grafici, senza spiegazioni"],
    },
    {
      q: "Un cliente ti chiede di mostrare solo i mesi in cui il suo prodotto ha venduto di più. Che cosa è corretto fare?",
      ok: "Spiegare che mostrare solo quei mesi dà un quadro falsato, e proporre il periodo completo",
      no: ["Farlo senza dirlo, perché paga lui", "Farlo e scrivere una nota minuscola", "Cambiare i dati dei mesi peggiori"],
    },
    {
      q: "Che cosa vuol dire «responsabilità professionale» per chi analizza dati?",
      ok: "Rispondere della correttezza del lavoro, dichiarare i limiti e non usare i dati per ingannare",
      no: ["Fare sempre ciò che chiede il cliente", "Evitare di spiegare i limiti, per non creare dubbi", "Tenere segreti tutti i metodi di calcolo"],
    },
    {
      q: "Per permettere ad altri di ricontrollare il tuo lavoro, che cosa è utile indicare nel rapporto?",
      ok: "Da dove vengono i dati, quando sono stati estratti e come sono stati trattati",
      no: ["Solo la conclusione", "Solo il nome di chi ha scritto il rapporto", "Solo i colori usati nei grafici"],
    },
  ],
};
