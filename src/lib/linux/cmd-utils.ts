import type { Shell } from "./shell";
import { ERR_TEXT, type FsError, type Identity } from "./types";

export interface Result {
  out: string;
  err: string;
  code: number;
}

export interface Ctx {
  sh: Shell;
  /** Identità effettiva: root se il comando è dietro `sudo`. */
  id: Identity;
  sudo: boolean;
  /** Testo in ingresso (da pipe o da `<`), oppure null se non c'è. */
  stdin: string | null;
}

export type Cmd = (args: string[], ctx: Ctx) => Result;

export const ok = (out = ""): Result => ({ out, err: "", code: 0 });
export const fail = (err: string, code = 1): Result => ({ out: "", err: err === "" || err.endsWith("\n") ? err : err + "\n", code });
export const errText = (e: FsError) => ERR_TEXT[e];

export interface OptSpec {
  /** Lettere delle opzioni senza valore. */
  bool?: string;
  /** Lettere delle opzioni con valore. */
  val?: string;
  /** Nomi lunghi → lettera corta. */
  long?: Record<string, string>;
  /** Accetta `-5` come `-n 5` (head, tail). */
  numeric?: boolean;
}

export interface Opts {
  flags: Set<string>;
  vals: Record<string, string>;
  rest: string[];
  error?: string;
}

/** Legge le opzioni in stile GNU: -la, -n5, -n 5, --all, --, e opzioni dopo i file. */
export function parseOpts(cmd: string, args: string[], spec: OptSpec): Opts {
  const o: Opts = { flags: new Set(), vals: {}, rest: [] };
  const bool = spec.bool ?? "";
  const val = spec.val ?? "";
  const bad = (msg: string) => {
    o.error = `${cmd}: ${msg}\nTry '${cmd} --help' for more information.`;
    return o;
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      o.rest.push(...args.slice(i + 1));
      break;
    }
    if (a.startsWith("--") && a.length > 2) {
      const [name, v] = a.slice(2).split(/=(.*)/);
      const letter = spec.long?.[name];
      if (!letter) return bad(`unrecognized option '--${name}'`);
      if (val.includes(letter)) {
        const value = v ?? args[++i];
        if (value === undefined) return bad(`option '--${name}' requires an argument`);
        o.vals[letter] = value;
      } else o.flags.add(letter);
      continue;
    }
    if (a.length > 1 && a[0] === "-") {
      if (spec.numeric && /^-\d+$/.test(a)) {
        o.vals.n = a.slice(1);
        continue;
      }
      for (let k = 1; k < a.length; k++) {
        const ch = a[k];
        if (bool.includes(ch)) o.flags.add(ch);
        else if (val.includes(ch)) {
          const inline = a.slice(k + 1);
          const value = inline !== "" ? inline : args[++i];
          if (value === undefined) return bad(`option requires an argument -- '${ch}'`);
          o.vals[ch] = value;
          break;
        } else return bad(`invalid option -- '${ch}'`);
      }
      continue;
    }
    o.rest.push(a);
  }
  return o;
}

/** Divide un testo in righe, senza l'ultima riga vuota dovuta al newline finale. */
export function splitLines(text: string): string[] {
  if (text === "") return [];
  const lines = text.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

export const joinLines = (lines: string[]) => (lines.length ? lines.join("\n") + "\n" : "");

/** Confronto stile `sort`: senza badare alle maiuscole, poi minuscole prima. */
export function compareText(a: string, b: string): number {
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  if (la !== lb) return la < lb ? -1 : 1;
  return a < b ? 1 : a > b ? -1 : 0;
}

export function humanSize(n: number): string {
  if (n < 1024) return String(n);
  const units = ["K", "M", "G"];
  let v = n / 1024;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u++;
  }
  return v < 10 ? `${(Math.ceil(v * 10) / 10).toFixed(1)}${units[u]}` : `${Math.ceil(v)}${units[u]}`;
}

/** Punti dove un percorso è «di sistema»: l'eliminazione e lo spostamento sono bloccati. */
export function isProtectedPath(abs: string): boolean {
  const segs = abs.split("/").filter(Boolean);
  if (segs.length === 0) return true;
  if (segs[0] === "tmp") return segs.length < 2;
  if (segs[0] === "home") return segs.length < 3;
  return true;
}
