import { errText, fail, ok, parseOpts, type Cmd, type Ctx } from "./cmd-utils";
import { MAN, renderMan } from "./manpages";
import { hasPerm } from "./perms";
import { ERR_TEXT } from "./types";
import { GROUPS, LAB_PASSWORD, identityOf, userExists } from "./users";

export interface Proc {
  pid: number;
  ppid: number;
  user: string;
  cpu: number;
  mem: number;
  vsz: number;
  rss: number;
  tty: string;
  stat: string;
  start: string;
  time: string;
  cmd: string;
}

/** Elenco di processi finti ma coerenti: ps, top e kill leggono la stessa lista. */
export function initialProcs(): Proc[] {
  const p = (pid: number, ppid: number, user: string, cpu: number, mem: number, vsz: number, rss: number, tty: string, stat: string, start: string, time: string, cmd: string): Proc => ({
    pid, ppid, user, cpu, mem, vsz, rss, tty, stat, start, time, cmd,
  });
  return [
    p(1, 0, "root", 0.0, 0.3, 167_600, 11_800, "?", "Ss", "Oct17", "0:04", "/sbin/init"),
    p(412, 1, "root", 0.0, 0.5, 69_800, 18_600, "?", "Ss", "Oct17", "0:01", "/lib/systemd/systemd-journald"),
    p(688, 1, "root", 0.0, 0.2, 15_400, 8_200, "?", "Ss", "Oct17", "0:00", "sshd: /usr/sbin/sshd -D [listener]"),
    p(701, 1, "root", 0.0, 0.1, 55_300, 5_100, "?", "Ss", "Oct17", "0:00", "nginx: master process /usr/sbin/nginx"),
    p(702, 701, "www-data", 0.1, 0.2, 56_000, 6_400, "?", "S", "Oct17", "0:02", "nginx: worker process"),
    p(1190, 688, "studente", 0.0, 0.2, 17_100, 9_000, "?", "S", "09:58", "0:00", "sshd: studente@pts/0"),
    p(1203, 1190, "studente", 0.0, 0.1, 8_900, 5_300, "pts/0", "Ss", "09:58", "0:00", "-bash"),
    p(2314, 1203, "studente", 92.4, 1.8, 245_000, 71_400, "pts/0", "R", "10:01", "7:42", "python3 lavoro_lungo.py"),
  ];
}

const pad = (n: number) => String(n).padStart(2, "0");
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(d: Date, fmt: string): string {
  const map: Record<string, string> = {
    Y: String(d.getUTCFullYear()),
    y: pad(d.getUTCFullYear() % 100),
    m: pad(d.getUTCMonth() + 1),
    d: pad(d.getUTCDate()),
    e: String(d.getUTCDate()).padStart(2, " "),
    H: pad(d.getUTCHours()),
    M: pad(d.getUTCMinutes()),
    S: pad(d.getUTCSeconds()),
    a: DAYS[d.getUTCDay()],
    A: FULL_DAYS[d.getUTCDay()],
    b: MONTHS[d.getUTCMonth()],
    B: FULL_MONTHS[d.getUTCMonth()],
    Z: "UTC",
    z: "+0000",
    s: String(Math.floor(d.getTime() / 1000)),
    F: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    T: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
    n: "\n",
    t: "\t",
    "%": "%",
  };
  return fmt.replace(/%(.)/g, (m, c: string) => (Object.hasOwn(map, c) ? map[c] : m));
}

const date: Cmd = (args, ctx) => {
  const now = ctx.sh.now();
  const fmtArg = args.find((a) => a.startsWith("+"));
  if (fmtArg) return ok(formatDate(now, fmtArg.slice(1)) + "\n");
  if (args.length) return fail(`date: invalid date '${args.join(" ")}'`);
  return ok(formatDate(now, "%a %b %e %H:%M:%S %Z %Y") + "\n");
};

const whoami: Cmd = (_a, ctx) => ok(ctx.id.name + "\n");

const idCmd: Cmd = (args, ctx) => {
  const o = parseOpts("id", args, { bool: "ugnG" });
  if (o.error) return fail(o.error);
  const name = o.rest[0];
  if (name !== undefined && !userExists(name)) return fail(`id: ‘${name}’: no such user`);
  const id = name ? identityOf(name)! : ctx.id;
  const gname = (g: string) => `${GROUPS[g]}(${g})`;
  if (o.flags.has("u")) return ok((o.flags.has("n") ? id.name : String(id.uid)) + "\n");
  if (o.flags.has("g")) return ok((o.flags.has("n") ? id.group : String(GROUPS[id.group])) + "\n");
  const groups = id.groups.map(gname).join(",");
  return ok(`uid=${id.uid}(${id.name}) gid=${gname(id.group)} groups=${groups}\n`);
};

