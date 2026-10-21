# Brief: approfondimenti (Cybersecurity C12-C30, Hedge fund H13-H24, Trading T15-T18)

Il titolare vuole corsi più profondi. Si aggiungono moduli di **specializzazione** dopo il tronco principale. Valgono TUTTE le regole di `docs/scrivere-lezioni.md` (formato, 6-8 schermate, `<Say>`, `<Practice>`, `<Recap>`, banche di domande, video obbligatorio, `draft`) e, per finanza, `docs/brief-trading-hedge.md` (regole speciali: educazione non consulenza, mai denaro reale, onestà sui risultati, calcoli esatti, tono severo ma caldo). Per la cybersecurity valgono le regole di sicurezza e legge del documento principale: concetti, difese, rilevamento e ragionamento; nessun codice funzionante per attaccare sistemi reali, nessun malware, nessuna procedura operativa contro bersagli reali; richiamo di legge (art. 615-ter c.p.) ed etica dove si parla di attacco; solo laboratorio isolato e di proprietà dello studente.

Questi moduli sono **più approfonditi** del tronco principale: lezioni da 8-12 minuti, più esempi svolti, più scenari, errori comuni e casi realistici (fittizi). Rimandi al tronco principale quando ripetono (non ripetere: richiama con una riga).

## Dove scrivere

- Cybersecurity: `content/cybersecurity/c<N>/C.<NN>.<MMM>.mdx`, `course: cybersecurity`, banche `src/lib/practice/banks-cyber/c<NN>.ts` (export `C<NN>_ITEMS`, chiavi `"cNN-argomento"`), test `pnpm vitest run src/lib/practice/banks-cyber`.
- Hedge fund: `content/hedge/h<N>/H.<NN>.<MMM>.mdx`, banche `src/lib/practice/banks-hedge/h<NN>.ts`.
- Trading: `content/trading/t<N>/T.<NN>.<MMM>.mdx`, banche `src/lib/practice/banks-trading/t<NN>.ts`.
- Video: `pnpm check:videos C.12` (o H.13, T.15 ecc.). Italiano preferito, altrimenti inglese con sottotitoli.
- Componenti interattivi disponibili (usali con misura, mai come unica verifica): `<LinuxTerminal goal="..." scenario="base|logs|permessi|scripting" />`, `<VirtualMachine goal="..." />` (Linux minimo isolato, solo desktop), `<PythonTerminal code="..." />`, `<SqlPlayground db="log|negozio|scuola|vendite" query="..." />`.

## Cybersecurity: moduli di specializzazione

Prerequisito della prima lezione di ogni modulo: indicato nella colonna «Prerequisito» (lezioni già esistenti). Le lezioni successive di un modulo: la precedente.

