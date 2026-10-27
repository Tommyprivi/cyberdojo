import type { PianoCorso } from "./tipi";

export const corso: PianoCorso = {
  id: "R",
  cartella: "reti-internet",
  titolo: "Reti e internet",
  presentazione:
    "Come funziona davvero internet, dal cavo in casa alla rete che tiene insieme il mondo: Wi-Fi, switch e router, protocolli, strumenti di diagnosi, progettazione, prestazioni, sicurezza di rete, automazione e reti moderne.",
  perChi: "Per chi vuole capire internet e le reti, o lavorare come tecnico di rete, anche partendo da zero.",
  consigliato: "Il blocco 1 si segue da zero. Chi ha già fatto Fondamenta (F5-F8: IP, subnet, TCP/UDP, DNS, HTTP, VPN) trova qui gli stessi argomenti solo richiamati e poi approfonditi.",
  blocchi: [
    {
      titolo: "Internet e la rete di casa",
      descrizione: "Cos'è internet, come arriva a casa e come si fa funzionare bene la propria rete.",
      moduli: [
        {
          titolo: "Che cos'è internet",
          riassunto: "Cavi, provider, dorsali, data center, indirizzi e storia di una rete di reti",
          lezioni:
            "Internet non è il web | Una breve storia di internet | Una rete di reti: come si collegano tra loro | Il provider e il collegamento da casa | Cavi in fibra, cavi sottomarini e dorsali | I data center: dove stanno i siti | Indirizzi e nomi: come ti trovano | Che cosa succede quando guardi un video | Chi governa internet (e chi no) | Esercizi: tracciare il percorso di un pacchetto sulla mappa",
        },
        {
          titolo: "La rete di casa",
          riassunto: "Router, modem, cavi, prese, indirizzi locali, collegare i dispositivi e capire cosa non va",
          rinvio: "Gli indirizzi IP privati e il NAT sono spiegati in Fondamenta (F5, F7).",
          lezioni:
            "Cosa c'è nella scatola del provider: modem e router | I cavi Ethernet e le prese | I dispositivi di casa e il loro indirizzo | L'interfaccia del router: cosa si trova e cosa non toccare | Nome della rete e password: scelte sensate | Ospiti e dispositivi della casa intelligente | Il controllo dei genitori e i limiti di cosa può fare | Aggiornare il router | Cosa vedere quando «internet non va»: gli step | Esercizi: disegnare e documentare la rete di casa",
        },
        {
          titolo: "Il Wi-Fi",
          riassunto: "Onde radio, bande e canali, standard, sicurezza WPA, copertura e velocità vera",
          lezioni:
            "Come passano i dati nell'aria | Le bande 2,4 e 5 GHz (e 6 GHz) | I canali e le interferenze | Gli standard Wi-Fi: 4, 5, 6, 6E, 7 | Perché la velocità reale è meno di quella scritta | Copertura: muri, distanza e posizione del router | Ripetitori, sistemi mesh e cavi | La sicurezza: WEP, WPA, WPA2, WPA3 | Reti aperte e pubbliche: i rischi | Esercizi: analizzare e migliorare il Wi-Fi di un appartamento",
        },
        {
          titolo: "I servizi che usi ogni giorno",
          riassunto: "Posta, messaggi, streaming, chiamate video, giochi online e come funzionano in rete",
          lezioni:
            "Come arriva un'email | Messaggi istantanei: cosa viaggia e cosa si vede | Lo streaming video e la qualità adattiva | Chiamate e videochiamate: il ritardo e le interruzioni | Giochi online: ping e latenza | I CDN: perché un sito si apre veloce | Cloud e sincronizzazione dei file | Cosa vede il tuo provider e cosa no | Test di velocità: cosa misurano | Esercizi: capire perché la videochiamata si blocca",
        },
      ],
    },
    {
      titolo: "Dentro la rete locale",
      descrizione: "Cavi, switch, strumenti di diagnosi e il progetto di una rete piccola.",
      moduli: [
        {
          titolo: "Ethernet e cablaggio",
          riassunto: "Standard Ethernet, cavi in rame e fibra, connettori, prese, prove e cablaggio ordinato",
          lezioni:
            "Ethernet: la lingua delle reti cablate | Velocità e standard: 100 Mb, 1 Gb, 10 Gb | Il cavo a coppie intrecciate e le categorie | Connettori e prese RJ45 | Cavi diritti e cavi incrociati: com'era e com'è | La fibra ottica: monomodale e multimodale | Lunghezze massime e perdite | Alimentare i dispositivi dal cavo (PoE) | Provare un cavo: cosa dice il tester | Esercizi: pianificare il cablaggio di un ufficio",
        },
        {
          titolo: "Switch e rete locale",
          riassunto: "Come lavora uno switch, tabella degli indirizzi, broadcast, anelli e collegamenti multipli",
          rinvio: "MAC, ARP e le VLAN introdotte sono in Fondamenta (F5, F8).",
          lezioni:
            "Hub e switch: la differenza | La tabella degli indirizzi MAC dello switch | Domini di collisione e di broadcast | Il guaio degli anelli nella rete | Spanning tree in parole semplici | Collegamenti multipli tra switch (aggregazione) | Switch gestibili e non gestibili | VLAN: ripasso e uso pratico | Collegare VLAN diverse | Esercizi: una rete a due switch nel simulatore",
        },
        {
          titolo: "Strumenti di diagnosi",
          riassunto: "ping, traceroute, nslookup, ss, mtr, iperf, tcpdump: cercare un problema con metodo",
          rinvio: "Wireshark e Packet Tracer sono in Fondamenta (F8).",
          lezioni:
            "Un metodo: dal cavo all'applicazione | ping: il cuore del controllo | traceroute e mtr: il percorso e dove si perde | nslookup e dig: interrogare il DNS | ip e ss: indirizzi e connessioni sul computer | curl: parlare con un sito dalla riga di comando | iperf: misurare la velocità tra due punti | tcpdump: guardare i pacchetti dal terminale | Leggere i risultati senza farsi ingannare | Esercizi: tre guasti da risolvere con il metodo",
        },
        {
          titolo: "Progettare una rete piccola",
          riassunto: "Requisiti, piano degli indirizzi, DHCP, DNS locale, server e documentazione",
          rinvio: "La suddivisione in sottoreti e il CIDR sono in Fondamenta (F6).",
          lezioni:
            "Dai bisogni alla rete: le domande da fare | Quanti dispositivi e quanta banda | Il piano degli indirizzi con spazio per crescere | Segmentare: ospiti, uffici e server | Un server DHCP: configurazione e prenotazioni | DNS locale: nomi per le macchine di casa | Un NAS e i file condivisi | Stampanti e dispositivi di rete | Documentare la rete: schema e tabella | Progetto: la rete di un piccolo studio professionale",
        },
      ],
    },
    {
      titolo: "Instradamento e reti geografiche",
      descrizione: "Come i pacchetti trovano la strada: routing, BGP, IPv6 e collegamenti su lunga distanza.",
      moduli: [
        {
          titolo: "Routing",
          riassunto: "Tabelle di routing, rotte statiche e dinamiche, RIP e OSPF in modo intuitivo",
          rinvio: "Il routing introduttivo è in Fondamenta (F6): qui si va oltre le rotte semplici.",
          lezioni:
            "Che cos'è un router e che cosa decide | Leggere una tabella di routing | La rotta più specifica vince | Rotte statiche | La rotta predefinita | Perché servono rotte dinamiche | Vettore di distanza e RIP | Stato dei collegamenti e OSPF | Il costo delle strade e la scelta del percorso | Esercizi: tre router nel simulatore",
        },
        {
          titolo: "BGP e come si tiene insieme internet",
          riassunto: "Sistemi autonomi, peering e transito, BGP in sintesi, guasti famosi e sicurezza dell'instradamento",
          lezioni:
            "Internet è fatta di sistemi autonomi | Il numero AS | Transito e peering | I punti di scambio (IXP) | BGP: il protocollo che si fida | Come BGP sceglie la strada | Quando un errore di rotta mette fuori servizio un sito | Il dirottamento delle rotte | Proteggere l'instradamento: RPKI in sintesi | Esercizi: leggere un percorso AS di un sito vero",
        },
        {
          titolo: "IPv6 e il futuro degli indirizzi",
          riassunto: "Perché IPv4 finisce, indirizzi IPv6, configurazione automatica e coesistenza",
          rinvio: "Una prima introduzione a IPv6 è in Fondamenta (F8).",
          lezioni:
            "Gli indirizzi IPv4 sono finiti: cosa è successo | Come è fatto un indirizzo IPv6 | Abbreviare gli indirizzi IPv6 | Tipi di indirizzi: globali, link-local e unique local | Il prefisso e le sottoreti in IPv6 | Configurazione automatica (SLAAC) e DHCPv6 | Neighbor Discovery al posto di ARP | IPv4 e IPv6 insieme: doppia pila e traduzione | Sicurezza e privacy in IPv6 | Esercizi: leggere e scrivere indirizzi IPv6",
        },
        {
          titolo: "Collegamenti geografici",
          riassunto: "Fibra, ADSL, mobile, satellite, collegamenti aziendali, SD-WAN e scelta del collegamento",
          lezioni:
            "Dalla casa alla centrale: tecnologie di accesso | ADSL e VDSL: come funzionano | Fibra: FTTH, FTTC e FTTB | Reti mobili e collegamenti radio | Satellite: pro, contro e il ritardo | Collegamenti dedicati per le aziende | Collegare più sedi: VPN e linee private | MPLS e SD-WAN in sintesi | Ridondanza: due collegamenti sono meglio di uno | Esercizi: scegliere il collegamento per tre sedi diverse",
        },
      ],
    },
    {
      titolo: "Prestazioni, sicurezza e automazione",
      descrizione: "Far andare bene la rete, proteggerla e smettere di configurarla a mano.",
      moduli: [
        {
          titolo: "Prestazioni e TCP a fondo",
          riassunto: "Banda, latenza, perdita, TCP in dettaglio, congestione, code e qualità del servizio",
          rinvio: "TCP e UDP di base sono in Fondamenta (F7).",
          lezioni:
            "Banda, latenza e perdita: tre cose diverse | Il prodotto banda per ritardo | Come TCP sa quanto dati mandare: finestre | La congestione e come TCP reagisce | Perché la velocità cala quando c'è perdita | Le code nei router e il bufferbloat | Qualità del servizio: dare la precedenza | UDP e le applicazioni in tempo reale | Misurare le prestazioni con metodo | Esercizi: perché il trasferimento è lento",
        },
        {
          titolo: "Affidabilità e monitoraggio",
          riassunto: "Ridondanza, gateway ridondanti, SNMP, registri, grafici e allarmi della rete",
          lezioni:
            "Un guasto non deve fermare tutto | Punti singoli di guasto | Gateway ridondanti | Collegamenti e alimentazione doppi | SNMP: chiedere ai dispositivi come stanno | Raccogliere e conservare i log di rete | Grafici di traffico e di utilizzo | Allarmi: cosa vale la pena sapere subito | Aggiornare i dispositivi senza fermare la rete | Esercizi: un piccolo monitoraggio con strumenti gratuiti",
        },
        {
          titolo: "Sicurezza della rete per chi la progetta",
          riassunto: "Regole di accesso, protezione delle porte, autenticazione 802.1X, VPN, zero trust e buone prassi",
          rinvio: "Firewall, IDS e segmentazione sono in Cybersecurity (C4): qui la prospettiva di chi costruisce la rete.",
          lezioni:
            "La rete come castello e come città | Segmentare per limitare i danni | Liste di controllo degli accessi (ACL) | Proteggere le porte dello switch | Autenticare chi si collega: 802.1X | Wi-Fi aziendale con accesso individuale | Accesso remoto sicuro con VPN | Zero trust: non fidarsi della sola posizione | Aggiornamenti e configurazioni sicure di base | Lista di controllo per una rete aziendale",
        },
        {
          titolo: "Automazione delle reti",
          riassunto: "Script, configurazioni come codice, API dei dispositivi, modelli e controllo delle modifiche",
          rinvio: "Python base: Fondamenta (F9) e Programmazione generale (P).",
          lezioni:
            "Perché automatizzare la rete | Copie delle configurazioni | Python per parlare con i dispositivi | Modelli di configurazione | Leggere e scrivere dati strutturati: JSON e YAML | API dei dispositivi e dei servizi di rete | Controllare che la rete sia come dovrebbe | Le modifiche in squadra con Git | Ansible per le reti in sintesi | Progetto: uno script che controlla una rete di prova",
        },
      ],
    },
    {
      titolo: "Reti moderne",
      descrizione: "Data center, reti mobili e dell'internet delle cose, protocolli nuovi e un progetto completo.",
      moduli: [
        {
          titolo: "Reti nel cloud e nei data center",
          riassunto: "Architetture dei data center, reti virtuali, bilanciamento, traffico nord-sud ed est-ovest",
          lezioni:
            "Dentro un data center | Rack, switch e cavi | Le architetture a due livelli: spine e leaf | Traffico nord-sud ed est-ovest | Reti virtuali e sovrapposte (overlay) | Reti definite dal software | Bilanciatori di carico a fondo | Le reti dei container | Interconnessione tra data center | Esercizi: progettare la rete di una piccola sala server",
        },
        {
          titolo: "Reti mobili e internet delle cose",
          riassunto: "Rete cellulare 4G e 5G, Bluetooth, Zigbee, LoRa, protocolli per dispositivi piccoli",
          lezioni:
            "Come funziona la rete cellulare | Celle, antenne e passaggio tra celle | Dal 3G al 5G: cosa cambia davvero | Bluetooth e Bluetooth a basso consumo | Zigbee, Thread e la casa intelligente | LoRa e le reti a lungo raggio | Protocolli leggeri: MQTT | Quanta energia e quanta banda servono ai dispositivi piccoli | Sicurezza e aggiornamenti dei dispositivi connessi | Esercizi: scegliere la tecnologia per un sensore in un campo",
        },
        {
          titolo: "Protocolli del web moderno",
          riassunto: "HTTP/2 e HTTP/3, QUIC, TLS 1.3, DNS sicuro, WebSocket e WebRTC",
          lezioni:
            "Com'è cambiato il web dagli anni Novanta | HTTP/1.1 e i suoi limiti | HTTP/2: molte richieste su una connessione | QUIC e HTTP/3 | TLS 1.3: più veloce e più sicuro | DNS cifrato: DoH e DoT | WebSocket: la connessione che resta aperta | WebRTC: audio e video tra browser | Cache, compressione e prestazioni | Esercizi: osservare le versioni di HTTP usate da un sito",
        },
        {
          titolo: "Progetto finale e mestiere",
          riassunto: "Progettare, documentare e provare una rete completa; i mestieri e le certificazioni",
          lezioni:
            "Progetto: i requisiti di una scuola o di uno studio | Progetto: il piano degli indirizzi | Progetto: lo schema fisico | Progetto: la configurazione di switch e router | Progetto: Wi-Fi e ospiti | Progetto: sicurezza e accessi | Progetto: monitoraggio e documentazione | Progetto: prove di funzionamento e di guasto | I mestieri di rete: tecnico, amministratore, ingegnere | Certificazioni e come continuare a imparare",
        },
      ],
    },
  ],
};
