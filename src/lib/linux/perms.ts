import type { FsNode, Identity, Perm } from "./types";

const BIT: Record<Perm, number> = { r: 4, w: 2, x: 1 };

/** L'identità può fare `p` su questo nodo? (root può tutto, ma eseguire un file richiede almeno un bit x). */
export function hasPerm(node: FsNode, id: Identity, p: Perm): boolean {
  if (id.uid === 0) return p !== "x" || node.kind === "dir" || (node.mode & 0o111) !== 0;
  const shift = node.owner === id.name ? 6 : id.groups.includes(node.group) ? 3 : 0;
  return ((node.mode >> shift) & BIT[p]) !== 0;
}

/** Stringa dei permessi come in `ls -l`: «drwxr-xr-x». */
export function modeString(node: FsNode): string {
  const triple = (m: number) => (m & 4 ? "r" : "-") + (m & 2 ? "w" : "-") + (m & 1 ? "x" : "-");
  return (node.kind === "dir" ? "d" : "-") + triple((node.mode >> 6) & 7) + triple((node.mode >> 3) & 7) + triple(node.mode & 7);
}

export function octalString(mode: number): string {
  return (mode & 0o777).toString(8).padStart(3, "0");
}

/**
 * Calcola il nuovo modo per `chmod`: accetta ottale («755», «0644») e simbolico («u+x», «go-w», «a=r», «u=rwx,g=rx»).
 * Restituisce null se la specifica non è valida.
 */
export function applyChmod(spec: string, current: number, isDir: boolean): number | null {
  if (/^[0-7]{1,4}$/.test(spec)) return parseInt(spec, 8) & 0o777;
  if (spec === "") return null;
  let mode = current & 0o777;
  for (const clause of spec.split(",")) {
    const m = /^([ugoa]*)([+\-=])([rwxX]*)$/.exec(clause);
    if (!m) return null;
    const who = m[1] === "" ? "a" : m[1];
    let bits = 0;
    for (const ch of m[3]) {
      if (ch === "r") bits |= 4;
      else if (ch === "w") bits |= 2;
      else if (ch === "x") bits |= 1;
      else if (ch === "X" && (isDir || (mode & 0o111) !== 0)) bits |= 1;
    }
    let mask = 0;
    let value = 0;
    for (const w of new Set(who === "a" ? ["u", "g", "o"] : who.split(""))) {
      const shift = w === "u" ? 6 : w === "g" ? 3 : 0;
      mask |= 7 << shift;
      value |= bits << shift;
    }
    if (m[2] === "+") mode |= value;
    else if (m[2] === "-") mode &= ~value;
    else mode = (mode & ~mask) | value;
  }
  return mode & 0o777;
}
