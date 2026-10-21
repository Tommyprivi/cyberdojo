import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F6 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f06-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 * Tutti i calcoli sono stati verificati a mano (maschere, reti, broadcast, blocchi di sottoreti).
 */

// Tabella di routing usata in alcune domande di f06-routing.
const TAB = "Tabella: 10.0.0.0/8 via R1; 10.1.0.0/16 via R2; 10.1.5.0/24 via R3; 0.0.0.0/0 via ISP.";

export const F06_ITEMS: Record<string, BankItem[]> = {
  // ---------- F.06.001: la subnet mask ----------
  "f06-subnet-mask": [
    { q: "A cosa serve la subnet mask?", ok: "A dire quali bit dell'indirizzo IP indicano la rete e quali il dispositivo", no: ["A cifrare i pacchetti che escono dalla rete", "A dare un nome al computer", "A scegliere la velocità del cavo"] },
    { q: "Nella subnet mask 255.255.255.0, quanti sono i bit a 1?", ok: "24", no: ["8", "16", "32"] },
    { q: "Nella subnet mask, i bit a 1 indicano…", ok: "la parte di rete dell'indirizzo", no: ["la parte del dispositivo (host)", "i bit di controllo degli errori", "il numero della porta"] },
    { q: "Qual è il risultato dell'AND bit a bit tra un bit a 1 e un bit a 0?", ok: "0", no: ["1", "dipende dal bit successivo"] },
    { q: "Quale operazione si fa tra indirizzo IP e maschera per trovare l'indirizzo di rete?", ok: "AND bit a bit", no: ["OR bit a bit", "somma dei quattro numeri", "sottrazione ottetto per ottetto"] },
    { q: "Qual è l'indirizzo di rete di 192.168.10.77 con maschera 255.255.255.192?", ok: "192.168.10.64", no: ["192.168.10.0", "192.168.10.128", "192.168.10.76"] },
    { q: "Qual è l'indirizzo di rete di 10.4.200.9 con maschera 255.255.0.0?", ok: "10.4.0.0", no: ["10.0.0.0", "10.4.200.0", "0.0.200.9"] },
    { q: "Qual è l'indirizzo di rete di 172.16.45.130 con maschera 255.255.255.128?", ok: "172.16.45.128", no: ["172.16.45.0", "172.16.0.0", "172.16.45.192"] },
    { q: "Qual è l'indirizzo di rete di 192.168.5.200 con maschera 255.255.255.224?", ok: "192.168.5.192", no: ["192.168.5.224", "192.168.5.128", "192.168.5.160"] },
    { q: "Con maschera 255.255.252.0, qual è l'indirizzo di rete di 10.1.77.5?", ok: "10.1.76.0", no: ["10.1.77.0", "10.1.64.0", "10.1.0.0"] },
    { q: "Con maschera 255.255.255.0, i computer 192.168.1.20 e 192.168.1.200 sono nella stessa rete?", ok: "Sì: entrambi danno la rete 192.168.1.0", no: ["No: i numeri finali sono diversi", "Dipende dal gateway"] },
    { q: "Con maschera 255.255.255.128, i computer 192.168.1.20 e 192.168.1.200 sono nella stessa rete?", ok: "No: danno le reti 192.168.1.0 e 192.168.1.128", no: ["Sì: i primi tre numeri sono uguali", "Sì: la maschera non cambia il risultato"] },
    { q: "Con maschera 255.255.255.192, i computer 192.168.10.70 e 192.168.10.100 sono nella stessa rete?", ok: "Sì: entrambi danno la rete 192.168.10.64", no: ["No: danno le reti 192.168.10.0 e 192.168.10.64", "No: 70 e 100 sono troppo distanti"] },
    { q: "Quale di queste NON può essere una subnet mask valida (i bit a 1 devono stare tutti a sinistra, di seguito)?", ok: "255.255.0.255", no: ["255.255.254.0", "255.255.255.240", "255.255.192.0"] },
  ],

  // ---------- F.06.002: la notazione CIDR ----------
  "f06-cidr": [
    { q: "Che cosa indica il numero dopo la barra in 192.168.1.0/24?", ok: "Quanti bit iniziali sono la parte di rete", no: ["Quanti dispositivi ci sono nella rete", "Il numero della porta", "Quanti router servono"] },
    { q: "A quale maschera corrisponde il prefisso /24?", ok: "255.255.255.0", no: ["255.255.0.0", "255.0.0.0", "255.255.255.255"] },
    { q: "A quale maschera corrisponde il prefisso /16?", ok: "255.255.0.0", no: ["255.0.0.0", "255.255.255.0", "255.255.240.0"] },
    { q: "A quale maschera corrisponde il prefisso /8?", ok: "255.0.0.0", no: ["255.255.0.0", "255.255.255.0", "0.0.0.255"] },
    { q: "A quale maschera corrisponde il prefisso /26?", ok: "255.255.255.192", no: ["255.255.255.128", "255.255.255.224", "255.255.255.252"] },
    { q: "A quale maschera corrisponde il prefisso /20?", ok: "255.255.240.0", no: ["255.255.248.0", "255.255.224.0", "255.255.255.240"] },
    { q: "A quale maschera corrisponde il prefisso /27?", ok: "255.255.255.224", no: ["255.255.255.192", "255.255.255.240", "255.255.255.248"] },
    { q: "A quale maschera corrisponde il prefisso /22?", ok: "255.255.252.0", no: ["255.255.248.0", "255.255.254.0", "255.255.255.252"] },
    { q: "Come si scrive in CIDR la maschera 255.255.255.248?", ok: "/29", no: ["/28", "/30", "/27"] },
    { q: "Come si scrive in CIDR la maschera 255.255.255.252?", ok: "/30", no: ["/29", "/26", "/24"] },
    { q: "Come si scrive in CIDR la maschera 255.255.248.0?", ok: "/21", no: ["/20", "/22", "/19"] },
    { q: "Come si scrive in CIDR la maschera 255.255.192.0?", ok: "/18", no: ["/17", "/19", "/20"] },
    { q: "Come si scrive in CIDR la maschera 255.255.128.0?", ok: "/17", no: ["/16", "/18", "/15"] },
    { q: "Tra una rete /16 e una rete /24, quale contiene più indirizzi?", ok: "La /16: ha meno bit di rete e più bit per i dispositivi", no: ["La /24: ha più bit di rete, quindi più dispositivi", "Hanno gli stessi indirizzi: cambia solo il modo di scriverla", "Dipende dal gateway"] },
    { q: "In 172.16.5.9/20, quanti bit sono riservati ai dispositivi (host)?", ok: "12", no: ["20", "8", "4"] },
    { q: "Che cosa indica un prefisso /32, per esempio 203.0.113.7/32?", ok: "Un solo indirizzo, cioè un solo dispositivo", no: ["Tutta Internet", "La rete più grande possibile", "Un errore: il massimo è /30"] },
  ],

  // ---------- F.06.003: quanti indirizzi ci sono ----------
  "f06-indirizzi-host": [
    { q: "In una rete, l'indirizzo con tutti i bit del dispositivo a 0 è…", ok: "l'indirizzo di rete, il «nome» della rete", no: ["l'indirizzo di broadcast", "l'indirizzo del gateway", "il primo host utilizzabile"] },
    { q: "In una rete, l'indirizzo con tutti i bit del dispositivo a 1 è…", ok: "l'indirizzo di broadcast, per parlare a tutti", no: ["l'indirizzo di rete", "l'indirizzo del router", "l'indirizzo di loopback"] },
    { q: "Con n bit riservati ai dispositivi, quanti host utilizzabili ha la rete?", ok: "2^n − 2", no: ["2^n", "2^n − 1", "n × 2"] },
    { q: "Quanti host utilizzabili ha una rete /24?", ok: "254", no: ["256", "255", "24"] },
    { q: "Quanti host utilizzabili ha una rete /27?", ok: "30", no: ["32", "27", "28"] },
    { q: "Quanti host utilizzabili ha una rete /30?", ok: "2", no: ["4", "3", "1"] },
    { q: "Quanti host utilizzabili ha una rete /29?", ok: "6", no: ["8", "5", "7"] },
    { q: "Quanti host utilizzabili ha una rete /26?", ok: "62", no: ["64", "60", "63"] },
    { q: "Quanti host utilizzabili ha una rete /25?", ok: "126", no: ["128", "125", "127"] },
    { q: "Quanti host utilizzabili ha una rete /28?", ok: "14", no: ["16", "15", "12"] },
    { q: "Quanti host utilizzabili ha una rete /16?", ok: "65534", no: ["65536", "65535", "256"] },
    { q: "Qual è l'indirizzo di broadcast della rete di 192.168.10.77/26?", ok: "192.168.10.127", no: ["192.168.10.255", "192.168.10.64", "192.168.10.126"] },
    { q: "Qual è il primo host utilizzabile della rete di 192.168.10.77/26?", ok: "192.168.10.65", no: ["192.168.10.64", "192.168.10.1", "192.168.10.77"] },
    { q: "Qual è l'ultimo host utilizzabile della rete di 192.168.10.77/26?", ok: "192.168.10.126", no: ["192.168.10.127", "192.168.10.254", "192.168.10.63"] },
    { q: "Qual è l'indirizzo di rete di 10.0.5.9/30?", ok: "10.0.5.8", no: ["10.0.5.0", "10.0.5.9", "10.0.5.4"] },
    { q: "Qual è l'indirizzo di broadcast della rete di 192.168.1.130/25?", ok: "192.168.1.255", no: ["192.168.1.127", "192.168.1.254", "192.168.1.128"] },
    { q: "Qual è l'indirizzo di broadcast della rete di 172.16.20.200/28?", ok: "172.16.20.207", no: ["172.16.20.208", "172.16.20.200", "172.16.20.255"] },
    { q: "Puoi assegnare 192.168.1.127 a un PC di una rete 192.168.1.0/25?", ok: "No: è l'indirizzo di broadcast di quella rete", no: ["Sì: è un normale indirizzo per un dispositivo", "No: gli indirizzi che finiscono per 7 sono vietati", "Sì, ma solo a un server"] },
  ],

  // ---------- F.06.004: dividere una rete in sottoreti ----------
  "f06-sottoreti": [
    { q: "Quanti bit si prendono dalla parte dei dispositivi per ottenere almeno 4 sottoreti?", ok: "2", no: ["1", "3", "4"] },
    { q: "Quanti bit si prendono dalla parte dei dispositivi per ottenere esattamente 8 sottoreti?", ok: "3", no: ["2", "4", "8"] },
    { q: "Servono 5 sottoreti della stessa dimensione. Quanti bit si prendono dalla parte dei dispositivi?", ok: "3", no: ["2", "4", "5"] },
    { q: "Quanti bit si prendono dalla parte dei dispositivi per ottenere 16 sottoreti?", ok: "4", no: ["3", "5", "16"] },
    { q: "Dividi 192.168.1.0/24 in 4 sottoreti uguali. Quale prefisso hanno?", ok: "/26", no: ["/25", "/27", "/28"] },
    { q: "Dividi 192.168.1.0/24 in 8 sottoreti uguali. Quale prefisso hanno?", ok: "/27", no: ["/26", "/28", "/25"] },
    { q: "Dividi 192.168.1.0/24 in 2 sottoreti uguali. Quale prefisso hanno?", ok: "/25", no: ["/26", "/24", "/27"] },
    { q: "Dividi 192.168.1.0/24 in 4 sottoreti /26. Qual è la terza sottorete?", ok: "192.168.1.128/26", no: ["192.168.1.64/26", "192.168.1.192/26", "192.168.1.128/25"] },
    { q: "Quanti host utilizzabili ha ciascuna delle 4 sottoreti ottenute da 192.168.1.0/24?", ok: "62", no: ["64", "63", "254"] },
    { q: "Quanti host utilizzabili ha ciascuna delle 8 sottoreti ottenute da 192.168.1.0/24?", ok: "30", no: ["32", "31", "28"] },
    { q: "Le sottoreti di 192.168.1.0/24 diviso in 4 sono .0/26, .64/26, .128/26 e .192/26. In quale cade 192.168.1.130?", ok: "192.168.1.128/26", no: ["192.168.1.64/26", "192.168.1.192/26", "192.168.1.0/26"] },
    { q: "Dividi 192.168.1.0/24 in 8 sottoreti /27. Qual è la seconda sottorete?", ok: "192.168.1.32/27", no: ["192.168.1.64/27", "192.168.1.16/27", "192.168.1.128/27"] },
    { q: "Dividi 172.16.0.0/16 in 4 sottoreti uguali. Quale prefisso hanno?", ok: "/18", no: ["/17", "/19", "/20"] },
    { q: "Dividi 172.16.0.0/16 in 4 sottoreti uguali. Qual è l'ultima?", ok: "172.16.192.0/18", no: ["172.16.128.0/18", "172.16.192.0/24", "172.16.255.0/18"] },
    { q: "Servono 3 sottoreti della stessa dimensione da 192.168.1.0/24. Quale prefisso usi?", ok: "/26", no: ["/25", "/27", "/24"] },
    { q: "Che cosa succede ai bit di rete quando si divide una rete in sottoreti?", ok: "Aumentano: si prendono bit in prestito dalla parte dei dispositivi", no: ["Diminuiscono: la rete diventa più piccola", "Restano uguali: cambia solo il gateway", "Si azzerano"] },
    { q: "Perché un'azienda divide la sua rete in sottoreti per reparto?", ok: "Per separare i reparti e limitare quanto può diffondersi un problema", no: ["Per avere più indirizzi in totale", "Per cifrare tutto il traffico", "Per rendere i computer più veloci"] },
  ],

  // ---------- F.06.005: sottoreti per host richiesti e VLSM ----------
  "f06-vlsm": [
    { q: "Servono 50 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/26", no: ["/27", "/25", "/24"] },
    { q: "Servono 20 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/27", no: ["/28", "/26", "/29"] },
    { q: "Servono 10 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/28", no: ["/29", "/27", "/30"] },
    { q: "Servono 100 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/25", no: ["/26", "/24", "/27"] },
    { q: "Qual è il prefisso più adatto al collegamento tra due soli router?", ok: "/30", no: ["/29", "/28", "/24"] },
    { q: "Servono 6 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/29", no: ["/30", "/28", "/27"] },
    { q: "Servono 62 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/26", no: ["/27", "/25", "/28"] },
    { q: "Servono 63 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/25", no: ["/26", "/27", "/24"] },
    { q: "Servono 1000 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/22", no: ["/23", "/21", "/24"] },
    { q: "Servono 15 dispositivi in una rete. Qual è il prefisso della rete più piccola che li contiene tutti?", ok: "/27", no: ["/28", "/26", "/29"] },
    { q: "Che cosa significa VLSM (Variable Length Subnet Mask)?", ok: "Usare maschere di lunghezza diversa per sottoreti diverse, ognuna della misura giusta", no: ["Usare la stessa maschera per tutte le sottoreti", "Usare una maschera più veloce per i server", "Un protocollo con cui i router si scambiano le route"] },
    { q: "Perché per il collegamento tra due router si usa un /30 e non un /26?", ok: "Perché il /30 basta e non spreca 60 indirizzi", no: ["Perché il /30 è più veloce", "Perché tra router il /26 non funziona", "Perché i router vogliono maschere diverse dai PC"] },
    { q: "Con il VLSM, in che ordine conviene assegnare le sottoreti?", ok: "Prima le più grandi, partendo dall'inizio del blocco", no: ["Prima le più piccole", "In ordine alfabetico dei reparti", "A caso: il blocco è lo stesso"] },
    { q: "Dal blocco 192.168.20.0/24 hai assegnato 192.168.20.0/26 (50 host). Dove parte la rete da 25 host (/27)?", ok: "192.168.20.64/27", no: ["192.168.20.64/26", "192.168.20.32/27", "192.168.20.128/27"] },
    { q: "Dal blocco 192.168.20.0/24 hai assegnato .0/26 e .64/27. Dove parte la rete da 10 host (/28)?", ok: "192.168.20.96/28", no: ["192.168.20.80/28", "192.168.20.128/28", "192.168.20.100/28"] },
    { q: "Dal blocco 192.168.20.0/24 hai assegnato .0/26, .64/27 e .96/28. Dove parte il collegamento da /30?", ok: "192.168.20.112/30", no: ["192.168.20.110/30", "192.168.20.116/30", "192.168.20.128/30"] },
  ],

  // ---------- F.06.006: il gateway ----------
  "f06-gateway": [
    { q: "Che cos'è il gateway predefinito di un PC?", ok: "Il router a cui il PC manda i pacchetti destinati ad altre reti", no: ["Il server che traduce i nomi dei siti in indirizzi (DNS)", "Il cavo che collega il PC allo switch", "Il programma antivirus del PC"] },
    { q: "Come decide un PC se la destinazione è nella sua stessa rete?", ok: "Applica la propria maschera al proprio indirizzo e a quello di destinazione e confronta le due reti", no: ["Controlla se il nome della destinazione somiglia al suo", "Prova sempre prima tramite il gateway", "Fa un ping e guarda se risponde"] },
    { q: "Un PC 192.168.1.66/24 deve parlare con 192.168.1.200. Come procede?", ok: "Direttamente nella rete locale, chiedendo il MAC con ARP", no: ["Passa dal gateway", "Non può: serve prima il DNS", "Manda il pacchetto al gateway, che lo rimanda indietro"] },
    { q: "Un PC 192.168.1.66/24 deve parlare con 203.0.113.50. Come procede?", ok: "Manda il pacchetto al gateway: la destinazione è in un'altra rete", no: ["Direttamente: la rete è la stessa", "Con un broadcast a tutti", "Non parte finché non trova il DNS"] },
    { q: "Un PC 192.168.1.66/26 deve parlare con 192.168.1.100. Come procede?", ok: "Direttamente: sono nella stessa rete, la 192.168.1.64", no: ["Passa dal gateway: i numeri finali sono diversi", "Passa dal gateway: 100 è oltre la fine della rete"] },
    { q: "Un PC 192.168.1.66/26 deve parlare con 192.168.1.10. Come procede?", ok: "Passa dal gateway: 192.168.1.10 è nella rete 192.168.1.0, diversa dalla 192.168.1.64", no: ["Direttamente: i primi tre numeri sono uguali", "Direttamente: 10 è minore di 66", "Non è raggiungibile in nessun modo"] },
    { q: "Un PC 10.0.0.15/8 deve parlare con 10.200.3.4. Come procede?", ok: "Direttamente: sono nella stessa rete 10.0.0.0/8", no: ["Passa dal gateway: il secondo numero è diverso", "Passa dal gateway: il terzo numero è diverso", "Dipende dal DNS"] },
    { q: "Un PC 172.16.5.9/16 deve parlare con 172.17.5.9. Come procede?", ok: "Passa dal gateway: la rete 172.16.0.0/16 è diversa dalla 172.17.0.0/16", no: ["Direttamente: iniziano entrambi per 172", "Direttamente: un /16 copre tutti i 172", "Non è raggiungibile in nessun modo"] },
    { q: "Un PC 192.168.10.77/26 deve parlare con 192.168.10.120. Come procede?", ok: "Direttamente: sono nella stessa rete, la 192.168.10.64", no: ["Passa dal gateway: 120 è maggiore di 77", "Passa dal gateway: la rete è la 192.168.10.0", "Passa dal gateway: 120 è un broadcast"] },
    { q: "Un PC 192.168.10.77/26 deve parlare con 192.168.10.130. Come procede?", ok: "Passa dal gateway: 192.168.10.130 è nella rete .128, diversa dalla .64", no: ["Direttamente: i primi tre numeri sono uguali", "Direttamente: 130 è vicino a 77", "Con un broadcast a tutti"] },
    { q: "Quale di questi può essere il gateway di un PC 192.168.1.66/24?", ok: "192.168.1.1", no: ["192.168.2.1", "10.0.0.1", "192.168.1.66"] },
    { q: "Un PC /24 ha indirizzo e maschera giusti ma nessun gateway. Che cosa funziona?", ok: "Parla con la rete locale ma non raggiunge altre reti", no: ["Niente: neppure il vicino di scrivania", "Solo Internet, non la rete locale", "Tutto: il gateway è facoltativo"] },
    { q: "Un pacchetto da un PC va a un server di un'altra rete. Qual è il MAC di destinazione nella busta Ethernet del primo salto?", ok: "Quello del gateway (il router)", no: ["Quello del server", "Quello di broadcast, per raggiungere tutti", "Quello del server DNS"] },
    { q: "Nello stesso pacchetto (senza NAT), qual è l'indirizzo IP di destinazione?", ok: "Quello del server finale", no: ["Quello del gateway", "Quello del PC che invia", "0.0.0.0"] },
    { q: "Un PC 192.168.1.66/26 ha gateway 192.168.1.1. Che cosa non va?", ok: "Il gateway è nella rete 192.168.1.0, il PC nella 192.168.1.64: non può raggiungerlo direttamente", no: ["Il gateway deve sempre finire per 254", "Niente: va benissimo", "Il gateway deve finire con lo stesso numero del PC"] },
  ],

  // ---------- F.06.007: il routing ----------
  "f06-routing": [
    { q: "Che cos'è una tabella di routing?", ok: "L'elenco con cui il router sa, per ogni rete di destinazione, a chi inoltrare il pacchetto", no: ["L'elenco delle password dei dispositivi", "Il registro dei pacchetti persi", "La tabella dei MAC che usa lo switch"] },
    { q: "Che cosa dice la regola del prefisso più lungo?", ok: "Tra le route che corrispondono vince quella con più bit di rete, la più specifica", no: ["Vince la prima route della tabella", "Vince la route con il numero più piccolo", "Vince la route con il prefisso più corto"] },
    { q: TAB + " Dove va un pacchetto per 10.1.5.9?", ok: "A R3", no: ["A R1", "A R2", "All'ISP"] },
    { q: TAB + " Dove va un pacchetto per 10.1.9.9?", ok: "A R2", no: ["A R1", "A R3", "All'ISP"] },
    { q: TAB + " Dove va un pacchetto per 10.9.9.9?", ok: "A R1", no: ["A R2", "A R3", "All'ISP"] },
    { q: TAB + " Dove va un pacchetto per 172.40.12.9?", ok: "All'ISP", no: ["A R1", "A R2", "A R3"] },
    { q: TAB + " Dove va un pacchetto per 10.1.6.1?", ok: "A R2", no: ["A R3", "A R1", "All'ISP"] },
    { q: "Che cos'è la route di default?", ok: "La 0.0.0.0/0: corrisponde a ogni indirizzo e si usa solo se nessuna route più specifica corrisponde", no: ["La route che il router prova sempre per prima", "La route che blocca i pacchetti sconosciuti", "La route verso il router stesso (127.0.0.1)"] },
    { q: "Un router non ha una route che corrisponde e non ha una route di default. Che cosa fa del pacchetto?", ok: "Lo scarta (e può avvisare chi lo ha inviato)", no: ["Lo inoltra a tutti i vicini", "Lo tiene in attesa finché arriva una route", "Lo rimanda al mittente senza cambiarlo"] },
    { q: "Un router ha: 192.168.1.0/24 diretta; 192.168.2.0/24 via R2; 0.0.0.0/0 via ISP. Dove va un pacchetto per 192.168.2.77?", ok: "A R2", no: ["Lo consegna direttamente nella rete 192.168.1.0/24", "All'ISP", "Viene scartato"] },
    { q: "Che cosa significa che una rete è «direttamente connessa» a un router?", ok: "È collegata a un'interfaccia del router: non serve un prossimo salto", no: ["È raggiungibile solo passando da Internet", "È una rete senza maschera", "È la rete di un altro router vicino"] },
    { q: "Che cos'è il prossimo salto (next hop) di una route?", ok: "L'indirizzo del prossimo router a cui inoltrare il pacchetto", no: ["Il numero massimo di router che si possono attraversare", "L'indirizzo del server finale", "Il tempo che il pacchetto impiega"] },
    { q: "Un router inoltra un pacchetto (senza NAT). Cambia l'IP di destinazione?", ok: "No: cambia solo la busta Ethernet, cioè i MAC", no: ["Sì: mette l'IP del prossimo router", "Sì: mette il proprio IP", "Sì, ma solo se usa la route di default"] },
    { q: "Tra 10.1.5.0/24 e 10.0.0.0/8, quale route è più specifica?", ok: "La 10.1.5.0/24: ha più bit di rete", no: ["La 10.0.0.0/8: copre più indirizzi", "Sono uguali", "Dipende dall'ordine nella tabella"] },
  ],

  // ---------- F.06.008: routing statico e dinamico ----------
  "f06-routing-dinamico": [
    { q: "Che cos'è una route statica?", ok: "Una route scritta a mano dall'amministratore", no: ["Una route imparata scambiando messaggi con gli altri router", "Una route che cambia ogni minuto", "Una route che vale solo per il Wi-Fi"] },
    { q: "Che cos'è il routing dinamico?", ok: "I router si scambiano informazioni e costruiscono le tabelle da soli", no: ["L'amministratore scrive ogni route a mano", "Il router usa sempre e solo la route di default", "Ogni pacchetto sceglie da solo la strada"] },
    { q: "Qual è il limite principale di una route statica?", ok: "Se un collegamento cade, non si adatta: qualcuno deve cambiarla", no: ["Consuma moltissima banda", "Non si può usare con più di due router", "Non si può usare insieme alla route di default"] },
    { q: "Una rete aziendale ha 200 router e collegamenti che cambiano spesso. Che cosa conviene?", ok: "Il routing dinamico", no: ["Solo route statiche scritte a mano", "Solo la route di default su ogni router", "Nessun routing: basta uno switch"] },
    { q: "Un piccolo ufficio ha un solo router collegato a un solo provider. Che cosa basta di solito?", ok: "Una route statica di default verso il provider", no: ["OSPF con tante aree", "BGP per ricevere tutta Internet", "Una route per ogni sito web"] },
    { q: "Che cosa conta il protocollo RIP per scegliere la strada?", ok: "Il numero di router attraversati (i salti)", no: ["La velocità del collegamento", "La distanza in chilometri", "Il costo del collegamento in euro"] },
    { q: "Qual è il limite di RIP?", ok: "Al massimo 15 salti: 16 significa irraggiungibile", no: ["255 salti", "Un solo salto", "Nessun limite"] },
    { q: "Che cos'è il protocollo di routing OSPF?", ok: "Un protocollo interno che costruisce una mappa della rete e calcola il percorso migliore", no: ["Un protocollo tra le grandi organizzazioni di Internet", "Un protocollo che conta solo i salti, fino a 15", "Un protocollo per cifrare il traffico"] },
    { q: "A cosa serve il protocollo di routing BGP?", ok: "A scambiare le route tra reti di organizzazioni diverse su Internet", no: ["A dare gli indirizzi IP ai PC", "A tradurre i nomi dei siti in indirizzi", "A collegare i PC dentro un ufficio"] },
    { q: "Che cos'è un sistema autonomo (AS)?", ok: "Un insieme di reti gestito da un'unica organizzazione, con una propria politica di routing", no: ["Un router che si configura da solo", "Una rete senza gateway", "Un computer che non ha bisogno di un indirizzo"] },
    { q: "Quale protocollo tiene insieme Internet tra gli operatori e le grandi organizzazioni?", ok: "BGP", no: ["RIP", "OSPF", "ARP"] },
    { q: "Perché un router non dovrebbe fidarsi di route annunciate da chiunque?", ok: "Perché un annuncio falso o sbagliato può deviare o interrompere il traffico", no: ["Perché gli annunci consumano troppa corrente", "Perché i router accettano solo route statiche", "Perché gli annunci cambiano l'indirizzo IP dei PC"] },
    { q: "Quale protocollo di routing è il più vecchio e semplice, adatto a reti molto piccole?", ok: "RIP", no: ["OSPF", "BGP", "DNS"] },
    { q: "Una route statica dice: per 192.168.50.0/24 via 192.168.1.2. Che cosa significa?", ok: "Per raggiungere 192.168.50.0/24 manda i pacchetti al router 192.168.1.2", no: ["La rete 192.168.50.0/24 è collegata direttamente al router", "Tutto il traffico va a 192.168.50.0", "Blocca il traffico verso 192.168.1.2"] },
  ],
};