const groupsCmd: Cmd = (args, ctx) => {
  if (args.length === 0) return ok(ctx.id.groups.join(" ") + "\n");
  let out = "";
  let err = "";
  for (const n of args) {
    const id = identityOf(n);
    if (!id) err += `groups: ‘${n}’: no such user\n`;
    else out += `${n} : ${id.groups.join(" ")}\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

const KERNEL = "6.8.0-45-generic";
const KVER = "#45-Ubuntu SMP PREEMPT_DYNAMIC Fri Aug 30 12:02:04 UTC 2024";

const uname: Cmd = (args) => {
  const o = parseOpts("uname", args, { bool: "asnrvmo" });
  if (o.error) return fail(o.error);
  if (o.flags.has("a")) return ok(`Linux lab ${KERNEL} ${KVER} x86_64 x86_64 x86_64 GNU/Linux\n`);
  const parts: string[] = [];
  if (o.flags.has("s") || o.flags.size === 0) parts.push("Linux");
  if (o.flags.has("n")) parts.push("lab");
  if (o.flags.has("r")) parts.push(KERNEL);
  if (o.flags.has("v")) parts.push(KVER);
  if (o.flags.has("m")) parts.push("x86_64");
  if (o.flags.has("o")) parts.push("GNU/Linux");
  return ok(parts.join(" ") + "\n");
};

const hostname: Cmd = () => ok("lab\n");

const env: Cmd = (_a, ctx) =>
  ok(
    [...ctx.sh.exported]
      .sort()
      .map((k) => `${k}=${ctx.sh.getVar(k) ?? ""}`)
      .join("\n") + "\n",
  );

const printenv: Cmd = (args, ctx) => {
  if (args.length === 0) return env(args, ctx);
  const v = ctx.sh.exported.has(args[0]) ? ctx.sh.getVar(args[0]) : undefined;
  return v === undefined ? { out: "", err: "", code: 1 } : ok(v + "\n");
};

const exportCmd: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  if (args.length === 0) {
    return ok([...sh.exported].sort().map((k) => `declare -x ${k}="${sh.getVar(k) ?? ""}"`).join("\n") + "\n");
  }
  let err = "";
  for (const a of args) {
    const m = /^([A-Za-z_]\w*)(?:=([\s\S]*))?$/.exec(a);
    if (!m) {
      err += `bash: export: \`${a}': not a valid identifier\n`;
      continue;
    }
    if (m[2] !== undefined) sh.setVar(m[1], m[2]);
    sh.exported.add(m[1]);
  }
  return { out: "", err, code: err ? 1 : 0 };
};

const unset: Cmd = (args, ctx) => {
  for (const a of args) {
    ctx.sh.vars.delete(a);
    ctx.sh.exported.delete(a);
  }
  return ok();
};

const history: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  if (args[0] === "-c") {
    sh.history.length = 0;
    return ok();
  }
  let from = 0;
  if (args[0] !== undefined) {
    if (!/^\d+$/.test(args[0])) return fail(`bash: history: ${args[0]}: numeric argument required`);
    from = Math.max(0, sh.history.length - Number(args[0]));
  }
  return ok(
    sh.history
      .map((l, i) => `${String(i + 1).padStart(5)}  ${l}`)
      .slice(from)
      .join("\n") + "\n",
  );
};

const clear: Cmd = (_a, ctx) => {
  ctx.sh.pendingClear = true;
  return ok();
};

const man: Cmd = (args) => {
  if (args.length === 0) return fail("What manual page do you want?\nFor example, try 'man man'.");
  let out = "";
  let err = "";
  for (const n of args) {
    if (Object.hasOwn(MAN, n)) out += renderMan(n, MAN[n]);
    else err += `No manual entry for ${n}\n`;
  }
  return { out, err, code: err ? 16 : 0 };
};

export const BUILTINS = new Set(["cd", "export", "unset", "history", "clear", "exit", "help", "man", "sudo", "test", "[", "[[", "true", "false", ":"]);

