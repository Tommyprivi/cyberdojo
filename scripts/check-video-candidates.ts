/**
 * Verifica la lista content/video-candidati.json con l'oEmbed pubblico di YouTube:
 * esistenza, incorporamento attivo, canale e titolo reali. Scrive il risultato accanto a ogni voce.
 * Uso: pnpm check:video-candidates
 */
import { readFileSync, writeFileSync } from "node:fs";

type Candidate = {
  modulo: string;
  tema: string;
  id: string;
  titolo: string;
  canale: string;
  durata: string;
  lang: "it" | "en";
  verifica?: { stato: "ok" | "non incorporabile" | "non trovato" | "canale diverso" | "errore"; canaleReale?: string; titoloReale?: string; data: string };
};

const file = new URL("../content/video-candidati.json", import.meta.url);
const list = JSON.parse(readFileSync(file, "utf8")) as Candidate[];
const today = new Date().toISOString().slice(0, 10);

async function verify(c: Candidate): Promise<Candidate> {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${c.id}`)}`;
  try {
    const res = await fetch(url);
    if (res.status === 401 || res.status === 403) return { ...c, verifica: { stato: "non incorporabile", data: today } };
    if (!res.ok) return { ...c, verifica: { stato: "non trovato", data: today } };
    const d = (await res.json()) as { title: string; author_name: string };
    const same = d.author_name.trim().toLowerCase() === c.canale.trim().toLowerCase();
    return {
      ...c,
      verifica: { stato: same ? "ok" : "canale diverso", canaleReale: d.author_name, titoloReale: d.title, data: today },
    };
  } catch {
    return { ...c, verifica: { stato: "errore", data: today } };
  }
}

(async () => {
  const out: Candidate[] = [];
  for (const c of list) {
    out.push(await verify(c)); // in sequenza, per non farsi limitare da YouTube
    await new Promise((r) => setTimeout(r, 250));
  }
  writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  for (const c of out) console.log(`${c.verifica!.stato.padEnd(18)} ${c.modulo.padEnd(4)} ${c.id}  ${c.canale}${c.verifica!.canaleReale && c.verifica!.stato !== "ok" ? ` (reale: ${c.verifica!.canaleReale})` : ""}`);
  const bad = out.filter((c) => c.verifica!.stato !== "ok");
  console.log(`${out.length} candidati, ${out.length - bad.length} ok, ${bad.length} da guardare.`);
})();
