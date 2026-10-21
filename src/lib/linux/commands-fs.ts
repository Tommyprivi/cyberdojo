import { byteSize, compareNames, sortedNames } from "./fs";
import { errText, fail, humanSize, isProtectedPath, joinLines, ok, parseOpts, splitLines, type Cmd } from "./cmd-utils";
import { globMatch } from "./glob";
import { basename, dirname, isInside, joinPath, normalize } from "./path";
import { applyChmod, hasPerm, modeString } from "./perms";
import { ERR_TEXT, type DirNode, type FsNode, type Identity } from "./types";
import { groupExists, identityOf, userExists } from "./users";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function lsDate(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, " ")} ${hh}:${mm}`;
}

type Entry = { name: string; node: FsNode };

function nodeSize(n: FsNode): number {
  return n.kind === "dir" ? 4096 : byteSize(n.content);
}

function nodeBlocks(n: FsNode): number {
  return n.kind === "dir" ? 4 : Math.ceil(byteSize(n.content) / 4096) * 4;
}

function longLines(entries: Entry[], human: boolean): string[] {
  const rows = entries.map(({ name, node }) => ({
    perm: modeString(node),
    links: String(node.kind === "dir" ? 2 + Object.values(node.children).filter((c) => c.kind === "dir").length : 1),
    owner: node.owner,
    group: node.group,
    size: human ? humanSize(nodeSize(node)) : String(nodeSize(node)),
    date: lsDate(node.mtime),
    name,
  }));
  const w = (k: "links" | "owner" | "group" | "size") => Math.max(0, ...rows.map((r) => r[k].length));
  const wl = w("links");
  const wo = w("owner");
  const wg = w("group");
  const ws = w("size");
  return rows.map(
    (r) => `${r.perm} ${r.links.padStart(wl)} ${r.owner.padEnd(wo)} ${r.group.padEnd(wg)} ${r.size.padStart(ws)} ${r.date} ${r.name}`,
  );
}

const ls: Cmd = (args, ctx) => {
  const o = parseOpts("ls", args, {
    bool: "laRh1dr",
    long: { all: "a", "human-readable": "h", recursive: "R", directory: "d", reverse: "r" },
  });
  if (o.error) return fail(o.error, 2);
  const long = o.flags.has("l");
  const all = o.flags.has("a");
  const human = o.flags.has("h");
  const rev = o.flags.has("r");
  const single = o.flags.has("1");
  const rec = o.flags.has("R");
  const targets = o.rest.length ? o.rest : ["."];
  let err = "";
  let code = 0;

  const order = (names: string[]) => (rev ? names.reverse() : names);

  const renderDir = (abs: string, display: string, node: DirNode): { text: string; err: string } => {
    if (!hasPerm(node, ctx.id, "r")) return { text: "", err: `ls: cannot open directory '${display}': Permission denied\n` };
    const names = sortedNames(node).filter((n) => all || !n.startsWith("."));
    const entries: Entry[] = [];
    if (all) {
      const parent = ctx.sh.fs.lookup(dirname(abs)).node ?? node;
      entries.push({ name: ".", node }, { name: "..", node: parent });
    }
    for (const n of names) entries.push({ name: n, node: node.children[n] });
    if (rev) entries.reverse();
    let text: string;
    if (long) {
      const blocks = entries.reduce((s, e) => s + nodeBlocks(e.node), 0);
      text = `total ${human ? humanSize(blocks * 1024) : blocks}\n` + joinLines(longLines(entries, human));
    } else if (single) text = joinLines(entries.map((e) => e.name));
    else text = entries.length ? entries.map((e) => e.name).join("  ") + "\n" : "";
    let errs = "";
    if (rec) {
      for (const n of order(names.slice())) {
        const child = node.children[n];
        if (child.kind !== "dir") continue;
        const sub = renderDir(joinPath(abs, n), `${display}/${n}`, child);
        text += `\n${display}/${n}:\n` + sub.text;
        errs += sub.err;
      }
    }
    return { text, err: errs };
  };

  const fileEntries: Entry[] = [];
  const dirs: { arg: string; abs: string; node: DirNode }[] = [];
  for (const t of targets) {
    const abs = ctx.sh.abs(t);
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (!r.node) {
      err += `ls: cannot access '${t}': ${errText(r.err)}\n`;
      code = 2;
      continue;
    }
    if (r.node.kind === "dir" && !o.flags.has("d")) dirs.push({ arg: t, abs, node: r.node });
    else fileEntries.push({ name: t, node: r.node });
  }
  const sections: string[] = [];
  if (fileEntries.length) {
    fileEntries.sort((a, b) => compareNames(a.name, b.name));
    const list = long ? joinLines(longLines(fileEntries, human)) : single ? joinLines(fileEntries.map((e) => e.name)) : fileEntries.map((e) => e.name).join("  ") + "\n";
    sections.push(list);
  }
  dirs.sort((a, b) => compareNames(a.arg, b.arg));
  for (const d of dirs) {
    const r = renderDir(d.abs, d.arg, d.node);
    err += r.err;
    if (r.err) code = 2;
    const header = targets.length > 1 || rec ? `${d.arg}:\n` : "";
    if (r.err && r.text === "" && !header) continue;
    sections.push(header + r.text);
  }
  return { out: sections.join("\n"), err, code };
};

const pwd: Cmd = (_a, ctx) => ok(ctx.sh.cwd + "\n");

const cd: Cmd = (args, ctx) => {
  const sh = ctx.sh;
  if (args.length > 1) return fail("bash: cd: too many arguments");
  let target = args[0] ?? "~";
  let echoPath = false;
  if (target === "-") {
    if (!sh.oldpwd) return fail("bash: cd: OLDPWD not set");
    target = sh.oldpwd;
    echoPath = true;
  }
  if (target === "~") target = sh.home;
  else if (target.startsWith("~/")) target = sh.home + target.slice(1);
  const abs = normalize(target, sh.cwd);
  const r = sh.fs.lookup(abs, ctx.id);
  if (!r.node) return fail(`bash: cd: ${args[0] ?? target}: ${errText(r.err)}`);
  if (r.node.kind !== "dir") return fail(`bash: cd: ${args[0]}: Not a directory`);
  if (!hasPerm(r.node, ctx.id, "x")) return fail(`bash: cd: ${args[0] ?? target}: Permission denied`);
  sh.setCwd(abs);
  return ok(echoPath ? abs + "\n" : "");
};

const cat: Cmd = (args, ctx) => {
  const o = parseOpts("cat", args, { bool: "n", long: { number: "n" } });
  if (o.error) return fail(o.error);
  const files = o.rest.length ? o.rest : ["-"];
  let out = "";
  let err = "";
  let code = 0;
  for (const f of files) {
    let content: string;
    if (f === "-") content = ctx.stdin ?? "";
    else {
      const r = ctx.sh.fs.readFile(ctx.sh.abs(f), ctx.id);
      if ("err" in r) {
        err += `cat: ${f}: ${errText(r.err)}\n`;
        code = 1;
        continue;
      }
      content = r.content;
    }
    out += content;
    if (content !== "" && !content.endsWith("\n") && files.length > 1) out += "";
  }
  if (o.flags.has("n")) {
    let n = 0;
    out = splitLines(out)
      .map((l) => `${String(++n).padStart(6)}\t${l}`)
      .join("\n");
    if (out) out += "\n";
  }
  return { out, err, code };
};

const mkdir: Cmd = (args, ctx) => {
  const o = parseOpts("mkdir", args, { bool: "p", long: { parents: "p" } });
  if (o.error) return fail(o.error);
  if (o.rest.length === 0) return fail("mkdir: missing operand\nTry 'mkdir --help' for more information.");
  let err = "";
  const now = ctx.sh.nowMs();
  for (const d of o.rest) {
    const abs = ctx.sh.abs(d);
    const e = o.flags.has("p") ? ctx.sh.fs.mkdirp(abs, ctx.id, now) : ctx.sh.fs.mkdir(abs, ctx.id, now);
    if (e) err += `mkdir: cannot create directory '${d}': ${ERR_TEXT[e]}\n`;
  }
  return { out: "", err, code: err ? 1 : 0 };
};

const touch: Cmd = (args, ctx) => {
  const o = parseOpts("touch", args, { bool: "c" });
  if (o.error) return fail(o.error);
  if (o.rest.length === 0) return fail("touch: missing file operand\nTry 'touch --help' for more information.");
  let err = "";
  const now = ctx.sh.nowMs();
  for (const f of o.rest) {
    const abs = ctx.sh.abs(f);
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (r.node) {
      if (!hasPerm(r.node, ctx.id, "w") && r.node.owner !== ctx.id.name && ctx.id.uid !== 0) err += `touch: cannot touch '${f}': Permission denied\n`;
      else r.node.mtime = now;
    } else if (r.err === "ENOENT") {
      if (o.flags.has("c")) continue;
      const e = ctx.sh.fs.writeFile(abs, "", ctx.id, now);
      if (e) err += `touch: cannot touch '${f}': ${ERR_TEXT[e]}\n`;
    } else err += `touch: cannot touch '${f}': ${ERR_TEXT[r.err]}\n`;
  }
  return { out: "", err, code: err ? 1 : 0 };
};

/** Copia profonda: i nuovi nodi appartengono a chi copia. */
function cloneFor(node: FsNode, id: Identity, now: number): FsNode {
  const c = structuredClone(node);
  const walk = (n: FsNode) => {
    n.owner = id.name;
    n.group = id.group;
    n.mtime = now;
    if (n.kind === "dir") Object.values(n.children).forEach(walk);
  };
  walk(c);
  return c;
}

function readableTree(node: FsNode, id: Identity): boolean {
  if (!hasPerm(node, id, "r")) return false;
  if (node.kind === "dir") {
    if (!hasPerm(node, id, "x")) return false;
    return Object.values(node.children).every((c) => readableTree(c, id));
  }
  return true;
}

const cp: Cmd = (args, ctx) => {
  const o = parseOpts("cp", args, { bool: "rRav", long: { recursive: "r" } });
  if (o.error) return fail(o.error);
  const recursive = o.flags.has("r") || o.flags.has("R") || o.flags.has("a");
  if (o.rest.length < 2) {
    return fail(o.rest.length === 0 ? "cp: missing file operand\nTry 'cp --help' for more information." : `cp: missing destination file operand after '${o.rest[0]}'\nTry 'cp --help' for more information.`);
  }
  const destArg = o.rest[o.rest.length - 1];
  const sources = o.rest.slice(0, -1);
  const destAbs = ctx.sh.abs(destArg);
  const destNode = ctx.sh.fs.lookup(destAbs, ctx.id).node;
  const destIsDir = destNode?.kind === "dir";
  if (sources.length > 1 && !destIsDir) return fail(`cp: target '${destArg}' is not a directory`);
  const now = ctx.sh.nowMs();
  let err = "";
  let out = "";
  for (const s of sources) {
    const srcAbs = ctx.sh.abs(s);
    const r = ctx.sh.fs.lookup(srcAbs, ctx.id);
    if (!r.node) {
      err += `cp: cannot stat '${s}': ${ERR_TEXT[r.err]}\n`;
      continue;
    }
    if (r.node.kind === "dir" && !recursive) {
      err += `cp: -r not specified; omitting directory '${s}'\n`;
      continue;
    }
    const target = destIsDir ? joinPath(destAbs, basename(srcAbs)) : destAbs;
    if (target === srcAbs) {
      err += `cp: '${s}' and '${destIsDir ? joinPath(destArg.replace(/\/$/, ""), basename(srcAbs)) : destArg}' are the same file\n`;
      continue;
    }
    if (r.node.kind === "dir" && isInside(target, srcAbs)) {
      err += `cp: cannot copy a directory, '${s}', into itself, '${destArg}'\n`;
      continue;
    }
    if (!readableTree(r.node, ctx.id)) {
      err += `cp: cannot open '${s}' for reading: Permission denied\n`;
      continue;
    }
    const existing = ctx.sh.fs.lookup(target, ctx.id).node;
    if (existing && existing.kind === "dir" && r.node.kind === "file") {
      err += `cp: cannot overwrite directory '${destArg}' with non-directory\n`;
      continue;
    }
    if (existing && existing.kind === "file" && r.node.kind === "dir") {
      err += `cp: cannot overwrite non-directory '${destArg}' with directory '${s}'\n`;
      continue;
    }
    if (existing && existing.kind === "file" && r.node.kind === "file") {
      const e = ctx.sh.fs.writeFile(target, r.node.content, ctx.id, now);
      if (e) err += `cp: cannot create regular file '${destArg}': ${ERR_TEXT[e]}\n`;
      continue;
    }
    const e = ctx.sh.fs.insert(target, cloneFor(r.node, ctx.id, now), ctx.id, now);
    if (e) err += `cp: cannot create ${r.node.kind === "dir" ? "directory" : "regular file"} '${destIsDir ? joinPath(destArg.replace(/\/$/, ""), basename(srcAbs)) : destArg}': ${ERR_TEXT[e]}\n`;
    else if (o.flags.has("v")) out += `'${s}' -> '${destArg}'\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

