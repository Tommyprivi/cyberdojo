import { compareText, errText, fail, joinLines, ok, parseOpts, splitLines, type Cmd, type Ctx } from "./cmd-utils";
import { sortedNames } from "./fs";
import { joinPath } from "./path";
import { hasPerm } from "./perms";
import { ERR_TEXT } from "./types";

/** Legge i file indicati (o lo stdin). Restituisce i testi e gli errori già formattati. */
function readInputs(cmd: string, files: string[], ctx: Ctx): { inputs: { name: string; text: string }[]; err: string } {
  const inputs: { name: string; text: string }[] = [];
  let err = "";
  if (files.length === 0) return { inputs: [{ name: "-", text: ctx.stdin ?? "" }], err };
  for (const f of files) {
    if (f === "-") {
      inputs.push({ name: "-", text: ctx.stdin ?? "" });
      continue;
    }
    const r = ctx.sh.fs.readFile(ctx.sh.abs(f), ctx.id);
    if ("err" in r) err += `${cmd}: ${f}: ${errText(r.err)}\n`;
    else inputs.push({ name: f, text: r.content });
  }
  return { inputs, err };
}

function escapeSeq(s: string, stopAtC = false): string {
  return s.replace(/\\(n|t|\\|"|a|r|0|c)/g, (_m, c: string) => {
    if (c === "c") return stopAtC ? "" : "\\c";
    return { n: "\n", t: "\t", "\\": "\\", '"': '"', a: "\x07", r: "\r", "0": "\0" }[c] ?? c;
  });
}

const echo: Cmd = (args) => {
  let nl = true;
  let esc = false;
  let i = 0;
  for (; i < args.length; i++) {
    const m = /^-[neE]+$/.exec(args[i]);
    if (!m) break;
    if (args[i].includes("n")) nl = false;
    if (args[i].includes("e")) esc = true;
    if (args[i].includes("E")) esc = false;
  }
  let text = args.slice(i).join(" ");
  if (esc) text = escapeSeq(text);
  return ok(text + (nl ? "\n" : ""));
};

const printf: Cmd = (args) => {
  if (args.length === 0) return fail("printf: usage: printf format [arguments]");
  const format = args[0];
  const vals = args.slice(1);
  const spec = /%(-?)(\d*)(?:\.(\d+))?([sdifbx%])/g;
  const usesArgs = /%[^%]/.test(format.replace(/%%/g, ""));
  let out = "";
  let idx = 0;
  let err = "";
  do {
    out += escapeSeq(
      format.replace(spec, (_m, left: string, width: string, prec: string | undefined, conv: string) => {
        if (conv === "%") return "%";
        const raw = vals[idx++] ?? "";
        let s: string;
        if (conv === "d" || conv === "i") {
          const n = Number.parseInt(raw === "" ? "0" : raw, 10);
          if (Number.isNaN(n)) {
            err += `printf: ${raw}: invalid number\n`;
            s = "0";
          } else s = String(n);
        } else if (conv === "f") s = Number(raw || 0).toFixed(prec === undefined ? 6 : Number(prec));
        else if (conv === "x") s = (Number.parseInt(raw || "0", 10) >>> 0).toString(16);
        else if (conv === "b") s = escapeSeq(raw);
        else s = prec === undefined ? raw : raw.slice(0, Number(prec));
        const w = Number(width || 0);
        return left ? s.padEnd(w) : s.padStart(w);
      }),
    );
  } while (usesArgs && idx < vals.length);
  return { out, err, code: err ? 1 : 0 };
};

const wc: Cmd = (args, ctx) => {
  const o = parseOpts("wc", args, { bool: "lwcm", long: { lines: "l", words: "w", bytes: "c", chars: "m" } });
  if (o.error) return fail(o.error);
  const sel = ["l", "w", "c"].filter((k) => o.flags.has(k) || (k === "c" && o.flags.has("m")));
  const cols = sel.length ? sel : ["l", "w", "c"];
  const { inputs, err } = readInputs("wc", o.rest, ctx);
  const rows = inputs.map((inp) => ({
    name: inp.name === "-" ? "" : inp.name,
    nums: cols.map((k) => (k === "l" ? (inp.text.match(/\n/g) ?? []).length : k === "w" ? (inp.text.match(/\S+/g) ?? []).length : new TextEncoder().encode(inp.text).length)),
  }));
  if (rows.length > 1) rows.push({ name: "total", nums: cols.map((_c, k) => rows.reduce((s, r) => s + r.nums[k], 0)) });
  const stdinOnly = o.rest.length === 0;
  const width = cols.length === 1 && rows.length === 1 ? 0 : stdinOnly ? 7 : Math.max(...rows.flatMap((r) => r.nums.map((n) => String(n).length)));
  const out = rows.map((r) => r.nums.map((n) => String(n).padStart(width)).join(" ") + (r.name ? ` ${r.name}` : "")).join("\n") + (rows.length ? "\n" : "");
  return { out, err, code: err ? 1 : 0 };
};