| Modulo | Titolo | Lez. | Prerequisito (prima lezione) | Cintura | Argomenti, in ordine |
|---|---|---|---|---|---|
| C12 | Linux per la sicurezza | 7 | C.07.006 | blu | permessi avanzati e ACL; hardening del sistema (idee dei benchmark CIS); AppArmor e SELinux a livello concettuale; auditd e tracciamento; gestione avanzata di utenti e sudo; firewall con nftables/ufw; script di controllo della configurazione |
| C13 | Analisi del traffico di rete | 7 | C.04.006 | blu | Wireshark a fondo; filtri di cattura e di visualizzazione; analisi di DNS, HTTP e TLS; riconoscere anomalie; leggere una cattura sospetta (descritta nel testo); Zeek e NetFlow a livello concettuale; scrivere il rapporto di analisi |
| C14 | Windows e Active Directory in difesa | 7 | C.07.006 | blu | architettura di Windows; account, gruppi e permessi NTFS; Active Directory (domini, utenti, GPO); Kerberos e NTLM a livello concettuale; attacchi comuni ad AD spiegati per la difesa e come si rilevano; il registro eventi di Windows; hardening di Windows |
| C15 | Crittografia applicata | 6 | C.02.007 | blu | PKI e certificati; configurare TLS in modo corretto; gestione delle chiavi (KMS, HSM); firma del codice e catena di fornitura; cifratura di dischi e backup; password manager e passkey |
| C16 | Sicurezza delle API e dell'identità | 7 | C.05.008 | blu | OAuth 2.0 e OpenID Connect; JWT e i suoi errori tipici; sessioni contro token; CORS e CSRF; OWASP API Top 10; limitazione delle richieste e abusi; log e rilevamento |
| C17 | Sicurezza del cloud | 7 | C.04.006 | blu | responsabilità condivisa; IAM e minimo privilegio; storage esposti e configurazioni errate; reti virtuali e segmentazione; log e monitoraggio nel cloud; cifratura e gestione dei segreti; governance e costi |
| C18 | Analisi dei malware: concetti | 6 | C.09.006 | marrone | famiglie di malware; il ciclo di vita di un attacco; analisi statica a livello concettuale; analisi dinamica in sandbox isolata; indicatori di compromissione e regole YARA a livello concettuale; igiene del laboratorio di analisi. NIENTE istruzioni per creare o diffondere malware |
| C19 | Detection engineering e threat hunting | 7 | C.07.006 | marrone | dalla minaccia alla regola; Sigma e regole portabili; MITRE ATT&CK in pratica; threat hunting a ipotesi; ridurre i falsi positivi; metriche del SOC; esercitazioni purple team in laboratorio |
| C20 | Incident response avanzata | 6 | C.09.006 | marrone | runbook e playbook; comunicazione di crisi; ransomware: risposta e ripristino; forensics nel cloud; rapporti con autorità e assicurazioni; esercitazioni di tavolo (tabletop) |
| C21 | Penetration testing: metodologia | 6 | C.08.006 | marrone | fasi e standard (PTES, OWASP); ambito e regole d'ingaggio avanzate; enumerazione e valutazione in lab (concetti); post-sfruttamento a livello concettuale e rischi per il cliente; rapporto avanzato; carriera e certificazioni (in sintesi, ottobre 2026). Nessun exploit, nessun payload |
| C22 | Sicurezza di IoT e OT | 6 | C.04.006 | marrone | dispositivi IoT; protocolli industriali a livello concettuale; segmentazione tra IT e OT; aggiornamenti e ciclo di vita; casi storici (in sintesi); sicurezza dei dispositivi di casa |
| C23 | Governance, rischio e conformità | 7 | C.09.006 | marrone | analisi del rischio; ISO/IEC 27001; NIS2 e quadro europeo in sintesi; politiche e procedure; audit e controlli; continuità operativa e disaster recovery; metriche e rapporti alla direzione |
| C24 | DevSecOps | 7 | C.05.008 | marrone | sicurezza nel ciclo di sviluppo; SAST e DAST; dipendenze e catena di fornitura; container e Docker; infrastruttura come codice; segreti nel codice; integrazione continua sicura |
| C25 | Sicurezza e intelligenza artificiale | 6 | C.05.008 | marrone | rischi dei modelli; prompt injection; avvelenamento e privacy dei dati di addestramento; IA nella difesa e nell'attacco (concetti); governance dell'IA (AI Act in sintesi); uso responsabile |
| C26 | Social engineering e persone | 6 | C.03.006 | blu | psicologia dell'inganno; phishing avanzato e frodi del finto fornitore (BEC); vishing e smishing; difese organizzative; simulazioni di phishing etiche; cultura della sicurezza |
| C27 | Privacy engineering | 6 | C.10.006 | marrone | privacy by design; valutazione d'impatto (DPIA); minimizzazione tecnica; anonimizzazione avanzata (k-anonimato, privacy differenziale a livello concettuale); gestione dei consensi; diritti degli interessati in pratica |
| C28 | Sicurezza fisica e continuità | 5 | C.09.006 | blu | accesso fisico; sicurezza degli uffici e dei locali; backup e continuità; gestione dei fornitori; esercitazioni |
| C29 | Sicurezza mobile | 6 | C.05.008 | blu | modello di sicurezza di Android e iOS; permessi e store; sicurezza delle app (OWASP MASVS a livello concettuale); gestione dei dispositivi (MDM); protezione dei dati sul telefono; rischi comuni |
| C30 | Progetto avanzato e certificazioni | 6 | C.11.005 | marrone | scegliere una specializzazione; piano di studio per le certificazioni (Security+, CISSP, ecc.: panorama onesto, ottobre 2026); portfolio di sicurezza; CTF e bug bounty in pratica; la comunità; progetto finale: audit di una piccola azienda fittizia |

Ultime lezioni (per i prerequisiti): C12 C.12.007, C13 C.13.007, C14 C.14.007, C15 C.15.006, C16 C.16.007, C17 C.17.007, C18 C.18.006, C19 C.19.007, C20 C.20.006, C21 C.21.006, C22 C.22.006, C23 C.23.007, C24 C.24.007, C25 C.25.006, C26 C.26.006, C27 C.27.006, C28 C.28.005, C29 C.29.006, C30 C.30.006. I moduli C12-C29 sono rami paralleli (non dipendono l'uno dall'altro).

## Hedge fund: moduli di approfondimento

Prerequisito della prima lezione: nella tabella. Rami paralleli.

