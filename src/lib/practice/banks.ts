import { rng, shuffle, type Question } from "./core";
import { ipQuestions } from "./ip";

/**
 * Domande a scelta. Ogni banca è scritta a mano e controllata dai test: una sola risposta giusta,
 * nessuna opzione ripetuta. Le opzioni si mescolano per seme, quindi la posizione giusta cambia.
 */

export type BankItem = { q: string; ok: string; no: [string, string] | [string, string, string] };

export function makeBank(id: string, items: readonly BankItem[]) {
  return (seed: string, count = 5): Question[] => {
    const next = rng(`${id}:${seed}`);
    const picked = shuffle(items, next).slice(0, Math.min(count, items.length));
    return picked.map((it) => {
      const options = shuffle([it.ok, ...it.no], next);
      return { prompt: it.q, data: "", choices: options, answer: options.indexOf(it.ok) };
    });
  };
}

// ---------- F.05.001: il pacchetto e il suo log ----------
export const PACKET_BASICS: BankItem[] = [
  { q: "In un pacchetto, l'indirizzo sorgente indica…", ok: "chi ha inviato il pacchetto", no: ["a chi è diretto", "quanto è grande il pacchetto", "quale password è stata usata"] },
  { q: "L'indirizzo di destinazione indica…", ok: "a chi è diretto il pacchetto", no: ["chi lo ha inviato", "quanto tempo ha impiegato", "se il contenuto è cifrato"] },
  { q: "Un indirizzo IPv4 è lungo…", ok: "32 bit", no: ["8 bit", "16 bit", "64 bit"] },
  { q: "Un indirizzo IPv4 si scrive come…", ok: "quattro numeri da 0 a 255 separati da punti", no: ["quattro lettere separate da punti", "un solo numero da 0 a 999", "sei coppie di cifre separate da due punti"] },
  { q: "La porta 22 serve di solito per…", ok: "l'accesso remoto (SSH)", no: ["le pagine web sicure (HTTPS)", "la posta in arrivo", "la risoluzione dei nomi (DNS)"] },
  { q: "La porta 443 serve di solito per…", ok: "le pagine web sicure (HTTPS)", no: ["l'accesso remoto (SSH)", "il trasferimento di file in chiaro", "la posta in uscita"] },
  { q: "A cosa serve guardare l'indirizzo sorgente in un log?", ok: "a capire da dove arriva il traffico", no: ["a leggere il contenuto del messaggio", "a spegnere il server", "a conoscere il nome dell'utente"] },
  { q: "Una connessione verso un server è identificata da indirizzo IP di destinazione e…", ok: "porta", no: ["colore", "versione del browser", "orario di spegnimento"] },
];

// ---------- F.05.002: indirizzi IPv4 validi o no ----------
export function ipValid(seed: string, count = 5): Question[] {
  const next = rng(`ip-valid:${seed}`);
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const octet = () => int(0, 255);
  const out: Question[] = [];
  const seen = new Set<string>();
  while (out.length < count) {
    const wantValid = out.length % 2 === 0 ? next() < 0.4 : next() < 0.6; // mix, senza schema fisso
    let parts: string[] = [String(octet()), String(octet()), String(octet()), String(int(1, 254))];
    let valid = true;
    if (!wantValid) {
      valid = false;
      const kind = int(0, 3);
      if (kind === 0) parts[int(0, 3)] = String(int(256, 999)); // ottetto troppo grande
      else if (kind === 1) parts = parts.slice(0, 3); // un ottetto in meno
      else if (kind === 2) parts.push(String(octet())); // un ottetto in più
      else parts[int(0, 3)] = "1o" + String(int(0, 9)); // una lettera "o" al posto di uno zero
    }
    const data = parts.join(".");
    if (seen.has(data)) continue;
    seen.add(data);
    out.push({
      prompt: "Questo indirizzo IPv4 è valido?",
      data,
      choices: ["Valido", "Non valido"],
      answer: valid ? 0 : 1,
    });
  }
  return out;
}

// ---------- F.05.005: da dentro o da Internet ----------
export function ipPrivatePublic(seed: string, count = 5): Question[] {
  return ipQuestions(`pp:${seed}`, count).map((q) => ({
    prompt: "Questo indirizzo sorgente arriva da…",
    data: q.octets.join("."),
    choices: ["Dentro l'azienda (rete privata)", "Internet (indirizzo pubblico)"],
    answer: q.private ? 0 : 1,
  }));
}

// ---------- F.05.006: byte esadecimali (MAC) ----------
export function hexByteToDecimal(seed: string, count = 5): Question[] {
  const next = rng(`hex-byte:${seed}`);
  const seen = new Set<number>();
  const out: Question[] = [];
  while (out.length < count) {
    const value = 16 + Math.floor(next() * 240); // 0x10..0xFF: sempre due cifre significative
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ prompt: "Quanto vale questo byte esadecimale (in decimale)?", data: value.toString(16).toUpperCase().padStart(2, "0"), answer: value });
  }
  return out;
}

