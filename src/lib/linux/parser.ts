/**
 * Parser dei comandi: legge il testo e costruisce un albero. NON esegue nulla (niente eval):
 * l'esecuzione la fa la shell, solo con i comandi del simulatore.
 * Supporta virgolette, escape, $VAR, ${VAR}, $(...), pipe, ; && ||, redirezioni (> >> < 2> 2>&1),
 * e i blocchi for / while / if (anche su più righe, per gli script).
 */

export type Part =
  | { t: "lit"; s: string; q: boolean }
  | { t: "var"; name: string; q: boolean }
  | { t: "cmd"; src: string; q: boolean };
export type Word = Part[];

export type Redir = { op: ">" | ">>" | "<" | "2>" | "2>>" | "2>&1"; target?: Word };

export type Simple = { kind: "simple"; words: Word[]; redirs: Redir[] };
export type ForNode = { kind: "for"; name: string; words: Word[]; body: List };
export type WhileNode = { kind: "while"; cond: List; body: List };
export type IfNode = { kind: "if"; cond: List; then: List; else: List | null };
export type Command = Simple | ForNode | WhileNode | IfNode;
export type Pipeline = { cmds: Command[] };
export type AndOr = { first: Pipeline; rest: { op: "&&" | "||"; p: Pipeline }[] };
export type List = AndOr[];

export class ParseError extends Error {}

type Token = { k: "word"; w: Word } | { k: "op"; v: string };

const MAX_INPUT = 4000;

