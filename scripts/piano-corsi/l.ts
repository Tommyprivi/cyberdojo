import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "L",
  cartella: "cloud-devops",
  titolo: "Cloud e DevOps",
  presentazione:
    "Come si pubblica e si fa funzionare un servizio vero: server e rete, container, cloud, automazione e rilasci continui, infrastruttura come codice, Kubernetes, monitoraggio e affidabilità. Gli esercizi usano strumenti gratuiti e il proprio computer.",
  perChi: "Per chi vuole lavorare con server, cloud e rilasci automatici, o semplicemente capire come gira un servizio online.",
  consigliato: "Conviene aver fatto Fondamenta (F1-F4: Linux) e le basi di programmazione (P1-P4). Per le reti basta F5-F7.",
  blocchi: [
    {
      titolo: "Le basi per mettere online",
      descrizione: "Cos'è DevOps, e il minimo su Linux, rete e Git per far funzionare un servizio.",
      moduli: [
        {
          titolo: "Che cos'è DevOps e che cos'è il cloud",
          riassunto: "Dal codice al servizio, cultura DevOps, cloud in parole semplici e il ciclo di vita di un'applicazione",
          lezioni:
            "Dal codice al servizio: cosa succede in mezzo | Chi sviluppa e chi gestisce: il muro da abbattere | Che cos'è DevOps (e cosa non è) | Il ciclo: pianificare, costruire, provare, rilasciare, osservare | Che cos'è il cloud in parole semplici | Server fisici, macchine virtuali e container | I mestieri: sviluppatore, sistemista, DevOps, SRE | I problemi che DevOps risolve: rilasci rari e rischiosi | Un servizio di esempio che useremo in tutto il corso | Cosa imparerai e come è organizzato il corso",
        },
        {
          titolo: "Linux per chi gestisce servizi",
          riassunto: "Accesso remoto con SSH, servizi, log, script di automazione, processi e risorse",
          rinvio: "Terminale, permessi e bash sono in Fondamenta (F2-F4): qui si usano per gestire un servizio.",
          lezioni:
            "Un server Linux: cosa c'è e cosa manca | Collegarsi con SSH e le chiavi | Copiare file con scp e rsync | I servizi con systemd | Leggere i log: journalctl e /var/log | Processi, memoria e disco: i comandi per capire cosa succede | Utenti e permessi sul server | Aggiornare il sistema e i pacchetti | Script che fanno le cose al posto tuo | Esercizi: preparare un server di prova in una macchina virtuale",
        },
        {
          titolo: "Rete e web per chi pubblica",
          riassunto: "DNS, porte, firewall, proxy inverso, HTTPS e certificati, bilanciare le richieste",
          rinvio: "IP, DNS, HTTP e NAT sono spiegati in Fondamenta (F5-F8): qui servono per pubblicare un sito.",
          lezioni:
            "Come arriva una richiesta al tuo server | DNS: record A, CNAME e MX | Porte e firewall sul server | Un server web: Nginx in pratica | Il proxy inverso | HTTPS e certificati gratuiti con Let's Encrypt | Rinnovare i certificati in automatico | Il bilanciatore di carico | Controlli di salute dei servizi | Esercizi: pubblicare un sito statico in una macchina virtuale",
        },
        {
          titolo: "Git e flussi di lavoro",
          riassunto: "Rami, rilasci, versioni e tag, convenzioni di squadra e revisione del codice",
          rinvio: "Git base e pull request: Programmazione generale (P13, P14).",
          lezioni:
            "Perché il codice di un servizio sta sotto Git | Flussi di lavoro: un solo ramo o tanti | Trunk-based e rami di funzione | Messaggi e convenzioni di commit | Versioni e tag: numerare i rilasci | Il changelog | Proteggere il ramo principale | Revisione del codice che trova errori | Cosa non va mai nel repository: segreti e file grandi | Esercizi: il repository di un servizio ben ordinato",
        },
      ],
    },
    {
      titolo: "Container",
      descrizione: "Pacchettizzare un'applicazione perché giri uguale ovunque.",
      moduli: [
        {
          titolo: "Docker: i primi passi",
          riassunto: "Container e macchine virtuali, immagini, comandi base, avviare, fermare e guardare dentro",
          lezioni:
            "Il problema «da me funziona» | Container o macchina virtuale | Installare Docker | Immagini e container: la differenza | Avviare il primo container | Elencare, fermare e cancellare | Entrare in un container e guardare | Porte e accesso dal browser | Variabili d'ambiente | Esercizi: un server web in un container",
        },
        {
          titolo: "Costruire immagini",
          riassunto: "Dockerfile, strati, cache, immagini piccole, build a più fasi e buone abitudini",
          lezioni:
            "Che cos'è un Dockerfile | FROM, COPY e RUN | CMD ed ENTRYPOINT | Gli strati e la cache di build | Il file .dockerignore | Immagini piccole: scegliere la base giusta | Build a più fasi | Utente non root nel container | Etichette e versioni delle immagini | Progetto: containerizzare l'applicazione del corso",
        },
        {
          titolo: "Più container insieme",
          riassunto: "Docker Compose, reti, volumi, database in container e configurazione",
          lezioni:
            "Un'app è fatta di tanti pezzi | Il file di Docker Compose | Avviare e fermare un insieme di servizi | Reti tra container: i nomi dei servizi | I volumi: dati che sopravvivono | Un database in container | Configurazione e file .env | Ordine di avvio e controlli di salute | Registri dei container: leggerli tutti | Progetto: l'app con database e proxy in un solo comando",
        },
        {
          titolo: "Registri e sicurezza dei container",
          riassunto: "Pubblicare le immagini, scansione, aggiornamenti, privilegi e segreti",
          rinvio: "La sicurezza dei container come pratica DevSecOps: Cybersecurity (C24).",
          lezioni:
            "Dove si conservano le immagini: i registri | Pubblicare un'immagine | Immagini ufficiali e immagini di cui diffidare | Vulnerabilità nelle immagini e come scansionarle | Aggiornare le basi senza rompere | Privilegi dei container: cosa limitare | Segreti: mai dentro l'immagine | Limiti di memoria e di processore | Cosa condividono davvero i container con il computer | Lista di controllo per un'immagine sicura",
        },
      ],
    },
    {
      titolo: "Il cloud",
      descrizione: "Capire i servizi dei grandi fornitori senza farsi spaventare dalle sigle.",
      moduli: [
        {
          titolo: "I concetti del cloud",
          riassunto: "Modelli di servizio, regioni, elasticità, responsabilità condivisa e come si ragiona sul cloud",
          rinvio: "La responsabilità condivisa e la sicurezza del cloud: Cybersecurity (C17).",
          lezioni:
            "Cloud pubblico, privato e ibrido | IaaS, PaaS e SaaS | Regioni e zone di disponibilità | Elasticità: crescere e calare in fretta | Pagare a consumo: cosa significa | La responsabilità condivisa | I grandi fornitori e cosa offrono in sintesi | Il livello gratuito: possibilità e trappole | Aprire un account senza sorprese sui costi | Esercizi: il vocabolario del cloud su un caso reale",
        },
        {
          titolo: "Calcolo, archiviazione e serverless",
          riassunto: "Macchine virtuali, archiviazione a oggetti, funzioni serverless, database gestiti e code",
          lezioni:
            "Le macchine virtuali nel cloud | Scegliere il tipo di macchina | Dischi e archiviazione a blocchi | L'archiviazione a oggetti | Un sito statico dentro un contenitore di oggetti | Funzioni serverless | Quando il serverless conviene e quando no | Database gestiti | Code e messaggi gestiti | Progetto: un'applicazione piccola costruita con pezzi gestiti",
        },
        {
          titolo: "Rete e identità nel cloud",
          riassunto: "Reti virtuali, sottoreti, gruppi di sicurezza, gestione di utenti e permessi",
          lezioni:
            "La rete virtuale privata del cloud | Sottoreti pubbliche e private | Tabelle di instradamento e uscita verso internet | Gruppi di sicurezza e regole di accesso | Collegare reti diverse | Identità e permessi: chi può fare cosa | Politiche e ruoli | Il minimo privilegio nel cloud | Autenticazione a più fattori e account di emergenza | Esercizi: leggere una politica di permessi e trovare l'errore",
        },
        {
          titolo: "Costi e scelta del fornitore",
          riassunto: "Come si legge una fattura, controllare la spesa, evitare sorprese e non restare vincolati",
          lezioni:
            "Da cosa dipende la spesa nel cloud | Leggere una fattura e il calcolatore di prezzi | Allarmi e limiti di spesa | Gli errori che costano: risorse dimenticate | Risparmiare: dimensioni giuste e spegnimenti | Prenotare capacità in anticipo | Costi del traffico dati | Il vincolo con un fornitore (lock-in) | Confrontare fornitori in modo onesto | Esercizi: stimare il costo mensile di un servizio",
        },
      ],
    },
    {
      titolo: "Automazione e orchestrazione",
      descrizione: "Rilasciare in automatico, descrivere l'infrastruttura con il codice e far girare molti container.",
      moduli: [
        {
          titolo: "Integrazione e rilascio continui (CI/CD)",
          riassunto: "Pipeline, test automatici, build, rilascio, ambienti e strategie di rilascio",
          lezioni:
            "Rilasci rari contro rilasci continui | Che cos'è una pipeline | La prima pipeline con GitHub Actions | Test automatici in pipeline | Costruire e pubblicare l'immagine | Gli ambienti: sviluppo, prova e produzione | Rilascio automatico verso la prova | Rilasciare in produzione con calma: approvazioni | Strategie: blu-verde e rilascio graduale | Tornare indietro in fretta quando qualcosa va male",
        },
        {
          titolo: "Infrastruttura come codice",
          riassunto: "Descrivere server e reti in file, Terraform, Ansible, stato e revisione dei cambiamenti",
          lezioni:
            "Il problema dei server fatti a mano | Descrivere l'infrastruttura in un file | Terraform: risorse e fornitori | Pianificare e applicare i cambiamenti | Lo stato e perché va protetto | Variabili, moduli e riuso | Ansible: configurare le macchine | Idempotenza: lanciare due volte non rompe | Revisione dei cambiamenti di infrastruttura | Progetto: un ambiente intero costruito da un file",
        },
        {
          titolo: "Kubernetes",
          riassunto: "Pod, deployment, servizi, configurazioni, scalare e aggiornare senza interruzioni",
          lezioni:
            "Perché serve un orchestratore | L'architettura di Kubernetes in sintesi | Un cluster di prova sul proprio computer | I pod | I deployment e le repliche | I servizi e la rete tra pod | ConfigMap e segreti | Aggiornare senza interruzioni | Scalare in automatico | Progetto: l'app del corso su Kubernetes",
        },
        {
          titolo: "Configurazioni, segreti e rilasci sicuri",
          riassunto: "Gestire configurazioni e segreti, firmare e controllare le dipendenze, sicurezza della catena di produzione",
          rinvio: "Sicurezza nel ciclo di sviluppo a fondo: Cybersecurity (C24).",
          lezioni:
            "Configurazione per ambiente | Segreti: dove si tengono e chi li legge | Cambiare un segreto senza fermare il servizio | Le dipendenze: cosa c'è dentro il tuo software | Aggiornare le dipendenze con criterio | La catena di fornitura del software | Firmare e verificare gli artefatti | Controlli di sicurezza in pipeline | Accessi della pipeline: il minimo necessario | Lista di controllo di una pipeline sicura",
        },
      ],
    },
    {
      titolo: "Operare e mantenere",
      descrizione: "Osservare, misurare l'affidabilità, rispondere agli incidenti e prepararsi ai guasti.",
      moduli: [
        {
          titolo: "Monitoraggio e osservabilità",
          riassunto: "Metriche, log, tracce, cruscotti, allarmi utili e Prometheus e Grafana",
          lezioni:
            "Sapere cosa succede nel servizio | Metriche, log e tracce | Prometheus: raccogliere metriche | Grafana: costruire un cruscotto | Quattro segnali d'oro: tempo, traffico, errori, saturazione | Log strutturati e centralizzati | Tracce distribuite in sintesi | Allarmi che servono e allarmi che stancano | Controlli dall'esterno: il servizio risponde? | Progetto: il cruscotto dell'applicazione del corso",
        },
        {
          titolo: "Affidabilità e incidenti",
          riassunto: "Obiettivi di servizio, budget di errore, risposta agli incidenti, analisi senza colpe",
          lezioni:
            "Che cos'è l'affidabilità | SLI, SLO e SLA | Il budget di errore | Reperibilità e turni | Cosa fare quando scatta un allarme | Gestire un incidente: ruoli e comunicazione | Rimediare prima, capire dopo | Analisi dopo l'incidente senza cercare colpevoli | Imparare dagli incidenti: azioni che restano | Esercizi: un incidente simulato dall'inizio alla fine",
        },
        {
          titolo: "Backup, ripristino e continuità",
          riassunto: "Copie di sicurezza, obiettivi di ripristino, piani di emergenza, prove di guasto e scalabilità",
          lezioni:
            "Cosa può andare storto: dal disco al fornitore | La regola 3-2-1 | RPO e RTO: quanto si può perdere e per quanto | Ripristinare davvero: provare i backup | Piano di emergenza (disaster recovery) | Più regioni e più zone | Test di carico: quanto regge il servizio | Prove di guasto controllate (chaos engineering in sintesi) | Pianificare la capacità | Esercizi: ripristinare un servizio da zero",
        },
        {
          titolo: "Progetto finale e carriera",
          riassunto: "Un servizio completo dall'idea al monitoraggio, con relazione, e come si cresce nel mestiere",
          lezioni:
            "Progetto: dall'idea ai requisiti | Progetto: il codice e le sue prove | Progetto: containerizzare e orchestrare | Progetto: la pipeline di rilascio | Progetto: l'infrastruttura descritta nel codice | Progetto: monitoraggio e allarmi | Progetto: sicurezza e costi | Progetto: il piano di emergenza | Presentare il progetto e la relazione | Percorsi e certificazioni: come continuare",
        },
      ],
    },
  ],
};
