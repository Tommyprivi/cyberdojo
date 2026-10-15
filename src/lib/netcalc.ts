/**
 * Calcolatore di rete IPv4: funzioni pure, nessun accesso al browser o al database.
 * Si usa nel laboratorio (src/components/lab) e si prova con valori noti (netcalc.test.ts).
 */

export type Ipv4 = [number, number, number, number];

/** Quattro numeri da 0 a 255 separati da punti. Niente zeri iniziali ("01" è ambiguo: in passato valeva ottale). */
export function parseIpv4(input: string): Ipv4 | null {
  const parts = input.trim().split(".");
  if (parts.length !== 4) return null;
  const nums: number[] = [];
  for (const p of parts) {
    if (!/^(0|[1-9]\d{0,2})$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    nums.push(n);
  }
  return nums as Ipv4;
}

export const formatIpv4 = (ip: Ipv4) => ip.join(".");

/** Indirizzo come intero senza segno a 32 bit. */
export const toInt = ([a, b, c, d]: Ipv4) => (((a << 24) | (b << 16) | (c << 8) | d) >>> 0);

export const fromInt = (n: number): Ipv4 => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];

/** Un ottetto in 8 bit, con gli zeri iniziali. */
export const octetBinary = (n: number) => n.toString(2).padStart(8, "0");

export function maskFromPrefix(prefix: number): Ipv4 {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new RangeError("Il prefisso va da 0 a 32");
  return fromInt(prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);
}

/** Lunghezza del prefisso di una maschera, o null se non è "continua" (tutti uno poi tutti zero). */
export function prefixFromMask(mask: Ipv4): number | null {
  const bits = mask.map(octetBinary).join("");
  const m = /^(1*)(0*)$/.exec(bits);
  return m ? m[1].length : null;
}

export type NetInfo = {
  ip: Ipv4;
  prefix: number;
  mask: Ipv4;
  wildcard: Ipv4;
  network: Ipv4;
  broadcast: Ipv4;
  firstHost: Ipv4;
  lastHost: Ipv4;
  /** Dispositivi che possono avere un indirizzo in questa rete. */
  hosts: number;
  /** I 32 bit dell'indirizzo, raggruppati in 4 ottetti. */
  bits: string[];
};

export function describeNetwork(ip: Ipv4, prefix: number): NetInfo {
  const mask = maskFromPrefix(prefix);
  const m = toInt(mask);
  const addr = toInt(ip);
  const network = (addr & m) >>> 0;
  const broadcast = (network | (~m >>> 0)) >>> 0;

  // /32: un solo indirizzo. /31: collegamento punto-punto, due indirizzi usabili (RFC 3021).
  // Altrimenti rete e broadcast non sono assegnabili a un dispositivo.
  let first: number, last: number, hosts: number;
  if (prefix === 32) {
    first = last = addr;
    hosts = 1;
  } else if (prefix === 31) {
    first = network;
    last = broadcast;
    hosts = 2;
  } else {
    first = network + 1;
    last = broadcast - 1;
    hosts = 2 ** (32 - prefix) - 2;
  }

  return {
    ip,
    prefix,
    mask,
    wildcard: fromInt(~m >>> 0),
    network: fromInt(network),
    broadcast: fromInt(broadcast),
    firstHost: fromInt(first),
    lastHost: fromInt(last),
    hosts,
    bits: ip.map(octetBinary),
  };
}

export type AddressKind = {
  id: string;
  label: string;
  scope: "privato" | "pubblico" | "speciale";
  explanation: string;
};

const inBlock = (ip: Ipv4, base: Ipv4, prefix: number) => {
  const m = toInt(maskFromPrefix(prefix));
  return ((toInt(ip) & m) >>> 0) === ((toInt(base) & m) >>> 0);
};