const help: Cmd = (_a, ctx) => {
  const names = ctx.sh.commandNames().filter((n) => n !== "[" && n !== "[[").sort();
  return ok(
    "Comandi disponibili nel simulatore:\n\n  " +
      names.join("  ") +
      "\n\nScrivi «man COMANDO» per il manuale in italiano, oppure «COMANDO --help».\nRedirezioni (> >> <), pipe (|), variabili ($VAR), caratteri jolly (* ?) e Tab per completare funzionano come in bash.\n",
  );
};

const exitCmd: Cmd = (args, ctx) => {
  if (ctx.sh.scriptDepth > 0) throw new ExitSignal(args[0] ? Number(args[0]) || 0 : ctx.sh.lastStatus);
  return ok("exit: questo è un simulatore, non c'è una sessione da chiudere. Usa il pulsante «Esci» in alto.\n");
};

export class ExitSignal extends Error {
  constructor(public code: number) {
    super("exit");
  }
}

const which: Cmd = (args, ctx) => {
  let out = "";
  let code = 0;
  for (const a of args) {
    if (ctx.sh.commandNames().includes(a) && !BUILTINS.has(a)) out += `/usr/bin/${a}\n`;
    else code = 1;
  }
  return { out, err: "", code };
};

const sleep: Cmd = (args) => {
  if (args.length === 0) return fail("sleep: missing operand\nTry 'sleep --help' for more information.");
  if (!/^\d+(\.\d+)?[smhd]?$/.test(args[0])) return fail(`sleep: invalid time interval ‘${args[0]}’`);
  return ok();
};

const uptime: Cmd = (_a, ctx) => ok(` ${formatDate(ctx.sh.now(), "%T")} up 3 days,  2:14,  1 user,  load average: 0.52, 0.31, 0.22\n`);

const sudo: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  if (args[0] === "-k") {
    sh.sudoAuthed = false;
    return ok();
  }
  if (args[0] === "-l") {
    return ok(`L'utente ${sh.user.name} può eseguire i seguenti comandi su lab:\n    (ALL : ALL) ALL\n`);
  }
  if (args.length === 0) return fail("usage: sudo [-k] [-l] command");
  if (["su", "-i", "-s"].includes(args[0])) {
    return fail("sudo: il simulatore non apre una shell da root. Metti «sudo» davanti a ogni singolo comando: è anche la pratica più sicura.");
  }
  if (!sh.user.groups.includes("sudo")) return fail(`${sh.user.name} is not in the sudoers file.`);
  let err = "";
  if (!sh.sudoAuthed) {
    sh.sudoAuthed = true;
    err = `[sudo] password for ${sh.user.name}: ********\n(password di laboratorio: ${LAB_PASSWORD}. In un computer vero non vedi nulla mentre la scrivi, e sudo la ricorda per qualche minuto.)\n`;
  }
  const r = sh.dispatch(args, { sudo: true, stdin: ctx.stdin });
  return { out: r.out, err: err + r.err, code: r.code };
};

// ---- processi -----------------------------------------------------------------------------------

const ps: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  const self: Proc = {
    pid: sh.takePid(),
    ppid: 1203,
    user: ctx.id.name,
    cpu: 0,
    mem: 0.1,
    vsz: 10_800,
    rss: 3_400,
    tty: "pts/0",
    stat: "R+",
    start: "10:05",
    time: "0:00",
    cmd: "ps " + args.join(" "),
  };
  const list = [...sh.procs, self].sort((a, b) => a.pid - b.pid);
  const a = args.join(" ");
  if (/(^|\s)-?[a-z]*(aux|ax|au)\b/.test(a)) {
    const rows = list.map((p) => `${p.user.padEnd(10).slice(0, 10)} ${String(p.pid).padStart(5)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${String(p.vsz).padStart(6)} ${String(p.rss).padStart(5)} ${p.tty.padEnd(8)} ${p.stat.padEnd(4)} ${p.start.padEnd(5)} ${p.time.padStart(5)} ${p.cmd}`);
    return ok(`USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START  TIME COMMAND\n${rows.join("\n")}\n`);
  }
  if (/(^|\s)-(ef|e|A|eF|ed)\b/.test(a)) {
    const rows = list.map((p) => `${p.user.padEnd(8).slice(0, 8)} ${String(p.pid).padStart(7)} ${String(p.ppid).padStart(7)}  ${p.cpu > 50 ? 9 : 0} ${p.start.padEnd(5)} ${p.tty.padEnd(8)} ${p.time.padStart(8)} ${p.cmd}`);
    return ok(`UID          PID    PPID  C STIME TTY          TIME CMD\n${rows.join("\n")}\n`);
  }
  const mine = list.filter((p) => p.tty === "pts/0" && p.user === sh.user.name);
  const hms = (t: string) => { const [m, sec] = t.split(":"); return `00:${m.padStart(2, "0")}:${sec}`; };
  const rows = mine.map((p) => `${String(p.pid).padStart(7)} ${p.tty.padEnd(8)} ${hms(p.time)} ${p.cmd.split(" ")[0].replace(/^-/, "")}`);
  return ok(`    PID TTY          TIME CMD\n${rows.join("\n")}\n`);
};

