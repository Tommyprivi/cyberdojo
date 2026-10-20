import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ExportNotes } from "@/components/review/export-notes";
import { LessonTable } from "@/components/review/lesson-table";
import { internalToolsEnabled } from "@/lib/internal";
import { gfxCatalog } from "@/lib/content/graphics";
import { loadQuestions } from "@/lib/content/questions";
import { loadLessonRows, moduleList } from "@/lib/content/review-data";
import { exportNotes, nextStep, summarize, summarizeGfx, summarizeQuestions, summarizeScenes } from "@/lib/content/reviews";
import { readQuestionReviews, readReviews } from "@/lib/content/reviews-store";

export const metadata: Metadata = { title: "Centro di revisione", robots: { index: false, follow: false } };

export default function ReviewCenter() {
  return (
    <Suspense fallback={<p className="p-6">Carico il centro di revisione…</p>}>
      <Center />
    </Suspense>
  );
}

const SECTIONS = [
  { href: "/revisione/lezioni", title: "Lezioni (stato)", text: "Tabella con tutto ciò che manca a ogni lezione." },
  { href: "/revisione/domande", title: "Domande", text: "Tutte le domande delle verifiche, una per una." },
  { href: "/revisione/grafica", title: "Grafica", text: "Colori, font, componenti, immagini e copertine." },
  { href: "/revisione/ux", title: "Schermate e UX", text: "Ogni pagina del sito, su PC e su telefono." },
  { href: "/revisione/video", title: "Video", text: "I video candidati per modulo, da guardare e approvare." },
  { href: "/revisione/email", title: "Email", text: "Le email del sito come le vede chi le riceve." },
  { href: "/revisione/lavori", title: "Lavori da fare", text: "Lo stato di tutto il progetto, in sola lettura." },
  { href: "/anteprima", title: "Le due interfacce", text: "PC e telefono affiancati." },
  { href: "/", title: "Home del sito", text: "La pagina che vede chiunque." },
  { href: "/corsi", title: "Mappa dei corsi", text: "Moduli e corsi come li vede il pubblico." },
] as const;

async function Center() {
  await connection();
  if (!internalToolsEnabled()) notFound();

  const reviews = readReviews();
  const qReviews = readQuestionReviews();
  const rows = loadLessonRows(reviews);
  const questions = loadQuestions();
  const gfx = gfxCatalog();
  const s = summarize(rows, reviews);
  const q = summarizeQuestions(questions.length, qReviews);
  const g = summarizeGfx(gfx.length, reviews);
  const sc = summarizeScenes(reviews);
  const step = nextStep(rows, reviews);

  const qText = new Map(questions.map((x) => [x.id, x.q.length > 70 ? `${x.q.slice(0, 70)}…` : x.q]));
  const gfxLabels = new Map(gfx.map((x) => [x.id, x.label]));
  const text = exportNotes(rows, reviews, {
    questions: qReviews,
    questionText: (id) => qText.get(id) ?? "",
    gfxLabel: (id) => gfxLabels.get(id) ?? id,
  });

  const counters: [string, string | number, string?][] = [
    ["Lezioni totali", s.lessons],
    ["Lezioni approvate", `${s.approved} / ${s.lessons}`],
    ["Pronte per la pubblicazione", s.ready],
    ["Video guardati", `${s.videoReviewed} / ${s.videoReviewed + s.videoToWatch}`],
    ["Video da guardare", s.videoToWatch],
    ["Lezioni senza video", s.noVideo, s.noVideo ? "text-accent" : undefined],
    ["Modulo C8 da rivedere", s.attackToReview, s.attackToReview ? "text-accent" : undefined],
    ["Schermate di lezione viste", `${sc.seen} (${sc.approved} ok, ${sc.toChange} da cambiare)`],
    ["Domande viste", `${q.seen} / ${q.total}`],
    ["Domande giuste e chiare", q.ok],
    ["Domande da correggere", q.fix, q.fix ? "text-accent" : undefined],
    ["Domande da togliere", q.remove, q.remove ? "text-accent" : undefined],
    ["Grafica vista", `${g.seen} / ${g.total}`],
    ["Grafica approvata", g.approved],
    ["Schermate UX viste", `${s.uxSeen} / ${s.uxTotal} (${s.uxApproved} ok)`],
    ["Email viste", `${s.emailsSeen} / ${s.emailsTotal}`],
  ];

  return (
    <div className="grid gap-8">
      <header className="dossier grid gap-4 p-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Strumento interno · non indicizzato</p>
        <h1 className="font-display text-3xl font-semibold lg:text-4xl">Centro di revisione</h1>
        <p className="max-w-3xl text-muted">
          Qui controlli e approvi tutto senza toccare nessun file: lezioni, domande, grafica, schermate, video ed email. Ogni
          pulsante salva da solo. Quando hai finito, in fondo trovi le tue note da incollare in chat.
        </p>
        <div>
          <div className="flex items-baseline justify-between text-sm font-semibold">
            <span id="avanzamento">Avanzamento complessivo (lezioni, video, C8, email e schermate)</span>
            <span className="font-mono">{s.percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-labelledby="avanzamento"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={s.percent}
            className="mt-2 h-3 overflow-hidden rounded-sm border border-border bg-surface-muted"
          >
            <div className="h-full bg-primary" style={{ width: `${s.percent}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">Fatti {s.done} passi su {s.total}.</p>
        </div>
        <div className="grid gap-2 rounded-md border border-border bg-surface-muted p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Cosa fare adesso</h2>
          <Link href={step.href} className="font-display text-xl font-semibold text-primary underline">
            {step.text}
          </Link>
        </div>
      </header>

      <section aria-labelledby="numeri" className="grid gap-3">
        <h2 id="numeri" className="font-display text-2xl font-semibold">I numeri</h2>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {counters.map(([k, v, cls]) => (
            <div key={k} className="card p-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className={`font-display text-xl font-bold ${cls ?? ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="sezioni" className="grid gap-3">
        <h2 id="sezioni" className="font-display text-2xl font-semibold">Dove andare</h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {SECTIONS.map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="card lift grid h-full gap-1 p-4 hover:bg-surface-muted">
                <span className="font-display text-lg font-semibold">{x.title}</span>
                <span className="text-sm text-muted">{x.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lezioni" className="grid gap-3">
        <h2 id="lezioni" className="font-display text-2xl font-semibold">Le lezioni</h2>
        <p className="max-w-3xl text-muted">
          «Pronta per la pubblicazione» vuol dire: approvata, video guardato e, per il modulo C8, riletta da una persona. Le lezioni
          restano in bozza: pubblicarle è una decisione successiva.
        </p>
        <LessonTable rows={rows} modules={moduleList()} />
      </section>

      <ExportNotes text={text} />
    </div>
  );
}
