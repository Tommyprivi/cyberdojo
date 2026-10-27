/**
 * Ricerca nei contenuti: solo funzioni pure, nessun accesso ai file, così può stare anche nel client.
 * L'indice si costruisce in search-index.ts (che legge le lezioni).
 */

export type SearchEntry = {
  id: string;
  kind: "lezione" | "glossario";
  title: string;
  text: string;
  /** Lettera del corso (F, C, D, T, H). */
  course: string;
  /** Solo per le lezioni: servono a capire se sono bloccate. */
  prerequisites: string[];
  module?: number;
};

export type SnippetPart = { text: string; hit: boolean };
export type SearchResult = {
  id: string;
  kind: SearchEntry["kind"];
  title: string;
  course: string;
  prerequisites: string[];
  module?: number;
  score: number;
  snippet: SnippetPart[];
};

/** Minuscolo, senza accenti, ogni segno diventa spazio. Mantiene la lunghezza (serve per l'evidenziazione). */
export function normalize(s: string): string {
  let out = "";
  for (const ch of s) {
    const base = ch.normalize("NFD")[0].toLowerCase()[0];
    const keep = /[\p{L}\p{N}]/u.test(base) ? base : " ";
    out += keep.padEnd(ch.length, " ");
  }
  return out;
}

const MAX_TOKENS = 8;

export function tokenize(query: string): string[] {
  const seen = new Set<string>();
  for (const w of normalize(query.slice(0, 200)).split(/\s+/)) if (w.length >= 2) seen.add(w);
  return [...seen].slice(0, MAX_TOKENS);
}

/** Da testo MDX di una lezione a testo semplice leggibile. */
export function cleanMdx(src: string): string {
  return src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<Scene\s+title="([^"]+)"[^>]*>/g, "$1. ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/```[a-z]*/gi, " ")
    .replace(/[*_`#>|]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function wordStarts(norm: string, token: string): boolean {
  return norm.startsWith(token) || norm.includes(" " + token);
}

/** Estratto attorno alla prima parola trovata, con le parole cercate segnate come `hit`. */
export function makeSnippet(text: string, tokens: string[], radius = 70): SnippetPart[] {
  const flat = text.replace(/\s+/g, " ");
  const norm = normalize(flat);
  let first = -1;
  for (const t of tokens) {
    const i = norm.indexOf(t);
    if (i >= 0 && (first < 0 || i < first)) first = i;
  }
  let start = 0;
  let end = Math.min(flat.length, radius * 2);
  if (first >= 0) {
    start = Math.max(0, first - radius);
    end = Math.min(flat.length, first + radius);
    // Non si taglia a metà parola.
    if (start > 0) {
      const sp = flat.indexOf(" ", start);
      if (sp >= 0 && sp < first) start = sp + 1;
    }
    if (end < flat.length) {
      const sp = flat.lastIndexOf(" ", end);
      if (sp > first) end = sp;
    }
  }
  const slice = flat.slice(start, end);
  const nslice = norm.slice(start, end);
  const marks = new Array<boolean>(slice.length).fill(false);
  for (const t of tokens) {
    for (let i = nslice.indexOf(t); i >= 0; i = nslice.indexOf(t, i + t.length)) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
    }
  }
  const parts: SnippetPart[] = [];
  const push = (t: string, hit: boolean) => {
    if (!t) return;
    const last = parts[parts.length - 1];
    if (last && last.hit === hit) last.text += t;
    else parts.push({ text: t, hit });
  };
  if (start > 0) push("…", false);
  for (let i = 0; i < slice.length; i++) push(slice[i], marks[i]);
  if (end < flat.length) push("…", false);
  return parts;
}

/**
 * Cerca TUTTE le parole (parziali ammesse) nel titolo o nel testo. Il titolo pesa di più,
 * l'inizio di parola più di una corrispondenza a metà parola.
 */
export function search(entries: readonly SearchEntry[], query: string, limit = 30): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const out: SearchResult[] = [];
  for (const e of entries) {
    const nt = normalize(e.title);
    const nx = normalize(e.text);
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      let s = 0;
      if (wordStarts(nt, t)) s += 10;
      else if (nt.includes(t)) s += 6;
      if (wordStarts(nx, t)) s += 2;
      else if (nx.includes(t)) s += 1;
      if (s === 0) {
        ok = false;
        break;
      }
      score += s;
    }
    if (!ok) continue;
    if (e.kind === "glossario") score += 1;
    out.push({ id: e.id, kind: e.kind, title: e.title, course: e.course, prerequisites: e.prerequisites, module: e.module, score, snippet: makeSnippet(e.text, tokens) });
  }
  return out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
