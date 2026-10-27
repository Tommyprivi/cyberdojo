/**
 * Genera, dal piano in scripts/piano-corsi/, i file che dipendono dai 10 nuovi corsi:
 *   - src/lib/content/courses-new.ts   (catalogo: corsi, blocchi e moduli; si sovrascrive)
 *   - docs/nuovi-corsi.md              (briefing con tutti i titoli di lezione; si sovrascrive)
 *   - src/lib/practice/banks-nuovi/    (un file vuoto per modulo; si crea solo se manca; index.ts si sovrascrive)
 * Uso: npx tsx scripts/genera-nuovi-corsi.ts
 * Dopo aver cambiato il piano, rilanciarlo. Non cancella mai i file delle domande già scritti.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PIANO } from "./piano-corsi/indice";
import type { PianoCorso } from "./piano-corsi/tipi";
import { beltOfModule, titoliLezioni, validaPiano } from "./piano-corsi/valida";

const ROOT = process.cwd();
const pad2 = (n: number) => String(n).padStart(2, "0");
const pad3 = (n: number) => String(n).padStart(3, "0");
const q = (s: string) => JSON.stringify(s);

function courseTs(c: PianoCorso): string {
  const moduli: string[] = [];
  const blocchi: string[] = [];
  c.blocchi.forEach((b, bi) => {
    blocchi.push(`      { title: ${q(b.titolo)}, summary: ${q(b.descrizione)}, from: ${bi * 4 + 1}, to: ${bi * 4 + 4} },`);
    b.moduli.forEach((m, mi) => {
      const n = bi * 4 + mi + 1;
      moduli.push(`      { n: ${n}, title: ${q(m.titolo)}, summary: ${q(m.riassunto)} },`);
    });
  });
  return `  {
    id: ${q(c.id)},
    folder: ${q(c.cartella)},
    title: ${q(c.titolo)},
    blurb: { lead: ${q(c.presentazione)}, for: ${q(c.perChi)} },
    blocks: [
${blocchi.join("\n")}
    ],
    modules: [
${moduli.join("\n")}
    ],
  },`;
}

function docMd(piano: PianoCorso[]): string {
  const out: string[] = [];
  out.push("# I 10 nuovi corsi: indice e briefing per chi scrive le lezioni");
  out.push("");
  out.push("File generato da `scripts/genera-nuovi-corsi.ts` a partire da `scripts/piano-corsi/*.ts`: **per cambiare titoli o moduli si modifica il piano e si rilancia lo script**, non questo file.");
  out.push("Come si scrive una lezione: `docs/guida-scrivere-lezioni.md`. Il modulo pilota già scritto è **W1 (Come funziona il web)**: leggilo (content/sviluppo-web/w1/ e src/lib/practice/banks-nuovi/w01.ts) prima di scrivere.");
  out.push("");
  out.push("## Regole comuni");
  out.push("");
  out.push("- Ogni corso ha **200 lezioni** = 5 blocchi x 4 moduli x 10 lezioni. Un blocco va dal facile al difficile e dura circa 40 lezioni. **Un agente = un modulo** (10 lezioni + il file delle domande).");
  out.push("- ID lezione `X.MM.NNN` (X = lettera del corso, MM = numero del modulo da 01 a 20, NNN = numero nel modulo da 001 a 010). File: `content/<cartella>/<x><modulo>/X.MM.NNN.mdx` (esempio `content/sviluppo-web/w2/W.02.003.mdx`).");
  out.push("- **Nessun salto, prerequisiti nel frontmatter:** ogni lezione ha come prerequisito la precedente dello stesso modulo; la prima lezione di un modulo ha come prerequisito l'ultima del modulo precedente (`W.02.001` -> `[W.01.010]`); la prima del corso (`X.01.001`) ha `prerequisites: []`. I corsi si aprono tutti da subito: i prerequisiti sono solo dentro lo stesso corso. Le dipendenze da altri corsi sono consigli (campo «Consigliato») e si scrivono nel testo, non nei prerequisiti.");
  out.push("- Cinture: moduli 1-4 `bianca`, 5-8 `gialla`, 9-12 `arancione`, 13-16 `verde`, 17-20 `blu`.");
  out.push("- Dove un argomento è già in un corso esistente non si ripete: si scrive la lezione solo al livello nuovo e si **rimanda** con una frase («Lo hai visto in Fondamenta F7, qui lo usiamo per...»). Il campo «Rimando» di ogni modulo dice dove.");
  out.push("- Contenuti: niente consigli finanziari o legali, niente link di affiliazione, fatti verificabili, strumenti gratuiti. Offensiva solo concettuale o in laboratorio proprio (vedi la guida). Utenti dai 14 anni.");
  out.push("- Finché un modulo non ha lezioni il sito lo mostra «In preparazione»: si può pubblicare un modulo alla volta.");
  out.push("");
  out.push("## Indice dei corsi");
  out.push("");
  out.push("| Lettera | Cartella | Corso | Lezioni |");
  out.push("|---|---|---|---|");
  for (const c of piano) out.push(`| ${c.id} | \`content/${c.cartella}/\` | ${c.titolo} | 200 |`);
  out.push("");
  for (const c of piano) {
    out.push(`## ${c.id} · ${c.titolo}`);
    out.push("");
    out.push(c.presentazione);
    out.push("");
    out.push(`- **Per chi:** ${c.perChi}`);
    out.push(`- **Consigliato:** ${c.consigliato}`);
    out.push(`- **Cartella e \`course:\`:** \`${c.cartella}\` · **Domande:** \`src/lib/practice/banks-nuovi/${c.id.toLowerCase()}NN.ts\``);
    out.push("");
    c.blocchi.forEach((b, bi) => {
      out.push(`### Blocco ${bi + 1} · ${b.titolo} (${c.id}${bi * 4 + 1}-${c.id}${bi * 4 + 4}, lezioni ${bi * 40 + 1}-${bi * 40 + 40})`);
      out.push("");
      out.push(b.descrizione);
      out.push("");
      b.moduli.forEach((m, mi) => {
        const n = bi * 4 + mi + 1;
        out.push(`#### ${c.id}${n} · ${m.titolo}`);
        out.push("");
        out.push(`${m.riassunto}. Cintura: ${beltOfModule(n)}.`);
        if (m.rinvio) out.push(`**Rimando:** ${m.rinvio}`);
        out.push("");
        titoliLezioni(m.lezioni).forEach((t, li) => out.push(`${li + 1}. \`${c.id}.${pad2(n)}.${pad3(li + 1)}\` ${t}`));
        out.push("");
      });
    });
  }
  return out.join("\n");
}

function stubTs(c: PianoCorso, n: number, titolo: string): string {
  const L = c.id.toLowerCase();
  const U = c.id;
  return `import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo ${U}${n} (${c.titolo}: ${titolo}). Una chiave per lezione: "${L}${pad2(n)}-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte (vedi docs/guida-scrivere-lezioni.md).
 */