const sort: Cmd = (args, ctx) => {
  const o = parseOpts("sort", args, { bool: "rnufb", val: "tk", long: { reverse: "r", "numeric-sort": "n", unique: "u", "ignore-case": "f" } });
  if (o.error) return fail(o.error, 2);
  const { inputs, err } = readInputs("sort", o.rest, ctx);
  let lines = inputs.flatMap((i) => splitLines(i.text));
  const sep = o.vals.t;
  const field = o.vals.k ? Number.parseInt(o.vals.k, 10) : 0;
  if (o.vals.k && (!Number.isFinite(field) || field < 1)) return fail(`sort: invalid number at field start: invalid count at start of '${o.vals.k}'`, 2);
  const key = (l: string) => {
    if (!field) return l;
    const parts = sep ? l.split(sep) : l.trim().split(/\s+/);
    return parts[field - 1] ?? "";
  };
  const num = (s: string) => {
    const m = /^\s*(-?\d+(?:\.\d+)?)/.exec(s);
    return m ? Number(m[1]) : 0;
  };
  const cmp = (a: string, b: string) => {
    const ka = key(a);
    const kb = key(b);
    let c: number;
    if (o.flags.has("n")) c = num(ka) - num(kb);
    else if (o.flags.has("f")) c = ka.toLowerCase() < kb.toLowerCase() ? -1 : ka.toLowerCase() > kb.toLowerCase() ? 1 : 0;
    else c = compareText(ka, kb);
    if (c === 0) c = compareText(a, b);
    return c;
  };
  lines = lines.sort(cmp);
  if (o.flags.has("u")) lines = lines.filter((l, i) => i === 0 || cmp(lines[i - 1], l) !== 0 || (o.flags.has("n") ? false : key(lines[i - 1]) !== key(l)));
  if (o.flags.has("r")) lines.reverse();
  return { out: joinLines(lines), err, code: err ? 2 : 0 };
};

const uniq: Cmd = (args, ctx) => {
  const o = parseOpts("uniq", args, { bool: "cdui", long: { count: "c", repeated: "d", unique: "u", "ignore-case": "i" } });
  if (o.error) return fail(o.error);
  const { inputs, err } = readInputs("uniq", o.rest.slice(0, 1), ctx);
  const lines = inputs.flatMap((i) => splitLines(i.text));
  const groups: { line: string; n: number }[] = [];
  const same = (a: string, b: string) => (o.flags.has("i") ? a.toLowerCase() === b.toLowerCase() : a === b);
  for (const l of lines) {
    const last = groups[groups.length - 1];
    if (last && same(last.line, l)) last.n++;
    else groups.push({ line: l, n: 1 });
  }
  const shown = groups.filter((g) => (o.flags.has("d") ? g.n > 1 : o.flags.has("u") ? g.n === 1 : true));
  const out = shown.map((g) => (o.flags.has("c") ? `${String(g.n).padStart(7)} ${g.line}` : g.line));
  return { out: joinLines(out), err, code: err ? 1 : 0 };
};

/** Lista di campi di cut: «1», «1,3», «2-4», «-3», «2-». */
function parseRanges(spec: string): ((n: number) => boolean) | null {
  const parts = spec.split(",");
  const tests: [number, number][] = [];
  for (const p of parts) {
    const m = /^(\d*)-(\d*)$/.exec(p) ?? /^(\d+)$/.exec(p);
    if (!m) return null;
    if (m.length === 2) tests.push([Number(m[1]), Number(m[1])]);
    else {
      if (m[1] === "" && m[2] === "") return null;
      tests.push([m[1] === "" ? 1 : Number(m[1]), m[2] === "" ? Infinity : Number(m[2])]);
    }
  }
  if (tests.some(([a]) => a < 1)) return null;
  return (n) => tests.some(([a, b]) => n >= a && n <= b);
}

