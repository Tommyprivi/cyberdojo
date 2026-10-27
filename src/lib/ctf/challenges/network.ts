import { bytesOf, hexOf, int, mkFlag, pick, WORDS } from "../gen";
import type { Challenge } from "../types";

/** Somma di controllo dell'intestazione IPv4 (complemento a uno su parole da 16 bit). */
export function ipChecksum(header: readonly number[]): number {
  let sum = 0;
  for (let i = 0; i < header.length; i += 2) sum += (header[i] << 8) | header[i + 1];
  while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
  return ~sum & 0xffff;
}

const be16 = (n: number) => [(n >> 8) & 0xff, n & 0xff];
const be32 = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
const ipBytes = (ip: string) => ip.split(".").map(Number);

export type PacketSpec = { src: string; dst: string; protocol: 6 | 17; srcPort: number; dstPort: number; payload?: number[]; tcpOptions?: boolean };

/** Pacchetto IPv4 (senza Ethernet) con TCP o UDP. Il checksum del livello superiore è lasciato a zero. */
export function buildPacket(p: PacketSpec): number[] {
  const payload = p.payload ?? [];
  const l4: number[] =
    p.protocol === 6
      ? [
          ...be16(p.srcPort), ...be16(p.dstPort), ...be32(0x1a2b3c4d), ...be32(0), p.tcpOptions ? 0x80 : 0x50, 0x18, ...be16(64240), 0, 0, 0, 0,
          ...(p.tcpOptions ? [0x02, 0x04, 0x05, 0xb4, 0x01, 0x03, 0x03, 0x07, 0x04, 0x02, 0x01, 0x01] : []),
          ...payload,
        ]
      : [...be16(p.srcPort), ...be16(p.dstPort), ...be16(8 + payload.length), 0, 0, ...payload];
  const head = [0x45, 0x00, ...be16(20 + l4.length), 0x1c, 0x46, 0x40, 0x00, 64, p.protocol, 0, 0, ...ipBytes(p.src), ...ipBytes(p.dst)];
  const sum = ipChecksum(head);
  head[10] = sum >> 8;
  head[11] = sum & 0xff;
  return [...head, ...l4];
}

const randIp = (r: () => number) => `192.168.${int(r, 0, 20)}.${int(r, 2, 250)}`;
const pkt = (title: string, bytes: number[]) => ({ kind: "hex" as const, title, hex: hexOf(bytes).toUpperCase() });

const COMMON = "Il pacchetto parte con l'intestazione IP (20 byte, senza Ethernet); subito dopo c'è TCP o UDP.";

