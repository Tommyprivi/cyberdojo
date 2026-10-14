import { rng } from "./core";

/**
 * Indirizzi IPv4 per l'esercizio "Caccia all'intruso".
 * Privati secondo RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.
 */
export function isPrivate([a, b]: number[]): boolean {
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

/**
 * Primi ottetti pubblici "normali": esclusi apposta 0, 10, 100 (CGNAT 100.64/10), 127 (loopback),
 * 169 (link-local 169.254), 172, 192, 198 (test 198.18/15), 203 (TEST-NET-3) e 224+ (multicast e riservati).
 */
const PUBLIC_FIRST = [23, 31, 45, 51, 62, 77, 81, 93, 151, 185];

export type IpQuestion = { octets: number[]; bits: string[]; private: boolean };

const toBits = (n: number) => n.toString(2).padStart(8, "0");

export function ipQuestions(seed: string, count = 3): IpQuestion[] {
  const next = rng(`ip-intruder:${seed}`);
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const out: IpQuestion[] = [];
  for (let i = 0; i < count; i++) {
    let octets: number[];
    if (next() < 0.5) {
      const kind = int(0, 2);
      octets =
        kind === 0 ? [10, int(0, 255), int(0, 255), int(1, 254)]
        : kind === 1 ? [172, int(16, 31), int(0, 255), int(1, 254)]
        : [192, 168, int(0, 255), int(1, 254)];
    } else {
      octets = [PUBLIC_FIRST[int(0, PUBLIC_FIRST.length - 1)], int(0, 255), int(0, 255), int(1, 254)];
    }
    out.push({ octets, bits: octets.map(toBits), private: isPrivate(octets) });
  }
  return out;
}

/** Spiegazione mostrata dopo la scelta interno/esterno. */
export function explainIp([a, b]: number[]): string {
  if (a === 10) return "Inizia con 10: è una rete privata (10.0.0.0/8). Il traffico nasce dentro l'azienda.";
  if (a === 172 && b >= 16 && b <= 31)
    return `172.${b} sta tra 172.16 e 172.31: rete privata (172.16.0.0/12). Viene da dentro.`;
  if (a === 192 && b === 168) return "192.168 è una rete privata (192.168.0.0/16). Viene da dentro.";
  if (a === 172) return `172.${b} è fuori dall'intervallo privato 172.16-172.31: indirizzo pubblico. Trappola classica.`;
  return "Non è in nessuna delle tre reti private: indirizzo pubblico, quindi arriva da Internet.";
}