const cut: Cmd = (args, ctx) => {
  const o = parseOpts("cut", args, { bool: "s", val: "dfc", long: { delimiter: "d", fields: "f", characters: "c", "only-delimited": "s" } });
  if (o.error) return fail(o.error);
  if (o.vals.f === undefined && o.vals.c === undefined) return fail("cut: you must specify a list of bytes, characters, or fields\nTry 'cut --help' for more information.");
  const delim = o.vals.d ?? "\t";
  if (o.vals.d !== undefined && [...delim].length !== 1) return fail("cut: the delimiter must be a single character\nTry 'cut --help' for more information.");
  const test = parseRanges(o.vals.f ?? o.vals.c ?? "");
  if (!test) return fail(`cut: invalid field range\nTry 'cut --help' for more information.`);
  const { inputs, err } = readInputs("cut", o.rest, ctx);
  const out: string[] = [];
  for (const inp of inputs) {
    for (const line of splitLines(inp.text)) {
      if (o.vals.c !== undefined) {
        out.push([...line].filter((_c, i) => test(i + 1)).join(""));
      } else if (!line.includes(delim)) {
        if (!o.flags.has("s")) out.push(line);
      } else {
        out.push(line.split(delim).filter((_f, i) => test(i + 1)).join(delim));
      }
    }
  }
  return { out: joinLines(out), err, code: err ? 1 : 0 };
};

const POSIX_CLASSES: Record<string, string> = {
  alpha: "a-zA-Z",
  digit: "0-9",
  alnum: "a-zA-Z0-9",
  upper: "A-Z",
  lower: "a-z",
  space: "\\s",
  punct: "!-\\/:-@\\[-`{-~",
  blank: " \\t",
  xdigit: "0-9a-fA-F",
};