const PROTECT_MSG = (cmd: string, arg: string) =>
  `${cmd}: operazione bloccata su '${arg}': è un percorso di sistema (o la tua intera home). In un Linux vero potresti rompere il computer: nel laboratorio è vietato.\n`;

const mv: Cmd = (args, ctx) => {
  const o = parseOpts("mv", args, { bool: "fiv" });
  if (o.error) return fail(o.error);
  if (o.rest.length < 2) {
    return fail(o.rest.length === 0 ? "mv: missing file operand\nTry 'mv --help' for more information." : `mv: missing destination file operand after '${o.rest[0]}'\nTry 'mv --help' for more information.`);
  }
  const destArg = o.rest[o.rest.length - 1];
  const sources = o.rest.slice(0, -1);
  const destAbs = ctx.sh.abs(destArg);
  const destNode = ctx.sh.fs.lookup(destAbs, ctx.id).node;
  const destIsDir = destNode?.kind === "dir";
  if (sources.length > 1 && !destIsDir) return fail(`mv: target '${destArg}' is not a directory`);
  const now = ctx.sh.nowMs();
  let err = "";
  for (const s of sources) {
    const srcAbs = ctx.sh.abs(s);
    const r = ctx.sh.fs.lookup(srcAbs, ctx.id);
    if (!r.node) {
      err += `mv: cannot stat '${s}': ${ERR_TEXT[r.err]}\n`;
      continue;
    }
    if (isProtectedPath(srcAbs)) {
      err += PROTECT_MSG("mv", s);
      continue;
    }
    const target = destIsDir ? joinPath(destAbs, basename(srcAbs)) : destAbs;
    if (target === srcAbs) {
      err += `mv: '${s}' and '${destArg}' are the same file\n`;
      continue;
    }
    if (r.node.kind === "dir" && isInside(target, srcAbs)) {
      err += `mv: cannot move '${s}' to a subdirectory of itself, '${destArg}'\n`;
      continue;
    }
    const existing = ctx.sh.fs.lookup(target, ctx.id).node;
    if (existing && existing.kind === "dir" && r.node.kind === "file") {
      err += `mv: cannot overwrite directory '${destArg}' with non-directory\n`;
      continue;
    }
    if (existing && existing.kind === "file" && r.node.kind === "dir") {
      err += `mv: cannot overwrite non-directory '${destArg}' with directory '${s}'\n`;
      continue;
    }
    if (existing && existing.kind === "dir" && Object.keys(existing.children).length > 0) {
      err += `mv: cannot overwrite '${destArg}': Directory not empty\n`;
      continue;
    }
    const e1 = ctx.sh.fs.detach(srcAbs, ctx.id, now);
    if (e1) {
      err += `mv: cannot move '${s}' to '${destArg}': ${ERR_TEXT[e1]}\n`;
      continue;
    }
    const e2 = ctx.sh.fs.insert(target, r.node, ctx.id, now);
    if (e2) {
      ctx.sh.fs.insert(srcAbs, r.node, identityOf("root")!, now);
      err += `mv: cannot move '${s}' to '${destArg}': ${ERR_TEXT[e2]}\n`;
    }
  }
  return { out: "", err, code: err ? 1 : 0 };
};

