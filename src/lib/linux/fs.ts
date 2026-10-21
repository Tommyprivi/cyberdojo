import { basename, dirname, joinPath, segments } from "./path";
import { hasPerm } from "./perms";
import type { DirNode, FileNode, FsError, FsNode, Identity } from "./types";

export type Lookup = { node: FsNode; err?: undefined } | { node?: undefined; err: FsError };

const MAX_FILE = 200_000;
const BAD_NAMES = new Set(["__proto__"]);

export const mkFile = (owner: string, group: string, mode: number, content = "", mtime = 0): FileNode => ({
  kind: "file",
  owner,
  group,
  mode,
  content,
  mtime,
});

export const mkDir = (
  owner: string,
  group: string,
  mode: number,
  children: Record<string, FsNode> = {},
  mtime = 0,
): DirNode => ({ kind: "dir", owner, group, mode, children, mtime });

/** Filesystem virtuale in memoria: un albero JSON clonabile. Nulla esce dal simulatore. */
export class VFS {
  constructor(public root: DirNode) {}

  clone(): VFS {
    return new VFS(structuredClone(this.root));
  }

  /** Cerca un percorso assoluto. Se si passa `id`, controlla il permesso x su ogni cartella attraversata. */
  lookup(abs: string, id?: Identity): Lookup {
    let node: FsNode = this.root;
    for (const seg of segments(abs)) {
      if (node.kind !== "dir") return { err: "ENOTDIR" };
      if (id && !hasPerm(node, id, "x")) return { err: "EACCES" };
      if (!Object.hasOwn(node.children, seg)) return { err: "ENOENT" };
      node = node.children[seg];
    }
    return { node };
  }

  exists(abs: string): boolean {
    return this.lookup(abs).node !== undefined;
  }

  private parent(abs: string, id: Identity): { dir: DirNode; name: string } | { err: FsError } {
    const p = this.lookup(dirname(abs), id);
    if (p.err) return { err: p.err };
    if (p.node.kind !== "dir") return { err: "ENOTDIR" };
    const name = basename(abs);
    if (abs === "/" || BAD_NAMES.has(name)) return { err: "EINVAL" };
    return { dir: p.node, name };
  }

  /** Scrive (o aggiunge a) un file; lo crea se manca. */
  writeFile(abs: string, content: string, id: Identity, now: number, append = false): FsError | null {
    if (abs === "/dev/null") return null;
    const cur = this.lookup(abs, id);
    if (cur.node) {
      if (cur.node.kind === "dir") return "EISDIR";
      if (!hasPerm(cur.node, id, "w")) return "EACCES";
      const next = append ? cur.node.content + content : content;
      if (next.length > MAX_FILE) return "EFBIG";
      cur.node.content = next;
      cur.node.mtime = now;
      return null;
    }
    if (cur.err !== "ENOENT") return cur.err;
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    if (content.length > MAX_FILE) return "EFBIG";
    p.dir.children[p.name] = mkFile(id.name, id.group, 0o644, content, now);
    p.dir.mtime = now;
    return null;
  }

  readFile(abs: string, id: Identity): { content: string } | { err: FsError } {
    if (abs === "/dev/null") return { content: "" };
    const r = this.lookup(abs, id);
    if (r.err) return { err: r.err };
    if (r.node.kind === "dir") return { err: "EISDIR" };
    if (!hasPerm(r.node, id, "r")) return { err: "EACCES" };
    return { content: r.node.content };
  }

  mkdir(abs: string, id: Identity, now: number): FsError | null {
    const cur = this.lookup(abs, id);
    if (cur.node) return "EEXIST";
    if (cur.err !== "ENOENT") return cur.err;
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    p.dir.children[p.name] = mkDir(id.name, id.group, 0o755, {}, now);
    p.dir.mtime = now;
    return null;
  }

  mkdirp(abs: string, id: Identity, now: number): FsError | null {
    let cur = "/";
    for (const seg of segments(abs)) {
      cur = joinPath(cur, seg);
      const r = this.lookup(cur, id);
      if (r.node) {
        if (r.node.kind !== "dir") return "ENOTDIR";
        continue;
      }
      if (r.err !== "ENOENT") return r.err;
      const err = this.mkdir(cur, id, now);
      if (err) return err;
    }
    return null;
  }

  /** Controlla che si possa eliminare `node` (e tutto ciò che contiene, se è una cartella). */
  private canDeleteTree(node: FsNode, id: Identity): boolean {
    if (node.kind === "file") return true;
    const names = Object.keys(node.children);
    if (names.length === 0) return true;
    if (!hasPerm(node, id, "w") || !hasPerm(node, id, "x") || !hasPerm(node, id, "r")) return false;
    return names.every((n) => this.canDeleteTree(node.children[n], id));
  }

  remove(abs: string, id: Identity, opts: { recursive: boolean; now: number }): FsError | null {
    const r = this.lookup(abs, id);
    if (r.err) return r.err;
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    if (r.node.kind === "dir") {
      if (!opts.recursive) return "EISDIR";
      if (!this.canDeleteTree(r.node, id)) return "EACCES";
    }
    delete p.dir.children[p.name];
    p.dir.mtime = opts.now;
    return null;
  }

  rmdir(abs: string, id: Identity, now: number): FsError | null {
    const r = this.lookup(abs, id);
    if (r.err) return r.err;
    if (r.node.kind !== "dir") return "ENOTDIR";
    if (Object.keys(r.node.children).length > 0) return "ENOTEMPTY";
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    delete p.dir.children[p.name];
    p.dir.mtime = now;
    return null;
  }

  /** Inserisce un nodo (già clonato) sotto il nome indicato, sovrascrivendo un eventuale file. */
  insert(abs: string, node: FsNode, id: Identity, now: number): FsError | null {
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    const old = Object.hasOwn(p.dir.children, p.name) ? p.dir.children[p.name] : undefined;
    if (old && old.kind === "file" && !hasPerm(old, id, "w") && node.kind === "file") return "EACCES";
    p.dir.children[p.name] = node;
    p.dir.mtime = now;
    return null;
  }

  /** Scollega un nodo dalla sua cartella senza controlli di tipo (usato da mv). */
  detach(abs: string, id: Identity, now: number): FsError | null {
    const p = this.parent(abs, id);
    if ("err" in p) return p.err;
    if (!hasPerm(p.dir, id, "w") || !hasPerm(p.dir, id, "x")) return "EACCES";
    delete p.dir.children[p.name];
    p.dir.mtime = now;
    return null;
  }
}

/** Nomi dei figli ordinati come fa `ls` (senza badare a maiuscole e al punto iniziale). */
export function sortedNames(dir: DirNode): string[] {
  return Object.keys(dir.children).sort(compareNames);
}

export function compareNames(a: string, b: string): number {
  const ka = a.toLowerCase().replace(/^\./, "");
  const kb = b.toLowerCase().replace(/^\./, "");
  if (ka !== kb) return ka < kb ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

export function byteSize(s: string): number {
  return new TextEncoder().encode(s).length;
}
