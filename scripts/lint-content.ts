import { lintLessons } from "../src/lib/content/lint";
import { readRawLessons } from "../src/lib/content/load";

/**
 * Uso: `npx tsx scripts/lint-content.ts` controlla tutto.
 *      `npx tsx scripts/lint-content.ts W.05` mostra solo i problemi dei file che iniziano con W.05 (un modulo scritto in parallelo).
 * Con il filtro, «prerequisito inesistente» sulla PRIMA lezione del modulo è atteso finché il modulo precedente non esiste e non conta.
 */
const prefix = process.argv[2];
const lessons = readRawLessons();
let issues = lintLessons(lessons);

if (prefix) {
  issues = issues.filter((i) => i.file.split("/").pop()!.startsWith(prefix));
  issues = issues.filter((i) => !(i.message.startsWith("prerequisito inesistente") && i.file.split("/").pop()!.startsWith(`${prefix}.001`)));
}

for (const i of issues) console.error(`ERRORE ${i.file}: ${i.message}`);
const n = prefix ? lessons.filter((l) => String(l.data.id).startsWith(prefix)).length : lessons.length;
console.log(`${n} lezioni controllate${prefix ? ` (filtro ${prefix})` : ""}, ${issues.length} problemi.`);
process.exit(issues.length ? 1 : 0);
