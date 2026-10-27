import { GLOSSARY } from "./terms";

/**
 * Trova i termini del glossario dentro un testo (logica pura, nessun accesso a browser o database).
 * Serve alle «parole cliccabili» delle lezioni: si evidenzia solo la prima volta che un termine compare.
 */

export type LinkTerm = { term: string; def: string };
export type TermHit = { start: number; end: number; term: string; def: string };

/**
 * Parole di uso comune che nel glossario hanno un significato tecnico: nel testo normale sono quasi
 * sempre parole qualsiasi («porta» del verbo, «dato» = «dato che», «media» dei giornali...). Si
 * evita di sottolinearle per non fare falsi positivi; restano nella pagina /glossario.
 */
const AMBIGUOUS = new Set(
  [
    "Porta", "Dato", "Media", "Azione", "Indice", "Opzione", "Future", "Tor", "Salt", "Spread", "Candela", "Alpha", "Beta",
    "Campione", "Sessione", "Servizio", "Processo", "Percorso", "Permessi", "Rischio", "Minaccia", "Liquidità", "Copertura",
    "Posizione lunga", "Posizione corta", "Valore mancante", "Riga e colonna", "Variabile", "Patch", "Log",
  ].map((t) => t.toLowerCase()),
);

export const LINKABLE: readonly LinkTerm[] = GLOSSARY.filter((g) => !AMBIGUOUS.has(g.term.toLowerCase())).map((g) => ({ term: g.term, def: g.def }));

/** Solo le parole scritte «Così» (iniziale maiuscola, il resto minuscolo) si cercano senza badare alle maiuscole. */
function caseInsensitive(term: string): boolean {
  return /^\p{Lu}[\p{Ll}\s-]*$/u.test(term);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Prima e dopo il termine non ci devono essere lettere o cifre (parola intera, accenti compresi),
// né segni che indicano un percorso, un indirizzo o un nome di file.
const BEFORE = String.raw`(?<![\p{L}\p{N}_/.@$~-])`;
const AFTER = String.raw`(?![\p{L}\p{N}_/@]|[.-][\p{L}\p{N}])`;

const cache = new Map<string, RegExp>();
function regexFor(term: string): RegExp {
  let re = cache.get(term);
  if (!re) {
    re = new RegExp(`${BEFORE}${escape(term)}${AFTER}`, caseInsensitive(term) ? "giu" : "gu");
    cache.set(term, re);
  }
  return re;
}

/**
 * Cerca nel testo i termini non ancora usati e, di ognuno, la prima occorrenza. Se due termini si
 * sovrappongono vince il più lungo («Pacchetto software» e non «Pacchetto»). I termini trovati
 * vengono aggiunti a `used`, così il chiamante li salta nei testi successivi della stessa schermata.
 */
export function findTermHits(text: string, used: Set<string>, terms: readonly LinkTerm[] = LINKABLE): TermHit[] {
  const candidates: TermHit[] = [];
  for (const t of terms) {
    if (used.has(t.term)) continue;
    const re = regexFor(t.term);
    re.lastIndex = 0;
    const m = re.exec(text);
    if (m) candidates.push({ start: m.index, end: m.index + m[0].length, term: t.term, def: t.def });
  }
  // Dal più a sinistra; a parità, il più lungo. Poi si scartano i sovrapposti.
  candidates.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const hits: TermHit[] = [];
  let edge = 0;
  for (const c of candidates) {
    if (c.start < edge) continue;
    hits.push(c);
    edge = c.end;
    used.add(c.term);
  }
  return hits;
}

export type Part = string | { text: string; term: string; def: string };

/** Spezza il testo in pezzi: stringhe normali e termini trovati. */
export function splitByHits(text: string, hits: readonly TermHit[]): Part[] {
  const out: Part[] = [];
  let pos = 0;
  for (const h of hits) {
    if (h.start > pos) out.push(text.slice(pos, h.start));
    out.push({ text: text.slice(h.start, h.end), term: h.term, def: h.def });
    pos = h.end;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}
