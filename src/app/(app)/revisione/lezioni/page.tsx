import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { COURSES } from "@/lib/content/courses";
import { readRawLessons, splitScreens } from "@/lib/content/load";
import { lessonFrontmatter } from "@/lib/content/schema";
import { internalToolsEnabled } from "@/lib/internal";
import { CYBER_BANK_ITEMS } from "@/lib/practice/banks-cyber";

export const metadata: Metadata = { title: "Stato delle lezioni", robots: { index: false, follow: false } };

/** Strumento interno: tutte le lezioni, con ciò che manca prima di poterle approvare. */
export default function LessonStatusPage() {
  return (
    <Suspense fallback={<p className="p-6">Carico le lezioni…</p>}>
      <LessonStatus />
    </Suspense>
  );
}

async function LessonStatus() {
  await connection();
  if (!internalToolsEnabled()) notFound();

  const rows = readRawLessons().flatMap((l) => {
    const fm = lessonFrontmatter.safeParse(l.data);
    if (!fm.success) return [];
    const d = fm.data;
    const gen = d.verification.generator;
    // Le banche hanno un numero fisso di domande; gli altri esercizi le generano a ogni tentativo.
    const questions = gen ? (CYBER_BANK_ITEMS[gen]?.length ?? 0) : 0;
    return [{ d, screens: splitScreens(l.body).length, questions, course: l.file.split("/")[0] }];
  });

  const withVideo = rows.filter((r) => r.d.video).length;
  const approved = rows.filter((r) => r.d.approved).length;

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header className="grid gap-3">
        <h1 className="font-display text-3xl font-semibold">Stato delle lezioni</h1>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Lezioni", rows.length],
            ["Con video", `${withVideo} / ${rows.length}`],
            ["Video guardati", rows.filter((r) => r.d.video?.reviewed).length],
            ["Approvate", approved],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-xl border border-border bg-surface p-3 text-center">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="font-display text-2xl font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-muted">
          Ogni riga ha: schermate (servono 6-8), video, domande della verifica, stato. «Leggi e approva» mostra tutta la lezione in una pagina; «Apri come studente» porta alla lezione vera (serve l&apos;accesso). I valori includono le tue approvazioni.
          Il video è «da guardare» finché non lo approvi.
        </p>
      </header>

      {COURSES.map((c) => {
        const mine = rows.filter((r) => r.course === c.folder);
        if (!mine.length) return null;
        return (
          <section key={c.id} className="grid gap-4" aria-labelledby={`s-${c.id}`}>
            <h2 id={`s-${c.id}`} className="font-display text-2xl font-semibold">{c.title}</h2>
            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Titolo</th>
                    <th className="px-3 py-2">Cintura</th>
                    <th className="px-3 py-2">Schermate</th>
                    <th className="px-3 py-2">Video</th>
                    <th className="px-3 py-2">Domande</th>
                    <th className="px-3 py-2">Stato</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {mine.map(({ d, screens, questions }) => (
                    <tr key={d.id} className="border-t border-border align-top">
                      <td className="px-3 py-2 font-mono">{d.id}</td>
                      <td className="px-3 py-2 font-semibold">{d.title}</td>
                      <td className="px-3 py-2">{d.belt}</td>
                      <td className="px-3 py-2">{screens}</td>
                      <td className="px-3 py-2">
                        {d.video ? (
                          <span>
                            {d.video.channel} · {d.video.lang === "it" ? "italiano" : "inglese"} ·{" "}
                            {Math.round((d.video.end - d.video.start) / 60)} min
                            <br />
                            <span className={d.video.reviewed ? "font-semibold text-success" : "text-accent"}>
                              {d.video.reviewed ? "guardato" : "da guardare"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-accent">manca</span>
                        )}
                      </td>
                      <td className="px-3 py-2">{questions || "—"}</td>
                      <td className="px-3 py-2">
                        {d.status}
                        {d.approved ? " · approvata" : ""}
                        {d.module === 8 && c.id === "C" ? (d.human_reviewed ? " · rivista" : " · da rivedere") : ""}
                      </td>
                      <td className="px-3 py-2">
                        <Link href={`/revisione/lezioni/${d.id}`} className="font-bold text-primary underline">Leggi e approva</Link>
                        <br />
                        <Link href={`/lezione/${d.id}`} className="text-sm text-muted underline">Apri come studente</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