// ---------- F.05.007: ARP ----------
export const ARP_BANK: BankItem[] = [
  { q: "Un PC conosce l'IP del destinatario (stessa rete) ma non il suo MAC. Cosa fa?", ok: "invia una richiesta ARP a tutti", no: ["indovina un MAC a caso", "chiede il MAC al sito web", "scarta il pacchetto senza dire nulla"] },
  { q: "La richiesta ARP è inviata…", ok: "in broadcast, a tutti i dispositivi della rete", no: ["solo al router", "solo al dispositivo con quell'IP", "a un server su Internet"] },
  { q: "Chi risponde a una richiesta ARP?", ok: "solo il dispositivo che ha quell'indirizzo IP", no: ["tutti i dispositivi della rete", "solo il router", "solo il server DNS"] },
  { q: "A cosa serve ARP?", ok: "a trovare il MAC che corrisponde a un indirizzo IP", no: ["a trovare l'IP che corrisponde a un nome di sito", "a cifrare i pacchetti", "ad assegnare gli IP ai dispositivi"] },
  { q: "Il destinatario è fuori dalla tua rete. Di quale MAC hai bisogno per inviare il pacchetto?", ok: "quello del router (gateway)", no: ["quello del server di destinazione", "quello del tuo computer", "nessuno: il MAC non serve"] },
  { q: "Dopo la risposta ARP, il PC memorizza la coppia IP-MAC in…", ok: "una tabella ARP (cache)", no: ["un file di testo sul server", "una pagina web", "il firewall esterno"] },
  { q: "ARP lavora…", ok: "dentro la rete locale", no: ["solo su Internet", "solo tra continenti diversi", "solo con indirizzi pubblici"] },
  { q: "Se un attaccante interno fa credere alla vittima che l'IP del router abbia il MAC del proprio PC, è…", ok: "un ARP spoofing", no: ["un normale aggiornamento ARP", "un DNS spoofing", "una scansione di porte"] },
];

// ---------- F.05.008: modello OSI ----------
const L = { fis: "Fisico", dat: "Collegamento dati", ret: "Rete", tra: "Trasporto", ses: "Sessione", pre: "Presentazione", app: "Applicazione" };
export const OSI_BANK: BankItem[] = [
  { q: "Un cavo danneggiato interrompe il segnale. A quale livello è il problema?", ok: L.fis, no: [L.ret, L.tra, L.app] },
  { q: "Lo switch inoltra i frame leggendo gli indirizzi MAC. Livello?", ok: L.dat, no: [L.fis, L.ret, L.tra] },
  { q: "Il router sceglie il percorso in base all'indirizzo IP di destinazione. Livello?", ok: L.ret, no: [L.dat, L.tra, L.app] },
  { q: "Le porte (80, 443, 22) identificano il servizio di destinazione. Livello?", ok: L.tra, no: [L.ret, L.ses, L.app] },
  { q: "TCP numera i segmenti e ritrasmette quelli persi. Livello?", ok: L.tra, no: [L.fis, L.dat, L.ret] },
  { q: "Il browser chiede una pagina web con il protocollo HTTP. Livello?", ok: L.app, no: [L.fis, L.ret, L.tra] },
  { q: "Il DNS traduce un nome di sito in un indirizzo IP. Livello?", ok: L.app, no: [L.dat, L.ret, L.tra] },
  { q: "Apre, mantiene e chiude il dialogo tra due applicazioni. Livello?", ok: L.ses, no: [L.fis, L.dat, L.ret] },
  { q: "Converte il formato dei dati: codifica dei caratteri, compressione. Livello?", ok: L.pre, no: [L.fis, L.ret, L.tra] },
  { q: "L'unità di dati si chiama frame. Livello?", ok: L.dat, no: [L.fis, L.ret, L.tra] },
  { q: "L'unità di dati si chiama pacchetto (packet). Livello?", ok: L.ret, no: [L.fis, L.dat, L.tra] },
  { q: "L'unità di dati si chiama segmento (TCP). Livello?", ok: L.tra, no: [L.fis, L.dat, L.ret] },
  { q: "La scheda di rete ha un indirizzo MAC. Livello?", ok: L.dat, no: [L.fis, L.ret, L.app] },
  { q: "192.168.1.66 è un indirizzo di quale livello?", ok: L.ret, no: [L.fis, L.dat, L.tra] },
];

// ---------- F.05.009: incapsulamento ----------
const H = { eth: "Intestazione Ethernet (indirizzi MAC)", ip: "Intestazione IP (indirizzi IP)", tcp: "Intestazione TCP (porte)" };
export const ENCAPSULATION_BANK: BankItem[] = [
  { q: "Scendendo dall'applicazione, qual è la prima intestazione che avvolge i dati?", ok: H.tcp, no: [H.ip, H.eth] },
  { q: "Dopo l'intestazione TCP, quale si aggiunge?", ok: H.ip, no: [H.tcp, H.eth] },
  { q: "Quale intestazione si aggiunge per ultima, prima dei bit sul cavo?", ok: H.eth, no: [H.tcp, H.ip] },
  { q: "Quale intestazione contiene le porte di sorgente e destinazione?", ok: H.tcp, no: [H.ip, H.eth] },
  { q: "Quale intestazione contiene gli indirizzi IP di sorgente e destinazione?", ok: H.ip, no: [H.tcp, H.eth] },
  { q: "Quale intestazione contiene gli indirizzi MAC?", ok: H.eth, no: [H.tcp, H.ip] },
  { q: "Un router inoltra un pacchetto (senza NAT). Quali indirizzi cambiano a ogni salto?", ok: "Gli indirizzi MAC", no: ["Gli indirizzi IP di sorgente e destinazione", "Le porte di sorgente e destinazione"] },
  { q: "Il pacchetto arriva al destinatario: qual è la prima intestazione che viene tolta?", ok: H.eth, no: [H.tcp, H.ip] },
];

export const BANKS = {
  "packet-basics": makeBank("packet-basics", PACKET_BASICS),
  "arp-concepts": makeBank("arp-concepts", ARP_BANK),
  "osi-layers": makeBank("osi-layers", OSI_BANK),
  "encapsulation": makeBank("encapsulation", ENCAPSULATION_BANK),
} as const;
