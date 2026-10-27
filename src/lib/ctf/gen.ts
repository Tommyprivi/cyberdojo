import { createHash } from "node:crypto";

/** Piccoli attrezzi per costruire i dati delle sfide (solo server, nessuna bandiera qui). */

export const WORDS = [
  "ciliegia", "tramonto", "lanterna", "scoiattolo", "bussola", "arcobaleno", "montagna", "violino", "farfalla", "cascata",
  "ombrello", "girasole", "veliero", "torrente", "castagna", "pergamena", "nuvola", "zaffiro", "faro", "papavero",
  "biscotto", "orchidea", "pianeta", "lucciola", "sentiero", "mandorla", "tempesta", "fontana", "scacchiera", "melograno",
];

export const mkFlag = (inner: string) => `cyberdojo{${inner}}`;
export const shownFlag = (flag: string) => `CYBERDOJO${flag.slice(9)}`;

export type Rng = () => number;
export const int = (r: Rng, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
export const pick = <T>(r: Rng, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
export const pad2 = (n: number) => String(n).padStart(2, "0");
export function shuffled<T>(r: Rng, xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** n elementi diversi. */
export const sample = <T>(r: Rng, xs: readonly T[], n: number): T[] => shuffled(r, xs).slice(0, n);

export function caesar(text: string, shift: number): string {
  return text.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + shift + 26) % 26) + 97));
}

export function vigenere(text: string, key: string, decrypt = false): string {
  let i = 0;
  return text.replace(/[a-z]/g, (c) => {
    const k = key.charCodeAt(i++ % key.length) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - 97 + (decrypt ? 26 - k : k)) % 26) + 97);
  });
}

export const bytesOf = (s: string): number[] => [...Buffer.from(s, "latin1")];
export const hexOf = (bytes: readonly number[]): string => bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
export const md5 = (s: string) => createHash("md5").update(s).digest("hex");
export const sha1 = (s: string) => createHash("sha1").update(s).digest("hex");
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

const FIRST_OCTETS = [23, 45, 62, 91, 103, 145, 178, 185, 193, 201];
/** Indirizzo «pubblico» di fantasia (non è un'indicazione di host reali). */
export const publicIp = (r: Rng): string => `${pick(r, FIRST_OCTETS)}.${int(r, 1, 254)}.${int(r, 1, 254)}.${int(r, 2, 253)}`;
export const dashed = (ip: string) => ip.replace(/\./g, "-");

/** Indirizzi pubblici tutti diversi. */
export function uniqueIps(r: Rng, n: number): string[] {
  const out = new Set<string>();
  while (out.size < n) out.add(publicIp(r));
  return [...out];
}

export const time = (s: number) => `${pad2(Math.floor(s / 3600) % 24)}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`;