| Modulo | Titolo | Lez. | Prerequisito (prima lezione) | Cintura | Argomenti, in ordine |
|---|---|---|---|---|---|
| H13 | Reddito fisso | 7 | H.03.007 | arancione | prezzo di un'obbligazione; rendimenti e curva dei tassi; duration e convessità; rischio di credito e rating; inflazione e titoli indicizzati; strategie di relative value sui tassi; rischi |
| H14 | Opzioni a fondo | 7 | H.05.007 | verde | modello di Black-Scholes in modo intuitivo; volatilità implicita e smile; le greche in pratica; strategie con le opzioni (spread, straddle); copertura dinamica (delta hedging); gamma e vega; opzioni e rischi di coda |
| H15 | Fattori e strategie quantitative | 7 | H.03.007 | verde | premi per il rischio (value, momentum, qualità, dimensione, bassa volatilità); costruire un fattore; arbitraggio statistico; costi e capacità; overfitting nella ricerca; backtest di portafoglio; affollamento delle strategie |
| H16 | Credito e situazioni speciali | 6 | H.04.007 | verde | high yield e leveraged loans; debito in sofferenza; fallimenti e ristrutturazioni (concetti generali); arbitraggio sulla struttura del capitale; recupero e valutazione; casi |
| H17 | Macro e tassi | 6 | H.03.007 | verde | banche centrali e politica monetaria; cicli economici; valute e carry trade; materie prime e inflazione; segnali macro e limiti; costruire una tesi macro |
| H18 | Event driven | 6 | H.04.007 | blu | fusioni e acquisizioni (merger arbitrage); spin-off e ristrutturazioni; azionariato attivista; eventi societari e calendario; rischio di evento; gestione delle posizioni |
| H19 | Materie prime e futures | 6 | H.05.007 | blu | futures sulle materie prime; contango e backwardation; stoccaggio e roll; energia e metalli; agricoli e stagionalità; rischi |
| H20 | Asset digitali e cripto | 5 | H.06.007 | blu | cosa sono; custodia e rischi; derivati su cripto; regolamentazione (MiCA in sintesi); frodi e rischi sistemici |
| H21 | Contabilità e fiscalità del fondo | 6 | H.08.006 | blu | il valore netto (NAV) in dettaglio; commissioni e high-water mark; rendiconti; fiscalità in sintesi (concetti, mai consulenza); revisione contabile; reporting agli investitori |
| H22 | Tecnologia e dati | 6 | H.08.006 | blu | dati alternativi; infrastruttura dei dati; Python in un fondo (rimando al corso di trading); esecuzione algoritmica a livello concettuale; sicurezza informatica di un fondo; continuità operativa tecnologica |
| H23 | Casi di studio | 6 | H.11.005 | marrone | LTCM; Archegos (leva e total return swap) in sintesi; Madoff come frode; la crisi del 2008 e i fondi; lo short squeeze di GameStop in sintesi; lezioni e lista di controllo. Fatti verificati sul web e scritti in sintesi, senza accuse a persone viventi non condannate |
| H24 | Prepararsi alla professione | 5 | H.12.006 | marrone | ruoli (analista, risk manager, trader, direttore operativo); studi e certificazioni (CFA, FRM: in sintesi, ottobre 2026); colloqui; etica professionale; costruire un track record onesto |

Ultime lezioni: H13 H.13.007, H14 H.14.007, H15 H.15.007, H16 H.16.006, H17 H.17.006, H18 H.18.006, H19 H.19.006, H20 H.20.005, H21 H.21.006, H22 H.22.006, H23 H.23.006, H24 H.24.005.

## Trading: moduli di approfondimento

| Modulo | Titolo | Lez. | Prerequisito (prima lezione) | Cintura | Argomenti, in ordine |
|---|---|---|---|---|---|
| T15 | Opzioni e volatilità per il trader | 6 | T.09.007 | blu | opzioni per chi fa backtest; volatilità storica e implicita; strategie con le opzioni nel codice; copertura di un portafoglio; costi e liquidità delle opzioni; rischi e perdite illimitate |
| T16 | Portafogli di strategie | 6 | T.09.007 | blu | combinare strategie; correlazione tra strategie; allocazione del capitale; ribilanciamento; rischio di portafoglio e drawdown; monitoraggio e quando spegnere una strategia |
| T17 | Dati alternativi e sentiment | 5 | T.11.006 | marrone | cosa sono i dati alternativi; testo e notizie come dati; sentiment e i suoi limiti; costi, licenze e privacy; perdita di dati e bias |
| T18 | Microstruttura di mercato | 5 | T.08.006 | marrone | libro degli ordini; tipi di partecipanti; spread e impatto sul prezzo; velocità e latenza (concetti); strategie ad alta frequenza a livello concettuale e rischi sistemici |

Ultime lezioni: T15 T.15.006, T16 T.16.006, T17 T.17.005, T18 T.18.005.
