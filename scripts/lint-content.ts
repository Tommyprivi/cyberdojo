import { lintLessons } from "../src/lib/content/lint";
import { readRawLessons } from "../src/lib/content/load";

const lessons = readRawLessons();
const issues = lintLessons(lessons);

for (const i of issues) console.error(`ERRORE ${i.file}: ${i.message}`);
console.log(`${lessons.length} lezioni controllate, ${issues.length} problemi.`);
process.exit(issues.length ? 1 : 0);
