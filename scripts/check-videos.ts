/**
 * Controlla i video delle lezioni tramite l'oEmbed pubblico di YouTube:
 *  - 200: esiste ed è incorporabile; si verifica anche che il canale coincida con `channel`;
 *  - 401: l'autore ha disattivato l'incorporamento → il video va sostituito;
 *  - 404 / 400: video rimosso, privato o ID sbagliato.
 * Uso: pnpm check:videos [prefisso]   (richiede connessione a Internet; da eseguire anche periodicamente, epic E9)
 * Con un prefisso (es. C.05 o F.02) controlla solo le lezioni il cui ID comincia così.
 */
import { readRawLessons } from "../src/lib/content/load";
import { lessonFrontmatter } from "../src/lib/content/schema";

type Result = { lesson: string; id: string; ok: boolean; note: string };

async function check(lesson: string, id: string, channel: string): Promise<Result> {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
  try {
    const res = await fetch(url);
    if (res.status === 401 || res.status === 403) return { lesson, id, ok: false, note: "incorporamento disattivato: scegli un altro video" };
    if (!res.ok) return { lesson, id, ok: false, note: `non trovato (HTTP ${res.status}): rimosso, privato o ID sbagliato` };
    const data = (await res.json()) as { title?: string; author_name?: string };
    const same = (data.author_name ?? "").trim().toLowerCase() === channel.trim().toLowerCase();
    return {
      lesson,
      id,
      ok: same,
      note: same
        ? `ok · «${data.title}» · ${data.author_name}`
        : `il canale è «${data.author_name}», nel frontmatter c'è «${channel}»`,
    };
  } catch (e) {
    return { lesson, id, ok: false, note: `rete non raggiungibile: ${(e as Error).message}` };
  }
}

const prefix = process.argv[2] ?? "";

const jobs = readRawLessons().flatMap((l) => {
  const fm = lessonFrontmatter.safeParse(l.data);
  if (fm.success && !fm.data.id.startsWith(prefix)) return [];
  return fm.success && fm.data.video ? [check(fm.data.id, fm.data.video.id, fm.data.video.channel)] : [];
});

Promise.all(jobs).then((results) => {
  for (const r of results) console.log(`${r.ok ? "OK  " : "ERRORE"} ${r.lesson} (${r.id}): ${r.note}`);
  console.log(`${results.length} video controllati, ${results.filter((r) => !r.ok).length} problemi.`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
});
