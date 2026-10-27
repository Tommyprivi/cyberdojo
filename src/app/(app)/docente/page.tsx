import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { SHARE_PROGRESS_EXPLAIN, formatLastDay } from "@/lib/docente/rules";
import { getTeacherClasses } from "@/lib/docente/service";
import { getSessionUser } from "@/lib/session";
import { PageArt } from "@/components/page-art";

export const metadata: Metadata = { title: "Le mie classi", robots: { index: false } };

export default function DocentePage() {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-3xl rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico le classi" />}>
      <DocenteContent />
    </Suspense>
  );
}

/** Solo docenti verificati: il controllo è qui, sul server (e di nuovo nella funzione SQL). Gli altri vedono «non trovata». */
async function DocenteContent() {
  const user = await getSessionUser();
  if (!user) redirect("/accedi?next=%2Fdocente");
  const data = await getTeacherClasses(user.id);
  if (!data) notFound();
  const today = new Date();

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <header className="relative grid gap-2 border-b-2 border-border pb-4 pr-20">
        <PageArt art="docente" priority className="top-0" />
        <h1 className="font-display text-3xl font-bold">Le mie classi</h1>
        <p className="text-muted">
          Le classi sono i gruppi di studio: si creano da <Link href="/social" className="font-semibold text-primary underline">Social, scheda Gruppi</Link> (scegli «Ragazzi di 14-17 anni» per una classe di minorenni). Gli studenti entrano col codice.
        </p>
        <p className="rounded-md border border-border bg-surface p-3 text-sm">
          <strong>Privacy.</strong> Qui compaiono solo gli studenti che hanno acceso il consenso. {SHARE_PROGRESS_EXPLAIN} Non esistono chat né messaggi.
        </p>
      </header>

      {data.unavailable && <p role="status" className="rounded-md border border-border bg-surface p-3 text-sm">Le classi non sono ancora disponibili: riprova più tardi.</p>}
      {!data.unavailable && data.classes.length === 0 && <p className="rounded-lg border border-border bg-surface p-4 text-sm">Non hai ancora creato nessuna classe.</p>}

      {data.classes.map((c) => (
        <section key={c.id} className="grid gap-3 rounded-lg border border-border bg-surface p-4" aria-label={c.name}>
          <header className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold">{c.name}</h2>
            <span className="font-mono text-xs text-muted">
              {c.members} studenti · {c.rows.length} con consenso
            </span>
          </header>
          <p className="text-sm">
            Codice di invito: <strong className="select-all font-mono text-base tracking-widest">{c.code}</strong> (daglielo a voce o a scuola; si rinnova da Social).
          </p>
          {c.rows.length === 0 ? (
            <p className="text-sm text-muted">Nessuno studente ha ancora acconsentito a mostrarti i progressi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[22rem] text-left text-sm">
                <caption className="sr-only">Progressi degli studenti consenzienti di {c.name}</caption>
                <thead>
                  <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
                    <th scope="col" className="py-2 pr-3">Studente</th>
                    <th scope="col" className="py-2 pr-3 text-right">Lezioni</th>
                    <th scope="col" className="py-2 pr-3 text-right">XP</th>
                    <th scope="col" className="py-2">Ultima attività</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.no} className="border-b border-border last:border-0">
                      <th scope="row" className="py-2 pr-3 font-semibold">{r.nickname}</th>
                      <td className="py-2 pr-3 text-right font-mono">{r.lessons}</td>
                      <td className="py-2 pr-3 text-right font-mono">{r.xp}</td>
                      <td className="py-2">{formatLastDay(r.lastDay, today)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