export function tokenize(src: string): Token[] {
  if (src.length > MAX_INPUT) throw new ParseError("riga troppo lunga");
  const toks: Token[] = [];
  let parts: Part[] = [];
  let inWord = false;

  const addLit = (s: string, q: boolean) => {
    const last = parts[parts.length - 1];
    if (last && last.t === "lit" && last.q === q) last.s += s;
    else parts.push({ t: "lit", s, q });
    inWord = true;
  };
  const endWord = () => {
    if (inWord) toks.push({ k: "word", w: parts });
    parts = [];
    inWord = false;
  };
  const op = (v: string) => {
    endWord();
    toks.push({ k: "op", v });
  };

  /** Dopo un `$`: legge variabile o sostituzione. Restituisce il nuovo indice. */
  const dollar = (i: number, q: boolean): number => {
    const c = src[i + 1];
    if (c === "(") {
      if (src[i + 2] === "(") throw new ParseError("l'aritmetica $((...)) non è supportata nel simulatore");
      let depth = 1;
      let j = i + 2;
      while (j < src.length && depth > 0) {
        const ch = src[j];
        if (ch === "'" || ch === '"') {
          const end = src.indexOf(ch, j + 1);
          if (end === -1) throw new ParseError("unexpected EOF while looking for matching `)'");
          j = end;
        } else if (ch === "(") depth++;
        else if (ch === ")") depth--;
        j++;
      }
      if (depth > 0) throw new ParseError("unexpected EOF while looking for matching `)'");
      parts.push({ t: "cmd", src: src.slice(i + 2, j - 1), q });
      inWord = true;
      return j;
    }
    if (c === "{") {
      const end = src.indexOf("}", i + 2);
      if (end === -1) throw new ParseError("bad substitution");
      const name = src.slice(i + 2, end);
      if (!/^([A-Za-z_]\w*|\d|[?#@*])$/.test(name)) throw new ParseError(`${src.slice(i, end + 1)}: bad substitution`);
      parts.push({ t: "var", name, q });
      inWord = true;
      return end + 1;
    }
    const m = /^([A-Za-z_]\w*|\d|[?#@*])/.exec(src.slice(i + 1));
    if (m) {
      parts.push({ t: "var", name: m[1], q });
      inWord = true;
      return i + 1 + m[1].length;
    }
    addLit("$", q);
    return i + 1;
  };

  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\r") {
      endWord();
      i++;
    } else if (c === "\n") {
      op(";");
      i++;
    } else if (c === "#" && !inWord) {
      while (i < src.length && src[i] !== "\n") i++;
    } else if (c === "'") {
      const end = src.indexOf("'", i + 1);
      if (end === -1) throw new ParseError("unexpected EOF while looking for matching `''");
      addLit(src.slice(i + 1, end), true);
      i = end + 1;
    } else if (c === '"') {
      i++;
      addLit("", true);
      let closed = false;
      while (i < src.length) {
        const ch = src[i];
        if (ch === '"') {
          closed = true;
          i++;
          break;
        }
        if (ch === "\\" && i + 1 < src.length) {
          const nx = src[i + 1];
          if (nx === '"' || nx === "\\" || nx === "$" || nx === "`") addLit(nx, true);
          else if (nx !== "\n") addLit("\\" + nx, true);
          i += 2;
        } else if (ch === "$") i = dollar(i, true);
        else {
          addLit(ch, true);
          i++;
        }
      }
      if (!closed) throw new ParseError('unexpected EOF while looking for matching `"\'');
    } else if (c === "\\") {
      if (i + 1 >= src.length) {
        addLit("\\", true);
        i++;
      } else {
        if (src[i + 1] !== "\n") addLit(src[i + 1], true);
        i += 2;
      }
    } else if (c === "$") {
      i = dollar(i, false);
    } else if (c === "`") {
      const end = src.indexOf("`", i + 1);
      if (end === -1) throw new ParseError("unexpected EOF while looking for matching ``'");
      parts.push({ t: "cmd", src: src.slice(i + 1, end), q: false });
      inWord = true;
      i = end + 1;
    } else if (c === "|") {
      if (src[i + 1] === "|") {
        op("||");
        i += 2;
      } else {
        op("|");
        i++;
      }
    } else if (c === "&") {
      if (src[i + 1] === "&") {
        op("&&");
        i += 2;
      } else {
        op("&");
        i++;
      }
    } else if (c === ";") {
      op(";");
      i++;
    } else if (c === "<") {
      op("<");
      i++;
    } else if (c === ">") {
      if (src[i + 1] === ">") {
        op(">>");
        i += 2;
      } else {
        op(">");
        i++;
      }
    } else if (c === "2" && !inWord && src[i + 1] === ">") {
      if (src.startsWith("2>&1", i)) {
        op("2>&1");
        i += 4;
      } else if (src[i + 2] === ">") {
        op("2>>");
        i += 3;
      } else {
        op("2>");
        i += 2;
      }
    } else if (c === "(" || c === ")") {
      throw new ParseError(`syntax error near unexpected token \`${c}'`);
    } else {
      addLit(c, false);
      i++;
    }
  }
  endWord();
  return toks;
}

const KEYWORDS = new Set(["for", "in", "do", "done", "while", "if", "then", "elif", "else", "fi"]);

function keywordOf(t: Token | undefined): string | null {
  if (!t || t.k !== "word" || t.w.length !== 1) return null;
  const p = t.w[0];
  return p.t === "lit" && !p.q && KEYWORDS.has(p.s) ? p.s : null;
}

class Parser {
  private i = 0;
  constructor(private toks: Token[]) {}

  private peek(): Token | undefined {
    return this.toks[this.i];
  }
  private isOp(v: string) {
    const t = this.peek();
    return t !== undefined && t.k === "op" && t.v === v;
  }
  private tokenText(t: Token | undefined): string {
    if (!t) return "newline";
    if (t.k === "op") return t.v;
    return t.w.map((p) => (p.t === "lit" ? p.s : p.t === "var" ? `$${p.name}` : "$(...)")).join("");
  }
  private fail(t: Token | undefined = this.peek()): never {
    throw new ParseError(`syntax error near unexpected token \`${this.tokenText(t)}'`);
  }
  private skipSeps() {
    while (this.isOp(";")) this.i++;
  }
  private expectKeyword(k: string) {
    this.skipSeps();
    if (keywordOf(this.peek()) !== k) this.fail();
    this.i++;
  }

  parseAll(): List {
    const l = this.parseList(new Set());
    if (this.i < this.toks.length) this.fail();
    return l;
  }

  private parseList(stop: Set<string>): List {
    const items: List = [];
    for (;;) {
      this.skipSeps();
      const t = this.peek();
      if (!t) break;
      const kw = keywordOf(t);
      if (kw && stop.has(kw)) break;
      items.push(this.parseAndOr());
      const nx = this.peek();
      if (!nx) break;
      if (nx.k === "op" && (nx.v === ";" || nx.v === "&")) {
        this.i++;
        continue;
      }
      const k2 = keywordOf(nx);
      if (k2 && stop.has(k2)) break;
      this.fail(nx);
    }
    return items;
  }

  private parseAndOr(): AndOr {
    const first = this.parsePipeline();
    const rest: AndOr["rest"] = [];
    for (;;) {
      const t = this.peek();
      if (t && t.k === "op" && (t.v === "&&" || t.v === "||")) {
        this.i++;
        this.skipSeps();
        rest.push({ op: t.v, p: this.parsePipeline() });
      } else break;
    }
    return { first, rest };
  }

  private parsePipeline(): Pipeline {
    const cmds = [this.parseCommand()];
    while (this.isOp("|")) {
      this.i++;
      this.skipSeps();
      cmds.push(this.parseCommand());
    }
    return { cmds };
  }

  private parseCommand(): Command {
    const kw = keywordOf(this.peek());
    if (kw === "for") return this.parseFor();
    if (kw === "while") return this.parseWhile();
    if (kw === "if") return this.parseIf();
    if (kw) this.fail();
    return this.parseSimple();
  }

  private parseFor(): ForNode {
    this.i++;
    const nameTok = this.peek();
    if (
      !nameTok ||
      nameTok.k !== "word" ||
      nameTok.w.length !== 1 ||
      nameTok.w[0].t !== "lit" ||
      !/^[A-Za-z_]\w*$/.test(nameTok.w[0].s)
    ) {
      throw new ParseError("`for': nome di variabile non valido");
    }
    const name = nameTok.w[0].s;
    this.i++;
    if (keywordOf(this.peek()) !== "in") this.fail();
    this.i++;
    const words: Word[] = [];
    for (let t = this.peek(); t && t.k === "word"; t = this.peek()) {
      words.push(t.w);
      this.i++;
    }
    this.expectKeyword("do");
    const body = this.parseList(new Set(["done"]));
    this.expectKeyword("done");
    return { kind: "for", name, words, body };
  }

  private parseWhile(): WhileNode {
    this.i++;
    const cond = this.parseList(new Set(["do"]));
    this.expectKeyword("do");
    const body = this.parseList(new Set(["done"]));
    this.expectKeyword("done");
    return { kind: "while", cond, body };
  }

  private parseIf(): IfNode {
    this.i++;
    const node = this.parseIfRest();
    this.expectKeyword("fi");
    return node;
  }

  private parseIfRest(): IfNode {
    const cond = this.parseList(new Set(["then"]));
    this.expectKeyword("then");
    const thenB = this.parseList(new Set(["else", "elif", "fi"]));
    this.skipSeps();
    const kw = keywordOf(this.peek());
    if (kw === "elif") {
      this.i++;
      return { kind: "if", cond, then: thenB, else: [{ first: { cmds: [this.parseIfRest()] }, rest: [] }] };
    }
    if (kw === "else") {
      this.i++;
      return { kind: "if", cond, then: thenB, else: this.parseList(new Set(["fi"])) };
    }
    return { kind: "if", cond, then: thenB, else: null };
  }

  private parseSimple(): Simple {
    const words: Word[] = [];
    const redirs: Redir[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) break;
      if (t.k === "word") {
        words.push(t.w);
        this.i++;
        continue;
      }
      if (t.v === ">" || t.v === ">>" || t.v === "<" || t.v === "2>" || t.v === "2>>") {
        this.i++;
        const target = this.peek();
        if (!target || target.k !== "word") this.fail(target);
        redirs.push({ op: t.v, target: target.w });
        this.i++;
        continue;
      }
      if (t.v === "2>&1") {
        redirs.push({ op: "2>&1" });
        this.i++;
        continue;
      }
      break;
    }
    if (words.length === 0 && redirs.length === 0) this.fail();
    return { kind: "simple", words, redirs };
  }
}

export function parse(src: string): List {
  return new Parser(tokenize(src)).parseAll();
}