const top: Cmd = (_a, ctx) => {
  const sh = ctx.sh;
  const list = [...sh.procs].sort((a, b) => b.cpu - a.cpu);
  const running = list.filter((p) => p.stat.startsWith("R")).length;
  const rows = list.map((p) => `${String(p.pid).padStart(7)} ${p.user.padEnd(9).slice(0, 9)} 20   0 ${String(p.vsz).padStart(7)} ${String(p.rss).padStart(6)} ${String(Math.floor(p.rss / 3)).padStart(6)} ${p.stat[0]} ${p.cpu.toFixed(1).padStart(5)} ${p.mem.toFixed(1).padStart(5)} ${p.time.padStart(9)}.00 ${p.cmd.split(" ")[0].replace(/^-/, "")}`);
  const totalCpu = Math.min(100, list.reduce((s, p) => s + p.cpu, 0));
  return ok(
    [
      `top - ${formatDate(sh.now(), "%T")} up 3 days,  2:14,  1 user,  load average: ${(totalCpu / 40).toFixed(2)}, 0.31, 0.22`,
      `Tasks: ${String(list.length).padStart(3)} total, ${String(running).padStart(3)} running, ${String(list.length - running).padStart(3)} sleeping,   0 stopped,   0 zombie`,
      `%Cpu(s): ${totalCpu.toFixed(1)} us,  1.2 sy,  0.0 ni, ${(100 - totalCpu - 1.2 > 0 ? 100 - totalCpu - 1.2 : 0).toFixed(1)} id,  0.0 wa`,
      "MiB Mem :   3924.0 total,   2210.5 free,    812.3 used,    901.2 buff/cache",
      "",
      "    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM      TIME+ COMMAND",
      ...rows,
      "",
      "(istantanea: il vero top si aggiorna ogni secondo e si chiude con q)",
    ].join("\n") + "\n",
  );
};

const SIGNALS: Record<string, number> = { HUP: 1, INT: 2, KILL: 9, TERM: 15, STOP: 19, CONT: 18 };

const kill: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  const pids: string[] = [];
  let signal = 15;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-s" && args[i + 1]) {
      const s = args[++i].replace(/^SIG/, "");
      if (!Object.hasOwn(SIGNALS, s) && !/^\d+$/.test(s)) return fail(`bash: kill: ${s}: invalid signal specification`);
      signal = /^\d+$/.test(s) ? Number(s) : SIGNALS[s];
    } else if (/^-\d+$/.test(a)) signal = Number(a.slice(1));
    else if (/^-[A-Z]+$/.test(a)) {
      const s = a.slice(1).replace(/^SIG/, "");
      if (!Object.hasOwn(SIGNALS, s)) return fail(`bash: kill: ${a.slice(1)}: invalid signal specification`);
      signal = SIGNALS[s];
    } else pids.push(a);
  }
  if (pids.length === 0) return fail("kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]");
  let err = "";
  for (const p of pids) {
    if (!/^\d+$/.test(p)) {
      err += `bash: kill: ${p}: arguments must be process or job IDs\n`;
      continue;
    }
    const pid = Number(p);
    const idx = sh.procs.findIndex((x) => x.pid === pid);
    if (idx === -1) {
      err += `bash: kill: (${pid}) - No such process\n`;
      continue;
    }
    const proc = sh.procs[idx];
    if (proc.user !== ctx.id.name && ctx.id.uid !== 0) {
      err += `bash: kill: (${pid}) - Operation not permitted\n`;
      continue;
    }
    if (pid === 1 || pid === 1203 || pid === 1190) {
      err += `bash: kill: (${pid}) - il processo ${pid} tiene in piedi il sistema o la tua sessione: nel laboratorio non si può chiudere\n`;
      continue;
    }
    if (signal === 18 || signal === 19 || signal === 0) continue;
    sh.procs.splice(idx, 1);
  }
  return { out: "", err, code: err ? 1 : 0 };
};

