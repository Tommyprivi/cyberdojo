/**
 * La shell del simulatore: tiene lo stato (filesystem, cartella, variabili, cronologia, processi),
 * esegue l'albero prodotto dal parser e smista i comandi. Tutto vive in memoria nel browser.
 */
import { fail, ok, type Cmd, type Result } from "./cmd-utils";
import { FS_COMMANDS } from "./commands-fs";
import { ExitSignal, SYS_COMMANDS, initialProcs, type EditorRequest, type Proc } from "./commands-sys";
import { TEXT_COMMANDS } from "./commands-text";
import { expandSingle, expandWords, type ExpandEnv } from "./expand";
import { sortedNames, type VFS } from "./fs";
import { expandGlob } from "./glob";
import { MAN, renderHelp } from "./manpages";
import { ParseError, parse, type AndOr, type Command, type List, type Pipeline, type Redir, type Simple, type Word } from "./parser";
import { basename, normalize, tildify } from "./path";
import { hasPerm } from "./perms";
import { buildFs, scenarioInfo, type ScenarioId } from "./scenarios";
import { ERR_TEXT, type Identity } from "./types";
import { identityOf } from "./users";

export type { EditorRequest, Proc };

const COMMANDS: Record<string, Cmd> = { ...FS_COMMANDS, ...TEXT_COMMANDS, ...SYS_COMMANDS };

/** Suggerimenti per chi arriva da Windows o sbaglia a scrivere. */
const FOREIGN_HINTS: Record<string, string> = {
  dir: "su Linux si usa «ls» (prova «ls -l»).",
  cls: "su Linux per pulire lo schermo si usa «clear».",
  copy: "su Linux si usa «cp».",
  del: "su Linux si usa «rm» (con cautela: non c'è il cestino).",
  erase: "su Linux si usa «rm».",
  move: "su Linux si usa «mv».",
  ren: "su Linux per rinominare si usa «mv».",
  type: "su Linux per leggere un file si usa «cat».",
  md: "su Linux si usa «mkdir».",
  ipconfig: "su Linux si usa «ip a» (non disponibile in questo simulatore).",
  ifconfig: "comando di rete non disponibile in questo simulatore.",
  ping: "il simulatore non ha accesso a Internet: nessun pacchetto esce davvero.",
  vi: "prova «nano», più semplice.",
  vim: "prova «nano», più semplice.",
  python: "in questo simulatore non c'è Python; per l'ambiente Python usa lo strumento «Python» della Pratica.",
  python3: "in questo simulatore non c'è Python; per l'ambiente Python usa lo strumento «Python» della Pratica.",
  su: "usa «sudo COMANDO» al posto di diventare root.",
};

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export function suggestCommand(name: string): string {
  if (Object.hasOwn(FOREIGN_HINTS, name)) return `Suggerimento: ${FOREIGN_HINTS[name]}`;
  const lower = name.toLowerCase();
  if (lower !== name && Object.hasOwn(COMMANDS, lower)) return `Suggerimento: Linux distingue maiuscole e minuscole. Forse intendevi «${lower}»?`;
  let best: string | null = null;
  let bestD = 3;
  for (const c of Object.keys(COMMANDS)) {
    if (c === "[" || c === "[[" || c === ":") continue;
    const dist = levenshtein(name, c);
    if (dist < bestD) {
      bestD = dist;
      best = c;
    }
  }
  if (best && name.length > 1) return `Suggerimento: forse intendevi «${best}»? Scrivi «help» per l'elenco dei comandi.`;
  return "Suggerimento: controlla di aver scritto bene il comando. Scrivi «help» per l'elenco di quelli disponibili.";
}

/** Raccoglie l'output in ordine. Gli errori di una sotto-shell finiscono nel contenitore padre. */
class Sink {
  chunks: string[] = [];
  size = 0;
  constructor(private errTarget?: Sink) {}
  private push(t: string) {
    if (t === "" || this.size > 200_000) return;
    this.chunks.push(t);
    this.size += t.length;
    if (this.size > 200_000) this.chunks.push("\n[...output troncato dal simulatore...]\n");
  }
  out(t: string) {
    this.push(t);
  }
  err(t: string) {
    (this.errTarget ?? this).push(t);
  }
  get text() {
    return this.chunks.join("");
  }
}

