import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Suspense } from "react";
import { parseTodo, TODO_LABELS, type TodoLabel } from "@/lib/content/todo";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Lavori da fare", robots: { index: false, follow: false } };

export default function Todo() {
  return (
    <Suspense fallback={<p className="p-6">Carico i lavori…</p>}>
      <TodoList />
    </Suspense>
  );
}

const STYLE: Record<TodoLabel, string> = {
  fatto: "bg-success text-success-fg",
  "in corso": "bg-belt-blue text-belt-blue-fg",
  "da fare": "bg-surface-muted text-foreground border border-foreground",
  tuo: "bg-accent text-accent-fg",
};
const BOX: Record<TodoLabel, string> = { fatto: "✓", "in corso": "…", "da fare": "", tuo: "!" };

/** Sola lettura: mostra docs/lavori-da-fare.md come lista con casella di stato. */
async function TodoList() {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const file = path.join(/*turbopackIgnore: true*/ process.cwd(), "docs", "lavori-da-fare.md");
  const md = existsSync(file) ? readFileSync(file, "utf8") : "";
  const { intro, groups } = parseTodo(md);
  const all = groups.flatMap((g) => g.items);

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <header className="dossier grid gap-3 p-6">
        <h1 className="font-display text-3xl font-semibold">Lavori da fare</h1>
        <p className="text-muted">Sola lettura: si aggiorna quando Claude modifica <span className="font-mono">docs/lavori-da-fare.md</span>. {intro}</p>
        <dl className="flex flex-wrap gap-2 text-sm">
          {TODO_LABELS.map((l) => (
            <div key={l} className="chip gap-2">
              <dt><span className={`rounded px-2 py-0.5 text-xs font-bold ${STYLE[l]}`}>{l}</span></dt>
              <dd className="font-bold">{all.filter((i) => i.label === l).length}</dd>
            </div>
          ))}
        </dl>
      </header>
      {groups.length === 0 && <p className="text-muted">Il file docs/lavori-da-fare.md non c&apos;è o è vuoto.</p>}
      {groups.map((g) => (
        <section key={g.title} aria-label={g.title} className="card grid gap-3 p-5">
          <h2 className="font-display text-xl font-semibold">{g.title}</h2>
          <ul className="grid gap-2">
            {g.items.map((it, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded border-2 text-sm font-bold ${
                    it.label === "fatto" ? "border-success bg-success text-success-fg" : "border-foreground"
                  }`}
                >
                  {it.label ? BOX[it.label] : ""}
                </span>
                <span>
                  {it.label && <span className={`mr-2 rounded px-2 py-0.5 text-xs font-bold uppercase ${STYLE[it.label]}`}>{it.label}</span>}
                  {it.text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
