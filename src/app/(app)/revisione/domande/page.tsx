import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { QuestionReview } from "@/components/review/question-review";
import { loadQuestions } from "@/lib/content/questions";
import { moduleList } from "@/lib/content/review-data";
import { summarizeQuestions } from "@/lib/content/reviews";
import { readQuestionReviews } from "@/lib/content/reviews-store";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Revisione delle domande", robots: { index: false, follow: false } };

const PAGE_SIZE = 20;
const STATES = [
  ["tutte", "Tutte"],
  ["da-vedere", "Da vedere"],
  ["ok", "Giuste e chiare"],
  ["fix", "Da correggere"],
  ["remove", "Da togliere"],
  ["nota", "Con una nota"],
] as const;

export default function QuestionsPage({ searchParams }: PageProps<"/revisione/domande">) {
  return (
    <Suspense fallback={<p className="p-6">Carico le domande…</p>}>
      <Questions searchParams={searchParams} />
    </Suspense>
  );
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function Questions({ searchParams }: { searchParams: PageProps<"/revisione/domande">["searchParams"] }) {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const sp = await searchParams;
  const q = first(sp.q).slice(0, 100).trim().toLowerCase();
  const modulo = first(sp.modulo).slice(0, 8);
  const lezione = first(sp.lezione).slice(0, 12);
  const stato = STATES.some(([id]) => id === first(sp.stato)) ? first(sp.stato) : "tutte";

  const all = loadQuestions();
  const reviews = readQuestionReviews();
  const sum = summarizeQuestions(all.length, reviews);

  const filtered = all.filter((x) => {
    const e = reviews[x.id];
    if (modulo && x.moduleCode !== modulo) return false;
    if (lezione && x.lessonId !== lezione) return false;
    if (stato === "da-vedere" && e?.verdict) return false;
    if ((stato === "ok" || stato === "fix" || stato === "remove") && e?.verdict !== stato) return false;
    if (stato === "nota" && !e?.note) return false;
    if (q && !`${x.q} ${x.ok} ${x.no.join(" ")} ${x.id}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(first(sp.pagina), 10) || 1));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lessons = [...new Set(all.map((x) => x.lessonId).filter((x): x is string => !!x))].sort();
  const modules = moduleList().filter((m) => all.some((x) => x.moduleCode === m.code));

  const href = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (modulo) u.set("modulo", modulo);
    if (lezione) u.set("lezione", lezione);
    if (stato !== "tutte") u.set("stato", stato);
    if (p > 1) u.set("pagina", String(p));
    const s = u.toString();
    return `/revisione/domande${s ? `?${s}` : ""}`;
  };

  return (
    <div className="grid gap-6">
      <header className="dossier grid gap-3 p-6">
        <h1 className="font-display text-3xl font-semibold">Revisione delle domande</h1>
        <p className="max-w-3xl text-muted">
          Tutte le domande delle verifiche. Quella verde è la risposta giusta, le altre sono gli errori proposti. Per ognuna dici se è
          giusta e chiara, da correggere o da togliere. I giudizi stanno in <span className="font-mono">content/revisioni-domande.json</span>.
        </p>
        <dl className="flex flex-wrap gap-3 text-sm">
          {[
            ["Domande", sum.total],
            ["Viste", sum.seen],
            ["Da vedere", sum.toSee],
            ["Giuste e chiare", sum.ok],
            ["Da correggere", sum.fix],
            ["Da togliere", sum.remove],
          ].map(([k, v]) => (
            <div key={k} className="chip gap-2"><dt className="text-muted">{k}</dt><dd className="font-bold">{v}</dd></div>
          ))}
        </dl>
      </header>

      <form method="get" action="/revisione/domande" className="grid gap-3 md:grid-cols-[1fr_12rem_12rem_12rem_auto] md:items-end">
        <label className="grid gap-1 text-sm font-bold">
          Cerca nel testo
          <input name="q" defaultValue={q} maxLength={100} type="search" className="field font-normal" placeholder="es. firewall, permesso" />
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Modulo
          <select name="modulo" defaultValue={modulo} className="field font-normal">
            <option value="">Tutti</option>
            {modules.map((m) => <option key={m.code} value={m.code}>{m.code} · {m.title}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Lezione
          <select name="lezione" defaultValue={lezione} className="field font-normal">
            <option value="">Tutte</option>
            {lessons.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Stato
          <select name="stato" defaultValue={stato} className="field font-normal">
            {STATES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn-primary">Filtra</button>
      </form>

      <p role="status" className="font-mono text-xs uppercase tracking-widest text-muted">
        {filtered.length} domande · pagina {page} di {pages}
      </p>

      <ol start={(page - 1) * PAGE_SIZE + 1} className="grid gap-4">
        {shown.map((x) => (
          <li key={x.id} className="card grid gap-3 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 text-xs">
              <span className="font-mono font-bold text-accent">{x.id}</span>
              <span className="font-mono text-muted">{x.moduleCode}{x.lessonId ? ` · ${x.lessonId}` : ""}</span>
            </div>
            <p className="font-semibold">{x.q}</p>
            <ul className="grid gap-1.5 text-sm md:grid-cols-2">
              <li className="rounded-md border-2 border-success bg-surface-muted px-3 py-2 font-semibold">✓ {x.ok}</li>
              {x.no.map((n) => (
                <li key={n} className="rounded-md border border-border px-3 py-2 text-muted">{n}</li>
              ))}
            </ul>
            <QuestionReview id={x.id} entry={reviews[x.id]} />
          </li>
        ))}
      </ol>
      {shown.length === 0 && <p className="text-muted">Nessuna domanda con questi filtri.</p>}

      <nav aria-label="Pagine" className="flex items-center justify-between gap-3">
        {page > 1 ? <Link href={href(page - 1)} className="btn btn-ghost">← Precedenti</Link> : <span />}
        <span className="font-mono text-sm">{page} / {pages}</span>
        {page < pages ? <Link href={href(page + 1)} className="btn btn-ghost">Successive →</Link> : <span />}
      </nav>
    </div>
  );
}
