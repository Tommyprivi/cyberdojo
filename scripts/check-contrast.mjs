// Verifica il contrasto AA (>= 4.5:1) delle coppie colore/testo di globals.css, in entrambi i temi.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

const grab = (block) =>
  Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [m[1], m[2]]));

const light = grab(css.slice(css.indexOf(":root {"), css.indexOf("@media")));
const darkBlock = css.slice(css.indexOf(':root[data-theme="dark"]'), css.indexOf("@theme"));
const dark = { ...light, ...grab(darkBlock) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const belts = ["white", "yellow", "orange", "green", "blue", "brown", "black"];
const pairs = [
  ["foreground", "background"],
  ["foreground", "surface"],
  ["foreground", "surface-muted"],
  ["foreground-muted", "background"],
  ["foreground-muted", "surface"],
  ["foreground-muted", "surface-muted"],
  ["primary-fg", "primary"],
  ["deep-fg", "deep"],
  ["accent-fg", "accent"],
  ["success-fg", "success"],
  ["success", "surface"], // testo delle risposte giuste
  ["success", "background"],
  ["primary", "background"], // link e testo indaco
  ["accent", "surface"], // testo di errore in colore sigillo
  ["accent", "background"],
  ["primary", "surface"], // testo e icone indaco sulle superfici
  ["focus", "background"],
  ...belts.map((b) => [`belt-${b}-fg`, `belt-${b}`]),
];

let failed = false;
for (const [name, vars] of [["chiaro", light], ["scuro", dark]]) {
  for (const [fg, bg] of pairs) {
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= 4.5;
    if (!ok) failed = true;
    if (!ok || process.argv.includes("--verbose")) console.log(`${ok ? "OK  " : "FAIL"} [${name}] ${fg} su ${bg}: ${r.toFixed(2)}:1`);
  }
}
console.log(failed ? "Contrasto insufficiente." : "Tutte le coppie rispettano AA in entrambi i temi.");
process.exit(failed ? 1 : 0);