class ExecLimit extends Error {}

export interface RunResult {
  output: string;
  clear: boolean;
  editor: EditorRequest | null;
}

export interface Completion {
  line: string;
  options: string[];
}

export interface ShellOptions {
  now?: () => Date;
}

const DEFAULT_ENV = (home: string): [string, string][] => [
  ["HOME", home],
  ["USER", "studente"],
  ["LOGNAME", "studente"],
  ["SHELL", "/bin/bash"],
  ["PATH", "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"],
  ["LANG", "it_IT.UTF-8"],
  ["HOSTNAME", "lab"],
  ["TERM", "xterm-256color"],
  ["EDITOR", "nano"],
];

export class Shell {
  fs: VFS;
  cwd: string;
  oldpwd: string | null = null;
  readonly home = "/home/studente";
  user: Identity;
  vars = new Map<string, string>();
  exported = new Set<string>();
  history: string[] = [];
  procs: Proc[] = initialProcs();
  installed = new Set<string>(["bash", "coreutils", "nano"]);
  sudoAuthed = false;
  lastStatus = 0;
  pendingClear = false;
  pendingEditor: EditorRequest | null = null;
  scriptDepth = 0;
  private pos: string[] = [];
  private scriptName = "bash";
  private budget = 0;
  private substDepth = 0;
  private cur: Sink = new Sink();
  private pidCounter = 2400;
  private readonly clock: () => Date;
  readonly scenario: ScenarioId;

  constructor(scenario: ScenarioId = "base", opts: ShellOptions = {}) {
    this.scenario = scenario;
    this.clock = opts.now ?? (() => new Date());
    this.fs = buildFs(scenario);
    this.user = identityOf("studente")!;
    this.cwd = scenarioInfo(scenario).start;
    for (const [k, v] of DEFAULT_ENV(this.home)) {
      this.vars.set(k, v);
      this.exported.add(k);
    }
    this.vars.set("PWD", this.cwd);
    this.exported.add("PWD");
  }

  // ---- utilità per i comandi ------------------------------------------------------------------

  now(): Date {
    return this.clock();
  }
  nowMs(): number {
    return this.clock().getTime();
  }
  takePid(): number {
    return this.pidCounter++;
  }
  abs(p: string): string {
    if (p === "~") return this.home;
    if (p.startsWith("~/")) return normalize(this.home + p.slice(1));
    return normalize(p, this.cwd);
  }
  setCwd(abs: string) {
    this.oldpwd = this.cwd;
    this.cwd = abs;
    this.vars.set("OLDPWD", this.oldpwd);
    this.exported.add("OLDPWD");
    this.vars.set("PWD", abs);
  }
  setVar(name: string, value: string) {
    this.vars.set(name, value);
  }
  getVar(name: string): string | undefined {
    if (name === "?") return String(this.lastStatus);
    if (name === "#") return String(this.pos.length);
    if (name === "@" || name === "*") return this.pos.join(" ");
    if (name === "0") return this.scriptName;
    if (/^[1-9]$/.test(name)) return this.pos[Number(name) - 1];
    if (name === "UID") return String(this.user.uid);
    return this.vars.get(name);
  }
  commandNames(): string[] {
    return Object.keys(COMMANDS);
  }
  prompt(): string {
    return `${this.user.name}@lab:${tildify(this.cwd, this.home)}$ `;
  }

  // ---- esecuzione ----------------------------------------------------------------------------

  run(line: string): RunResult {
    this.pendingClear = false;
    this.pendingEditor = null;
    const sink = new Sink();
    if (line.trim() === "") return { output: "", clear: false, editor: null };
    this.history.push(line);
    if (this.history.length > 500) this.history.shift();
    this.cur = sink;
    this.budget = 3000;
    this.substDepth = 0;
    this.scriptDepth = 0;
    this.pos = [];
    this.scriptName = "bash";
    try {
      this.execList(parse(line), sink, null);
    } catch (e) {
      if (e instanceof ParseError) {
        sink.err(`bash: ${e.message}\n`);
        this.lastStatus = 2;
      } else if (e instanceof ExecLimit) {
        sink.err("bash: limite di esecuzione del simulatore raggiunto (troppi comandi o un ciclo infinito)\n");
        this.lastStatus = 1;
      } else if (e instanceof ExitSignal) this.lastStatus = e.code;
      else throw e;
    }
    return { output: sink.text, clear: this.pendingClear, editor: this.pendingEditor };
  }

