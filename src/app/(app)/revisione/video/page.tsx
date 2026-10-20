import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { internalToolsEnabled } from "@/lib/internal";
import { readFileSync } from "node:fs";
import path from "node:path";
import { COURSES } from "@/lib/content/courses";

export const metadata: Metadata = {
  title: "Revisione video",
  robots: { index: false, follow: false },
};

type Candidate = {
  modulo: string;
  tema: string;
  id: string;
  titolo: string;
  canale: string;
  durata: string;
  lang: "it" | "en";
  verifica?: { stato: string; titoloReale?: string; data: string };
};

function load(): Candidate[] {
  const file = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "video-candidati.json");
  return JSON.parse(readFileSync(file, "utf8")) as Candidate[];
}

const STATUS_STYLE: Record<string, string> = {
  ok: "bg-primary text-primary-fg",
  "non incorporabile": "bg-accent text-accent-fg",
  "non trovato": "bg-accent text-accent-fg",
  "canale diverso": "bg-belt-yellow text-belt-yellow-fg",
};

/** Strumento interno: lista dei video candidati per modulo, da approvare dal titolare. */
export default function VideoReview() {
  if (!internalToolsEnabled()) notFound();
  const list = load();
  const modules = COURSES.flatMap((c) => c.modules.map((m) => ({ code: `${c.id}${m.n}`, title: m.title, course: c.title })));
  const ok = list.filter((c) => c.verifica?.stato === "ok").length;
  const checked = list.find((c) => c.verifica)?.verifica?.data;

  return (
    <div className="grid gap-8">
      <header className="dossier grid gap-3 p-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Strumento interno · non indicizzato</p>
        <h1 className="font-display text-3xl font-semibold">Revisione dei video</h1>
        <p><a href="/revisione" className="font-semibold text-primary underline">← Torna al centro di revisione</a></p>
        <p className="max-w-3xl text-muted">
          Due candidati per modulo, scelti tra canali didattici italiani (in alternativa inglesi, marcati EN). Ogni video
          è stato verificato con YouTube: esiste, l&apos;incorporamento è attivo e il canale coincide. Resta da fare una
          cosa sola: guardarlo e approvarlo.
        </p>
        <dl className="flex flex-wrap gap-3 text-sm">
          <div className="chip"><dt className="text-muted">Candidati</dt><dd className="font-bold">{list.length}</dd></div>
          <div className="chip"><dt className="text-muted">Verificati</dt><dd className="font-bold text-primary">{ok}</dd></div>
          <div className="chip"><dt className="text-muted">Moduli coperti</dt><dd className="font-bold">{new Set(list.map((c) => c.modulo)).size} / {modules.length}</dd></div>
          {checked && <div className="chip"><dt className="text-muted">Ultimo controllo</dt><dd className="font-mono">{checked}</dd></div>}
        </dl>
      </header>

      {modules.map((m) => {
        const items = list.filter((c) => c.modulo === m.code);
        return (
          <section key={m.code} aria-labelledby={`m-${m.code}`} className="grid gap-3">
            <h2 id={`m-${m.code}`} className="flex items-baseline gap-3">
              <span className="font-mono text-sm font-bold text-accent">{m.code}</span>
              <span className="font-display text-2xl font-semibold">{m.title}</span>
            </h2>
            {items.length === 0 ? (
              <p className="text-muted">Nessun candidato.</p>
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[44rem] table-fixed text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th scope="col" className="w-[18%] px-4 py-3">Tema</th>
                      <th scope="col" className="w-[38%] px-4 py-3">Video</th>
                      <th scope="col" className="w-[18%] px-4 py-3">Canale</th>
                      <th scope="col" className="w-[8%] px-4 py-3">Durata</th>
                      <th scope="col" className="w-[9%] px-4 py-3">Lingua</th>
                      <th scope="col" className="w-[9%] px-4 py-3">Verifica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 align-top">
                        <td className="px-4 py-3 font-semibold">{c.tema}</td>
                        <td className="px-4 py-3">
                          <a
                            href={`https://www.youtube.com/watch?v=${c.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline"
                          >
                            {c.verifica?.titoloReale ?? c.titolo}
                          </a>
                          <span className="block font-mono text-xs text-muted">{c.id}</span>
                        </td>
                        <td className="px-4 py-3">{c.canale}</td>
                        <td className="px-4 py-3 font-mono">{c.durata}</td>
                        <td className="px-4 py-3">
                          <span className="chip min-h-7 px-2.5 text-xs">{c.lang === "en" ? "EN · sottotitoli" : "IT"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[c.verifica?.stato ?? ""] ?? "bg-surface-muted"}`}>
                            {c.verifica?.stato ?? "da verificare"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
