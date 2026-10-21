# Brief: corsi «Trading algoritmico con Python» (T) e «Hedge fund» (H)

Due corsi nuovi, educativi e prudenti. Valgono TUTTE le regole di `docs/scrivere-lezioni.md` (formato, schermate, `<Say>`, `<Practice>`, `<Recap>`, banche di domande, video obbligatorio, stato `draft`). Qui ci sono solo le regole in più e i piani dei moduli.

## Regole speciali (obbligatorie, sono finanza)

1. **Educazione, non consulenza.** Nessuna raccomandazione personalizzata, nessun «compra/vendi X», nessuna promessa di rendimento, nessuna cifra di guadagno attesa. Ogni lezione richiama in una frase che si può perdere denaro (anche tutto) e che il corso non è consulenza finanziaria. Il Sensei dice «i mercati non regalano niente».
2. **Mai denaro reale nel corso.** Gli esercizi lavorano su dati storici o fittizi e su ambienti demo (paper trading). Nessuna lezione spiega come collegare un conto reale con soldi veri; se si parla di API di broker è solo per ambienti demo e per la sicurezza delle chiavi.
3. **Onestà sui risultati.** I backtest sono sempre ottimistici: ogni lezione di strategia mostra i limiti (bias di look-ahead, di sopravvivenza, overfitting, costi, slippage). Numeri di esempio sempre fittizi o storicamente neutri; nessun «ho guadagnato il 300%».
4. **Truffe e abusi.** Nei moduli di legge/etica spiega segnali a pagamento, schemi Ponzi, falsi broker, pump and dump, abusi di mercato (manipolazione, insider trading) per riconoscerli e difendersi, mai per praticarli. Riferimenti: CONSOB, Banca d'Italia, MiFID II in sintesi; verifica sul web i fatti normativi e scrivi «in sintesi, ottobre 2026, verifica le fonti ufficiali».
5. **Calcoli esatti.** Ogni calcolo (rendimenti, volatilità, drawdown, Sharpe, VaR, valutazioni) va ricontrollato due volte a mano con numeri puliti; dichiara le convenzioni (rendimento semplice o logaritmico, 252 giorni di borsa, tasso privo di rischio). Codice Python esatto (3.11+, pandas 2.x, numpy): blocchi ```python con output veri; dove puoi, usa dati piccoli scritti nel testo. Non usare dati reali di mercato nel testo (diritti): tabelle fittizie di 5-8 righe.
6. **Fatti istituzionali** (tasse italiane, regolamenti, soglie): scrivi solo cose ben note e stabili, in sintesi, con la data e l'invito a controllare le fonti ufficiali; se non sei sicuro, formula in modo generico.
7. **Tono:** severo ma caldo; casi con aziende e persone fittizie. Niente «gergo da guru», niente slogan.

## Dove scrivere

- Corso T: `content/trading/t<N>/T.<NN>.<MMM>.mdx`, `course: trading`, banche in `src/lib/practice/banks-trading/t<NN>.ts` (export `T<NN>_ITEMS`, chiavi `"tNN-argomento"`), test `pnpm vitest run src/lib/practice/banks-trading`.
- Corso H: `content/hedge/h<N>/H.<NN>.<MMM>.mdx`, `course: hedge`, banche in `src/lib/practice/banks-hedge/h<NN>.ts` (export `H<NN>_ITEMS`, chiavi `"hNN-argomento"`), test `pnpm vitest run src/lib/practice/banks-hedge`.
- Prima lezione di un modulo: prerequisito = ultima lezione del modulo precedente (T.01.001 e H.01.001 senza prerequisiti). Cinture: i primi moduli bianca/gialla, i centrali arancione/verde, gli ultimi blu/marrone.
- Componenti utili: `<PythonTerminal code="..." />` per far provare Python nel browser (codice iniziale breve, innocuo, solo Python puro: niente rete, niente pandas nel terminale); `<Log lines={[...]} />` per tabelle e output; `<Guided steps={[...]} />` per ragionamenti.
- Video: `pnpm check:videos T.05` (o H.xx). Italiano preferito, altrimenti inglese con sottotitoli; evita video di «guru», segnali, promesse di guadagno; preferisci università, banche centrali, canali educativi seri.

## Piano dei moduli: Trading algoritmico con Python (T)

| Modulo | Titolo | Lezioni | Argomenti, in ordine |
|---|---|---|---|
| T1 | Come funzionano i mercati | 7 | cosa sono i mercati; azioni; obbligazioni; ETF e fondi; derivati in breve; borsa, broker e orari; ordini (mercato, limite, stop) |
| T2 | Dati di mercato con Python | 7 | candele OHLC e volumi; fonti di dati gratuite e licenze; pandas per le serie temporali; rendimenti semplici e logaritmici; dividendi e frazionamenti (prezzi corretti); pulire i dati finanziari; grafici di prezzo |
| T3 | Analisi tecnica e indicatori | 7 | che cos'è e i suoi limiti; medie mobili; RSI; MACD; bande di Bollinger; volumi e volatilità (ATR); indicatori nel codice |
| T4 | Statistica per il trading | 6 | rendimenti e distribuzione; volatilità; correlazione e diversificazione; code grasse e eventi rari; autocorrelazione e rumore; campioni e significatività |
| T5 | Strategie e backtesting | 8 | cos'è una strategia (regole, segnali); il primo backtest vettoriale; posizioni e rendimento della strategia; look-ahead bias; survivorship bias; overfitting e dati fuori campione; walk-forward; leggere un backtest con spirito critico |
| T6 | Gestione del rischio | 7 | perché il rischio viene prima del rendimento; position sizing; stop loss e i loro limiti; drawdown e recupero; il rischio di rovina; diversificazione tra strumenti; leva e margine (pericoli) |
| T7 | Metriche di performance | 6 | rendimento annuo composto; volatilità annualizzata; Sharpe e Sortino; massimo drawdown e Calmar; confronto con buy and hold e benchmark; distribuzione dei rendimenti della strategia |
| T8 | Costi e realtà dell'esecuzione | 6 | commissioni e spread; slippage; liquidità e dimensioni; latenza e dati in tempo reale; tasse sui guadagni finanziari in Italia (in sintesi); rendimento al netto dei costi |
| T9 | Strategie classiche | 7 | trend following; mean reversion; momentum; coppie e arbitraggio statistico; breakout; volatilità; perché le strategie smettono di funzionare |
| T10 | Paper trading e API | 6 | che cos'è il paper trading; API di broker con ambiente demo; autenticazione e chiavi (mai nel codice); ordini simulati in codice; gestione degli errori e dei limiti di chiamata; log e monitoraggio |
| T11 | Machine learning per la finanza | 6 | che cosa si può prevedere e cosa no; feature finanziarie; target e perdita di dati; validazione temporale; modelli semplici di classificazione dei rendimenti; rischi e overfitting |
| T12 | Psicologia e disciplina | 5 | bias comportamentali (avversione alla perdita, eccesso di fiducia); FOMO e trading emotivo; il diario di trading; regole scritte e check-list; quando fermarsi |
| T13 | Legge, etica e truffe | 6 | chi regola i mercati (CONSOB, MiFID II in sintesi); truffe (segnali a pagamento, falsi broker, Ponzi); cripto e rischi; pump and dump e manipolazione; insider trading; come verificare un intermediario |
| T14 | Progetto finale | 5 | scegliere un'idea semplice; definire regole e ipotesi; backtest con costi; relazione onesta (limiti e rischi); presentazione e prossimi passi |

## Piano dei moduli: Hedge fund (H)

| Modulo | Titolo | Lezioni | Argomenti, in ordine |
|---|---|---|---|
| H1 | Che cos'è un hedge fund | 6 | definizione e miti; struttura (gestore, investitori, veicolo); commissioni di gestione e di performance; confronto con fondi comuni e ETF; chi può investire (investitori qualificati); panorama in Italia e nel mondo in sintesi |
| H2 | Le strategie | 8 | long/short azionario; global macro; event driven e fusioni; relative value e arbitraggio; quantitative; credit e distressed; managed futures; multi-strategy |
| H3 | Teoria del portafoglio | 7 | rischio e rendimento; diversificazione; frontiera efficiente di Markowitz; CAPM; alpha e beta; fattori di rischio; limiti dei modelli |
| H4 | Analisi fondamentale | 7 | leggere un bilancio; conto economico e flussi di cassa; indici e multipli; valore intrinseco; flussi di cassa scontati (DCF); confronto tra aziende; trappole di valutazione |
| H5 | Derivati e copertura | 7 | futures; opzioni (call e put); payoff e grafici; le greche in modo intuitivo; coperture (hedging); swap; rischi dei derivati |
| H6 | Il rischio | 7 | misurare il rischio; volatilità e VaR; stress test e scenari; leva; liquidità e rimborsi; rischio di controparte; casi storici (LTCM) |
| H7 | Costruzione del portafoglio | 6 | obiettivi e vincoli; allocazione tra strategie; risk parity; esposizione netta e lorda; ribilanciamento; monitoraggio |
| H8 | Operazioni e infrastruttura | 6 | prime broker; custodia; amministratore del fondo; il valore netto (NAV); reporting agli investitori; continuità operativa |
| H9 | Regolamentazione e compliance | 6 | quadro normativo europeo (AIFMD) in sintesi; MiFID II; antiriciclaggio e conosci il cliente; conflitti di interesse; segnalazioni e controlli; ruoli di Consob e Banca d'Italia |
| H10 | Gli investitori | 5 | due diligence degli investitori; track record e come leggerlo; comunicazione onesta; lock-up e rimborsi; gestione delle aspettative |
| H11 | Etica e fallimenti | 5 | perché i fondi falliscono; LTCM; frodi (Madoff come caso di schema Ponzi); cultura del rischio; lezioni |
| H12 | Costruire un fondo | 6 | idea e vantaggio competitivo; business plan; team e ruoli; costi e capitale minimo; licenze e autorizzazioni in sintesi; carriera nel settore |

Ultime lezioni (per i prerequisiti): T1 T.01.007, T2 T.02.007, T3 T.03.007, T4 T.04.006, T5 T.05.008, T6 T.06.007, T7 T.07.006, T8 T.08.006, T9 T.09.007, T10 T.10.006, T11 T.11.006, T12 T.12.005, T13 T.13.006; H1 H.01.006, H2 H.02.008, H3 H.03.007, H4 H.04.007, H5 H.05.007, H6 H.06.007, H7 H.07.006, H8 H.08.006, H9 H.09.006, H10 H.10.005, H11 H.11.005.
Il corso H può cominciare senza prerequisiti da altri corsi (H.01.001 ha `prerequisites: []`); T.01.001 idem.