// ---- apt ----------------------------------------------------------------------------------------

const PACKAGES: Record<string, string> = {
  tree: "mostra le cartelle come un albero",
  htop: "monitor dei processi a colori",
  cowsay: "una mucca che parla",
  nmap: "scanner di rete",
  curl: "scarica pagine web dalla riga di comando",
  wget: "scarica file",
  git: "controllo di versione",
  vim: "editor di testo avanzato",
  "net-tools": "ifconfig, netstat e simili",
  python3: "il linguaggio Python",
  tcpdump: "cattura il traffico di rete",
  whois: "informazioni sui domini",
};

const apt: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  const sub = args.find((a) => !a.startsWith("-"));
  const pkgs = args.filter((a) => !a.startsWith("-")).slice(1);
  if (!sub) return ok("apt 2.7.14 (amd64)\nUso: apt [opzioni] comando\n\nComandi utili: update, upgrade, install, remove, list, search, show\n(simulatore: nulla viene scaricato davvero)\n");
  if (["list", "search", "show"].includes(sub)) {
    if (sub === "list") {
      const names = [...sh.installed].sort();
      return ok("Listing... Done\n" + names.map((n) => `${n}/noble,now 1.0 amd64 [installed]`).join("\n") + "\n");
    }
    if (sub === "search") {
      const q = pkgs[0] ?? "";
      const hits = Object.entries(PACKAGES).filter(([n, d]) => n.includes(q) || d.includes(q));
      return ok("Sorting... Done\n" + hits.map(([n, d]) => `${n}/noble 1.0 amd64\n  ${d}\n`).join("\n"));
    }
    const p = pkgs[0];
    if (!p || !Object.hasOwn(PACKAGES, p)) return fail(`E: No packages found${p ? ` for '${p}'` : ""}`);
    return ok(`Package: ${p}\nVersion: 1.0\nDescription: ${PACKAGES[p]}\n`);
  }
  if (!["update", "upgrade", "install", "remove", "purge", "autoremove"].includes(sub)) return fail(`E: Invalid operation ${sub}`);
  if (ctx.id.uid !== 0) {
    return fail(
      "E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?\nSuggerimento: installare e aggiornare programmi cambia il sistema, quindi serve sudo (per esempio: sudo apt " + sub + ").",
      100,
    );
  }
  if (sub === "update") {
    return ok("Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nGet:2 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]\nFetched 126 kB in 1s (210 kB/s)\nReading package lists... Done\nBuilding dependency tree... Done\nAll packages are up to date.\n(simulazione: nessun dato è stato scaricato)\n");
  }
  if (sub === "upgrade" || sub === "autoremove") return ok("Reading package lists... Done\nBuilding dependency tree... Done\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.\n");
  if (pkgs.length === 0) return fail("E: Nessun pacchetto indicato");
  let out = "Reading package lists... Done\n";
  let err = "";
  for (const p of pkgs) {
    if (!Object.hasOwn(PACKAGES, p) && !sh.installed.has(p)) {
      err += `E: Unable to locate package ${p}\n`;
      continue;
    }
    if (sub === "install") {
      if (sh.installed.has(p)) out += `${p} is already the newest version (1.0).\n`;
      else {
        sh.installed.add(p);
        out += `The following NEW packages will be installed:\n  ${p}\nSetting up ${p} (1.0) ...\n(simulazione: nel laboratorio il programma non viene davvero installato)\n`;
      }
    } else if (sh.installed.has(p)) {
      sh.installed.delete(p);
      out += `Removing ${p} (1.0) ...\n`;
    } else out += `Package '${p}' is not installed, so not removed\n`;
  }
  return { out, err, code: err ? 100 : 0 };
};

// ---- editor ------------------------------------------------------------------------------------

export interface EditorRequest {
  path: string;
  display: string;
  content: string;
  readOnly: boolean;
  asRoot: boolean;
  isNew: boolean;
}