/** Trasforma un modello grep (BRE o ERE) in un'espressione regolare JS. Restituisce null se non valido. */
export function grepRegex(pattern: string, opts: { extended: boolean; fixed: boolean; ignoreCase: boolean; word: boolean }): RegExp | null {
  if (pattern.length > 300) return null;
  let src = "";
  if (opts.fixed) src = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  else {
    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i];
      if (c === "\\" && i + 1 < pattern.length) {
        const n = pattern[++i];
        if (!opts.extended && "+?|(){}".includes(n)) src += n; // in BRE, \+ \? \| \( \) sono speciali
        else if (n === "<" || n === ">") src += "\\b";
        else if ("wWsSdbB".includes(n)) src += "\\" + n;
        else src += "\\" + n;
      } else if (c === "[") {
        let j = i + 1;
        if (pattern[j] === "^") j++;
        if (pattern[j] === "]") j++;
        while (j < pattern.length && pattern[j] !== "]") {
          if (pattern[j] === "[" && pattern[j + 1] === ":") {
            const e = pattern.indexOf(":]", j + 2);
            if (e === -1) return null;
            j = e + 2;
          } else j++;
        }
        if (j >= pattern.length) return null;
        let cls = pattern.slice(i + 1, j);
        cls = cls.replace(/\[:([a-z]+):\]/g, (_m, n: string) => POSIX_CLASSES[n] ?? "");
        const neg = cls.startsWith("^");
        if (neg) cls = cls.slice(1);
        cls = cls.replace(/\\(?![sdwSDWtnr\\\]\-/!:@`{}~\[ ,])/g, "\\\\").replace(/\[/g, "\\[");
        src += `[${neg ? "^" : ""}${cls.replace(/^\]/, "\\]")}]`;
        i = j;
      } else if (!opts.extended && "+?|(){}".includes(c)) src += "\\" + c;
      else src += c;
    }
  }
  if (opts.word) src = `(?<![A-Za-z0-9_])(?:${src})(?![A-Za-z0-9_])`;
  try {
    return new RegExp(src, opts.ignoreCase ? "i" : "");
  } catch {
    return null;
  }
}

const grep: Cmd = (args, ctx) => {
  const o = parseOpts("grep", args, {
    bool: "ivncrRlEFwHh",
    val: "e",
    long: { "ignore-case": "i", "invert-match": "v", "line-number": "n", count: "c", recursive: "r", "files-with-matches": "l", "extended-regexp": "E", "fixed-strings": "F", "word-regexp": "w", regexp: "e" },
  });
  if (o.error) return fail(o.error, 2);
  let pattern: string | undefined = o.vals.e;
  const rest = [...o.rest];
  if (pattern === undefined) {
    pattern = rest.shift();
    if (pattern === undefined) return fail("Usage: grep [OPTION]... PATTERNS [FILE]...\nTry 'grep --help' for more information.", 2);
  }
  const re = grepRegex(pattern, { extended: o.flags.has("E"), fixed: o.flags.has("F"), ignoreCase: o.flags.has("i"), word: o.flags.has("w") });
  if (!re) return fail("grep: invalid regular expression (controlla parentesi e quadre)", 2);
  const recursive = o.flags.has("r") || o.flags.has("R");
  const invert = o.flags.has("v");
  const targets: { name: string; text: string }[] = [];
  let err = "";
  const walk = (abs: string, display: string) => {
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (!r.node) {
      err += `grep: ${display}: ${errText(r.err)}\n`;
      return;
    }
    if (r.node.kind === "file") {
      if (!hasPerm(r.node, ctx.id, "r")) err += `grep: ${display}: Permission denied\n`;
      else targets.push({ name: display, text: r.node.content });
      return;
    }
    if (!recursive) {
      err += `grep: ${display}: Is a directory\n`;
      return;
    }
    if (!hasPerm(r.node, ctx.id, "r") || !hasPerm(r.node, ctx.id, "x")) {
      err += `grep: ${display}: Permission denied\n`;
      return;
    }
    for (const n of sortedNames(r.node)) walk(joinPath(abs, n), display === "." ? `./${n}` : `${display.replace(/\/$/, "")}/${n}`);
  };
  let multi = recursive;
  if (rest.length === 0) {
    if (recursive) walk(ctx.sh.cwd, ".");
    else targets.push({ name: "(standard input)", text: ctx.stdin ?? "" });
  } else {
    if (rest.length > 1) multi = true;
    for (const f of rest) {
      if (f === "-") targets.push({ name: "(standard input)", text: ctx.stdin ?? "" });
      else walk(ctx.sh.abs(f), f);
    }
  }
  if (o.flags.has("h")) multi = false;
  if (o.flags.has("H")) multi = true;
  let out = "";
  let any = false;
  for (const t of targets) {
    const lines = splitLines(t.text);
    let count = 0;
    let buf = "";
    lines.forEach((line, i) => {
      if (re.test(line) === invert) return;
      count++;
      if (o.flags.has("c") || o.flags.has("l")) return;
      buf += `${multi ? `${t.name}:` : ""}${o.flags.has("n") ? `${i + 1}:` : ""}${line}\n`;
    });
    if (count > 0) any = true;
    if (o.flags.has("l")) {
      if (count > 0) out += `${t.name}\n`;
    } else if (o.flags.has("c")) out += `${multi ? `${t.name}:` : ""}${count}\n`;
    else out += buf;
  }
  return { out, err, code: err ? 2 : any ? 0 : 1 };
};

/** Espande un insieme di `tr`: intervalli (a-z), classi ([:upper:]) ed escape. */
function expandTrSet(s: string): string[] | null {
  const chars: string[] = [];
  const classes: Record<string, string> = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    digit: "0123456789",
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    alnum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    space: " \t\n\r\v\f",
    punct: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
  };
  const items: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "[" && s[i + 1] === ":") {
      const e = s.indexOf(":]", i + 2);
      if (e === -1) return null;
      const name = s.slice(i + 2, e);
      if (!Object.hasOwn(classes, name)) return null;
      items.push(...classes[name]);
      i = e + 1;
    } else if (s[i] === "\\" && i + 1 < s.length) {
      const n = s[++i];
      items.push(n === "n" ? "\n" : n === "t" ? "\t" : n === "r" ? "\r" : n);
    } else items.push(s[i]);
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i + 1] === "-" && i + 2 < items.length) {
      const a = items[i].codePointAt(0)!;
      const b = items[i + 2].codePointAt(0)!;
      if (b < a) return null;
      for (let c = a; c <= b; c++) chars.push(String.fromCodePoint(c));
      i += 2;
    } else chars.push(items[i]);
  }
  return chars;
}

const tr: Cmd = (args, ctx) => {
  const o = parseOpts("tr", args, { bool: "ds", long: { delete: "d", "squeeze-repeats": "s" } });
  if (o.error) return fail(o.error);
  const del = o.flags.has("d");
  const squeeze = o.flags.has("s");
  if (o.rest.length === 0) return fail("tr: missing operand\nTry 'tr --help' for more information.");
  if (!del && !squeeze && o.rest.length < 2) return fail(`tr: missing operand after '${o.rest[0]}'\nTwo strings must be given when translating.`);
  if (o.rest.length > 2) return fail(`tr: extra operand '${o.rest[2]}'`);
  const set1 = expandTrSet(o.rest[0]);
  const set2 = o.rest[1] !== undefined ? expandTrSet(o.rest[1]) : [];
  if (!set1 || !set2) return fail("tr: insieme di caratteri non valido");
  const text = ctx.stdin ?? "";
  let out = "";
  const map = new Map<string, string>();
  if (!del && set2.length) set1.forEach((c, i) => map.set(c, set2[Math.min(i, set2.length - 1)]));
  let prev = "";
  for (const ch of text) {
    if (del) {
      if (set1.includes(ch)) continue;
      out += ch;
      continue;
    }
    const t = map.get(ch) ?? ch;
    const inSet = map.has(ch) || (set2.length === 0 && set1.includes(ch));
    if (squeeze && inSet && prev === t) continue;
    out += t;
    prev = inSet ? t : "";
  }
  return ok(out);
};

const tee: Cmd = (args, ctx) => {
  const o = parseOpts("tee", args, { bool: "a", long: { append: "a" } });
  if (o.error) return fail(o.error);
  const text = ctx.stdin ?? "";
  let err = "";
  for (const f of o.rest) {
    const e = ctx.sh.fs.writeFile(ctx.sh.abs(f), text, ctx.id, ctx.sh.nowMs(), o.flags.has("a"));
    if (e) err += `tee: ${f}: ${ERR_TEXT[e]}\n`;
  }
  return { out: text, err, code: err ? 1 : 0 };
};

const pager = (name: string): Cmd => (args, ctx) => {
  const files = args.filter((a) => !a.startsWith("-"));
  if (files.length === 0 && ctx.stdin === null) return fail(`${name === "less" ? "Missing filename (\"less --help\" for help)" : "Usage: more [options] file..."}`);
  const { inputs, err } = readInputs(name, files, ctx);
  const text = inputs.map((i) => i.text).join("");
  const tail = inputs.length ? "\n(fine del file: nel vero " + name + " si scorre con le frecce e si esce con q)\n" : "";
  return { out: text + (text && !text.endsWith("\n") ? "\n" : "") + tail, err, code: err ? 1 : 0 };
};

const basenameCmd: Cmd = (args) => {
  if (args.length === 0) return fail("basename: missing operand\nTry 'basename --help' for more information.");
  const p = args[0].replace(/\/+$/, "");
  let b = p === "" ? "/" : p.split("/").pop()!;
  if (args[1] && b.endsWith(args[1]) && b !== args[1]) b = b.slice(0, -args[1].length);
  return ok(b + "\n");
};

const dirnameCmd: Cmd = (args) => {
  if (args.length === 0) return fail("dirname: missing operand\nTry 'dirname --help' for more information.");
  const p = args[0].replace(/\/+$/, "");
  const i = p.lastIndexOf("/");
  return ok((i === -1 ? "." : i === 0 ? "/" : p.slice(0, i)) + "\n");
};

const seq: Cmd = (args) => {
  const nums = args.map(Number);
  if (args.length === 0 || args.length > 3 || nums.some((n) => !Number.isInteger(n))) return fail(`seq: invalid argument${args.length ? ` '${args.find((a) => !Number.isInteger(Number(a)))}'` : ""}\nTry 'seq --help' for more information.`);
  const [first, step, last] = args.length === 1 ? [1, 1, nums[0]] : args.length === 2 ? [nums[0], 1, nums[1]] : [nums[0], nums[1], nums[2]];
  if (step === 0) return fail("seq: invalid Zero increment value: '0'");
  const out: string[] = [];
  for (let v = first; step > 0 ? v <= last : v >= last; v += step) {
    out.push(String(v));
    if (out.length > 5000) return fail("seq: sequenza troppo lunga per il simulatore");
  }
  return ok(joinLines(out));
};

const fileCmd: Cmd = (args, ctx) => {
  const files = args.filter((a) => !a.startsWith("-"));
  if (files.length === 0) return fail("Usage: file [OPTION...] [FILE...]");
  let out = "";
  for (const f of files) {
    const r = ctx.sh.fs.lookup(ctx.sh.abs(f), ctx.id);
    if (!r.node) out += `${f}: cannot open \`${f}' (${errText(r.err)})\n`;
    else if (r.node.kind === "dir") out += `${f}: directory\n`;
    else if (r.node.content === "") out += `${f}: empty\n`;
    else if (r.node.content.startsWith("#!")) out += `${f}: ${r.node.content.split("\n")[0].includes("bash") ? "Bourne-Again shell script" : "script"}, ASCII text executable\n`;
    else out += `${f}: ${/[^\x00-\x7f]/.test(r.node.content) ? "Unicode text, UTF-8 text" : "ASCII text"}\n`;
  }
  return ok(out);
};

export const TEXT_COMMANDS: Record<string, Cmd> = {
  file: fileCmd,
  echo,
  printf,
  wc,
  sort,
  uniq,
  cut,
  grep,
  tr,
  tee,
  less: pager("less"),
  more: pager("more"),
  basename: basenameCmd,
  dirname: dirnameCmd,
  seq,
};
