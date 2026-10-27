import { NEW_COURSES } from "./courses-new";

/** Albero dei corsi: fonte unica per titoli di corsi e moduli (sezione 3 della spec + C11). */

/**
 * Lettera del corso = prima parte dell'ID lezione (F.05.003). F, C, D, T, H sono i corsi storici;
 * W, P, A, I, B, L, R, E, X, M sono i 10 nuovi corsi da 200 lezioni (courses-new.ts, docs/nuovi-corsi.md).
 */
export type CourseId = "F" | "C" | "D" | "T" | "H" | "W" | "P" | "A" | "I" | "B" | "L" | "R" | "E" | "X" | "M";

export type CourseDef = {
  id: CourseId;
  folder: string;
  title: string;
  modules: { n: number; title: string; summary: string }[];
  /** Solo corsi nuovi: presentazione per la pagina Corsi. */
  blurb?: { lead: string; for: string };
  /** Solo corsi nuovi: i 5 blocchi (dal facile al difficile); ogni blocco copre i moduli da `from` a `to`. */
  blocks?: { title: string; summary: string; from: number; to: number }[];
};

export const COURSES: CourseDef[] = [
  {
    id: "F",
    folder: "fondamenta",
    title: "Fondamenta IT, Linux e Reti",
    modules: [
      { n: 1, title: "Come funziona un computer", summary: "Hardware, binario, sistema operativo, macchine virtuali, laboratorio, installare Kali" },
      { n: 2, title: "Linux 1", summary: "Terminale, filesystem, file, editor" },
      { n: 3, title: "Linux 2", summary: "Utenti, permessi, processi, servizi, pacchetti" },
      { n: 4, title: "Linux 3", summary: "Pipe, grep, bash scripting, cron" },
      { n: 5, title: "Reti 1", summary: "IP, binario e ottetti, modello OSI, incapsulamento, MAC e ARP" },
      { n: 6, title: "Reti 2", summary: "Subnet mask, CIDR, sottoreti, routing" },
      { n: 7, title: "Reti 3", summary: "TCP/UDP, porte, DNS, HTTP/HTTPS, DHCP, NAT" },
      { n: 8, title: "Reti 4", summary: "Wireshark, Packet Tracer, VLAN, ACL, VPN, IPv6" },
      { n: 9, title: "Python per l'IT", summary: "Basi, file, socket, automazione" },
      { n: 10, title: "Progetto e cintura", summary: "Rete aziendale completa ed esame di cintura" },
    ],
  },
  {
    id: "C",
    folder: "cybersecurity",
    title: "Cybersecurity",
    modules: [
      { n: 1, title: "Principi", summary: "Triade CIA, rischio, modello di minaccia, etica e legge" },
      { n: 2, title: "Crittografia", summary: "Hash, cifratura simmetrica e asimmetrica, firme, TLS" },
      { n: 3, title: "Identità e autenticazione", summary: "Password, salt, 2FA, sessioni, gestione accessi" },
      { n: 4, title: "Sicurezza di rete", summary: "Firewall, IDS/IPS, segmentazione, VPN" },
      { n: 5, title: "Web security", summary: "OWASP Top 10, difese, applicazioni vulnerabili in locale" },
      { n: 6, title: "Database e dati", summary: "SQL, SQL injection e query sicure, backup" },
      { n: 7, title: "Blue team", summary: "Log, SIEM, hardening, monitoraggio, fail2ban" },
      { n: 8, title: "Attacco etico in lab", summary: "Laboratorio isolato, ricognizione, scansioni, report" },
      { n: 9, title: "Forensics e incident response", summary: "Raccolta prove, analisi, risposta, ripristino" },
      { n: 10, title: "Privacy, anonimato e progetto", summary: "Privacy, anonimato e sicurezza, VPN, Tor, fingerprinting, progetto finale" },
      { n: 11, title: "Prossimi passi", summary: "Risorse verificate, certificazioni, CTF italiane e costruzione del tuo home lab" },
      { n: 12, title: "Specializzazione: Linux per la sicurezza", summary: "Permessi avanzati e ACL, hardening, AppArmor e SELinux, auditd, sudo, nftables, script di controllo" },
      { n: 13, title: "Specializzazione: analisi del traffico di rete", summary: "Wireshark a fondo, filtri, DNS HTTP e TLS, anomalie, Zeek e NetFlow, rapporto di analisi" },
      { n: 14, title: "Specializzazione: Windows e Active Directory", summary: "Permessi NTFS, domini e GPO, Kerberos e NTLM, rilevare gli attacchi ad AD, registro eventi, hardening" },
      { n: 15, title: "Specializzazione: crittografia applicata", summary: "PKI e certificati, TLS configurato bene, gestione delle chiavi, firma del codice, cifratura dei dischi, passkey" },
      { n: 16, title: "Specializzazione: sicurezza delle API e dell'identità", summary: "OAuth e OpenID Connect, JWT, sessioni, CORS e CSRF, OWASP API Top 10, abusi e rilevamento" },
      { n: 17, title: "Specializzazione: sicurezza del cloud", summary: "Responsabilità condivisa, IAM, configurazioni errate, reti virtuali, log nel cloud, segreti, governance" },
      { n: 18, title: "Specializzazione: analisi dei malware (concetti)", summary: "Famiglie e ciclo di vita, analisi statica e dinamica in sandbox, indicatori di compromissione, igiene del laboratorio" },
      { n: 19, title: "Specializzazione: detection engineering e threat hunting", summary: "Dalla minaccia alla regola, Sigma, MITRE ATT&CK, hunting a ipotesi, falsi positivi, metriche del SOC" },
      { n: 20, title: "Specializzazione: incident response avanzata", summary: "Runbook, comunicazione di crisi, ransomware, forensics nel cloud, autorità e assicurazioni, tabletop" },
      { n: 21, title: "Specializzazione: penetration testing, metodologia", summary: "Fasi e standard, ambito e regole d'ingaggio, valutazione in lab, rischi per il cliente, rapporto, carriera" },
      { n: 22, title: "Specializzazione: IoT e OT", summary: "Dispositivi IoT, protocolli industriali, segmentazione IT/OT, aggiornamenti, casi storici, sicurezza domestica" },
      { n: 23, title: "Specializzazione: governance, rischio e conformità", summary: "Analisi del rischio, ISO 27001, NIS2, politiche, audit, continuità operativa, rapporti alla direzione" },
      { n: 24, title: "Specializzazione: DevSecOps", summary: "Sicurezza nel ciclo di sviluppo, SAST e DAST, dipendenze, container, infrastruttura come codice, segreti, CI sicura" },
      { n: 25, title: "Specializzazione: sicurezza e intelligenza artificiale", summary: "Rischi dei modelli, prompt injection, avvelenamento dei dati, IA in difesa e attacco, AI Act, uso responsabile" },
      { n: 26, title: "Specializzazione: social engineering e persone", summary: "Psicologia dell'inganno, phishing avanzato e BEC, vishing e smishing, difese, simulazioni etiche, cultura" },
      { n: 27, title: "Specializzazione: privacy engineering", summary: "Privacy by design, DPIA, minimizzazione, anonimizzazione avanzata, consensi, diritti degli interessati" },
      { n: 28, title: "Specializzazione: sicurezza fisica e continuità", summary: "Accesso fisico, uffici e locali, backup e continuità, fornitori, esercitazioni" },
      { n: 29, title: "Specializzazione: sicurezza mobile", summary: "Android e iOS, permessi e store, sicurezza delle app, gestione dei dispositivi, protezione dei dati" },
      { n: 30, title: "Progetto avanzato e certificazioni", summary: "Scegliere la specializzazione, piano per le certificazioni, portfolio, CTF e bug bounty, audit di una piccola azienda" },
    ],
  },
  {
    id: "D",
    folder: "dati",
    title: "Analista di dati",
    modules: [
      { n: 1, title: "Che cosa sono i dati", summary: "Tipi di dati, tabelle, dataset, qualità, domande da porre ai dati, i mestieri dei dati" },
      { n: 2, title: "Fogli di calcolo", summary: "Formule, funzioni, tabelle pivot, grafici, ordinare e filtrare, Excel e Fogli Google" },
      { n: 3, title: "SQL", summary: "SELECT, filtri, aggregazioni, JOIN, sottoquery, funzioni finestra, progettare tabelle" },
      { n: 4, title: "Python per l'analisi", summary: "Variabili, liste, funzioni, NumPy, pandas, notebook, leggere e scrivere dati" },
      { n: 5, title: "Statistica descrittiva", summary: "Media, mediana, varianza, distribuzioni, correlazione, outlier, campionamento" },
      { n: 6, title: "Probabilità e inferenza", summary: "Probabilità, distribuzioni, intervalli di confidenza, test di ipotesi, p-value, errori" },
      { n: 7, title: "Visualizzazione dei dati", summary: "Scegliere il grafico giusto, colori, storytelling, dashboard, matplotlib, Power BI e Tableau" },
      { n: 8, title: "Pulizia e preparazione", summary: "Valori mancanti, duplicati, formati, outlier, unire fonti, data wrangling con pandas" },
      { n: 9, title: "Data engineering", summary: "Database, ETL e ELT, pipeline, data warehouse, orchestrazione, qualità e monitoraggio" },
      { n: 10, title: "Business intelligence e metriche", summary: "KPI, metriche di prodotto, esperimenti A/B, report, modelli dei dati, analisi di coorte" },
      { n: 11, title: "Machine learning introduttivo", summary: "Regressione, classificazione, clustering, addestramento e test, valutazione, overfitting" },
      { n: 12, title: "Etica, privacy e governance", summary: "GDPR, bias, anonimizzazione, sicurezza dei dati, catalogo e responsabilità, comunicazione onesta" },
      { n: 13, title: "Progetto e carriera", summary: "Portfolio, progetto completo dal dato al report, ruoli (analista, data engineer, data scientist), colloqui" },
      { n: 14, title: "Ramo: data engineering avanzato", summary: "Cloud, Spark e big data, streaming, data lake e lakehouse, orchestrazione, costi e prestazioni" },
      { n: 15, title: "Ramo: business intelligence avanzata", summary: "Modellazione a stella, DAX e misure, livello semantico, dashboard per i dirigenti, governance dei report" },
      { n: 16, title: "Ramo: data science avanzata", summary: "Feature, validazione, alberi e ensemble, serie storiche, introduzione al linguaggio naturale, messa in produzione" },
      { n: 17, title: "Ramo: analisi per settori", summary: "Casi di marketing, finanza, sanità, sport e logistica: domande, metriche e trappole di ogni settore" },
      { n: 18, title: "Ramo: SQL avanzato e database", summary: "Transazioni, indici, piani di esecuzione, viste, procedure, PostgreSQL e pgAdmin, backup e prestazioni" },
      { n: 19, title: "Ramo: R per l'analisi", summary: "Il linguaggio R, tidyverse, ggplot2, statistica applicata, report riproducibili con R Markdown e Quarto" },
      { n: 20, title: "Ramo: analisi di prodotto e web", summary: "Eventi e tracciamento, Google Analytics, funnel e percorsi, attribuzione, privacy e consenso, dashboard di prodotto" },
      { n: 21, title: "Ramo: analytics engineering", summary: "Modellare i dati con SQL versionato, dbt, test e documentazione, livelli staging e marts, integrazione continua" },
    ],
  },
  {
    id: "T",
    folder: "trading",
    title: "Trading algoritmico con Python",
    modules: [
      { n: 1, title: "Come funzionano i mercati", summary: "Azioni, obbligazioni, ETF, derivati in breve, borsa, broker e tipi di ordine" },
      { n: 2, title: "Dati di mercato con Python", summary: "Candele e volumi, fonti di dati, pandas per le serie temporali, rendimenti, prezzi corretti" },
      { n: 3, title: "Analisi tecnica e indicatori", summary: "Medie mobili, RSI, MACD, bande di Bollinger, ATR: cosa dicono e quali sono i limiti" },
      { n: 4, title: "Statistica per il trading", summary: "Rendimenti, volatilità, correlazione, code grasse, rumore e significatività" },
      { n: 5, title: "Strategie e backtesting", summary: "Regole e segnali, backtest vettoriale, look-ahead e survivorship bias, overfitting, walk-forward" },
      { n: 6, title: "Gestione del rischio", summary: "Position sizing, stop, drawdown, rischio di rovina, diversificazione, leva e margine" },
      { n: 7, title: "Metriche di performance", summary: "Rendimento annuo, volatilità, Sharpe e Sortino, drawdown massimo, confronto con il benchmark" },
      { n: 8, title: "Costi e realtà dell'esecuzione", summary: "Commissioni, spread, slippage, liquidità, tasse in Italia in sintesi, rendimento netto" },
      { n: 9, title: "Strategie classiche", summary: "Trend following, mean reversion, momentum, coppie, breakout e perché smettono di funzionare" },
      { n: 10, title: "Paper trading e API", summary: "Ambienti demo, API dei broker, chiavi al sicuro, ordini simulati, errori e monitoraggio" },
      { n: 11, title: "Machine learning per la finanza", summary: "Cosa si può prevedere, feature, perdita di dati, validazione temporale, rischi" },
      { n: 12, title: "Psicologia e disciplina", summary: "Bias comportamentali, FOMO, diario di trading, regole scritte, quando fermarsi" },
      { n: 13, title: "Legge, etica e truffe", summary: "CONSOB e MiFID II in sintesi, truffe e falsi broker, abusi di mercato, come verificare un intermediario" },
      { n: 14, title: "Progetto finale", summary: "Un'idea semplice, regole, backtest con costi, relazione onesta sui limiti" },
      { n: 15, title: "Approfondimento: opzioni e volatilità", summary: "Opzioni per chi fa backtest, volatilità storica e implicita, strategie nel codice, coperture, costi e rischi" },
      { n: 16, title: "Approfondimento: portafogli di strategie", summary: "Combinare strategie, correlazione, allocazione del capitale, ribilanciamento, monitoraggio, quando spegnere" },
      { n: 17, title: "Approfondimento: dati alternativi e sentiment", summary: "Dati alternativi, testo e notizie, sentiment e limiti, licenze e privacy, perdita di dati" },
      { n: 18, title: "Approfondimento: microstruttura di mercato", summary: "Libro degli ordini, partecipanti, spread e impatto, latenza, alta frequenza e rischi sistemici" },
    ],
  },
  {
    id: "H",
    folder: "hedge",
    title: "Hedge fund: strategie e gestione",
    modules: [
      { n: 1, title: "Che cos'è un hedge fund", summary: "Definizione e miti, struttura, commissioni, differenza dai fondi comuni, chi può investire" },
      { n: 2, title: "Le strategie", summary: "Long/short, global macro, event driven, relative value, quantitative, credit, managed futures" },
      { n: 3, title: "Teoria del portafoglio", summary: "Rischio e rendimento, diversificazione, Markowitz, CAPM, alpha e beta, fattori" },
      { n: 4, title: "Analisi fondamentale", summary: "Bilanci, flussi di cassa, multipli, valore intrinseco e DCF, confronto tra aziende" },
      { n: 5, title: "Derivati e copertura", summary: "Futures, opzioni, payoff, greche in modo intuitivo, hedging, swap, rischi" },
      { n: 6, title: "Il rischio", summary: "Volatilità, VaR, stress test, leva, liquidità, controparte, il caso LTCM" },
      { n: 7, title: "Costruzione del portafoglio", summary: "Obiettivi e vincoli, allocazione, risk parity, esposizione netta e lorda, ribilanciamento" },
      { n: 8, title: "Operazioni e infrastruttura", summary: "Prime broker, custodia, amministratore, valore netto, reporting, continuità operativa" },
      { n: 9, title: "Regolamentazione e compliance", summary: "AIFMD, MiFID II, antiriciclaggio, conflitti di interesse, controlli, autorità" },
      { n: 10, title: "Gli investitori", summary: "Due diligence, track record, comunicazione onesta, lock-up e rimborsi" },
      { n: 11, title: "Etica e fallimenti", summary: "Perché i fondi falliscono, LTCM, frodi come Madoff, cultura del rischio" },
      { n: 12, title: "Costruire un fondo", summary: "Idea e vantaggio, business plan, team, costi e capitale, autorizzazioni, carriera" },
      { n: 13, title: "Approfondimento: reddito fisso", summary: "Prezzo delle obbligazioni, curva dei tassi, duration e convessità, rischio di credito, inflazione, relative value" },
      { n: 14, title: "Approfondimento: opzioni a fondo", summary: "Black-Scholes intuitivo, volatilità implicita, greche, strategie, delta hedging, gamma e vega, rischi di coda" },
      { n: 15, title: "Approfondimento: fattori e strategie quantitative", summary: "Premi per il rischio, costruire un fattore, arbitraggio statistico, costi, overfitting, affollamento" },
      { n: 16, title: "Approfondimento: credito e situazioni speciali", summary: "High yield, debito in sofferenza, ristrutturazioni, capital structure arbitrage, recupero e valutazione" },
      { n: 17, title: "Approfondimento: macro e tassi", summary: "Banche centrali, cicli economici, valute e carry trade, materie prime, segnali macro, tesi macro" },
      { n: 18, title: "Approfondimento: event driven", summary: "Merger arbitrage, spin-off, azionariato attivista, calendario degli eventi, rischio di evento" },
      { n: 19, title: "Approfondimento: materie prime e futures", summary: "Futures sulle commodity, contango e backwardation, roll, energia e metalli, agricoli, rischi" },
      { n: 20, title: "Approfondimento: asset digitali e cripto", summary: "Cosa sono, custodia, derivati cripto, MiCA in sintesi, frodi e rischi sistemici" },
      { n: 21, title: "Approfondimento: contabilità e fiscalità del fondo", summary: "NAV, commissioni e high-water mark, rendiconti, fiscalità in sintesi, revisione, reporting" },
      { n: 22, title: "Approfondimento: tecnologia e dati", summary: "Dati alternativi, infrastruttura, Python in un fondo, esecuzione algoritmica, sicurezza informatica, continuità" },
      { n: 23, title: "Approfondimento: casi di studio", summary: "LTCM, Archegos, Madoff, la crisi del 2008, GameStop, lezioni e lista di controllo" },
      { n: 24, title: "Prepararsi alla professione", summary: "Ruoli, studi e certificazioni, colloqui, etica professionale, track record onesto" },
    ],
  },
  ...NEW_COURSES,
];

export function getCourseById(id: string) {
  return COURSES.find((c) => c.id === id);
}

export function getCourseByFolder(folder: string) {
  return COURSES.find((c) => c.folder === folder);
}
