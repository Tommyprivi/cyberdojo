/**
 * Pubblica le lezioni che hanno un video (decisione del titolare, DECISIONS.md, 2026-10-20):
 * porta `status: draft` a `published` e `approved: false` a `true` nel solo frontmatter.
 * Le lezioni senza video restano bozze. Non cambia `video.reviewed` né `human_reviewed`.
 *
 * Uso:
 *   node scripts/publish-lessons.mjs            # mostra cosa farebbe (nessuna modifica)
 *   node scripts/publish-lessons.mjs --write    # applica
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content");
const write = process.argv.includes("--write");

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name.endsWith(".mdx")) yield full;
  }
}

let changed = 0;
let skippedNoVideo = 0;
let already = 0;
const noVideo = [];

for (const file of walk(root)) {
  const text = readFileSync(file, "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) continue;
  const fm = m[1];
  if (!/^video:\s*$/m.test(fm)) {
    skippedNoVideo++;
    noVideo.push(path.relative(root, file));
    continue;
  }
  if (/^status:\s*published\s*$/m.test(fm) && /^approved:\s*true\s*$/m.test(fm)) {
    already++;
    continue;
  }
  const newFm = fm.replace(/^status:\s*\S+\s*$/m, "status: published").replace(/^approved:\s*\S+\s*$/m, "approved: true");
  if (newFm === fm) continue;
  const out = text.replace(fm, newFm);
  if (out.length < text.length - 20 || out.length < 100) throw new Error(`Scrittura sospetta su ${file}`);
  if (write) writeFileSync(file, out, "utf8");
  changed++;
}

console.log(`${write ? "Pubblicate" : "Da pubblicare"}: ${changed}. Già pubblicate: ${already}. Senza video (restano bozze): ${skippedNoVideo}.`);
if (noVideo.length) console.log("Senza video:\n  " + noVideo.join("\n  "));
