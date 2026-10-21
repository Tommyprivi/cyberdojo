import { escapeGlob, hasGlobChars, unescapeGlob } from "./glob";
import type { Part, Word } from "./parser";

/** Espansione delle graffe: `a{1,2}b` → a1b a2b; `{1..3}` → 1 2 3. */
export function braceExpand(s: string, depth = 0): string[] {
  if (depth > 5) return [s];
  const start = s.indexOf("{");
  if (start === -1) return [s];
  let level = 0;
  let end = -1;
  const commas: number[] = [];
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === "{") level++;
    else if (c === "}") {
      level--;
      if (level === 0) {
        end = i;
        break;
      }
    } else if (c === "," && level === 1) commas.push(i);
  }
  if (end === -1) return [s];
  const prefix = s.slice(0, start);
  const suffix = s.slice(end + 1);
  const inner = s.slice(start + 1, end);
  let alts: string[] | null = null;
  if (commas.length > 0) {
    alts = [];
    let from = start + 1;
    for (const c of [...commas, end]) {
      alts.push(s.slice(from, c));
      from = c + 1;
    }
  } else {
    const r = /^(-?\d+)\.\.(-?\d+)$/.exec(inner) ?? /^([a-zA-Z])\.\.([a-zA-Z])$/.exec(inner);
    if (r) {
      alts = [];
      const numeric = /\d/.test(r[1]);
      const a = numeric ? Number(r[1]) : r[1].charCodeAt(0);
      const b = numeric ? Number(r[2]) : r[2].charCodeAt(0);
      if (Math.abs(b - a) > 200) return [s];
      const step = a <= b ? 1 : -1;
      for (let v = a; step > 0 ? v <= b : v >= b; v += step) alts.push(numeric ? String(v) : String.fromCharCode(v));
    }
  }
  if (!alts) {
    // Graffa senza virgole né intervalli: resta letterale, ma si controlla il resto.
    return braceExpand(suffix, depth + 1).map((x) => prefix + "{" + inner + "}" + x);
  }
  const out: string[] = [];
  for (const alt of alts) {
    for (const rest of braceExpand(prefix + alt + suffix, depth + 1)) out.push(rest);
  }
  return out;
}

type Field = { text: string; pat: string; glob: boolean; has: boolean };
const newField = (): Field => ({ text: "", pat: "", glob: false, has: false });

export interface ExpandEnv {
  getVar(name: string): string | undefined;
  /** Esegue un comando e restituisce il suo stdout (per $(...)). */
  subst(src: string): string;
  /** Espande un pattern con caratteri jolly; vuoto se nessun file corrisponde. */
  glob(pattern: string): string[];
  home: string;
}

/** Varianti di una parola dopo l'espansione delle graffe (solo nei pezzi letterali non quotati). */
function braceVariants(word: Word): Word[] {
  let variants: Word[] = [[]];
  for (const part of word) {
    if (part.t === "lit" && !part.q && part.s.includes("{")) {
      const alts = braceExpand(part.s);
      const next: Word[] = [];
      for (const v of variants) for (const a of alts) next.push([...v, { t: "lit", s: a, q: false }]);
      variants = next;
    } else {
      variants = variants.map((v) => [...v, part]);
    }
  }
  return variants;
}

function expandVariant(word: Word, env: ExpandEnv): string[] {
  const fields: Field[] = [newField()];
  const cur = () => fields[fields.length - 1];

  word.forEach((part: Part, idx) => {
    if (part.t === "lit") {
      let s = part.s;
      if (idx === 0 && !part.q && s.startsWith("~") && (s.length === 1 || s[1] === "/")) {
        cur().text += env.home;
        cur().pat += escapeGlob(env.home);
        s = s.slice(1);
        cur().has = true;
      }
      cur().text += s;
      cur().pat += part.q ? escapeGlob(s) : s;
      if (!part.q && hasGlobChars(s)) cur().glob = true;
      if (part.q || s !== "") cur().has = true;
      return;
    }
    const value = part.t === "var" ? (env.getVar(part.name) ?? "") : env.subst(part.src).replace(/\n+$/, "");
    if (part.q) {
      cur().text += value;
      cur().pat += escapeGlob(value);
      cur().has = true;
      return;
    }
    const pieces = value.split(/[ \t\n]+/);
    pieces.forEach((piece, k) => {
      if (k > 0) fields.push(newField());
      cur().text += piece;
      cur().pat += escapeGlob(piece);
      if (piece !== "") cur().has = true;
    });
  });

  const out: string[] = [];
  for (const f of fields) {
    if (!f.has && f.text === "") continue;
    if (f.glob) {
      const found = env.glob(f.pat);
      if (found.length > 0) {
        out.push(...found);
        continue;
      }
      out.push(unescapeGlob(f.pat));
      continue;
    }
    out.push(f.text);
  }
  return out;
}

/** Espande le parole di un comando: graffe, tilde, variabili, sostituzioni, caratteri jolly. */
export function expandWords(words: Word[], env: ExpandEnv): string[] {
  const out: string[] = [];
  for (const w of words) {
    for (const v of braceVariants(w)) out.push(...expandVariant(v, env));
  }
  return out;
}

/** Espande una parola in un solo valore (per i bersagli delle redirezioni): niente glob né split. */
export function expandSingle(word: Word, env: ExpandEnv): string {
  return word
    .map((p, idx) => {
      if (p.t === "lit") {
        if (idx === 0 && !p.q && p.s.startsWith("~") && (p.s.length === 1 || p.s[1] === "/")) return env.home + p.s.slice(1);
        return p.s;
      }
      return p.t === "var" ? (env.getVar(p.name) ?? "") : env.subst(p.src).replace(/\n+$/, "");
    })
    .join("");
}