  /** Salva il file dall'editor (nano). Restituisce un messaggio di errore oppure null. */
  saveFile(abs: string, content: string, asRoot: boolean): string | null {
    const id = asRoot ? identityOf("root")! : this.user;
    const e = this.fs.writeFile(abs, content, id, this.nowMs());
    return e ? `Error writing ${basename(abs)}: ${ERR_TEXT[e]}` : null;
  }

  private env(): ExpandEnv {
    return {
      getVar: (n) => this.getVar(n),
      subst: (src) => this.substitute(src),
      glob: (p) => expandGlob(this.fs, this.cwd, p, this.user),
      home: this.home,
    };
  }

  private substitute(src: string): string {
    if (this.substDepth >= 4) throw new ParseError("sostituzioni troppo annidate");
    this.substDepth++;
    const parent = this.cur;
    const cap = new Sink(parent);
    const savedStatus = this.lastStatus;
    this.cur = cap;
    try {
      this.execList(parse(src), cap, null);
    } finally {
      this.cur = parent;
      this.substDepth--;
    }
    this.lastStatus = savedStatus;
    return cap.text;
  }

  private tick() {
    if (--this.budget < 0) throw new ExecLimit();
  }

  execList(list: List, sink: Sink, stdin: string | null): number {
    let code = this.lastStatus;
    for (const ao of list) code = this.execAndOr(ao, sink, stdin);
    return code;
  }

  private execAndOr(ao: AndOr, sink: Sink, stdin: string | null): number {
    let code = this.execPipeline(ao.first, sink, stdin);
    this.lastStatus = code;
    for (const r of ao.rest) {
      if (r.op === "&&" && code !== 0) continue;
      if (r.op === "||" && code === 0) continue;
      code = this.execPipeline(r.p, sink, stdin);
      this.lastStatus = code;
    }
    return code;
  }

  private execPipeline(p: Pipeline, sink: Sink, stdin: string | null): number {
    let data = stdin;
    let code = 0;
    p.cmds.forEach((c, i) => {
      const last = i === p.cmds.length - 1;
      if (last) {
        code = this.execCommand(c, sink, data);
      } else {
        const cap = new Sink(sink);
        this.execCommand(c, cap, data);
        data = cap.text;
      }
    });
    return code;
  }

  private execCommand(c: Command, sink: Sink, stdin: string | null): number {
    this.tick();
    if (c.kind === "simple") return this.execSimple(c, sink, stdin);
    if (c.kind === "for") {
      const items = expandWords(c.words, this.env());
      let code = 0;
      for (const it of items) {
        this.tick();
        this.vars.set(c.name, it);
        code = this.execList(c.body, sink, stdin);
      }
      return code;
    }
    if (c.kind === "while") {
      let code = 0;
      for (let n = 0; n < 500; n++) {
        this.tick();
        if (this.execList(c.cond, sink, stdin) !== 0) return code;
        code = this.execList(c.body, sink, stdin);
      }
      sink.err("bash: ciclo while interrotto dopo 500 giri (limite del simulatore)\n");
      return 1;
    }
    const cond = this.execList(c.cond, sink, stdin);
    if (cond === 0) return this.execList(c.then, sink, stdin);
    if (c.else) return this.execList(c.else, sink, stdin);
    return 0;
  }

