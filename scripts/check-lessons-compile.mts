// Compila ogni schermata di ogni lezione come fa il sito e controlla gli schemi (pittogrammi ammessi, numero di passaggi).
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { readRawLessons, splitScreens } from "../src/lib/content/load";
import { PIC_NAMES } from "../src/components/lesson/diagrams";

const allowed = new Set<string>(PIC_NAMES);
let bad = 0;
let diagrams = 0;
async function main() {
for (const l of readRawLessons()) {
  const id = String(l.data.id);
  const screens = splitScreens(l.body);
  for (const [i, src] of screens.entries()) {
    try {
      await serialize(src, { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } } as never);
    } catch (e) {
      bad++;
      console.log(`ERRORE ${id} schermata ${i + 1}: ${(e as Error).message.split("\n")[0]}`);
    }
    for (const m of src.matchAll(/icon:\s*"([^"]+)"/g)) if (!allowed.has(m[1])) { bad++; console.log(`ICONA ${id} schermata ${i + 1}: "${m[1]}" non ammessa`); }
    for (const m of src.matchAll(/<(Flow|Layers)\b/g)) { diagrams++; void m; }
    diagrams += (src.match(/<Compare\b/g) ?? []).length;
  }
}
console.log(`${diagrams} schemi, ${bad} problemi.`);
process.exit(bad ? 1 : 0);
}
void main();
