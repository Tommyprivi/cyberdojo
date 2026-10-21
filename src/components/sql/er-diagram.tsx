"use client";

import { useMemo } from "react";
import { layoutEr } from "@/lib/sql/er";
import type { SchemaInfo } from "@/lib/sql/schema";

/** Diagramma ER semplificato in SVG, generato dallo schema: tabelle, colonne, chiavi e relazioni (N → 1). */
export function ErDiagram({ schema }: { schema: SchemaInfo | null }) {
  const layout = useMemo(() => (schema ? layoutEr(schema) : null), [schema]);
  if (!layout || layout.boxes.length === 0) {
    return <p className="p-4 text-sm text-muted">Nessuna tabella da disegnare.</p>;
  }
  return (
    <div className="h-full overflow-auto p-3">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width={layout.width}
        height={layout.height}
        role="img"
        aria-label={`Diagramma delle relazioni: ${layout.boxes.map((b) => b.name).join(", ")}`}
        className="mx-auto max-w-none"
      >
        {layout.links.map((l, i) => (
          <g key={i}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--foreground-muted)" strokeWidth={1.5} />
            <circle cx={l.x1} cy={l.y1} r={4} fill="var(--accent)" />
            <rect x={l.x2 - 4} y={l.y2 - 4} width={8} height={8} fill="var(--primary)" />
            <title>{`${l.from} ${l.label} ${l.to}`}</title>
          </g>
        ))}
        {layout.boxes.map((b) => (
          <g key={b.name} transform={`translate(${b.x} ${b.y})`}>
            <rect width={b.w} height={b.h} rx={4} fill="var(--surface)" stroke="var(--foreground)" strokeWidth={1.5} />
            <rect width={b.w} height={28} rx={4} fill="var(--primary)" />
            <text x={10} y={19} fontSize={13} fontWeight={700} fontFamily="monospace" fill="var(--primary-fg)">{b.name}</text>
            {b.rows.map((r, i) => (
              <g key={i}>
                <text x={10} y={28 + 15 + i * 19} fontSize={12} fontFamily="monospace" fill="var(--foreground)" fontWeight={r.pk ? 700 : 400}>
                  {r.text}
                </text>
                {(r.pk || r.fk) && (
                  <text x={b.w - 8} y={28 + 15 + i * 19} fontSize={10} fontWeight={700} fontFamily="monospace" textAnchor="end" fill={r.pk ? "var(--primary)" : "var(--accent)"}>
                    {r.pk ? "PK" : "FK"}
                  </text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
      <p className="pt-2 text-center text-xs text-muted">
        Il pallino rosso è il lato «molti» (la chiave esterna), il quadrato blu il lato «uno» (la chiave primaria).
      </p>
    </div>
  );
}