  private execSimple(node: Simple, sink: Sink, stdin: string | null): number {
    const env = this.env();
    // Assegnazioni iniziali: NOME=valore
    const assigns: [string, Word][] = [];
    let wi = 0;
    while (wi < node.words.length) {
      const w = node.words[wi];
      const first = w[0];
      const m = first && first.t === "lit" && !first.q ? /^([A-Za-z_]\w*)=([\s\S]*)$/.exec(first.s) : null;
      if (!m) break;
      assigns.push([m[1], [{ t: "lit", s: m[2], q: false }, ...w.slice(1)]]);
      wi++;
    }
    const argv = expandWords(node.words.slice(wi), env);
    for (const [k, w] of assigns) this.vars.set(k, expandSingle(w, env));
    if (argv.length === 0 && node.redirs.length === 0) return 0;

    // Redirezioni
    let inText = stdin;
    let outFile: { path: string; append: boolean } | null = null;
    let errFile: { path: string; append: boolean } | null = null;
    let merge = false;
    const failRedir = (name: string, why: string) => {
      sink.err(`bash: ${name}: ${why}\n`);
      return 1;
    };
    const redirs: Redir[] = node.redirs;
    for (const r of redirs) {
      if (r.op === "2>&1") {
        merge = true;
        continue;
      }
      const name = expandSingle(r.target as Word, env);
      const abs = this.abs(name);
      if (r.op === "<") {
        const rd = this.fs.readFile(abs, this.user);
        if ("err" in rd) return failRedir(name, ERR_TEXT[rd.err]);
        inText = rd.content;
        continue;
      }
      const append = r.op === ">>" || r.op === "2>>";
      if (abs !== "/dev/null") {
        const e = this.fs.writeFile(abs, "", this.user, this.nowMs(), append);
        if (e) return failRedir(name, ERR_TEXT[e]);
      }
      if (r.op === ">" || r.op === ">>") outFile = { path: abs, append: true };
      else errFile = { path: abs, append: true };
    }
    if (argv.length === 0) return 0;

    let res: Result;
    try {
      res = this.dispatch(argv, { sudo: false, stdin: inText });
    } catch (e) {
      if (e instanceof ExitSignal) throw e;
      throw e;
    }
    this.cur = sink;
    const writeOut = (text: string) => {
      if (text === "") return;
      if (outFile) {
        const e = this.fs.writeFile(outFile.path, text, this.user, this.nowMs(), true);
        if (e) sink.err(`bash: ${ERR_TEXT[e]}\n`);
      } else sink.out(text);
    };
    const writeErr = (text: string) => {
      if (text === "") return;
      if (merge) {
        writeOut(text);
        return;
      }
      if (errFile) {
        const e = this.fs.writeFile(errFile.path, text, this.user, this.nowMs(), true);
        if (e) sink.err(`bash: ${ERR_TEXT[e]}\n`);
      } else sink.err(text);
    };
    // Gli errori vengono prima dell'output, come nella pratica quando un comando fallisce subito.
    writeErr(res.err);
    writeOut(res.out);
    return res.code;
  }

  /** Esegue un comando già espanso. Usato dalla shell e da `sudo`. */
  dispatch(argv: string[], opts: { sudo: boolean; stdin: string | null }): Result {
    const [name, ...args] = argv;
    const id = opts.sudo ? identityOf("root")! : this.user;
    if (name.includes("/")) return this.runScript(this.abs(name), name, args, id, opts.stdin, true);
    if (!Object.hasOwn(COMMANDS, name)) {
      const hint = suggestCommand(name);
      return fail(`${name}: command not found\n${hint}`, 127);
    }
    if (args.includes("--help") && !["echo", "printf", "test", "[", "[[", "true", "false", ":"].includes(name) && Object.hasOwn(MAN, name)) {
      return ok(renderHelp(name, MAN[name]));
    }
    const ctx = { sh: this, id, sudo: opts.sudo, stdin: opts.stdin };
    return COMMANDS[name](args, ctx);
  }