export const ${U}${pad2(n)}_ITEMS: Record<string, BankItem[]> = {};
`;
}

function indexTs(piano: PianoCorso[]): string {
  const imports: string[] = [];
  const spread: string[] = [];
  for (const c of piano) {
    for (let n = 1; n <= 20; n++) {
      const name = `${c.id}${pad2(n)}_ITEMS`;
      imports.push(`import { ${name} } from "./${c.id.toLowerCase()}${pad2(n)}";`);
      spread.push(`  ...${name},`);
    }
  }
  return `// File generato da scripts/genera-nuovi-corsi.ts: non modificare a mano.
import { makeBank, type BankItem } from "../banks";
${imports.join("\n")}

/** Tutte le banche dei 10 nuovi corsi (W, P, A, I, B, L, R, E, X, M), per identificatore (w01-..., p05-...). */
export const NUOVI_BANK_ITEMS: Record<string, BankItem[]> = {
${spread.join("\n")}
};

export const NUOVI_BANKS = Object.fromEntries(
  Object.entries(NUOVI_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
`;
}

function main() {
  const err = validaPiano(PIANO);
  if (err.length) {
    for (const e of err) console.error("ERRORE piano:", e);
    process.exit(1);
  }
  const write = (rel: string, text: string) => {
    const f = path.join(ROOT, rel);
    mkdirSync(path.dirname(f), { recursive: true });
    writeFileSync(f, text, "utf8");
  };

  write(
    "src/lib/content/courses-new.ts",
    `// File generato da scripts/genera-nuovi-corsi.ts (piano in scripts/piano-corsi/): non modificare a mano.
import type { CourseDef } from "./courses";

/** I 10 nuovi corsi: 5 blocchi x 4 moduli x 10 lezioni = 200 lezioni ciascuno. Titoli delle lezioni: docs/nuovi-corsi.md. */
export const NEW_COURSES: CourseDef[] = [
${PIANO.map(courseTs).join("\n")}
];
`,
  );
  write("docs/nuovi-corsi.md", docMd(PIANO));

  let creati = 0;
  for (const c of PIANO) {
    let n = 0;
    for (const b of c.blocchi) {
      for (const m of b.moduli) {
        n++;
        const rel = `src/lib/practice/banks-nuovi/${c.id.toLowerCase()}${pad2(n)}.ts`;
        if (!existsSync(path.join(ROOT, rel))) {
          write(rel, stubTs(c, n, m.titolo));
          creati++;
        }
      }
    }
  }
  write("src/lib/practice/banks-nuovi/index.ts", indexTs(PIANO));
  console.log(`Piano valido: ${PIANO.length} corsi, ${PIANO.length * 200} lezioni previste. File delle domande creati ora: ${creati}.`);
}

main();
