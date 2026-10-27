import type { SqlRow } from "./types";

/*
  Mini «database» finto per mostrare come funziona una SQL injection. NON è un vero SQL e non si collega a nulla:
  capisce solo WHERE con =, <>, !=, LIKE, AND, OR, TRUE/FALSE e i commenti (-- e #), su una tabella in memoria.
  Serve a far vedere cosa succede quando il testo dell'utente viene incollato dentro la query.
*/

type Tok = { t: "str" | "num" | "id" | "op" | "word"; v: string };
export class SqlSyntaxError extends Error {}

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) i++;
    else if (c === "#" || (c === "-" && src[i + 1] === "-")) break; // commento: il resto della riga sparisce
    else if (c === "'") {
      let s = "";
      i++;
      for (;;) {
        if (i >= src.length) throw new SqlSyntaxError("stringa non chiusa");
        if (src[i] === "'") {
          if (src[i + 1] === "'") { s += "'"; i += 2; continue; }
          i++;
          break;
        }
        s += src[i++];
      }
      out.push({ t: "str", v: s });
    } else if (/[0-9]/.test(c)) {
      let n = "";
      while (i < src.length && /[0-9]/.test(src[i])) n += src[i++];
      out.push({ t: "num", v: n });
    } else if (/[A-Za-z_]/.test(c)) {
      let w = "";
      while (i < src.length && /[A-Za-z_0-9]/.test(src[i])) w += src[i++];
      const u = w.toUpperCase();
      out.push(["AND", "OR", "LIKE", "TRUE", "FALSE"].includes(u) ? { t: "word", v: u } : { t: "id", v: w });
    } else if (c === "<" && src[i + 1] === ">") { out.push({ t: "op", v: "<>" }); i += 2; }
    else if (c === "!" && src[i + 1] === "=") { out.push({ t: "op", v: "!=" }); i += 2; }
    else if (c === "=") { out.push({ t: "op", v: "=" }); i++; }
    else throw new SqlSyntaxError(`carattere inatteso «${c}»`);
  }
  return out;
}

function likeToRegex(p: string): RegExp {
  const special = ".*+?^$()[]{}|\\";
  const body = [...p].map((c) => (c === "%" ? ".*" : c === "_" ? "." : special.includes(c) ? "\\" + c : c)).join("");
  return new RegExp("^" + body + "$", "i");
}

/** Valuta la condizione WHERE su una riga. Lancia SqlSyntaxError se la frase non torna. */
function evaluate(toks: Tok[], row: SqlRow): boolean {
  let p = 0;
  const peek = () => toks[p];
  const operand = (): string => {
    const t = toks[p++];
    if (!t) throw new SqlSyntaxError("la frase finisce troppo presto");
    if (t.t === "str" || t.t === "num") return t.v;
    if (t.t === "id") {
      if (!(t.v in row)) throw new SqlSyntaxError(`colonna «${t.v}» inesistente`);
      return String(row[t.v]);
    }
    throw new SqlSyntaxError(`«${t.v}» al posto sbagliato`);
  };
  const cmp = (): boolean => {
    const t = peek();
    if (t?.t === "word" && (t.v === "TRUE" || t.v === "FALSE")) { p++; return t.v === "TRUE"; }
    const a = operand();
    const op = toks[p++];
    if (!op || !((op.t === "op") || (op.t === "word" && op.v === "LIKE"))) throw new SqlSyntaxError("manca un confronto");
    const b = operand();
    if (op.v === "=") return a === b;
    if (op.v === "<>" || op.v === "!=") return a !== b;
    return likeToRegex(b).test(a);
  };
  const and = (): boolean => {
    let v = cmp();
    while (peek()?.t === "word" && peek().v === "AND") { p++; const n = cmp(); v = v && n; }
    return v;
  };
  const or = (): boolean => {
    let v = and();
    while (peek()?.t === "word" && peek().v === "OR") { p++; const n = and(); v = v || n; }
    return v;
  };
  const result = or();
  if (p < toks.length) throw new SqlSyntaxError(`«${toks[p].v}» al posto sbagliato`);
  return result;
}

export type SqlOutcome = { query: string; rows: SqlRow[]; error?: string };

export const MAX_FIELD = 80;

/** `template` contiene «{}» dove finisce il testo dell'utente (una o più volte, in ordine). */
export function runQuery(select: string, template: string, inputs: string[], table: readonly SqlRow[]): SqlOutcome {
  let i = 0;
  const where = template.replace(/\{\}/g, () => inputs[i++] ?? "");
  const query = `${select} ${where}`;
  try {
    const toks = tokenize(where.replace(/^\s*WHERE\s+/i, ""));
    if (toks.length === 0) return { query, rows: [] };
    return { query, rows: table.filter((row) => evaluate(toks, row)) };
  } catch (e) {
    if (e instanceof SqlSyntaxError) return { query, rows: [], error: `Errore di sintassi: ${e.message}.` };
    throw e;
  }
}

export const LOGIN_SELECT = "SELECT * FROM utenti";
export const LOGIN_TEMPLATE = "WHERE nome = '{}' AND password = '{}'";
export const SEARCH_SELECT = "SELECT nome, prezzo, note FROM prodotti";
export const SEARCH_TEMPLATE = "WHERE nome LIKE '%{}%' AND visibile = 1";