  /** Esegue uno script come sotto-shell: variabili e cartella dello script non restano. */
  runScript(abs: string, display: string, args: string[], id: Identity, stdin: string | null, direct: boolean): Result {
    const node = this.fs.lookup(abs, id);
    if (!node.node) return fail(`${direct ? "bash" : "bash"}: ${display}: ${ERR_TEXT[node.err]}`, 127);
    if (node.node.kind === "dir") return fail(`bash: ${display}: Is a directory`, direct ? 126 : 1);
    if (direct && !hasPerm(node.node, id, "x")) return fail(`bash: ${display}: Permission denied\nSuggerimento: manca il permesso di esecuzione. Prova «chmod +x ${display}».`, 126);
    if (!hasPerm(node.node, id, "r")) return fail(`bash: ${display}: Permission denied`, direct ? 126 : 126);
    if (this.scriptDepth >= 4) return fail("bash: script annidati troppo in profondità", 1);
    const saved = {
      cwd: this.cwd,
      oldpwd: this.oldpwd,
      vars: new Map(this.vars),
      exported: new Set(this.exported),
      pos: this.pos,
      name: this.scriptName,
      status: this.lastStatus,
      user: this.user,
    };
    const sink = new Sink();
    const parentSink = this.cur;
    this.cur = sink;
    this.pos = args;
    this.scriptName = display;
    this.scriptDepth++;
    let code = 0;
    const savedUser = this.user;
    if (id.uid === 0) this.user = id;
    try {
      let list: List;
      try {
        list = parse(node.node.content);
      } catch (e) {
        if (e instanceof ParseError) {
          sink.out(`${display}: ${e.message}\n`);
          return { out: sink.text, err: "", code: 2 };
        }
        throw e;
      }
      this.lastStatus = 0;
      code = this.execList(list, sink, stdin);
    } catch (e) {
      if (e instanceof ExitSignal) code = e.code;
      else throw e;
    } finally {
      this.scriptDepth--;
      this.user = savedUser;
      this.cwd = saved.cwd;
      this.oldpwd = saved.oldpwd;
      this.vars = saved.vars;
      this.exported = saved.exported;
      this.pos = saved.pos;
      this.scriptName = saved.name;
      this.lastStatus = saved.status;
      this.cur = parentSink;
    }
    return { out: sink.text, err: "", code };
  }

  // ---- completamento con Tab -------------------------------------------------------------------

  complete(line: string): Completion {
    const m = /(?:^|[\s|;&<>])([^\s|;&<>]*)$/.exec(line);
    const prefix = m ? m[1] : "";
    const start = line.length - prefix.length;
    const before = line.slice(0, start).trimEnd();
    const words = before.split(/\s+/).filter(Boolean);
    const atCommand = before === "" || /[|;&]$/.test(before) || (words.length === 1 && words[0] === "sudo") || (words.length >= 1 && words[words.length - 1] === "sudo" && /(^|[|;&]\s*)sudo$/.test(before));
    const cmdWord = before.split(/[|;&]/).pop()!.trim().split(/\s+/).filter((w) => w !== "sudo")[0] ?? "";
    let candidates: string[];
    if (atCommand && !prefix.includes("/")) {
      candidates = this.commandNames()
        .filter((n) => n !== "[" && n !== "[[" && n !== ":" && n.startsWith(prefix))
        .sort();
    } else {
      const slash = prefix.lastIndexOf("/");
      const dirPart = slash === -1 ? "" : prefix.slice(0, slash + 1);
      const namePart = prefix.slice(slash + 1);
      const dirAbs = dirPart === "" ? this.cwd : this.abs(dirPart);
      const d = this.fs.lookup(dirAbs, this.user).node;
      candidates = [];
      if (d && d.kind === "dir" && hasPerm(d, this.user, "r")) {
        for (const n of sortedNames(d)) {
          if (!n.startsWith(namePart)) continue;
          if (n.startsWith(".") && !namePart.startsWith(".")) continue;
          const child = d.children[n];
          if ((cmdWord === "cd" || cmdWord === "rmdir") && child.kind !== "dir") continue;
          candidates.push(dirPart + n.replace(/ /g, "\\ ") + (child.kind === "dir" ? "/" : ""));
        }
      }
    }
    if (candidates.length === 0) return { line, options: [] };
    const head = line.slice(0, start);
    if (candidates.length === 1) {
      const c = candidates[0];
      return { line: head + c + (c.endsWith("/") ? "" : " "), options: [] };
    }
    let common = candidates[0];
    for (const c of candidates) {
      while (!c.startsWith(common)) common = common.slice(0, -1);
    }
    return { line: head + common, options: candidates };
  }
}


