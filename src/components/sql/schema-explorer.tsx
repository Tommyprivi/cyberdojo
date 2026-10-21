"use client";

import { useState } from "react";
import type { SchemaInfo } from "@/lib/sql/schema";

/** Esploratore dello schema, come l'albero di pgAdmin: tabelle, colonne con tipo e chiavi, relazioni. */
export function SchemaExplorer({
  schema,
  onPreview,
  disabled,
}: {
  schema: SchemaInfo | null;
  onPreview: (table: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  if (!schema) return <p className="p-3 text-sm text-muted">Avvia il database per vedere le tabelle.</p>;
  return (
    <nav aria-label="Esploratore dello schema" className="grid content-start gap-3 p-2 text-sm">
      <section>
        <h3 className="px-1 pb-1 font-mono text-[0.7rem] font-bold uppercase tracking-widest text-muted">
          Tabelle ({schema.tables.length})
        </h3>
        {schema.tables.length === 0 && <p className="px-1 text-muted">Nessuna tabella.</p>}
        <ul className="grid gap-0.5">
          {schema.tables.map((t) => {
            const isOpen = open[t.name] ?? false;
            return (
              <li key={t.name}>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Chiudi" : "Apri"} le colonne di ${t.name}`}
                    onClick={() => setOpen((o) => ({ ...o, [t.name]: !isOpen }))}
                    className="grid size-6 shrink-0 place-items-center rounded font-mono text-xs hover:bg-surface-muted"
                  >
                    {isOpen ? "▾" : "▸"}
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onPreview(t.name)}
                    title="Mostra le prime righe"
                    className="min-w-0 flex-1 truncate rounded px-1.5 py-1 text-left font-mono font-bold hover:bg-surface-muted disabled:opacity-50"
                  >
                    {t.name}
                  </button>
                  <span className="shrink-0 font-mono text-xs text-muted">{t.rows}</span>
                </div>
                {isOpen && (
                  <ul className="ml-7 grid gap-0.5 border-l border-border pl-2 pb-1">
                    {t.columns.map((c) => (
                      <li key={c.name} className="flex flex-wrap items-baseline gap-x-1.5 font-mono text-xs">
                        <span className={c.pk ? "font-bold" : ""}>{c.name}</span>
                        <span className="text-muted">{c.type}</span>
                        {c.pk && <span className="rounded bg-primary px-1 text-[0.65rem] font-bold text-primary-fg" title="Chiave primaria">PK</span>}
                        {c.ref && (
                          <span className="rounded border border-accent px-1 text-[0.65rem] font-bold text-accent" title={`Chiave esterna verso ${c.ref.table}.${c.ref.column}`}>
                            FK → {c.ref.table}
                          </span>
                        )}
                        {c.unique && !c.pk && <span className="rounded border border-border px-1 text-[0.65rem]" title="Valore unico">UQ</span>}
                        {!c.nullable && !c.pk && <span className="text-[0.65rem] text-muted" title="Obbligatoria">NOT NULL</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <p className="px-1 pt-1 text-xs text-muted">Clic su un nome: anteprima delle prime righe. Il numero a destra sono le righe.</p>
      </section>
      <section>
        <h3 className="px-1 pb-1 font-mono text-[0.7rem] font-bold uppercase tracking-widest text-muted">Relazioni ({schema.relations.length})</h3>
        {schema.relations.length === 0 ? (
          <p className="px-1 text-muted">Nessuna chiave esterna.</p>
        ) : (
          <ul className="grid gap-1">
            {schema.relations.map((r, i) => (
              <li key={i} className="px-1 font-mono text-xs">
                {r.from}.{r.fromColumns.join(",")} <span aria-label="collegata a">→</span> {r.to}.{r.toColumns.join(",")}
              </li>
            ))}
          </ul>
        )}
      </section>
    </nav>
  );
}
