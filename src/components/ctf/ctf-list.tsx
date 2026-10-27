"use client";

import Link from "next/link";
import { useState } from "react";
import { LEVELS, LEVEL_LABEL, XP_BY_LEVEL, type Level } from "@/lib/ctf/core";
import { CATEGORIES, CATEGORY_LABEL, type Category } from "@/lib/ctf/types";

export type CtfItem = { id: string; title: string; category: Category; level: Level; story: string; solved: boolean };

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`min-h-11 rounded-full border-2 px-4 text-sm font-semibold ${on ? "border-primary bg-primary text-primary-fg" : "border-border"}`}>
      {children}
    </button>
  );
}

export function CtfList({ items }: { items: CtfItem[] }) {
  const [cat, setCat] = useState<Category | null>(null);
  const [lvl, setLvl] = useState<Level | null>(null);
  const [todo, setTodo] = useState(false);
  const shown = items.filter((i) => (!cat || i.category === cat) && (!lvl || i.level === lvl) && (!todo || !i.solved));
  const done = items.filter((i) => i.solved).length;

  return (
    <div className="grid gap-5">
      <p className="font-semibold" role="status">
        Risolte: {done} su {items.length}
      </p>
      <div className="grid gap-3">
        <div role="group" aria-label="Filtra per categoria" className="flex flex-wrap gap-2">
          <Chip on={cat === null} onClick={() => setCat(null)}>Tutte</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} on={cat === c} onClick={() => setCat(cat === c ? null : c)}>
              {CATEGORY_LABEL[c]}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filtra per livello" className="flex flex-wrap gap-2">
          <Chip on={lvl === null} onClick={() => setLvl(null)}>Tutti i livelli</Chip>
          {LEVELS.map((l) => (
            <Chip key={l} on={lvl === l} onClick={() => setLvl(lvl === l ? null : l)}>
              {LEVEL_LABEL[l]}
            </Chip>
          ))}
          <Chip on={todo} onClick={() => setTodo(!todo)}>Solo da risolvere</Chip>
        </div>
      </div>
      <p className="text-sm text-muted" aria-live="polite">
        {shown.length} sfide mostrate
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {shown.map((i) => (
          <li key={i.id}>
            <Link href={`/ctf/${i.id}`} className="grid min-h-14 gap-1 rounded-xl border-2 border-border bg-surface p-4 hover:bg-surface-muted">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                {CATEGORY_LABEL[i.category]} · {LEVEL_LABEL[i.level]} · {XP_BY_LEVEL[i.level]} XP
              </span>
              <span className="font-display text-lg font-bold">
                {i.title}
                {i.solved && <span className="ml-2 text-success">✓ risolta</span>}
              </span>
              <span className="text-sm text-muted">{i.story}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
