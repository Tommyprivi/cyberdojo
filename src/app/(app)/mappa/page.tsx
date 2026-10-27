import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { loadCatalog } from "@/lib/content/catalog";
import { COURSES } from "@/lib/content/courses";
import { buildKnowledgeMap, type MapCourseNode, type ModuleState } from "@/lib/map/map-core";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Mappa del sapere" };

export default function MappaPage() {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-muted">Disegno la mappa…</p>}>
      <Mappa />
    </Suspense>
  );
}

async function Mappa() {
  const member = await requireMember("/mappa");
  const map = buildKnowledgeMap(COURSES, loadCatalog(), member.completed);
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 lg:mx-0">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Mappa del sapere</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Dove sei arrivato</h1>
        <p className="text-muted">Ogni cerchio è un modulo. Si procede in ordine, dal primo all&apos;ultimo.</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Legenda">
          {LEGEND.map((l) => (
            <li key={l.state} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="6" {...look(l.state)} />
              </svg>
              {l.label}
            </li>
          ))}
        </ul>
      </header>
      {map.map((c) => (
        <CourseMapSvg key={c.id} course={c} />
      ))}
    </div>
  );
}

const LEGEND: { state: ModuleState; label: string }[] = [
  { state: "done", label: "Completato" },
  { state: "progress", label: "In corso" },
  { state: "todo", label: "Da fare" },
  { state: "soon", label: "In preparazione" },
];

const STATE_LABEL: Record<ModuleState, string> = { done: "completato", progress: "in corso", todo: "da fare", soon: "in preparazione" };

function look(state: ModuleState) {
  switch (state) {
    case "done":
      return { fill: "var(--success)", stroke: "var(--success)", strokeWidth: 2 };
    case "progress":
      return { fill: "var(--surface)", stroke: "var(--primary)", strokeWidth: 3 };
    case "todo":
      return { fill: "var(--surface)", stroke: "var(--foreground-muted)", strokeWidth: 2 };
    case "soon":
      return { fill: "none", stroke: "var(--border)", strokeWidth: 2, strokeDasharray: "3 3" };
  }
}

const COLS = 5;
const GAP = 76;
const R = 24;

function CourseMapSvg({ course }: { course: MapCourseNode }) {
  const rows = Math.ceil(course.modules.length / COLS);
  const width = GAP * (COLS - 1) + R * 2 + 16;
  const height = GAP * (rows - 1) + R * 2 + 16;
  // Percorso a serpentina: la riga dispari va da destra a sinistra.
  const pos = (i: number) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const x = row % 2 === 0 ? col : COLS - 1 - col;
    return { x: 8 + R + x * GAP, y: 8 + R + row * GAP };
  };
  return (
    <section aria-labelledby={`m-${course.id}`} className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`m-${course.id}`} className="font-display text-xl font-bold">
          {course.title}
        </h2>
        <p className="font-mono text-xs text-muted">
          {course.done}/{course.total} lezioni
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Mappa del corso ${course.title}: ${course.modules.filter((m) => m.state === "done").length} moduli completati su ${course.modules.length}`} className="h-auto w-full">
        {course.modules.slice(1).map((m, i) => {
          const a = pos(i);
          const b = pos(i + 1);
          const reached = course.modules[i].state === "done";
          return <line key={m.n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={reached ? "var(--success)" : "var(--border)"} strokeWidth={3} />;
        })}
        {course.modules.map((m, i) => {
          const { x, y } = pos(i);
          const frac = m.total > 0 ? m.done / m.total : 0;
          const circ = 2 * Math.PI * (R + 4);
          return (
            <g key={m.n}>
              <title>{`${course.id}${m.n} ${m.title}: ${STATE_LABEL[m.state]}${m.total ? ` (${m.done}/${m.total})` : ""}`}</title>
              <circle cx={x} cy={y} r={R} {...look(m.state)} />
              {m.state === "progress" ? (
                <circle cx={x} cy={y} r={R + 4} fill="none" stroke="var(--primary)" strokeWidth={3} strokeDasharray={`${circ * frac} ${circ}`} transform={`rotate(-90 ${x} ${y})`} opacity={0.6} />
              ) : null}
              <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="var(--font-mono-face)" fill={m.state === "done" ? "var(--success-fg)" : "var(--foreground)"}>
                {m.state === "done" ? "✓" : `${course.id}${m.n}`}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
        {course.modules.map((m) => (
          <li key={m.n} className="flex justify-between gap-3 border-b border-border py-1">
            <span className="min-w-0 truncate">
              <span className="font-mono text-xs text-muted">{course.id}{m.n}</span> {m.title}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted">{m.total ? `${m.done}/${m.total}` : "presto"}</span>
          </li>
        ))}
      </ul>
      <Link href="/percorso" className="w-fit text-sm font-semibold text-primary underline">
        Vai al Percorso
      </Link>
    </section>
  );
}