/** Blocchi riservati, dal più specifico al più generale. Fonte: RFC 1918, 6598, 5735/5737, 3927, 5771. */
const BLOCKS: { base: Ipv4; prefix: number; kind: AddressKind }[] = [
  { base: [0, 0, 0, 0], prefix: 8, kind: { id: "this-network", label: "Questa rete", scope: "speciale", explanation: "0.x.x.x non è un indirizzo di un dispositivo: indica «questa rete» o «nessun indirizzo ancora»." } },
  { base: [10, 0, 0, 0], prefix: 8, kind: { id: "private-10", label: "Privato (10.0.0.0/8)", scope: "privato", explanation: "Rete privata: non si instrada su Internet. Il traffico con questa sorgente nasce dentro l'azienda." } },
  { base: [100, 64, 0, 0], prefix: 10, kind: { id: "cgnat", label: "Condiviso dagli operatori (100.64.0.0/10)", scope: "speciale", explanation: "Spazio usato dagli operatori per dare lo stesso indirizzo pubblico a molti clienti (CGNAT). Non è privato di casa e non è pubblico." } },
  { base: [127, 0, 0, 0], prefix: 8, kind: { id: "loopback", label: "Loopback (127.0.0.0/8)", scope: "speciale", explanation: "Il computer che parla con sé stesso. Non esce mai dalla macchina." } },
  { base: [169, 254, 0, 0], prefix: 16, kind: { id: "link-local", label: "Link-local (169.254.0.0/16)", scope: "speciale", explanation: "Indirizzo che un dispositivo si dà da solo quando non trova nessuno che glielo assegni. Se lo vedi, di solito qualcosa non va nella rete." } },
  { base: [172, 16, 0, 0], prefix: 12, kind: { id: "private-172", label: "Privato (172.16.0.0/12)", scope: "privato", explanation: "Rete privata: vale solo per il secondo numero da 16 a 31. Il traffico con questa sorgente nasce dentro l'azienda." } },
  { base: [192, 0, 2, 0], prefix: 24, kind: { id: "doc-1", label: "Documentazione (192.0.2.0/24)", scope: "speciale", explanation: "Riservato a manuali ed esempi: nessun dispositivo vero lo usa." } },
  { base: [192, 168, 0, 0], prefix: 16, kind: { id: "private-192", label: "Privato (192.168.0.0/16)", scope: "privato", explanation: "Rete privata, la più comune nelle case e negli uffici. Il traffico con questa sorgente nasce dentro la rete." } },
  { base: [198, 18, 0, 0], prefix: 15, kind: { id: "benchmark", label: "Prove di rete (198.18.0.0/15)", scope: "speciale", explanation: "Riservato ai collaudi delle apparecchiature di rete." } },
  { base: [198, 51, 100, 0], prefix: 24, kind: { id: "doc-2", label: "Documentazione (198.51.100.0/24)", scope: "speciale", explanation: "Riservato a manuali ed esempi: nessun dispositivo vero lo usa." } },
  { base: [203, 0, 113, 0], prefix: 24, kind: { id: "doc-3", label: "Documentazione (203.0.113.0/24)", scope: "speciale", explanation: "Riservato a manuali ed esempi: nessun dispositivo vero lo usa." } },
  { base: [224, 0, 0, 0], prefix: 4, kind: { id: "multicast", label: "Multicast (224.0.0.0/4)", scope: "speciale", explanation: "Indirizzo di gruppo: un pacchetto destinato a più dispositivi insieme, non a uno solo." } },
  { base: [240, 0, 0, 0], prefix: 4, kind: { id: "reserved", label: "Riservato (240.0.0.0/4)", scope: "speciale", explanation: "Spazio riservato, non assegnato ai dispositivi." } },
];

const PUBLIC: AddressKind = {
  id: "public",
  label: "Pubblico",
  scope: "pubblico",
  explanation: "Indirizzo raggiungibile su Internet. Il traffico con questa sorgente arriva da fuori.",
};

const LIMITED_BROADCAST: AddressKind = {
  id: "limited-broadcast",
  label: "Broadcast (255.255.255.255)",
  scope: "speciale",
  explanation: "Un messaggio per tutti i dispositivi della rete locale, senza uscire dal router.",
};

export function classifyAddress(ip: Ipv4): AddressKind {
  if (toInt(ip) === 0xffffffff) return LIMITED_BROADCAST;
  for (const b of BLOCKS) if (inBlock(ip, b.base, b.prefix)) return b.kind;
  return PUBLIC;
}