const nano: Cmd = (args, ctx) => {
  const files = args.filter((a) => !a.startsWith("-"));
  if (files.length === 0) return fail("nano: nel simulatore indica il file da aprire, per esempio: nano appunti.txt");
  const f = files[0];
  const abs = ctx.sh.abs(f);
  const r = ctx.sh.fs.lookup(abs, ctx.id);
  let content = "";
  let readOnly = false;
  let isNew = false;
  if (r.node) {
    if (r.node.kind === "dir") return fail(`Error reading ${f}: ${ERR_TEXT.EISDIR}`);
    if (!hasPerm(r.node, ctx.id, "r")) return fail(`Error reading ${f}: ${ERR_TEXT.EACCES}`);
    content = r.node.content;
    readOnly = !hasPerm(r.node, ctx.id, "w");
  } else if (r.err === "ENOENT") isNew = true;
  else return fail(`Error reading ${f}: ${errText(r.err)}`);
  ctx.sh.pendingEditor = { path: abs, display: f, content, readOnly, asRoot: ctx.id.uid === 0, isNew };
  return ok();
};

// ---- script e test --------------------------------------------------------------------------------

const scriptRunner =
  (name: string): Cmd =>
  (args, ctx) => {
    const f = args.find((a) => !a.startsWith("-"));
    if (!f) return fail(`${name}: nel simulatore indica uno script, per esempio: ${name} saluto.sh`);
    const rest = args.slice(args.indexOf(f) + 1);
    return ctx.sh.runScript(ctx.sh.abs(f), f, rest, ctx.id, ctx.stdin, false);
  };

function evalTest(args: string[], ctx: Ctx): boolean | string {
  if (args.length === 0) return false;
  if (args[0] === "!") {
    const r = evalTest(args.slice(1), ctx);
    return typeof r === "string" ? r : !r;
  }
  if (args.length === 1) return args[0] !== "";
  if (args.length === 2) {
    const [op, v] = args;
    if (op === "-z") return v === "";
    if (op === "-n") return v !== "";
    const node = ctx.sh.fs.lookup(ctx.sh.abs(v), ctx.id).node;
    switch (op) {
      case "-e": return !!node;
      case "-f": return node?.kind === "file";
      case "-d": return node?.kind === "dir";
      case "-s": return node?.kind === "file" ? node.content.length > 0 : false;
      case "-r": return !!node && hasPerm(node, ctx.id, "r");
      case "-w": return !!node && hasPerm(node, ctx.id, "w");
      case "-x": return !!node && hasPerm(node, ctx.id, "x");
      default: return `unary operator expected: ${op}`;
    }
  }
  if (args.length === 3) {
    const [a, op, b] = args;
    if (op === "=" || op === "==") return a === b;
    if (op === "!=") return a !== b;
    const x = Number(a);
    const y = Number(b);
    if (["-eq", "-ne", "-lt", "-le", "-gt", "-ge"].includes(op)) {
      if (!Number.isInteger(x)) return `${a}: integer expression expected`;
      if (!Number.isInteger(y)) return `${b}: integer expression expected`;
      return op === "-eq" ? x === y : op === "-ne" ? x !== y : op === "-lt" ? x < y : op === "-le" ? x <= y : op === "-gt" ? x > y : x >= y;
    }
    return `binary operator expected: ${op}`;
  }
  return "too many arguments";
}

const testBuiltin =
  (close: string | null, label: string): Cmd =>
  (args, ctx) => {
    let a = args;
    if (close) {
      if (args[args.length - 1] !== close) return fail(`bash: ${label}: missing \`${close}'`, 2);
      a = args.slice(0, -1);
    }
    const r = evalTest(a, ctx);
    if (typeof r === "string") return fail(`bash: ${label}: ${r}`, 2);
    return { out: "", err: "", code: r ? 0 : 1 };
  };

const trueCmd: Cmd = () => ok();
const falseCmd: Cmd = () => ({ out: "", err: "", code: 1 });

export const SYS_COMMANDS: Record<string, Cmd> = {
  date,
  whoami,
  id: idCmd,
  groups: groupsCmd,
  uname,
  hostname,
  env,
  printenv,
  export: exportCmd,
  unset,
  history,
  clear,
  man,
  help,
  exit: exitCmd,
  which,
  sleep,
  uptime,
  sudo,
  ps,
  top,
  kill,
  apt,
  "apt-get": apt,
  nano,
  bash: scriptRunner("bash"),
  sh: scriptRunner("sh"),
  test: testBuiltin(null, "test"),
  "[": testBuiltin("]", "["),
  "[[": testBuiltin("]]", "[["),
  true: trueCmd,
  false: falseCmd,
  ":": trueCmd,
};

