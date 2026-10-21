import { sortedNames, type VFS } from "./fs";
import { normalize } from "./path";
import { hasPerm } from "./perms";
import type { Identity } from "./types";

export function hasGlobChars(s: string): boolean {
  return /[*?[]/.test(s);
}

/** Toglie i backslash di protezione da un pattern. */
export function unescapeGlob(p: string): string {
  return p.replace(/\\(.)/g, "$1");
}

export function escapeGlob(s: string): string {
  return s.replace(/[\\*?[]/g, "\\$&");
}

function reEscape(c: string): string {
  return c.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
}

/** Trasforma un pattern di una sola componente (senza barre) in espressione regolare. */
export function globToRegex(pat: string, flags = ""): RegExp {
  let re = "";
  for (let i = 0; i < pat.length; i++) {
    const c = pat[i];
    if (c === "\\" && i + 1 < pat.length) {
      re += reEscape(pat[++i]);
    } else if (c === "*") re += ".*";
    else if (c === "?") re += ".";
    else if (c === "[") {
      const end = pat.indexOf("]", i + 2);
      if (end === -1) re += "\\[";
      else {
        let cls = pat.slice(i + 1, end);
        let neg = false;
        if (cls[0] === "!" || cls[0] === "^") {
          neg = true;
          cls = cls.slice(1);
        }
        re += `[${neg ? "^" : ""}${cls.replace(/[\\\]^]/g, "\\$&")}]`;
        i = end;
      }
    } else re += reEscape(c);
  }
  return new RegExp(`^${re}$`, flags + "s");
}

/** Il nome corrisponde al pattern (una componente)? Usato da `find -name`. */
export function globMatch(pat: string, name: string, ci = false): boolean {
  return globToRegex(pat, ci ? "i" : "").test(name);
}

/**
 * Espande un pattern con * ? [ ] sul filesystem virtuale. Restituisce i percorsi trovati
 * (nella stessa forma del pattern, relativa o assoluta), in ordine alfabetico.
 */
export function expandGlob(fs: VFS, cwd: string, pattern: string, id: Identity): string[] {
  const absolute = pattern.startsWith("/");
  const segs = pattern.split("/").filter((s) => s !== "");
  let current: string[] = [absolute ? "" : "."];
  for (let idx = 0; idx < segs.length; idx++) {
    const seg = segs[idx];
    const last = idx === segs.length - 1;
    const next: string[] = [];
    for (const base of current) {
      const join = (name: string) => (base === "" ? `/${name}` : base === "." ? name : `${base}/${name}`);
      if (!hasGlobChars(seg.replace(/\\./g, ""))) {
        const lit = unescapeGlob(seg);
        const r = fs.lookup(normalize(join(lit), cwd), id);
        if (r.node && (last || r.node.kind === "dir")) next.push(join(lit));
        continue;
      }
      const d = fs.lookup(normalize(base === "" ? "/" : base, cwd), id);
      if (!d.node || d.node.kind !== "dir" || !hasPerm(d.node, id, "r")) continue;
      const re = globToRegex(seg);
      const showHidden = seg.startsWith(".") || seg.startsWith("\\.");
      for (const name of sortedNames(d.node)) {
        if (name.startsWith(".") && !showHidden) continue;
        if (!re.test(name)) continue;
        if (!last && d.node.children[name].kind !== "dir") continue;
        next.push(join(name));
      }
    }
    current = next;
    if (current.length === 0) return [];
  }
  return current;
}
