/** Percorsi: funzioni pure, nessun accesso al filesystem. */

/** Rende assoluto e pulito un percorso (gestisce ., .. e barre doppie). */
export function normalize(path: string, cwd = "/"): string {
  const abs = path.startsWith("/") ? path : `${cwd}/${path}`;
  const out: string[] = [];
  for (const seg of abs.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return "/" + out.join("/");
}

export function segments(abs: string): string[] {
  return abs.split("/").filter(Boolean);
}

export function dirname(abs: string): string {
  const s = segments(abs);
  s.pop();
  return "/" + s.join("/");
}

export function basename(abs: string): string {
  const s = segments(abs);
  return s[s.length - 1] ?? "/";
}

export function joinPath(dir: string, name: string): string {
  return dir === "/" ? `/${name}` : `${dir}/${name}`;
}

/** Percorso come lo mostra il prompt: la home diventa «~». */
export function tildify(abs: string, home: string): string {
  if (abs === home) return "~";
  if (abs.startsWith(home + "/")) return "~" + abs.slice(home.length);
  return abs;
}

/** Il percorso è dentro `parent` (o è `parent`)? */
export function isInside(abs: string, parent: string): boolean {
  return abs === parent || abs.startsWith(parent === "/" ? "/" : parent + "/");
}