export const NETWORK: Challenge[] = [
  {
    id: "pacchetto-ip-sorgente",
    title: "Chi ha mandato il pacchetto?",
    category: "reti",
    level: "facile",
    story: `Hai davanti i byte grezzi di un pacchetto, scritti in esadecimale. ${COMMON}`,
    goal: "Leggi l'indirizzo IP di chi lo ha spedito (sorgente). Bandiera: CYBERDOJO{a-b-c-d}, con i quattro numeri in decimale separati da trattini.",
    hints: [
      "Nell'intestazione IPv4 i byte 12-15 (contando da 0) sono l'indirizzo sorgente; i byte 16-19 la destinazione.",
      "Conta 12 byte dall'inizio: i quattro byte che seguono sono l'IP sorgente. Ogni byte è un numero da 0 a 255.",
      "Converti ogni coppia esadecimale in decimale (es. C0 = 192, A8 = 168) oppure usa il calcolatore di rete del laboratorio.",
    ],
    explanation: "Ogni campo di un pacchetto ha una posizione fissa. Imparare a leggerla permette di capire il traffico anche senza strumenti grafici.",
    defense: "Il traffico non cifrato può essere letto da chiunque sia sulla rete: usa HTTPS, VPN e firewall che controllino i pacchetti sospetti. L'IP sorgente poi si può falsificare, quindi non basta da solo per fidarsi.",
    build: (r) => {
      const src = randIp(r);
      const bytes = buildPacket({ src, dst: "10.0.0.5", protocol: 6, srcPort: int(r, 40000, 60000), dstPort: 443 });
      return { flag: mkFlag(src.replace(/\./g, "-")), artifact: pkt("Pacchetto (esadecimale)", bytes) };
    },
  },
  {
    id: "pacchetto-protocollo-porta",
    title: "Protocollo e porta",
    category: "reti",
    level: "medio",
    story: `Un altro pacchetto catturato su una rete di prova. ${COMMON}`,
    goal: "Trova il protocollo (TCP o UDP) e la porta di destinazione. Bandiera: CYBERDOJO{protocollo-porta} in minuscolo, per esempio CYBERDOJO{protocollo-numero}.",
    hints: [
      "Nell'intestazione IPv4 il byte 9 (contando da 0) dice il protocollo: 06 = TCP, 11 (esadecimale) = 17 = UDP.",
      "Dopo i primi 20 byte inizia TCP/UDP: i primi due byte sono la porta sorgente, i due successivi la porta di destinazione.",
      "La porta è un numero a 16 bit: due byte esadecimali insieme (es. 01 BB = 443, 00 50 = 80).",
    ],
    explanation: "Il campo protocollo dell'IP dice come leggere il resto. Porta e protocollo indicano a quale servizio è diretto il pacchetto (80 web, 443 web sicuro, 53 DNS, 22 SSH...).",
    defense: "Un firewall ben configurato lascia aperte solo le porte necessarie e registra il traffico verso le altre.",
    build: (r) => {
      const udp = r() < 0.5;
      const dstPort = udp ? pick(r, [53, 123]) : pick(r, [22, 25, 80, 443, 3306, 8080]);
      const bytes = buildPacket({ src: randIp(r), dst: randIp(r), protocol: udp ? 17 : 6, srcPort: int(r, 40000, 60000), dstPort });
      return { flag: mkFlag(`${udp ? "udp" : "tcp"}-${dstPort}`), artifact: pkt("Pacchetto (esadecimale)", bytes) };
    },
  },
  {
    id: "pacchetto-payload",
    title: "Il contenuto del pacchetto",
    category: "reti",
    level: "difficile",
    story: `Questo pacchetto TCP porta dei dati veri e propri (payload). L'intestazione TCP è più lunga del solito perché contiene delle opzioni. ${COMMON}`,
    goal: "Trova dove finiscono le intestazioni e leggi il testo contenuto. Il testo è «token=parola»: bandiera CYBERDOJO{parola}.",
    hints: [
      "L'intestazione IP è lunga 20 byte (il primo byte 45: la seconda cifra, 5, vale 5 parole da 4 byte).",
      "Nell'intestazione TCP il byte 12 (contando da 0 dentro TCP) ha il «data offset» nella prima cifra: 8 significa 8 parole da 4 byte = 32 byte.",
      "Il contenuto comincia dopo 20 + 32 = 52 byte. Converti da esadecimale a testo (lo strumento Esadecimale aiuta).",
    ],
    explanation: "Il payload comincia dopo le intestazioni, la cui lunghezza è scritta nei pacchetti stessi (IHL per IP, data offset per TCP). Un traffico non cifrato mostra il contenuto a chi lo intercetta.",
    defense: "Cifra le comunicazioni (TLS/HTTPS): chi intercetta i pacchetti vede solo byte senza senso. Non inviare mai token o password in chiaro.",
    build: (r) => {
      const w = pick(r, WORDS);
      const bytes = buildPacket({ src: randIp(r), dst: randIp(r), protocol: 6, srcPort: int(r, 40000, 60000), dstPort: 8080, tcpOptions: true, payload: bytesOf(`token=${w}`) });
      return { flag: mkFlag(w), artifact: pkt("Pacchetto (esadecimale)", bytes) };
    },
  },
];