const rm: Cmd = (args, ctx) => {
  const o = parseOpts("rm", args, { bool: "rRfv", long: { recursive: "r", force: "f" } });
  if (o.error) return fail(o.error);
  const recursive = o.flags.has("r") || o.flags.has("R");
  const force = o.flags.has("f");
  if (o.rest.length === 0) {
    return force ? ok() : fail("rm: missing operand\nTry 'rm --help' for more information.");
  }
  const now = ctx.sh.nowMs();
  let err = "";
  let out = "";
  for (const f of o.rest) {
    const b = f.replace(/\/+$/, "").split("/").pop();
    if (b === "." || b === "..") {
      err += `rm: refusing to remove '.' or '..' directory: skipping '${f}'\n`;
      continue;
    }
    const abs = ctx.sh.abs(f);
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (!r.node) {
      if (!(force && r.err === "ENOENT")) err += `rm: cannot remove '${f}': ${ERR_TEXT[r.err]}\n`;
      continue;
    }
    if (isProtectedPath(abs)) {
      err += PROTECT_MSG("rm", f);
      continue;
    }
    const e = ctx.sh.fs.remove(abs, ctx.id, { recursive, now });
    if (e) {
      err += `rm: cannot remove '${f}': ${ERR_TEXT[e]}\n`;
      continue;
    }
    if (o.flags.has("v")) out += `removed '${f}'\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

const rmdir: Cmd = (args, ctx) => {
  const o = parseOpts("rmdir", args, {});
  if (o.error) return fail(o.error);
  if (o.rest.length === 0) return fail("rmdir: missing operand\nTry 'rmdir --help' for more information.");
  let err = "";
  for (const d of o.rest) {
    const abs = ctx.sh.abs(d);
    if (isProtectedPath(abs)) {
      err += PROTECT_MSG("rmdir", d);
      continue;
    }
    const e = ctx.sh.fs.rmdir(abs, ctx.id, ctx.sh.nowMs());
    if (e) err += `rmdir: failed to remove '${d}': ${ERR_TEXT[e]}\n`;
  }
  return { out: "", err, code: err ? 1 : 0 };
};

function applyRecursive(node: FsNode, fn: (n: FsNode) => void) {
  fn(node);
  if (node.kind === "dir") Object.values(node.children).forEach((c) => applyRecursive(c, fn));
}

const chmod: Cmd = (args, ctx) => {
  // «-x» è un modo valido (toglie x): si riconosce a mano invece di usare parseOpts.
  let recursive = false;
  const rest: string[] = [];
  let modeSpec: string | null = null;
  const MODE_RE = /^([0-7]{1,4}|[ugoa]*[-+=][rwxX]*(,[ugoa]*[-+=][rwxX]*)*)$/;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      rest.push(...args.slice(i + 1));
      break;
    }
    if (a === "-R" || a === "--recursive") recursive = true;
    else if (modeSpec === null && MODE_RE.test(a)) modeSpec = a;
    else if (modeSpec === null && a.startsWith("-") && a.length > 1) {
      return fail(`chmod: invalid option -- '${a[1]}'
Try 'chmod --help' for more information.`);
    } else rest.push(a);
  }
  if (modeSpec === null) {
    if (rest.length === 0) return fail("chmod: missing operand\nTry 'chmod --help' for more information.");
    modeSpec = rest.shift()!;
  }
  if (rest.length === 0) return fail(`chmod: missing operand after '${modeSpec}'\nTry 'chmod --help' for more information.`);
  let err = "";
  let valid = true;
  for (const f of rest) {
    const abs = ctx.sh.abs(f);
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (!r.node) {
      err += `chmod: cannot access '${f}': ${ERR_TEXT[r.err]}\n`;
      continue;
    }
    if (applyChmod(modeSpec, r.node.mode, r.node.kind === "dir") === null) {
      valid = false;
      err += `chmod: invalid mode: '${modeSpec}'\nTry 'chmod --help' for more information.\n`;
      break;
    }
    if (ctx.id.uid !== 0 && r.node.owner !== ctx.id.name) {
      err += `chmod: changing permissions of '${f}': Operation not permitted\n`;
      continue;
    }
    const nodes: FsNode[] = [];
    if (recursive) applyRecursive(r.node, (n) => nodes.push(n));
    else nodes.push(r.node);
    for (const n of nodes) n.mode = applyChmod(modeSpec, n.mode, n.kind === "dir") ?? n.mode;
  }
  return { out: "", err, code: err || !valid ? 1 : 0 };
};

function chownLike(cmd: "chown" | "chgrp"): Cmd {
  return (args, ctx) => {
    const o = parseOpts(cmd, args, { bool: "R", long: { recursive: "R" } });
    if (o.error) return fail(o.error);
    if (o.rest.length < 2) {
      return fail(o.rest.length === 0 ? `${cmd}: missing operand\nTry '${cmd} --help' for more information.` : `${cmd}: missing operand after '${o.rest[0]}'\nTry '${cmd} --help' for more information.`);
    }
    const spec = o.rest[0];
    let owner: string | null = null;
    let group: string | null = null;
    if (cmd === "chgrp") group = spec;
    else {
      const [u, g] = spec.split(":");
      owner = u === "" ? null : u;
      group = g === undefined || g === "" ? null : g;
    }
    if (owner !== null && !userExists(owner)) return fail(`${cmd}: invalid user: '${spec}'`);
    if (group !== null && !groupExists(group)) return fail(`${cmd}: invalid group: '${spec}'`);
    let err = "";
    for (const f of o.rest.slice(1)) {
      const r = ctx.sh.fs.lookup(ctx.sh.abs(f), ctx.id);
      if (!r.node) {
        err += `${cmd}: cannot access '${f}': ${ERR_TEXT[r.err]}\n`;
        continue;
      }
      if (ctx.id.uid !== 0) {
        err += `${cmd}: changing ${cmd === "chgrp" ? "group" : "ownership"} of '${f}': Operation not permitted\n`;
        continue;
      }
      const apply = (n: FsNode) => {
        if (owner !== null) n.owner = owner;
        if (group !== null) n.group = group;
      };
      if (o.flags.has("R")) applyRecursive(r.node, apply);
      else apply(r.node);
    }
    return { out: "", err, code: err ? 1 : 0 };
  };
}

/** Quante righe: «5», «+3» (solo tail). */
function parseCount(cmd: string, v: string | undefined, allowPlus: boolean): { n: number; from: boolean } | string {
  if (v === undefined) return { n: 10, from: false };
  const m = /^(\+?)(\d+)$/.exec(v);
  if (!m || (m[1] === "+" && !allowPlus)) return `${cmd}: invalid number of lines: '${v}'`;
  return { n: Number(m[2]), from: m[1] === "+" };
}

function headTail(cmd: "head" | "tail"): Cmd {
  return (args, ctx) => {
    const o = parseOpts(cmd, args, { bool: cmd === "tail" ? "f" : "", val: "n", long: { lines: "n" }, numeric: true });
    if (o.error) return fail(o.error);
    const cnt = parseCount(cmd, o.vals.n, cmd === "tail");
    if (typeof cnt === "string") return fail(cnt);
    const files = o.rest.length ? o.rest : ["-"];
    let out = "";
    let err = "";
    files.forEach((f, idx) => {
      let content: string;
      if (f === "-") content = ctx.stdin ?? "";
      else {
        const r = ctx.sh.fs.readFile(ctx.sh.abs(f), ctx.id);
        if ("err" in r) {
          err += r.err === "EISDIR" ? `${cmd}: error reading '${f}': Is a directory\n` : `${cmd}: cannot open '${f}' for reading: ${ERR_TEXT[r.err]}\n`;
          return;
        }
        content = r.content;
      }
      const lines = splitLines(content);
      const pick = cmd === "head" ? lines.slice(0, cnt.n) : cnt.from ? lines.slice(Math.max(cnt.n - 1, 0)) : cnt.n === 0 ? [] : lines.slice(-cnt.n);
      if (files.length > 1) out += `${idx > 0 ? "\n" : ""}==> ${f === "-" ? "standard input" : f} <==\n`;
      out += joinLines(pick);
    });
    if (o.flags.has("f")) out += "(tail -f: nel simulatore il file non si aggiorna in diretta; nel vero terminale si ferma con Ctrl+C)\n";
    return { out, err, code: err ? 1 : 0 };
  };
}

const find: Cmd = (args, ctx) => {
  const starts: string[] = [];
  let i = 0;
  while (i < args.length && !args[i].startsWith("-") && args[i] !== "!" && args[i] !== "(") starts.push(args[i++]);
  if (starts.length === 0) starts.push(".");
  let name: string | null = null;
  let iname = false;
  let type: string | null = null;
  let maxDepth = Infinity;
  let minDepth = 0;
  let user: string | null = null;
  let perm: number | null = null;
  const need = (flag: string) => {
    const v = args[++i];
    if (v === undefined) throw new Error(`find: missing argument to \`${flag}'`);
    return v;
  };
  try {
    for (; i < args.length; i++) {
      const a = args[i];
      if (a === "-name") name = need(a);
      else if (a === "-iname") {
        name = need(a);
        iname = true;
      } else if (a === "-type") {
        type = need(a);
        if (type !== "f" && type !== "d") throw new Error(`find: Unknown argument to -type: ${type}`);
      } else if (a === "-maxdepth") {
        const v = need(a);
        if (!/^\d+$/.test(v)) throw new Error(`find: Expected a positive decimal integer argument to -maxdepth, but got '${v}'`);
        maxDepth = Number(v);
      } else if (a === "-mindepth") {
        const v = need(a);
        if (!/^\d+$/.test(v)) throw new Error(`find: Expected a positive decimal integer argument to -mindepth, but got '${v}'`);
        minDepth = Number(v);
      } else if (a === "-user") user = need(a);
      else if (a === "-perm") {
        const v = need(a);
        if (!/^[0-7]{3,4}$/.test(v)) throw new Error(`find: invalid mode '${v}'`);
        perm = parseInt(v, 8) & 0o777;
      } else if (a === "-print") continue;
      else throw new Error(`find: unknown predicate \`${a}'`);
    }
  } catch (e) {
    return fail((e as Error).message);
  }
  let out = "";
  let err = "";
  const visit = (abs: string, display: string, node: FsNode, depth: number) => {
    const matches =
      depth >= minDepth &&
      (name === null || globMatch(name, basename(abs) === "/" ? "/" : display === "." ? "." : basename(abs), iname)) &&
      (type === null || (type === "d" ? node.kind === "dir" : node.kind === "file")) &&
      (user === null || node.owner === user) &&
      (perm === null || (node.mode & 0o777) === perm);
    if (matches) out += display + "\n";
    if (node.kind === "dir" && depth < maxDepth) {
      if (!hasPerm(node, ctx.id, "r") || !hasPerm(node, ctx.id, "x")) {
        err += `find: '${display}': Permission denied\n`;
        return;
      }
      for (const n of sortedNames(node)) visit(joinPath(abs, n), display.endsWith("/") ? display + n : `${display}/${n}`, node.children[n], depth + 1);
    }
  };
  for (const s of starts) {
    const abs = ctx.sh.abs(s);
    const r = ctx.sh.fs.lookup(abs, ctx.id);
    if (!r.node) {
      err += `find: '${s}': ${ERR_TEXT[r.err]}\n`;
      continue;
    }
    visit(abs, s, r.node, 0);
  }
  return { out, err, code: err ? 1 : 0 };
};

export const FS_COMMANDS: Record<string, Cmd> = {
  ls,
  pwd,
  cd,
  cat,
  mkdir,
  touch,
  cp,
  mv,
  rm,
  rmdir,
  chmod,
  chown: chownLike("chown"),
  chgrp: chownLike("chgrp"),
  head: headTail("head"),
  tail: headTail("tail"),
  find,
};

