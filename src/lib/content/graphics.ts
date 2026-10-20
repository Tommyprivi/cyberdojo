import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/** Elementi grafici rivedibili: colori (letti da globals.css), font, componenti, immagini. */
export type GfxItem = { id: string; label: string; group: "Colori" | "Font" | "Componenti" | "Immagini" };

const root = () => process.cwd();

const COLOR_LABELS: Record<string, string> = {
  background: "Sfondo (washi)",
  surface: "Superficie delle schede",
  "surface-muted": "Superficie attenuata",
  foreground: "Testo (sumi)",
  "foreground-muted": "Testo secondario",
  border: "Filetti",
  primary: "Principale (indaco)",
  "primary-fg": "Testo sul principale",
  "primary-edge": "Bordo del principale",
  deep: "Blocchi scuri",
  "deep-fg": "Testo sui blocchi scuri",
  accent: "Accento (rosso sigillo)",
  "accent-fg": "Testo sull'accento",
  success: "Risposte giuste",
  "success-fg": "Testo su successo",
  focus: "Anello di focus",
};

function block(css: string, start: RegExp): Record<string, string> {
  const m = start.exec(css);
  if (!m) return {};
  const body = css.slice(m.index + m[0].length, css.indexOf("}", m.index + m[0].length));
  const out: Record<string, string> = {};
  for (const d of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[d[1]] = d[2].replace(/\/\*.*?\*\//g, "").trim();
  return out;
}

export type ColorToken = { name: string; label: string; light: string; dark: string };

/** Colori dell'app, con valori chiaro e scuro, letti da src/app/globals.css (sola lettura). */
export function loadColors(): ColorToken[] {
  const file = path.join(/*turbopackIgnore: true*/ root(), "src", "app", "globals.css");
  if (!existsSync(file)) return [];
  const css = readFileSync(file, "utf8");
  const light = block(css, /:root\s*\{/);
  const dark = block(css, /:root\[data-theme="dark"\]\s*\{/);
  return Object.entries(light)
    .filter(([, v]) => /^#[0-9a-f]{3,8}$/i.test(v))
    .map(([name, value]) => ({
      name,
      label: COLOR_LABELS[name] ?? (name.startsWith("belt-") ? `Cintura: ${name.slice(5)}` : name),
      light: value,
      dark: /^#[0-9a-f]{3,8}$/i.test(dark[name] ?? "") ? dark[name] : value,
    }));
}

function walk(dir: string, base: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const full = path.join(/*turbopackIgnore: true*/ dir, f);
    return statSync(full).isDirectory() ? walk(full, `${base}/${f}`) : /\.(jpe?g|png|webp|svg)$/i.test(f) ? [`${base}/${f}`] : [];
  });
}

/** Immagini in public/img e public/email (percorsi web). */
export function loadImages(): string[] {
  const pub = path.join(/*turbopackIgnore: true*/ root(), "public");
  return [...walk(path.join(/*turbopackIgnore: true*/ pub, "img"), "/img"), ...walk(path.join(/*turbopackIgnore: true*/ pub, "email"), "/email")].sort();
}

export const FONT_ITEMS: GfxItem[] = [
  { id: "font:titoli", label: "Font dei titoli (display)", group: "Font" },
  { id: "font:testo", label: "Font del testo", group: "Font" },
  { id: "font:mono", label: "Font mono (etichette, codice)", group: "Font" },
];

export const COMPONENT_ITEMS: GfxItem[] = [
  ["bottoni", "Pulsanti"],
  ["chip", "Chip (etichette)"],
  ["campi", "Campi di testo"],
  ["schede", "Schede e fascicoli"],
  ["tabelle", "Tabelle"],
  ["callout", "Riquadri Regola / Attenzione / Esempio"],
  ["avanzamento", "Barra di avanzamento"],
  ["mascotte", "Mascotte"],
  ["sigillo", "Sigillo"],
  ["icone", "Icone"],
].map(([id, label]) => ({ id: `componente:${id}`, label, group: "Componenti" as const }));

export function gfxCatalog(): GfxItem[] {
  return [
    ...loadColors().map((c) => ({ id: `colore:${c.name}`, label: c.label, group: "Colori" as const })),
    ...FONT_ITEMS,
    ...COMPONENT_ITEMS,
    ...loadImages().map((p) => ({ id: `immagine:${p}`, label: p, group: "Immagini" as const })),
  ];
}
