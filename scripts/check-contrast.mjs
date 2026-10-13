// Verifica il contrasto AA (>= 4.5:1) delle coppie colore/testo dichiarate in globals.css.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const root = css.split("@media")[0];
const vars = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [m[1], m[2]]),
);

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const pairs = [
  ["foreground", "background"],
  ["foreground-muted", "background"],
  ["accent-fg", "accent"],
  ...["white", "yellow", "orange", "green", "blue", "brown", "black"].map((b) => [`belt-${b}-fg`, `belt-${b}`]),
];

let failed = false;
for (const [fg, bg] of pairs) {
  const r = ratio(vars[fg], vars[bg]);
  const ok = r >= 4.5;
  if (!ok) failed = true;
  console.log(`${ok ? "OK  " : "FAIL"} ${fg} su ${bg}: ${r.toFixed(2)}:1`);
}
process.exit(failed ? 1 : 0);
